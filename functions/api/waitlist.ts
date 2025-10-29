/**
 * Waitlist API endpoint - Cloudflare Pages Function
 * This takes precedence over Astro API routes for Cloudflare Pages
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

export const onRequest = async (context: PagesFunctionContext) => {
  // Only handle POST requests
  if (context.request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 
        'Content-Type': 'application/json',
        'Allow': 'POST'
      },
    });
  }

  try {
    const { email, token } = await context.request.json();

    if (!email || !token) {
      return new Response(JSON.stringify({ error: 'Email and token required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const sanitizedEmail = sanitizeEmail(email);

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
    const cf = (context.request as any).cf;
    const ip = cf?.connectingIp || context.request.headers.get('cf-connecting-ip') || 'unknown';
    const ua = context.request.headers.get('user-agent') || 'unknown';
    const referer = context.request.headers.get('referer') || '';

    // Hash IP and UA
    const ipHash = await hashString(ip);
    const uaHash = await hashString(ua.substring(0, 100));

    // Check if email already exists
    if (context.env.OPDX_WAITLIST) {
      const existing = await context.env.OPDX_WAITLIST.get(`email:${sanitizedEmail}`);
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
        ipHash,
        consent: true,
      };

      await context.env.OPDX_WAITLIST.put(`email:${sanitizedEmail}`, JSON.stringify(entry));
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

