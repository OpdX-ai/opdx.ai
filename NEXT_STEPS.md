# Next Steps After Pushing to GitHub

Your code is now on GitHub! Follow these steps to deploy:

## 1. Connect GitHub to Cloudflare Pages

1. Go to [Cloudflare Dashboard → Pages](https://dash.cloudflare.com/?to=/:account/pages)
2. Click **"Create a project"**
3. Select **"Connect to Git"**
4. Authorize Cloudflare to access your GitHub account
5. Select repository: **`OpdX-ai/opdx.ai`**
6. Click **"Begin setup"**

## 2. Configure Build Settings

- **Framework preset**: Astro
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `/` (leave default)
- Click **"Save and Deploy"**

This will start the first deployment (may fail due to missing env vars, but that's OK).

## 3. Set Up Cloudflare Turnstile

1. Go to [Cloudflare Dashboard → Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile)
2. Click **"Add Site"**
3. Fill in:
   - Site name: `opdx-ai-landing`
   - Widget mode: **Managed**
4. Click **"Create"**
5. **Copy the Site Key and Secret Key** - you'll need these next

## 4. Create KV Namespace

Run these commands in your terminal:

```bash
# Login to Cloudflare (if not already)
npx wrangler login

# Create production KV namespace
npx wrangler kv:namespace create "OPDX_WAITLIST"

# Create preview KV namespace
npx wrangler kv:namespace create "OPDX_WAITLIST" --preview
```

**Copy the `id` values from the output!**

## 5. Update wrangler.toml

Edit `wrangler.toml` and replace the placeholder IDs with the actual KV namespace IDs from step 4.

## 6. Add Environment Variables to Cloudflare Pages

In your Pages project:
1. Go to **Settings** → **Environment variables**
2. Add these for **Production** and **Preview**:

```
CF_TURNSTILE_SITE_KEY = [your site key from step 3]
CF_TURNSTILE_SECRET = [your secret key from step 3]
PUBLIC_TURNSTILE_SITE_KEY = [same as site key]
PUBLIC_LAUNCH_READY = false
PUBLIC_ENABLE_WAITLIST = true
PUBLIC_ENABLE_SOCIAL = false
```

## 7. Bind KV Namespace

1. In Pages project → **Settings** → **Functions** → **KV Namespace Bindings**
2. Click **"Add binding"**
3. Variable name: `OPDX_WAITLIST`
4. Select your KV namespace
5. Click **"Save"**
6. Repeat for Preview environment

## 8. Redeploy

After setting environment variables and KV binding:
1. Go to **Deployments** tab
2. Find the latest deployment
3. Click **"Retry deployment"** or push a new commit

## 9. Set Up Custom Domain (optional)

1. **Custom domains** → **Set up a custom domain**
2. Enter: `opdx.ai` (or your domain)
3. Follow DNS instructions
4. SSL will provision automatically

## Quick Test Commands

After deployment, test these URLs:
- Main site: `https://your-project.pages.dev`
- OG image: `https://your-project.pages.dev/api/og`
- Calendar: `https://your-project.pages.dev/api/calendar.ics`
- Privacy: `https://your-project.pages.dev/privacy`
- Terms: `https://your-project.pages.dev/terms`

## Need Help?

See `SETUP_GUIDE.md` for detailed instructions or `README.md` for full documentation.

