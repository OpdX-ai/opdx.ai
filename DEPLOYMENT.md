# Deployment Checklist

## Pre-Deployment

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Cloudflare Turnstile**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) → Turnstile
   - Create a site key and secret
   - Add environment variables:
     - `CF_TURNSTILE_SITE_KEY` (secret)
     - `CF_TURNSTILE_SECRET` (secret)
     - `PUBLIC_TURNSTILE_SITE_KEY` (public)

3. **Create KV Namespace**
   ```bash
   npx wrangler kv:namespace create "OPDX_WAITLIST"
   npx wrangler kv:namespace create "OPDX_WAITLIST" --preview
   ```
   - Copy the namespace IDs and update `wrangler.toml`

4. **Test Local Build**
   ```bash
   npm run build
   npm run preview
   ```

## Cloudflare Pages Setup

1. **Connect Repository**
   - Push code to GitHub/GitLab
   - Connect to Cloudflare Pages
   - Select repository and branch

2. **Configure Build**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/` (default)

3. **Add Environment Variables**
   - Settings → Environment variables → Add:
     - `CF_TURNSTILE_SITE_KEY` (Production, Preview)
     - `CF_TURNSTILE_SECRET` (Production, Preview)
     - `PUBLIC_TURNSTILE_SITE_KEY` (Production, Preview)
     - `PUBLIC_LAUNCH_READY` = `"false"` (set to `"true"` when ready)
     - `PUBLIC_ENABLE_WAITLIST` = `"true"`
     - `PUBLIC_ENABLE_SOCIAL` = `"false"` (or `"true"` if you have social links)
     - Optional: `PUBLIC_PLAUSIBLE_DOMAIN`
     - Optional: `WEBHOOK_URL`

4. **Bind KV Namespace**
   - Settings → Functions → KV Namespace Bindings
   - Variable name: `OPDX_WAITLIST`
   - KV namespace: Select your namespace
   - Repeat for Preview environment

5. **Custom Domain**
   - Settings → Custom domains → Add domain
   - Follow DNS setup instructions
   - Enable HTTPS and HSTS

## Post-Deployment

1. **Verify Functionality**
   - [ ] Countdown timer displays correctly
   - [ ] Waitlist form submits successfully
   - [ ] Turnstile verification works
   - [ ] KV entries are saved
   - [ ] OG image generates: `https://opdx.ai/api/og`
   - [ ] Calendar file downloads: `https://opdx.ai/api/calendar.ics`
   - [ ] Privacy and Terms pages load
   - [ ] Sitemap is accessible (when `LAUNCH_READY=true`): `https://opdx.ai/sitemap.xml`

2. **Performance Check**
   - Run Lighthouse audit
   - Target scores: ≥ 95 in all categories
   - Verify TTI < 2s on 3G Fast
   - Check CLS < 0.02

3. **Accessibility Check**
   - Keyboard navigation works
   - Screen reader announces countdown
   - Focus states are visible
   - Color contrast meets AA standards

4. **Before Launch**
   - Set `PUBLIC_LAUNCH_READY=true`
   - Verify robots.txt allows indexing
   - Test OG image in social media previews
   - Check analytics tracking

## Monitoring

- Check Cloudflare Analytics for traffic
- Monitor KV namespace usage
- Review Worker logs for errors
- Set up alerts for form submission failures

## Troubleshooting

### Build Fails
- Check Node.js version (requires 18+)
- Clear `node_modules` and reinstall
- Verify all environment variables are set

### Functions Not Working
- Verify KV namespace is bound correctly
- Check environment variables are set
- Review Worker logs in Cloudflare dashboard

### Turnstile Not Loading
- Verify `PUBLIC_TURNSTILE_SITE_KEY` is set
- Check Turnstile domain whitelist
- Ensure script loads (check browser console)

### KV Writes Failing
- Verify namespace binding in Pages settings
- Check namespace ID matches `wrangler.toml`
- Ensure namespace has write permissions

