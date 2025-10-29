/**
 * Waitlist API endpoint - Cloudflare Pages Function
 * This takes precedence over Astro API routes for Cloudflare Pages
 * 
 * IMPORTANT: This is the PRODUCTION endpoint used on Cloudflare Pages
 */

// Types are available via @cloudflare/workers-types in Cloudflare runtime
declare type KVNamespace = {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
  delete(key: string): Promise<void>;
};

interface WaitlistEnv {
  OPDX_WAITLIST: KVNamespace;
  CF_TURNSTILE_SECRET: string;
  WEBHOOK_URL?: string;
}

interface PagesFunctionContext {
  request: Request & { cf?: { connectingIp?: string; clientAsn?: string } };
  env: WaitlistEnv;
  waitUntil: (promise: Promise<any>) => void;
  passThroughOnException: () => void;
  next: () => Promise<Response>;
}

// Validation utilities
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

async function hashString(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16);
}

// Security headers for all responses
function getSecurityHeaders(includeCors = false): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Cache-Control': 'no-store, no-cache, must-revalidate',
  };
  
  // Add CORS headers if needed (same-origin requests typically don't need this)
  if (includeCors) {
    headers['Access-Control-Allow-Origin'] = '*';
    headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS';
    headers['Access-Control-Allow-Headers'] = 'Content-Type';
  }
  
  return headers;
}

// Main handler - this is what Cloudflare Pages calls
export async function onRequest(context: PagesFunctionContext): Promise<Response> {
  console.log('=== CLOUDFLARE FUNCTION CALLED ===');
  
  // Debug logging
  const method = context.request.method;
  const url = context.request.url;
  const pathname = new URL(url).pathname;
  
  console.log('Waitlist API called (Cloudflare Function):', {
    method,
    url,
    pathname,
    userAgent: context.request.headers.get('user-agent'),
    contentType: context.request.headers.get('content-type'),
  });

  // Handle OPTIONS for CORS preflight
  if (method === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  // Handle HEAD requests (health checks from monitoring services)
  if (method === 'HEAD') {
    console.log('Handling HEAD request');
    return new Response(null, {
      status: 200,
      headers: getSecurityHeaders(),
    });
  }

  // Only handle POST requests
  if (method !== 'POST') {
    console.log('Rejected method:', method, '- Only POST, OPTIONS, HEAD allowed');
    return new Response(JSON.stringify({ 
      error: 'Method not allowed',
      allowed: ['POST', 'OPTIONS', 'HEAD'],
      received: method,
    }), {
      status: 405,
      headers: { 
        ...getSecurityHeaders(),
        'Allow': 'POST, OPTIONS, HEAD'
      },
    });
  }

  console.log('Processing POST request to waitlist API');

  // Validate Content-Type
  const contentType = context.request.headers.get('content-type');
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
      body = await context.request.json();
      console.log('Parsed request body successfully');
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

    const sanitizedEmail = sanitizeEmail(email);

    // Validate email format
    if (!isValidEmail(sanitizedEmail)) {
      return new Response(JSON.stringify({ error: 'Invalid email format' }), {
        status: 400,
        headers: getSecurityHeaders(),
      });
    }

    // Get IP address for rate limiting and Turnstile verification
    const cf = (context.request as any).cf;
    const ip = cf?.connectingIp || context.request.headers.get('cf-connecting-ip') || 'unknown';

    // Rate limiting - prevent abuse (before Turnstile verification to save API calls)
    if (context.env.OPDX_WAITLIST && ip !== 'unknown') {
      const rateLimitKey = `ratelimit:${ip}`;
      const rateLimitData = await context.env.OPDX_WAITLIST.get(rateLimitKey);
      
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
        await context.env.OPDX_WAITLIST.put(rateLimitKey, (attempts + 1).toString(), { expirationTtl: 3600 });
      } else {
        await context.env.OPDX_WAITLIST.put(rateLimitKey, '1', { expirationTtl: 3600 });
      }
    }

    // Verify Turnstile token
    const turnstileSecret = context.env.CF_TURNSTILE_SECRET;
    if (turnstileSecret) {
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
    } else {
      console.warn('CF_TURNSTILE_SECRET not configured - skipping verification');
    }

    // Get request metadata
    const ua = context.request.headers.get('user-agent') || 'unknown';
    const referer = context.request.headers.get('referer') || '';

    // Hash IP and UA
    const ipHash = await hashString(ip);
    const uaHash = await hashString(ua.substring(0, 100));

    // Check if email already exists
    if (context.env.OPDX_WAITLIST) {
      const existing = await context.env.OPDX_WAITLIST.get(`email:${sanitizedEmail}`);
      if (existing) {
        console.log('Email already subscribed:', sanitizedEmail);
        return new Response(JSON.stringify({ message: 'Already subscribed', duplicate: true }), {
          status: 200,
          headers: getSecurityHeaders(),
        });
      }

      // Store in KV
      const entry = {
        email: sanitizedEmail,
        ts: Date.now(),
        uaHash,
        referer,
        ipHash,
        consent: true,
      };

      await context.env.OPDX_WAITLIST.put(`email:${sanitizedEmail}`, JSON.stringify(entry));
      console.log('Email stored successfully:', sanitizedEmail);
    } else {
      console.warn('KV namespace not available');
    }

    // Optional webhook
    const webhookUrl = context.env.WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: sanitizedEmail, timestamp: Date.now() }),
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
}
