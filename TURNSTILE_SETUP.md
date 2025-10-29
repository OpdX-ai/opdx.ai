# Setting Up Cloudflare Turnstile Keys

## Step 1: Get Your Turnstile Keys

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Security** → **Turnstile**
3. Click **"Add Site"** (or use an existing site)
4. Configure:
   - **Site name**: `opdx.ai` (or any name)
   - **Domain**: `opdx.ai` (add your actual domain)
   - **Widget mode**: Choose "Managed" (recommended)
5. Click **Create**
6. **Copy both keys:**
   - **Site Key** (starts with `0x...` - this is public, shown to users)
   - **Secret Key** (starts with `0x...` - keep this private!)

## Step 2: Set Environment Variables

You need to set the keys in two places:

### A. For Cloudflare Pages (Production/Staging)

1. Go to [Cloudflare Pages](https://dash.cloudflare.com/?to=/:account/pages)
2. Click on your **opdx.ai** project
3. Go to **Settings** → **Environment variables**
4. Select **Production** (or **Preview** for staging)

5. Add these variables:

   **Variable 1: `PUBLIC_TURNSTILE_SITE_KEY`**
   - Variable name: `PUBLIC_TURNSTILE_SITE_KEY`
   - Value: Your Site Key (from Step 1)
   - Encrypt: ❌ **No** (this is public)
   - Click **Save**

   **Variable 2: `CF_TURNSTILE_SECRET`**
   - Variable name: `CF_TURNSTILE_SECRET`
   - Value: Your Secret Key (from Step 1)
   - Encrypt: ✅ **Yes** (keep this secret!)
   - Click **Save**

6. **Redeploy** your site after adding variables:
   - Go to **Deployments**
   - Click **Retry deployment** on the latest deployment
   - Or push a new commit to trigger a rebuild

### B. For Local Development

Create a `.env` file in the project root:

```bash
# In your project root directory
touch .env
```

Add to `.env`:
```env
PUBLIC_TURNSTILE_SITE_KEY=your_site_key_here
CF_TURNSTILE_SECRET=your_secret_key_here

# Optional: Other environment variables
PUBLIC_LAUNCH_READY=false
PUBLIC_ENABLE_WAITLIST=true
PUBLIC_ENABLE_SOCIAL=false
```

**Important**: Replace `your_site_key_here` and `your_secret_key_here` with your actual keys from Step 1.

**Note**: The `.env` file should be in `.gitignore` (don't commit secrets!)

## Step 3: Verify Setup

1. **Check browser console:**
   - Visit your site
   - Open Developer Tools (F12)
   - Check Console tab
   - You should NOT see: "Turnstile site key not configured"

2. **Test the form:**
   - The Turnstile widget should appear below the email input
   - Complete the challenge
   - Submit the form
   - Check console for "Turnstile verification successful"

## Troubleshooting

### "Turnstile site key not configured" error

- ✅ Check `PUBLIC_TURNSTILE_SITE_KEY` is set in Cloudflare Pages
- ✅ Ensure you redeployed after adding the variable
- ✅ For local dev: Check `.env` file exists and has the key

### Turnstile widget doesn't appear

- ✅ Verify Site Key is correct (starts with `0x...`)
- ✅ Check domain is whitelisted in Turnstile settings
- ✅ Check browser console for JavaScript errors
- ✅ Ensure `PUBLIC_TURNSTILE_SITE_KEY` starts with `PUBLIC_` (required for Astro)

### Form submission fails

- ✅ Check `CF_TURNSTILE_SECRET` is set in Cloudflare Pages
- ✅ Verify Secret Key matches the Site Key (same Turnstile site)
- ✅ Check Cloudflare Workers logs for errors

## Quick Reference

| Variable Name | Where Used | Encrypt? | Public? |
|--------------|------------|----------|---------|
| `PUBLIC_TURNSTILE_SITE_KEY` | Client-side (browser) | No | Yes ✅ |
| `CF_TURNSTILE_SECRET` | Server-side (API) | Yes | No ❌ |

## Need Help?

- Cloudflare Turnstile Docs: https://developers.cloudflare.com/turnstile/
- Check Cloudflare Dashboard → Workers & Pages → Your Project → Logs

