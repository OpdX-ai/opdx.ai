# Troubleshooting 405 Error on Waitlist API

## Possible Causes

### 1. **CORS Preflight (OPTIONS request)**
If the browser sends an OPTIONS preflight request that isn't handled, you might see a 405.

**Fix Applied:** Added OPTIONS handler in `functions/api/waitlist.ts`

### 2. **Cloudflare Pages Function Routing**
Cloudflare Pages Functions in `functions/` take precedence over Astro routes.

**Check:**
- The function file exists at `functions/api/waitlist.ts`
- The file exports `onRequest` correctly
- No conflicting directories (like `functions/api/waitlist/`)

**Fix Applied:** Removed empty `waitlist/` directory

### 3. **Deployment Cache**
Sometimes Cloudflare caches old routing information.

**Solution:**
1. Trigger a new deployment
2. Clear Cloudflare cache (if using a custom domain)
3. Wait 1-2 minutes for propagation

### 4. **Astro Route Conflict**
In hybrid mode, both routes exist but Cloudflare Functions should take precedence.

**Check:** The function at `functions/api/waitlist.ts` should be active in production.

## Debugging Steps

### Check Function Logs
In Cloudflare Dashboard:
1. Go to Pages → Your Site → Functions
2. Check the logs for requests to `/api/waitlist`
3. Look for the debug logs we added:
   ```
   Waitlist API called: { method: 'POST', url: '...', pathname: '/api/waitlist' }
   ```

### Test Manually
```bash
# Test POST request
curl -X POST https://your-site.com/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","token":"test-token"}'

# Test OPTIONS request
curl -X OPTIONS https://your-site.com/api/waitlist \
  -H "Origin: https://your-site.com" \
  -v
```

### Verify Function is Deployed
1. Check that `functions/api/waitlist.ts` is in your repository
2. Verify it's included in the build output
3. Check Cloudflare Pages deployment logs

## Current Implementation

- ✅ **Cloudflare Pages Function:** `functions/api/waitlist.ts`
  - Handles POST requests
  - Handles OPTIONS (CORS preflight)
  - Takes precedence in production
  
- ✅ **Astro API Route:** `src/pages/api/waitlist.ts`
  - Fallback for local development
  - Works when Cloudflare Function isn't available

## If 405 Persists

1. **Verify the function file structure:**
   ```
   functions/
     api/
       waitlist.ts  ← Should exist here
   ```

2. **Check build logs:**
   - Look for any errors during function compilation
   - Verify the function is being included in deployment

3. **Test locally with Wrangler:**
   ```bash
   npm run build
   npx wrangler pages dev dist --kv OPDX_WAITLIST=your-namespace-id
   ```

4. **Check Cloudflare Dashboard:**
   - Go to Pages → Functions tab
   - Verify `/api/waitlist` is listed
   - Check for any configuration errors

## Additional Notes

- Cloudflare doesn't block POST requests by default
- The 405 error means the route exists but the method isn't allowed
- The OPTIONS handler should resolve most CORS-related 405 errors
- Debug logging will help identify if requests are reaching the function

## Contact

If the issue persists after trying these steps, check:
1. Cloudflare Pages deployment status
2. Function runtime logs
3. Network tab in browser DevTools to see the exact request/response

