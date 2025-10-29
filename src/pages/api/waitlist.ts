/**
 * Waitlist API endpoint (Astro API route - works in dev and production)
 * Handles email submissions with Turnstile verification and KV storage
 */

import type { APIRoute } from 'astro';

function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

async function hashString(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16);
}

export const POST: APIRoute = async ({ request, locals }) => {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { email, token } = await request.json();

    if (!email || !token) {
      return new Response(JSON.stringify({ error: 'Email and token required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const sanitizedEmail = sanitizeEmail(email);

    // Get environment variables - check both runtime and import.meta.env
    const runtimeEnv = (locals.runtime as any)?.env;
    const turnstileSecret = runtimeEnv?.CF_TURNSTILE_SECRET || import.meta.env.CF_TURNSTILE_SECRET;
    const kvNamespace = runtimeEnv?.OPDX_WAITLIST;

    // Verify Turnstile token
    if (turnstileSecret) {
      const verifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
      const verifyResponse = await fetch(verifyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: turnstileSecret,
          response: token,
        }),
      });

      const verifyData = await verifyResponse.json();

      if (!verifyData.success) {
        console.error('Turnstile verification failed:', verifyData);
        return new Response(JSON.stringify({ error: 'Verification failed' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
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
      const existing = await kvNamespace.get(`email:${sanitizedEmail}`);
      if (existing) {
        return new Response(JSON.stringify({ message: 'Already subscribed', duplicate: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Store in KV
      const entry = {
        email: sanitizedEmail,
        ts: Date.now(),
        uaHash,
        referer,
        consent: true,
      };

      await kvNamespace.put(`email:${sanitizedEmail}`, JSON.stringify(entry));
    } else {
      console.warn('KV namespace not available - email not stored. This is OK in local dev.');
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
          body: JSON.stringify({ email: sanitizedEmail, timestamp: Date.now() }),
        });
      } catch (err) {
        console.error('Webhook error:', err);
      }
    }

    return new Response(JSON.stringify({ message: 'Success' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Waitlist API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

