# Fix: Migrate from Worker to Pages Project

## The Problem

Your `opdx.ai` domain is currently connected to a **Worker Service** (`opdx-landing`), but Astro sites need to be deployed as **Cloudflare Pages** projects, not Workers.

## Solution: Create a Pages Project

### Step 1: Disconnect Domain from Worker

1. Go to: `https://dash.cloudflare.com/2f9ad6aafdb4880d6272a302e5a8605f/workers/services/view/opdx-landing/production/settings`
2. Scroll to **"Domains & Routes"** section
3. Find the row with **"Custom domain opdx.ai"**
4. Click **"Delete"** button
5. Confirm deletion

This will disconnect `opdx.ai` from the Worker (don't worry, we'll reconnect it to Pages).

### Step 2: Create Pages Project

1. Go to: `https://dash.cloudflare.com/?to=/:account/workers-and-pages`
2. Click **"Create application"** button
3. Select **"Pages"** tab (NOT Workers)
4. Click **"Connect to Git"**
5. Select your Git provider (GitHub)
6. Authorize Cloudflare if needed
7. Select repository: **`OpdX-ai/opdx.ai`**
8. Click **"Begin setup"**

### Step 3: Configure Pages Build Settings

On the setup page:

- **Project name**: `opdx-ai` (or any name you want)
- **Framework preset**: **Astro**
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `/` (default)

Click **"Save and Deploy"**

### Step 4: Wait for First Deployment

The first deployment will start automatically. Wait for it to complete.

### Step 5: Connect Custom Domain

1. In your new Pages project → Go to **"Custom domains"** tab
2. Click **"Set up a custom domain"**
3. Enter: `opdx.ai`
4. Follow DNS instructions if needed
5. Cloudflare will automatically provision SSL

### Step 6: Migrate Configuration

After Pages project is created, you need to:

1. **Add Environment Variables** (same as before):
   - `CF_TURNSTILE_SITE_KEY`
   - `CF_TURNSTILE_SECRET`
   - `PUBLIC_TURNSTILE_SITE_KEY`
   - `PUBLIC_LAUNCH_READY` = `false`
   - `PUBLIC_ENABLE_WAITLIST` = `true`
   - `PUBLIC_ENABLE_SOCIAL` = `false`

2. **Bind KV Namespace**:
   - Settings → Functions → KV Namespace Bindings
   - Add: `OPDX_WAITLIST` → Select your `opdx-ai` namespace

3. **Redeploy** after adding env vars and bindings

## Important Notes

- **Worker Service (`opdx-landing`)**: You can keep this or delete it later - it won't interfere
- **Pages Project**: This is what will serve your Astro site
- **Domain**: Only connect to Pages, not Worker
- **Build**: Pages handles static site builds automatically
- **Functions**: Your API endpoints (`/api/waitlist`, `/api/og`) will work in Pages too

## After Migration

Your site should work at `https://opdx.ai` showing your Astro landing page instead of "Hello world".

You can verify by checking:
- Countdown timer displays
- Waitlist form works
- Pages are accessible

