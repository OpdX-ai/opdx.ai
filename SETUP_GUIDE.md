# Step-by-Step Cloudflare Deployment Guide

Follow these steps in order to deploy your OPDX.AI landing page.

## Step 1: Install Wrangler CLI (if needed)

Wrangler is bundled with your project, but you can also install it globally:
```bash
npm install -g wrangler
```

## Step 2: Log in to Cloudflare

```bash
npx wrangler login
```

This will open your browser to authenticate with Cloudflare.

## Step 3: Set Up Cloudflare Turnstile

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Security** → **Turnstile** (or go to https://dash.cloudflare.com/?to=/:account/turnstile)
3. Click **Add Site**
4. Fill in:
   - **Site name**: `opdx-ai-landing`
   - **Domain**: Your domain (e.g., `opdx.ai`) or leave empty for all domains
   - **Widget mode**: Managed
5. Click **Create**
6. Copy the **Site Key** and **Secret Key**
7. Save these - you'll need them in Step 6

## Step 4: Create KV Namespaces

Run these commands to create KV namespaces for storing waitlist emails:

```bash
# Create production namespace
npx wrangler kv:namespace create "OPDX_WAITLIST"

# Create preview namespace (for staging)
npx wrangler kv:namespace create "OPDX_WAITLIST" --preview
```

**Important**: Copy the **id** values from the output. You'll need to update `wrangler.toml`.

Example output:
```
🌀 Creating namespace with title "OPDX_WAITLIST"
✨ Success!
Add the following to your configuration file:
id = "abc123def456..."  ← COPY THIS
```

## Step 5: Update Configuration Files

1. Open `wrangler.toml`
2. Replace the placeholder IDs with the actual KV namespace IDs:

```toml
[[kv_namespaces]]
binding = "OPDX_WAITLIST"
id = "YOUR_PRODUCTION_NAMESPACE_ID"     # From Step 4
preview_id = "YOUR_PREVIEW_NAMESPACE_ID" # From Step 4
```

## Step 6: Set Up Environment Variables

Create a `.env` file in the project root:

```bash
# Create .env file
cat > .env << 'EOF'
# Cloudflare Turnstile
CF_TURNSTILE_SITE_KEY=your_site_key_here
CF_TURNSTILE_SECRET=your_secret_key_here
PUBLIC_TURNSTILE_SITE_KEY=your_site_key_here

# Feature Flags
PUBLIC_LAUNCH_READY=false
PUBLIC_ENABLE_WAITLIST=true
PUBLIC_ENABLE_SOCIAL=false

# Social Links (optional)
PUBLIC_TWITTER_URL=
PUBLIC_LINKEDIN_URL=

# Analytics (optional)
PUBLIC_PLAUSIBLE_DOMAIN=

# Webhooks (optional)
WEBHOOK_URL=
EOF
```

Then edit `.env` and add your Turnstile keys from Step 3.

## Step 7: Test Build Locally

```bash
# Build the project
npm run build

# Preview the build
npm run preview
```

Visit `http://localhost:4321` to test. The waitlist form won't work locally (needs Cloudflare runtime), but you can verify the page renders correctly.

## Step 8: Initialize Git Repository (if not already done)

```bash
git init
git add .
git commit -m "Initial commit: OPDX.AI landing page"
```

## Step 9: Push to GitHub

1. Create a new repository on GitHub (don't initialize with README)
2. Push your code:

```bash
git remote add origin https://github.com/YOUR_USERNAME/opdx-ai-landing.git
git branch -M main
git push -u origin main
```

## Step 10: Deploy to Cloudflare Pages

### Option A: Using Cloudflare Dashboard (Recommended)

1. Go to [Cloudflare Pages](https://dash.cloudflare.com/?to=/:account/pages)
2. Click **Create a project**
3. Select **Connect to Git**
4. Choose your Git provider (GitHub/GitLab) and authorize
5. Select your repository (`opdx-ai-landing`)
6. Configure build settings:
   - **Framework preset**: Astro
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (leave default)
7. Click **Save and Deploy**

### Option B: Using Wrangler CLI

```bash
npx wrangler pages deploy dist --project-name=opdx-ai-landing
```

## Step 11: Configure Environment Variables in Cloudflare Pages

1. Go to your Pages project
2. Navigate to **Settings** → **Environment variables**
3. Add the following variables for **Production** and **Preview**:

   - `CF_TURNSTILE_SITE_KEY` → Your site key (from Step 3)
   - `CF_TURNSTILE_SECRET` → Your secret key (from Step 3)
   - `PUBLIC_TURNSTILE_SITE_KEY` → Your site key (same as above)
   - `PUBLIC_LAUNCH_READY` → `false` (set to `true` when ready to launch)
   - `PUBLIC_ENABLE_WAITLIST` → `true`
   - `PUBLIC_ENABLE_SOCIAL` → `false` or `true`
   - (Optional) `PUBLIC_PLAUSIBLE_DOMAIN` → Your Plausible domain
   - (Optional) `WEBHOOK_URL` → Your webhook URL

4. Click **Save**

## Step 12: Bind KV Namespace

1. In your Pages project, go to **Settings** → **Functions** → **KV Namespace Bindings**
2. Click **Add binding**
3. Configure:
   - **Variable name**: `OPDX_WAITLIST`
   - **KV namespace**: Select your production namespace
4. Click **Save**
5. Repeat for Preview environment (use preview namespace)

## Step 13: Set Up Custom Domain

1. In your Pages project, go to **Custom domains**
2. Click **Set up a custom domain**
3. Enter your domain: `opdx.ai` (or `www.opdx.ai`)
4. Follow the DNS setup instructions:
   - If domain is on Cloudflare: DNS records are automatically configured
   - If not: Add a CNAME record pointing to your Pages URL
5. Cloudflare will provision SSL automatically

## Step 14: Verify Deployment

1. Visit your deployed site (check the Pages project for the URL)
2. Test the countdown timer
3. Test the waitlist form (submit a test email)
4. Verify OG image: `https://your-domain.com/api/og`
5. Test calendar download: `https://your-domain.com/api/calendar.ics`

## Step 15: Check KV Storage

Verify emails are being saved:

```bash
# List all keys in your KV namespace
npx wrangler kv:key list --namespace-id=YOUR_NAMESPACE_ID

# Get a specific entry
npx wrangler kv:key get email:test@example.com --namespace-id=YOUR_NAMESPACE_ID
```

## Troubleshooting

### Build fails
- Check Node.js version: `node --version` (should be 18+)
- Clear cache: `rm -rf node_modules .astro dist && npm install`

### Functions not working
- Verify KV namespace is bound in Pages settings
- Check environment variables are set correctly
- Review function logs in Cloudflare dashboard

### Turnstile not loading
- Verify `PUBLIC_TURNSTILE_SITE_KEY` is set
- Check browser console for errors
- Ensure domain is whitelisted in Turnstile settings

### Need help?
Check the main README.md for detailed documentation.

