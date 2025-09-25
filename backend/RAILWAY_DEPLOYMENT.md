# Backend Railway Deployment Guide - Bun + Railway

This guide covers deploying the DripDrop City backend to Railway using Bun as the runtime.

## Prerequisites

1. **Railway CLI**: Install globally

   ```bash
   npm install -g @railway/cli
   ```

2. **Bun**: Install Bun (if not already installed)

   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```

3. **Environment Variables**: Prepare your environment variables (see Environment Setup section)

## Quick Deployment

### 1. Login to Railway

```bash
railway login
```

### 2. Initialize Project

```bash
cd backend
railway init
```

### 3. Deploy

```bash
./deploy-railway.sh
```

## Manual Deployment Steps

### 1. Build and Deploy

```bash
cd backend
bun run build
railway up --detach
```

### 2. Set Environment Variables

In Railway Dashboard → Project → Variables:

```
OPENAI_API_KEY=your_openai_api_key_here
OPENCAGE_API_KEY=your_opencage_api_key_here
NODE_ENV=production
PORT=3000
```

## Configuration Files

### railway.json

- **Builder**: NIXPACKS (automatic detection)
- **Start Command**: `bun run start`
- **Health Check**: `/` endpoint
- **Restart Policy**: ON_FAILURE with 10 retries

### nixpacks.toml

- **Node.js**: Version 20
- **Bun**: Latest version
- **Build Command**: `bun run build`
- **Start Command**: `bun run start`

### package.json

- **Start Script**: `bun run src/index.ts`
- **Build Script**: `bun run type-check`
- **Engine**: Node.js >=20.0.0

## Development vs Production

### Local Development

```bash
bun run dev
```

- Uses `bun run --watch` for hot reloading
- Loads environment variables from `.env`
- Starts Bun server on port 3000

### Production (Railway)

- Uses compiled TypeScript with Bun runtime
- Environment variables from Railway dashboard
- Automatic scaling and health checks
- Persistent server (not serverless)

## Environment Variables

### Required Variables

```
OPENAI_API_KEY=sk-...
OPENCAGE_API_KEY=...
NODE_ENV=production
PORT=3000
```

### Optional Variables

```
RAILWAY_ENVIRONMENT=production
```

## Testing Deployment

### Health Check

```
GET https://your-railway-url.railway.app/
Expected: "OK"
```

### Test Endpoint

```
GET https://your-railway-url.railway.app/test
Expected: JSON with timestamp
```

### TRPC Endpoint

```
GET https://your-railway-url.railway.app/trpc/
Expected: TRPC router or error message
```

## Railway Features

### Automatic Scaling

- Railway automatically scales based on traffic
- No cold starts (persistent server)
- Built-in load balancing

### Health Checks

- Automatic health monitoring
- Automatic restarts on failure
- Built-in logging and monitoring

### Environment Management

- Easy environment variable management
- Support for multiple environments
- Secure variable storage

## Troubleshooting

### Common Issues

1. **Build Failures**

   ```bash
   bun run type-check  # Check TypeScript errors
   bun run build       # Test build process
   ```

2. **Runtime Errors**
   - Check Railway logs: `railway logs`
   - Verify environment variables are set
   - Check port configuration

3. **Import Errors**
   - Ensure all dependencies are in `package.json`
   - Check import paths and extensions

### Debug Commands

```bash
# Type checking
bun run type-check

# Local build test
bun run build
bun run start

# Railway deployment test
railway up --detach

# View logs
railway logs

# Check status
railway status
```

## File Structure

```
backend/
├── src/
│   └── index.ts          # Main application
├── app/                  # Application logic
├── core/                 # Core utilities
├── railway.json          # Railway configuration
├── nixpacks.toml         # Build configuration
├── deploy-railway.sh     # Deployment script
├── package.json          # Dependencies and scripts
└── tsconfig.json         # TypeScript configuration
```

## Performance Benefits

1. **Bun Runtime**: Faster startup and execution than Node.js
2. **Persistent Server**: No cold starts like serverless
3. **Automatic Scaling**: Handles traffic spikes automatically
4. **Built-in Monitoring**: Health checks and logging
5. **Simple Deployment**: One command deployment

## Security Considerations

1. **Environment Variables**: Stored securely in Railway
2. **HTTPS**: Automatic SSL/TLS certificates
3. **Network Security**: Built-in DDoS protection
4. **Access Control**: Team-based access management

## Cost Optimization

1. **Pay-per-use**: Only pay for actual usage
2. **Automatic Scaling**: Scales down during low traffic
3. **No Cold Starts**: More efficient than serverless
4. **Built-in Monitoring**: No additional monitoring costs

## Migration from Vercel

### Key Differences

- **Runtime**: Persistent server vs serverless functions
- **Scaling**: Automatic vs on-demand
- **Cold Starts**: None vs potential cold starts
- **Pricing**: Usage-based vs function-based

### Benefits of Railway

- Better Bun support
- No Node.js version conflicts
- Simpler deployment process
- More predictable performance
- Better for real-time applications

## Next Steps

1. **Deploy**: Run `./deploy-railway.sh`
2. **Configure**: Set environment variables in Railway dashboard
3. **Test**: Verify all endpoints are working
4. **Monitor**: Check Railway dashboard for performance metrics
5. **Update Frontend**: Point frontend to new Railway URL

The Railway deployment is now ready and should work seamlessly with Bun! 🚂
