# API Configuration Guide

## Problem: 404 Errors on API Calls

If you're seeing 404 errors like:
```
GET https://emeraldsrxhr.sitestaginglink.com/api/settings/sidebar_theme 404 (Not Found)
```

This means the frontend cannot find the backend API.

## Solution

You need to configure where your backend API is located.

### Option 1: Backend on Different Server (Recommended for Production)

If your backend is on a separate server (e.g., `https://api.emeraldsrxhr.sitestaginglink.com`):

1. **Create `.env.production` file** in the `frontend` directory:
```env
NEXT_PUBLIC_API_URL=https://api.emeraldsrxhr.sitestaginglink.com/api
NODE_ENV=production
```

2. **Rebuild the application**:
```bash
cd frontend
npm run build
```

3. **Redeploy** with the new build

### Option 2: Backend on Same Server (Proxied)

If your backend is on the same server but different port, and you want Next.js to proxy requests:

1. **Create `.env.production` file**:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
# Or if backend has a domain:
# NEXT_PUBLIC_API_URL=https://backend.emeraldsrxhr.sitestaginglink.com/api
NODE_ENV=production
```

2. **Rebuild**:
```bash
npm run build
```

The Next.js rewrites will proxy `/api/*` requests to your backend.

### Option 3: Backend on Same Domain (No Proxy Needed)

If your backend is accessible at the same domain (e.g., via reverse proxy):

1. **Create `.env.production` file**:
```env
NEXT_PUBLIC_API_URL=/api
NODE_ENV=production
```

2. **Rebuild**:
```bash
npm run build
```

## How to Find Your Backend URL

1. **Check your backend server** - What URL is it running on?
   - Local development: `http://localhost:5000`
   - Staging: `https://api-staging.example.com` or `https://example.com:5000`
   - Production: `https://api.example.com`

2. **Test the backend directly**:
   ```bash
   curl https://your-backend-url.com/api/health
   ```

3. **Set the full URL** in `.env.production`:
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
   ```

## Important Notes

- ⚠️ **Environment variables must be set BEFORE building**
- ⚠️ **After changing `.env.production`, you MUST rebuild**: `npm run build`
- ⚠️ **`NEXT_PUBLIC_*` variables are embedded at build time** - they cannot be changed at runtime
- ✅ The URL should include `/api` at the end (e.g., `https://api.example.com/api`)

## Verification

After deployment, check the browser console:
- ✅ Should see successful API calls (200 status)
- ❌ If you still see 404s, the `NEXT_PUBLIC_API_URL` is incorrect or not set

## Current Configuration

Check what API URL is being used:
1. Open browser DevTools (F12)
2. Go to Console
3. Type: `process.env.NEXT_PUBLIC_API_URL` (if available)
4. Or check Network tab to see what URL API calls are going to

