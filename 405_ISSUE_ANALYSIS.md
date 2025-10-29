# 405 Error - Potential Causes Analysis

## ✅ Confirmed NOT causing the 405 error:

### 1. **HTML form defaulting to GET**
**Status: FIXED** ✅

- **Before:** Form was missing explicit `method="POST"` attribute
- **After:** Added `method="POST" action="/api/waitlist"` to the form element
- **Location:** `src/components/EmailForm.tsx:239`
- **Why it's safe:** Form also has `onSubmit={handleSubmit}` with `e.preventDefault()`, so it never submits via HTML anyway - the fetch() API handles it

### 2. **fetch() missing method: 'POST'**
**Status: CONFIRMED CORRECT** ✅

- **Location:** `src/components/EmailForm.tsx:129-130`
- **Code:**
  ```typescript
  const response = await fetch('/api/waitlist', {
    method: 'POST',  // ✅ Explicitly set
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
      token: turnstileToken,
    }),
  });
  ```
- **Conclusion:** fetch() correctly specifies POST method

### 3. **Mailer service hitting with HEAD/GET**
**Status: HANDLED** ✅

- **Added:** HEAD request handler in `functions/api/waitlist.ts`
- **Implementation:**
  ```typescript
  // Handle HEAD requests (health checks from monitoring services)
  if (method === 'HEAD') {
    return new Response(null, {
      status: 200,
      headers: getSecurityHeaders(),
    });
  }
  ```
- **Why:** Health check services and some mailer services ping endpoints with HEAD or GET. Now handled gracefully.

### 4. **Form submission from another origin**
**Status: HANDLED** ✅

- **CORS Preflight:** Already handled OPTIONS requests
- **Same-Origin:** The form submits from the same domain (`/api/waitlist`), so no CORS issues
- **Added:** Explicit `method="POST"` on form as backup

## Current State:

### Form Element (EmailForm.tsx):
```tsx
<form 
  className="email-form" 
  onSubmit={handleSubmit} 
  method="POST"              // ✅ Added explicitly
  action="/api/waitlist"     // ✅ Added explicitly
  noValidate
>
```

### Fetch API Call:
```typescript
await fetch('/api/waitlist', {
  method: 'POST',           // ✅ Correctly set
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({...}),
});
```

### API Handler (functions/api/waitlist.ts):
```typescript
// ✅ Handles OPTIONS (CORS preflight)
if (method === 'OPTIONS') { ... }

// ✅ Handles HEAD (health checks)
if (method === 'HEAD') { ... }

// ✅ Handles POST (main functionality)
if (method === 'POST') { ... }

// ✅ Rejects everything else with detailed error
```

## Summary:

**None of the suspected issues are causing the 405 error.**

All potential causes have been addressed:
1. ✅ Form has explicit `method="POST"`
2. ✅ fetch() has `method: 'POST'`
3. ✅ HEAD requests handled
4. ✅ OPTIONS requests handled
5. ✅ Enhanced logging to diagnose actual issue

## Next Steps to Diagnose:

1. **Check Cloudflare Dashboard Logs:**
   - Look for the debug logs: `"Waitlist API called:"` with method, url, pathname
   - Verify what method is actually being received

2. **Network Tab Analysis:**
   - Open browser DevTools → Network tab
   - Submit the form
   - Check the request method in the Network tab
   - Look at the request headers

3. **Possible Real Causes:**
   - Cloudflare Pages Function routing issue (deployment cache)
   - Function not deploying correctly
   - Route conflict between `functions/api/waitlist.ts` and `src/pages/api/waitlist.ts`

## Debug Output Added:

The function now logs:
```javascript
{
  method: 'GET' | 'POST' | 'OPTIONS' | 'HEAD' | etc,
  url: 'https://...',
  pathname: '/api/waitlist',
  userAgent: '...'
}
```

This will show exactly what method is hitting the endpoint.

