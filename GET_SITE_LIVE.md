# Get Your Site Fully Functional - Next Steps

Your site is deployed! 🎉 Now let's make it fully functional with these steps:

## ✅ Step 1: Set Up Cloudflare Turnstile (Anti-Spam)

1. Go to [Cloudflare Dashboard → Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile)
2. Click **"Add Site"**
3. Fill in:
   - **Site name**: `opdx-ai-landing`
   - **Domain**: Leave empty (or add your domain like `opdx.ai`)
   - **Widget mode**: **Managed**
4. Click **"Create"**
5. **📋 COPY THE SITE KEY AND SECRET KEY** - You'll need these in the next step

## ✅ Step 2: Create KV Namespace (For Waitlist Storage)

Run these commands in your terminal:

```bash
# Login to Cloudflare (if not already logged in)
npx wrangler login

# Create production KV namespace
npx wrangler kv:namespace create "OPDX_WAITLIST"

# Create preview KV namespace (for staging)
npx wrangler kv:namespace create "OPDX_WAITLIST" --preview
```

**📋 COPY THE `id` VALUES** from both outputs - you'll need them next!

Example output:
```
🌀 Creating namespace with title "OPDX_WAITLIST"
✨ Success!
Add the following to your configuration file:
id = "abc123def456ghi789..."  ← COPY THIS
```

## ✅ Step 3: Update wrangler.toml with KV IDs

1. Open `wrangler.toml`
2. Replace the placeholder IDs:

```toml
[[kv_namespaces]]
binding = "OPDX_WAITLIST"
id = "YOUR_PRODUCTION_NAMESPACE_ID"    # Paste from Step 2
preview_id = "YOUR_PREVIEW_NAMESPACE_ID" # Paste from Step 2
```

3. Save and commit:
```bash
git add wrangler.toml
git commit -m "Update KV namespace IDs"
git push origin main
```

## ✅ Step 4: Add Environment Variables to Cloudflare Pages

1. Go to your **Cloudflare Pages project** → **Settings** → **Environment variables**
2. Click **"Add variable"** for each of these:

### For PRODUCTION environment:

- **Variable name**: `CF_TURNSTILE_SITE_KEY`
  - **Value**: [Your Site Key from Step 1]
  - **Encrypt**: ✅ Yes

- **Variable name**: `CF_TURNSTILE_SECRET`
  - **Value**: [Your Secret Key from Step 1]
  - **Encrypt**: ✅ Yes

- **Variable name**: `PUBLIC_TURNSTILE_SITE_KEY`
  - **Value**: [Your Site Key from Step 1 - same as above]
  - **Encrypt**: ❌ No (this is public)

- **Variable name**: `PUBLIC_LAUNCH_READY`
  - **Value**: `false`
  - **Encrypt**: ❌ No

- **Variable name**: `PUBLIC_ENABLE_WAITLIST`
  - **Value**: `true`
  - **Encrypt**: ❌ No

- **Variable name**: `PUBLIC_ENABLE_SOCIAL`
  - **Value**: `false` (or `true` if you have social links)
  - **Encrypt**: ❌ No

3. **Repeat for PREVIEW environment** (same variables)

4. Click **"Save"**

## ✅ Step 5: Bind KV Namespace in Cloudflare Pages

1. In your Pages project → **Settings** → **Functions** → **KV Namespace Bindings**
2. Click **"Add binding"**
3. Configure:
   - **Variable name**: `OPDX_WAITLIST`
   - **KV namespace**: Select your production namespace (from Step 2)
4. Click **"Save"**
5. **Repeat for Preview environment** (use the preview namespace ID)

## ✅ Step 6: Redeploy Your Site

After adding environment variables and KV binding:

1. Go to **Deployments** tab
2. Click **"Retry deployment"** on the latest deployment
   - OR push a new commit to trigger redeploy:
   ```bash
   git commit --allow-empty -m "Trigger redeploy with env vars"
   git push origin main
   ```

## ✅ Step 7: Test Your Site

Visit your deployed site and test:

1. **Countdown Timer** - Should show time until December 4, 2025
2. **Waitlist Form** - Fill it out and submit (test with your email)
3. **OG Image** - Visit: `https://your-site.pages.dev/api/og`
4. **Calendar Link** - Click "Add to Calendar" and verify ICS downloads
5. **Privacy/Terms Pages** - Should be accessible

## ✅ Step 8: Verify KV Storage (Optional)

Check if emails are being saved:

```bash
npx wrangler kv:key list --namespace-id=YOUR_NAMESPACE_ID
```

## 🎉 You're Done!

Your site should now be fully functional with:
- ✅ Working countdown timer
- ✅ Functional waitlist form with spam protection
- ✅ Email storage in KV
- ✅ OG images for social sharing
- ✅ Calendar integration

## 🔗 Quick Links

- **Cloudflare Dashboard**: https://dash.cloudflare.com
- **Cloudflare Pages**: https://dash.cloudflare.com/?to=/:account/pages
- **Cloudflare Turnstile**: https://dash.cloudflare.com/?to=/:account/turnstile
- **KV Management**: https://dash.cloudflare.com/?to=/:account/workers/kv/namespaces

## 🆘 Need Help?

If something doesn't work:
1. Check the **Function logs** in Cloudflare Pages dashboard
2. Check browser console for client-side errors
3. Verify all environment variables are set correctly
4. Make sure KV namespace is bound correctly

