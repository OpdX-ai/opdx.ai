# Complete Setup Guide (Using Cloudflare Dashboard UI)

## ✅ Step 1: Note Your Turnstile Keys

You've already created Turnstile keys. Make sure you have both:
- **Site Key** (public - starts with `0x...`)
- **Secret Key** (private - starts with `0x...`)

Keep these handy for Step 3.

## ✅ Step 2: Create KV Namespace (Via Dashboard)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Select your account
3. Go to **Workers & Pages** → **KV** (or direct link: https://dash.cloudflare.com/?to=/:account/workers/kv/namespaces)
4. Click **"Create a namespace"**
5. Name it: `OPDX_WAITLIST`
6. Click **"Add"**
7. **📋 COPY THE NAMESPACE ID** (you'll see it in the table - it's a long string)

### Create Preview Namespace Too:

1. Still in KV page, click **"Create a namespace"** again
2. Name it: `OPDX_WAITLIST_PREVIEW`
3. Click **"Add"**
4. **📋 COPY THIS NAMESPACE ID TOO**

## ✅ Step 3: Add Environment Variables to Cloudflare Pages

1. Go to [Cloudflare Pages](https://dash.cloudflare.com/?to=/:account/pages)
2. Click on your **opdx.ai** project
3. Go to **Settings** → **Environment variables**
4. Make sure you're adding to **Production** environment first

### Add these variables (click "Add variable" for each):

**Variable 1:**
- Variable name: `CF_TURNSTILE_SITE_KEY`
- Value: [Paste your Turnstile Site Key]
- Encrypt: ✅ **Yes** (check the box)
- Click **"Save"**

**Variable 2:**
- Variable name: `CF_TURNSTILE_SECRET`
- Value: [Paste your Turnstile Secret Key]
- Encrypt: ✅ **Yes** (check the box)
- Click **"Save"**

**Variable 3:**
- Variable name: `PUBLIC_TURNSTILE_SITE_KEY`
- Value: [Paste your Turnstile Site Key - same as Variable 1]
- Encrypt: ❌ **No** (this is public)
- Click **"Save"**

**Variable 4:**
- Variable name: `PUBLIC_LAUNCH_READY`
- Value: `false`
- Encrypt: ❌ **No**
- Click **"Save"**

**Variable 5:**
- Variable name: `PUBLIC_ENABLE_WAITLIST`
- Value: `true`
- Encrypt: ❌ **No**
- Click **"Save"**

**Variable 6:**
- Variable name: `PUBLIC_ENABLE_SOCIAL`
- Value: `false`
- Encrypt: ❌ **No**
- Click **"Save"**

### Now add the same variables to Preview environment:

1. Click the dropdown that says **"Production"** (top of the page)
2. Select **"Preview"**
3. Add all 6 variables again with the same values
4. Make sure encryption settings match

## ✅ Step 4: Bind KV Namespace in Cloudflare Pages

1. Still in your Pages project → Go to **Settings** → **Functions** 
2. Scroll down to **"KV Namespace Bindings"**
3. Click **"Add binding"**

**For Production:**
- Variable name: `OPDX_WAITLIST`
- KV namespace: Click the dropdown and select `OPDX_WAITLIST` (the namespace you created)
- Click **"Save"**

**For Preview:**
1. Click the **"Production"** dropdown (top of bindings section)
2. Select **"Preview"**
3. Click **"Add binding"**
4. Variable name: `OPDX_WAITLIST`
5. KV namespace: Select `OPDX_WAITLIST_PREVIEW`
6. Click **"Save"**

## ✅ Step 5: Update wrangler.toml (Optional but Recommended)

Update your local `wrangler.toml` file with the KV namespace IDs:

1. Open `wrangler.toml` in your editor
2. Replace the placeholder IDs with your actual namespace IDs:

```toml
[[kv_namespaces]]
binding = "OPDX_WAITLIST"
id = "YOUR_PRODUCTION_NAMESPACE_ID"      # From Step 2
preview_id = "YOUR_PREVIEW_NAMESPACE_ID" # From Step 2
```

3. Save the file
4. Commit and push:
```bash
git add wrangler.toml
git commit -m "Update KV namespace IDs"
git push origin main
```

## ✅ Step 6: Trigger Redeployment

After adding environment variables and KV bindings:

1. Go to **Deployments** tab in your Pages project
2. Find the latest deployment
3. Click the **"..."** (three dots) menu
4. Click **"Retry deployment"**

OR

Push a new commit to trigger automatic redeploy:
```bash
git commit --allow-empty -m "Trigger redeploy with env vars"
git push origin main
```

## ✅ Step 7: Test Your Site

1. Visit your Cloudflare Pages URL (should be something like `https://opdx-ai-xyz.pages.dev`)
2. Test the countdown timer - should show time until Dec 4, 2025
3. Test the waitlist form:
   - Enter an email
   - Complete the Turnstile challenge
   - Submit
   - Should see success message
4. Test OG image: Visit `https://your-site.pages.dev/api/og`
5. Test calendar: Click "Add to Calendar" link

## ✅ Step 8: Verify Email Was Saved (Optional)

You can verify emails are being saved by checking the KV namespace:

1. Go to **Workers & Pages** → **KV**
2. Click on `OPDX_WAITLIST` namespace
3. You should see entries like `email:user@example.com`

## 🎉 Done!

Your site should now be fully functional!

