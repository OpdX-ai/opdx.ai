# Fix Cloudflare Pages Build Settings

## The Problem

Cloudflare Pages is trying to run `npx wrangler deploy` instead of building your Astro site. This is incorrect - Pages should build the site itself.

## Solution: Update Build Settings in Cloudflare Dashboard

1. **Go to your Cloudflare Pages project**
   - Navigate to: https://dash.cloudflare.com/?to=/:account/pages
   - Click on your `opdx.ai` project

2. **Go to Settings → Builds & deployments**

3. **Update the Build configuration**:
   - **Framework preset**: `Astro` (or "None" if Astro isn't available)
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (default)

4. **Remove any "Deploy command"** 
   - If there's a "Deploy command" field, clear it or remove `npx wrangler deploy`
   - Cloudflare Pages doesn't need a deploy command - it deploys automatically after build

5. **Save the changes**

6. **Trigger a new deployment**:
   - Go to the **Deployments** tab
   - Click **Retry deployment** on the latest failed deployment
   - Or push a new commit to trigger a rebuild

## Correct Configuration Summary

```
Build command: npm run build
Build output directory: dist
Root directory: /
Deploy command: (leave empty or remove)
```

## Why This Happened

If you selected "Cloudflare Workers" as the framework preset, Cloudflare might have auto-configured it to use `wrangler deploy`. For Astro sites on Pages, you need to use the Astro preset or configure it manually.

