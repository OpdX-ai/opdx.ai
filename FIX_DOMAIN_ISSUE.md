# Fix Domain Issue - Seeing "Hello World"

The domain `opdx.ai` is showing "Hello world" instead of your Astro landing page. This means the custom domain might be pointing to the wrong Pages project or Workers script.

## 🔍 Diagnosis Steps

### Step 1: Check Which Pages Project Has Your Deployments

1. Go to [Cloudflare Pages Dashboard](https://dash.cloudflare.com/?to=/:account/pages)
2. Look for your project (should be the one connected to `OpdX-ai/opdx.ai` GitHub repo)
3. Check the **Deployments** tab - you should see successful deployments
4. Click on a recent deployment to see its status
5. Note the **Pages URL** (something like `opdx-ai-xyz.pages.dev`)

### Step 2: Verify Custom Domain Connection

1. In your Pages project → **Custom domains** tab
2. Check if `opdx.ai` is listed
3. If **not listed**:
   - Click **"Set up a custom domain"**
   - Enter: `opdx.ai`
   - Follow DNS setup instructions

4. If **already listed**:
   - Check if it says "Active" or "Pending"
   - Verify the DNS records are correct

### Step 3: Check DNS Records

Your domain needs to point to Cloudflare Pages. Check DNS:

1. Go to [Cloudflare Dashboard → DNS](https://dash.cloudflare.com/?to=/:account/zone/opdx.ai/dns)
2. Look for these records:
   - **CNAME**: `opdx.ai` → `[your-pages-url].pages.dev` (or similar)
   - OR **A/AAAA** records pointing to Cloudflare Pages IPs
3. If records are missing or wrong, add/update them

### Step 4: Check if Domain is on Different Project

The domain might be connected to a different Pages project or Workers script:

1. Search all your Pages projects for `opdx.ai` domain
2. Check if there's a Workers script attached to the domain
   - Go to **Workers & Pages** → **Workers**
   - Check if any Worker is deployed to `opdx.ai`

## 🔧 Solution Steps

### Option A: Connect Domain to Correct Pages Project

If `opdx.ai` is not connected to your Astro project:

1. Go to your **Astro Pages project** (the one with deployments)
2. **Custom domains** → **Set up a custom domain**
3. Enter: `opdx.ai`
4. Cloudflare will check DNS and connect it
5. Wait for SSL provisioning (usually 1-2 minutes)

### Option B: Disconnect from Wrong Project/Worker

If `opdx.ai` is connected to the wrong thing:

1. Find where `opdx.ai` is currently connected
2. **Remove the domain** from that project/worker
3. Then add it to your correct Astro Pages project

### Option C: Check Build Output

If domain is connected but showing wrong content:

1. Check latest deployment is **successful**
2. Verify build output directory is `dist`
3. Check if there's an `index.html` in the deployment
4. Retry deployment if needed

## 🧪 Test Steps

After fixing, test:

1. Visit: `https://opdx.ai` - should show your Astro landing page
2. Visit: `https://your-project.pages.dev` - should also work
3. Check countdown timer is visible
4. Check waitlist form is present

## 📋 Quick Checklist

- [ ] Domain `opdx.ai` is listed in correct Pages project → Custom domains
- [ ] DNS records are correct (CNAME or A records)
- [ ] Latest deployment is successful
- [ ] SSL certificate is active (should be automatic)
- [ ] Tried clearing browser cache (Ctrl+F5 or Cmd+Shift+R)

## 🔗 Useful Links

- Pages Dashboard: https://dash.cloudflare.com/?to=/:account/pages
- DNS Settings: https://dash.cloudflare.com/?to=/:account/zone/opdx.ai/dns
- Workers: https://dash.cloudflare.com/?to=/:account/workers

