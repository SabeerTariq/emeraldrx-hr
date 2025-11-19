# Deployment Guide - Fixing Chunk Loading Errors

## Problem
Chunk loading errors (400 Bad Request) when accessing Next.js chunks in production/staging.

## Common Causes

1. **Incomplete Build**: The `.next` folder might be incomplete or corrupted
2. **Server Configuration**: Web server (Nginx/Apache) blocking .js files
3. **Caching Issues**: Old cached chunks that no longer exist
4. **Build Mismatch**: Deployed build doesn't match the current codebase

## Solutions

### 1. Clean Build and Redeploy

```bash
# Clean previous build
rm -rf .next
rm -rf out
rm -rf node_modules/.cache

# Fresh install
npm install

# Build for production
npm run build

# Verify build output
ls -la .next/static/chunks/
```

### 2. Server Configuration (Nginx Example)

Ensure your Nginx config allows JavaScript files:

```nginx
server {
    listen 80;
    server_name emeraldsrxhr.sitestaginglink.com;

    location /_next/static/ {
        alias /path/to/your/app/.next/static/;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    location / {
        proxy_pass http://localhost:1206;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. Environment Variables (CRITICAL)

**You MUST set the backend API URL for production!**

Create `.env.production` file in the `frontend` directory:

```env
# Backend API URL - REQUIRED for production
# Replace with your actual backend server URL
NEXT_PUBLIC_API_URL=https://your-backend-api.com/api

# Or if backend is on same domain but different port:
# NEXT_PUBLIC_API_URL=https://emeraldsrxhr.sitestaginglink.com:5000/api

# Application
NEXT_PUBLIC_APP_NAME=EmeraldRx HRM
NODE_ENV=production
```

**Important Notes:**
- `NEXT_PUBLIC_API_URL` must be set at **build time** (not runtime)
- The URL should include `/api` at the end
- After setting, you MUST rebuild: `npm run build`
- If backend is on different server, use full URL: `https://api.example.com/api`
- If backend is proxied via Next.js, you can use relative URL: `/api` (but still set the env var for rewrites)

### 4. Verify Deployment

After deployment, check:
- All files in `.next/static/chunks/` are accessible
- No 404 or 400 errors in browser network tab
- Build output matches the deployed files

### 5. Clear Browser Cache

Users experiencing issues should:
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Clear browser cache
- Try incognito/private mode

## Quick Fix Commands

```bash
# Full clean rebuild
cd frontend
rm -rf .next out node_modules/.cache
npm install
npm run build

# Test locally before deploying
npm run start
```

