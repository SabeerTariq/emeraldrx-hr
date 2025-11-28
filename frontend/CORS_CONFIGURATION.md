# CORS Configuration in Frontend

## Overview

CORS (Cross-Origin Resource Sharing) is primarily configured on the **backend server**, not the frontend. However, the frontend has some configurations that work with CORS.

## Where CORS Appears in Frontend

### 1. **Browser Console Errors**
CORS errors appear in the browser console when:
- The frontend makes API requests to a different origin
- The backend doesn't allow the frontend's origin
- The request includes credentials (`withCredentials: true`)

**Example Error:**
```
Access to XMLHttpRequest at 'https://api.example.com/api/auth/me' from origin 'https://emeraldsrxhr.sitestaginglink.com' 
has been blocked by CORS policy: Response to preflight request doesn't pass access control check: 
The value of the 'Access-Control-Allow-Origin' header in the response must be the wildcard '*' 
when the request's credentials mode is 'include'.
```

**Location:** Browser DevTools → Console tab

### 2. **Network Tab**
CORS-related headers can be seen in:
- Browser DevTools → Network tab
- Look for `Access-Control-Allow-Origin` header in response
- Check if preflight OPTIONS requests are successful

**Location:** Browser DevTools → Network tab → Select any API request → Headers

### 3. **API Client Configuration**
The frontend API client is configured in:
- **File:** `frontend/lib/api.ts`
- **Key Setting:** `withCredentials: true` (line 35)
  - This requires the backend to explicitly allow the frontend origin
  - Cannot use wildcard `*` when credentials are included

### 4. **Blocking Script in Layout**
The blocking script in `app/layout.tsx` makes synchronous XHR requests:
- **File:** `frontend/app/layout.tsx` (lines 25-92)
- Makes requests to `/api/settings/sidebar_theme` and `/api/settings/sidebar_logo`
- These requests must be allowed by backend CORS

### 5. **Next.js API Routes**
If you have Next.js API routes (like `app/api/test-logo/route.ts`), they can set CORS headers:
- **File:** `frontend/app/api/test-logo/route.ts`
- Sets `Access-Control-Allow-Origin` header for allowed origins

## Production URL Configuration

The production URL `https://emeraldsrxhr.sitestaginglink.com` is configured in:

1. **Backend CORS** (`backend/src/index.ts`):
   ```typescript
   const productionOrigins = [
     "https://emeraldsrxhr.sitestaginglink.com",
   ];
   ```

2. **Frontend API Client** (`frontend/lib/api.ts`):
   - Uses `NEXT_PUBLIC_API_URL` environment variable
   - Falls back to relative `/api` path in production

3. **Blocking Script** (`frontend/app/layout.tsx`):
   - Detects production hostname and uses same origin
   - Updated to explicitly check for `emeraldsrxhr.sitestaginglink.com`

4. **Next.js API Routes** (`frontend/app/api/test-logo/route.ts`):
   - Includes `https://emeraldsrxhr.sitestaginglink.com` in allowed origins

## How to Debug CORS Issues

1. **Check Browser Console:**
   - Open DevTools (F12)
   - Go to Console tab
   - Look for CORS error messages

2. **Check Network Tab:**
   - Open DevTools (F12)
   - Go to Network tab
   - Select the failed request
   - Check Request Headers → `Origin`
   - Check Response Headers → `Access-Control-Allow-Origin`

3. **Check Backend Logs:**
   - Look for `🌐 Allowed CORS origins:` message
   - Look for `🚫 CORS rejected origin:` warnings

4. **Verify Origin Match:**
   - The `Origin` header must exactly match an allowed origin
   - No trailing slashes
   - Protocol must match (http vs https)

## Important Notes

- ⚠️ **CORS is configured on the backend**, not frontend
- ⚠️ **Frontend cannot fix CORS errors** - backend must allow the origin
- ✅ **Frontend can only configure** `withCredentials` and API URLs
- ✅ **Next.js API routes** can set CORS headers for their own endpoints

## Common CORS Issues

1. **Origin Mismatch:**
   - Frontend: `https://emeraldsrxhr.sitestaginglink.com/`
   - Backend allows: `https://emeraldsrxhr.sitestaginglink.com` (no trailing slash)
   - **Fix:** Normalize origins (remove trailing slashes)

2. **Protocol Mismatch:**
   - Frontend: `https://...`
   - Backend allows: `http://...`
   - **Fix:** Ensure both use same protocol

3. **Credentials with Wildcard:**
   - Backend uses `Access-Control-Allow-Origin: *`
   - Frontend uses `withCredentials: true`
   - **Fix:** Backend must return exact origin, not `*`

4. **Missing Preflight Headers:**
   - OPTIONS request fails
   - **Fix:** Backend must handle OPTIONS requests and return proper headers

