/**
 * Waitlist API endpoint (Astro API route - works in dev and production)
 * Handles email submissions with Turnstile verification and KV storage
 */

import type { APIRoute } from 'astro';
import { isValidEmail, sanitizeEmail, hashString } from '../../lib/validators';

// Security headers for all responses
function getSecurityHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Cache-Control': 'no-store, no-cache, must-revalidate',
  };
}

// Handle OPTIONS for CORS preflight
export const OPTIONS: APIRoute = async () => {
  console.log('=== ASTRO ROUTE: Handling OPTIONS ===');
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
};

// Handle HEAD for health checks
export const HEAD: APIRoute = async () => {
  console.log('=== ASTRO ROUTE: Handling HEAD ===');
  return new Response(null, {
    status: 200,
    headers: getSecurityHeaders(),
  });
};

// Handle POST for actual submissions
export const POST: APIRoute = async ({ request, locals }) => {
  console.log('=== ASTRO ROUTE: POST called ===');
  console.log('Request details:', {
    method: request.method,
    url: request.url,
    contentType: request.headers.get('content-type'),
  });

  // Validate Content-Type
  const contentType = request.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    console.log('Invalid content type:', contentType);
    return new Response(JSON.stringify({ error: 'Invalid content type' }), {
      status: 415,
      headers: getSecurityHeaders(),
    });
  }

  try {
    // Parse JSON with explicit error handling
    let body;
    try {
      body = await request.json();
      console.log('Body parsed successfully');
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return new Response(JSON.stringify({ error: 'Invalid JSON in request body' }), {
        status: 400,
        headers: getSecurityHeaders(),
      });
    }

    const { email, token } = body;

    // Validate input presence and types
    if (!email || !token) {
      return new Response(JSON.stringify({ error: 'Email and token required' }), {
        status: 400,
        headers: getSecurityHeaders(),
      });
    }

    // Validate input types and lengths
    if (typeof email !== 'string' || email.length < 3 || email.length > 254) {
      return new Response(JSON.stringify({ error: 'Invalid email format' }), {
        status: 400,
        headers: getSecurityHeaders(),
      });
    }

    if (typeof token !== 'string' || token.length > 2048) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 400,
        headers: getSecurityHeaders(),
      });
    }

    const sanitizedEmailValue = sanitizeEmail(email);

    // Validate email format
    if (!isValidEmail(sanitizedEmailValue)) {
      return new Response(JSON.stringify({ error: 'Invalid email format' }), {
        status: 400,
        headers: getSecurityHeaders(),
      });
    }

    // Get environment variables - check both runtime and import.meta.env
    const runtimeEnv = (locals.runtime as any)?.env;
    const turnstileSecret = runtimeEnv?.CF_TURNSTILE_SECRET || import.meta.env.CF_TURNSTILE_SECRET;
    const kvNamespace = runtimeEnv?.OPDX_WAITLIST;
    
    console.log('KV Namespace available:', !!kvNamespace);
    console.log('Turnstile secret available:', !!turnstileSecret);

    // Rate limiting - prevent abuse (if KV is available)
    const ip = request.headers.get('cf-connecting-ip') || 
               request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
               'unknown';
    
    if (kvNamespace && ip !== 'unknown') {
      const rateLimitKey = `ratelimit:${ip}`;
      const rateLimitData = await kvNamespace.get(rateLimitKey);
      
      if (rateLimitData) {
        const attempts = parseInt(rateLimitData, 10);
        if (attempts >= 5) { // Max 5 attempts per hour per IP
          return new Response(JSON.stringify({ error: 'Too many requests. Please try again later.' }), {
            status: 429,
            headers: {
              ...getSecurityHeaders(),
              'Retry-After': '3600',
            },
          });
        }
        await kvNamespace.put(rateLimitKey, (attempts + 1).toString(), { expirationTtl: 3600 });
      } else {
        await kvNamespace.put(rateLimitKey, '1', { expirationTtl: 3600 });
      }
    }

    // Verify Turnstile token
    if (turnstileSecret) {
      console.log('Verifying Turnstile token...');
      const verifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
      const verifyResponse = await fetch(verifyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: turnstileSecret,
          response: token,
          ...(ip !== 'unknown' && { remoteip: ip }),
        }),
      });

      const verifyData = await verifyResponse.json();

      if (!verifyData.success) {
        // Log only non-sensitive error info
        console.error('Turnstile verification failed:', {
          success: verifyData.success,
          'error-codes': verifyData['error-codes'],
        });
        return new Response(JSON.stringify({ error: 'Verification failed' }), {
          status: 400,
          headers: getSecurityHeaders(),
        });
      }
      console.log('Turnstile verification successful');
    } else {
      console.warn('CF_TURNSTILE_SECRET not configured - skipping verification');
    }

    // Get request metadata
    const ua = request.headers.get('user-agent') || 'unknown';
    const referer = request.headers.get('referer') || '';

    // Hash UA
    const uaHash = await hashString(ua.substring(0, 100));

    // Check if email already exists (if KV is available)
    if (kvNamespace) {
      console.log('Checking KV for existing email:', sanitizedEmailValue);
      const existing = await kvNamespace.get(`email:${sanitizedEmailValue}`);
      if (existing) {
        console.log('Email already exists:', sanitizedEmailValue);
        return new Response(JSON.stringify({ message: 'Already subscribed', duplicate: true }), {
          status: 200,
          headers: getSecurityHeaders(),
        });
      }

      // Store in KV
      const entry = {
        email: sanitizedEmailValue,
        ts: Date.now(),
        uaHash,
        referer,
        consent: true,
      };

      console.log('Storing email in KV:', sanitizedEmailValue, 'with entry:', entry);
      try {
        await kvNamespace.put(`email:${sanitizedEmailValue}`, JSON.stringify(entry));
        console.log('✅ Email stored successfully in KV:', sanitizedEmailValue);
        
        // Verify it was stored
        const verify = await kvNamespace.get(`email:${sanitizedEmailValue}`);
        if (verify) {
          console.log('✅ Verified email is stored in KV');
        } else {
          console.error('❌ Email not found after storing - KV write may have failed');
        }
      } catch (kvError) {
        console.error('❌ KV storage error:', kvError);
        // Don't fail the request, but log the error
      }
    } else {
      console.error('❌ KV namespace not available - email WILL NOT be stored!');
      console.error('This is a configuration issue. Check Cloudflare Pages KV bindings.');
      // In development without KV, we can still return success
      // In production, this should be configured
    }

    // Optional webhook
    const webhookUrl = runtimeEnv?.WEBHOOK_URL || import.meta.env.WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: sanitizedEmailValue, timestamp: Date.now() }),
        });
      } catch (err) {
        console.error('Webhook error:', err instanceof Error ? err.message : 'Unknown error');
      }
    }

    console.log('Returning success response');
    return new Response(JSON.stringify({ message: 'Success' }), {
      status: 200,
      headers: getSecurityHeaders(),
    });
  } catch (error) {
    console.error('Waitlist API error:', error instanceof Error ? error.message : 'Unknown error');
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: getSecurityHeaders(),
    });
  }
};
