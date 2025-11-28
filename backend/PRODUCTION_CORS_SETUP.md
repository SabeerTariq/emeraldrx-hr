# Production CORS Configuration

## Issue
CORS errors in production: `{"success":false,"error":{"message":"Not allowed by CORS"}}`

## Solution

The CORS configuration has been updated to support production domains. You need to set the following environment variables in your production environment:

### Required Environment Variables

1. **NODE_ENV**: Set to `production`
   ```bash
   NODE_ENV=production
   ```

2. **FRONTEND_URL**: Set to your production frontend URL
   ```bash
   FRONTEND_URL=https://emeraldsrxhr.sitestaginglink.com
   ```

### Optional: Multiple Origins

If you need to allow multiple origins (e.g., staging and production), you can use the `ALLOWED_ORIGINS` environment variable (comma-separated):

```bash
ALLOWED_ORIGINS=https://emeraldsrxhr.sitestaginglink.com,https://emeraldsrxhr.com,https://www.emeraldsrxhr.com
```

### Example Production .env File

```env
# Server Configuration
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://emeraldsrxhr.sitestaginglink.com

# Database Configuration
DB_HOST=your-db-host
DB_PORT=3306
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=emeraldsrx_hrm

# JWT
JWT_SECRET=your-production-secret-key
JWT_EXPIRES_IN=7d

# ... other configuration
```

### Verification

After setting these environment variables and restarting your server, you should see in the server logs:

```
🌐 Allowed CORS origins: https://emeraldsrxhr.sitestaginglink.com
```

If a request is rejected, you'll see:

```
🚫 CORS rejected origin: https://some-other-domain.com
   Allowed origins: https://emeraldsrxhr.sitestaginglink.com
```

### Important Notes

1. **Protocol matters**: Make sure `FRONTEND_URL` uses `https://` if your production site uses HTTPS
2. **No trailing slash**: Don't include a trailing slash in `FRONTEND_URL` (e.g., use `https://example.com` not `https://example.com/`)
3. **Restart required**: After changing environment variables, restart your Node.js server
4. **Credentials**: The CORS configuration allows credentials (`credentials: true`), which requires exact origin matching (no wildcards)

### Testing

You can test the CORS configuration by making a request from your frontend:

```javascript
fetch('https://your-backend-url.com/api/auth/me', {
  credentials: 'include',
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

If CORS is configured correctly, the request should succeed. If not, check:
1. The `FRONTEND_URL` environment variable matches your frontend domain exactly
2. The server has been restarted after changing environment variables
3. The server logs show the correct allowed origins

