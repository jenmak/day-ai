# CORS Configuration

This document explains the CORS (Cross-Origin Resource Sharing) configuration for the DripDropCity application.

## Overview

CORS is configured to allow requests from specific origins while maintaining security. The configuration is environment-aware and supports both development and production settings.

## Configuration Files

- **Shared Configuration**: `/workspace/shared/config.ts`
- **Backend Implementation**: `/workspace/backend/src/index.ts`

## Environment-Based Origins

### Development Environment

When `NODE_ENV` is `development` or not set, the following origins are allowed:

- `http://localhost:6173` (default frontend)
- `http://localhost:3000` (alternative React dev server)
- `http://localhost:5173` (Vite dev server)
- `http://127.0.0.1:3000` (localhost alternative)
- `http://127.0.0.1:5173` (localhost alternative)
- `http://127.0.0.1:6173` (localhost alternative)

### Production Environment

When `NODE_ENV` is `production`, the following origins are allowed:

- `https://dripdropcity-frontend.vercel.app` (main production URL)
- `https://dripdropcity.com` (custom domain)
- `https://www.dripdropcity.com` (www subdomain)

## Environment Variables

### Additional CORS Origins

You can add additional allowed origins using the `ADDITIONAL_CORS_ORIGINS` environment variable:

```bash
# Add multiple origins (comma-separated)
ADDITIONAL_CORS_ORIGINS="https://staging.dripdropcity.com,https://preview.dripdropcity.com"
```

### Disable CORS (Development Only)

To disable CORS restrictions in development:

```bash
DISABLE_CORS=true
```

**⚠️ Warning**: Only use this in development. Never disable CORS in production.

## CORS Settings

### Headers

The following headers are allowed:

- `Content-Type`
- `Authorization`
- `X-Requested-With`
- `Accept`
- `Origin`
- `Access-Control-Request-Method`
- `Access-Control-Request-Headers`

### Methods

The following HTTP methods are allowed:

- `GET`
- `POST`
- `PUT`
- `DELETE`
- `OPTIONS`
- `PATCH`

### Credentials

CORS credentials are enabled, allowing cookies and authentication headers to be sent with cross-origin requests.

### Cache

Preflight requests are cached for 24 hours (`maxAge: 86400` seconds).

## Testing CORS

### Test Endpoint

Use the `/cors-test` endpoint to verify CORS configuration:

```bash
# Test from allowed origin
curl -H "Origin: http://localhost:6173" http://localhost:3333/cors-test

# Test from blocked origin
curl -H "Origin: https://malicious-site.com" http://localhost:3333/cors-test
```

### Browser Testing

1. Open browser developer tools
2. Navigate to your frontend application
3. Check the Network tab for CORS-related errors
4. Look for console messages about CORS decisions (development only)

## Troubleshooting

### Common Issues

#### "Access to fetch at '...' from origin '...' has been blocked by CORS policy"

This means the origin is not in the allowed list. Check:

1. Is the origin in the development/production allowed list?
2. Are you using the correct environment?
3. Have you added the origin to `ADDITIONAL_CORS_ORIGINS`?

#### "Response to preflight request doesn't pass access control check"

This usually means:

1. The method is not allowed
2. A header is not allowed
3. Credentials are required but not configured properly

### Debugging

#### Development Logging

In development, CORS decisions are logged to the console:

```
CORS: Origin "http://localhost:6173" allowed
CORS: Origin "https://malicious-site.com" blocked
CORS: Allowed origins: http://localhost:6173, http://localhost:3000, ...
```

#### CORS Test Endpoint

The `/cors-test` endpoint returns information about the request:

```json
{
  "message": "CORS test successful",
  "origin": "http://localhost:6173",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "corsEnabled": true
}
```

## Security Considerations

1. **Never disable CORS in production** - This would allow any website to make requests to your API
2. **Use HTTPS in production** - All production origins should use HTTPS
3. **Limit allowed origins** - Only add origins you trust to the allowed list
4. **Monitor CORS logs** - Check server logs for unexpected CORS requests

## Configuration Updates

To update CORS configuration:

1. Edit `/workspace/shared/config.ts`
2. Copy the updated config to both frontend and backend:
   ```bash
   cp /workspace/shared/config.ts /workspace/frontend/app/config.ts
   cp /workspace/shared/config.ts /workspace/backend/app/config.ts
   ```
3. Restart the backend server
4. Test the configuration using the `/cors-test` endpoint

## Example Configurations

### Adding Staging Environment

```typescript
// In shared/config.ts
CORS_ORIGINS: {
  DEVELOPMENT: [...],
  PRODUCTION: [
    "https://dripdropcity-frontend.vercel.app",
    "https://dripdropcity.com",
    "https://www.dripdropcity.com",
    "https://staging.dripdropcity.com" // Add staging
  ]
}
```

### Environment Variable Override

```bash
# Add staging and preview URLs via environment variable
ADDITIONAL_CORS_ORIGINS="https://staging.dripdropcity.com,https://preview.dripdropcity.com"
```
