# Backend Vercel Deployment Guide

## Quick Deployment Steps

### 1. Prerequisites

- Vercel CLI installed: `npm install -g vercel`
- Environment variables ready (see below)

### 2. Deploy to Vercel

```bash
cd backend
vercel --prod
```

### 3. Set Environment Variables

In Vercel Dashboard → Project Settings → Environment Variables:

```
OPENAI_API_KEY=your_openai_api_key_here
OPENCAGE_API_KEY=your_opencage_api_key_here
NODE_ENV=production
```

## Configuration Details

### Fixed Issues

1. **Vercel Configuration**: Updated `vercel.json` with proper function configuration
2. **TypeScript Setup**: Added Vercel-compatible TypeScript options
3. **Environment Variables**: Only load `.env` in development mode
4. **Build Process**: Added `vercel-build` script for deployment
5. **Import Paths**: Fixed dynamic imports to use `.ts` extensions

### Key Files Updated

- `vercel.json`: Proper serverless function configuration
- `package.json`: Added deployment scripts
- `tsconfig.json`: Vercel-compatible TypeScript settings
- `src/index.ts`: Production-ready entry point
- `.vercelignore`: Excludes unnecessary files

### Deployment Structure

```
backend/
├── src/index.ts          # Main entry point
├── app/                  # Application logic
├── core/                 # Core utilities
├── vercel.json           # Vercel configuration
├── package.json          # Dependencies and scripts
└── tsconfig.json         # TypeScript configuration
```

## Testing Deployment

### Health Check

Visit: `https://your-backend-url.vercel.app/`
Expected: `OK`

### Test Endpoint

Visit: `https://your-backend-url.vercel.app/test`
Expected: JSON with timestamp and environment info

### TRPC Endpoint

Visit: `https://your-backend-url.vercel.app/trpc/`
Expected: TRPC router or error message

## Troubleshooting

### Common Issues

1. **Build Failures**: Check TypeScript errors with `bun run build:full`
2. **Import Errors**: Ensure all dependencies are in `package.json`
3. **Environment Variables**: Verify they're set in Vercel dashboard
4. **Timeout Issues**: Functions have 30-second max duration

### Debug Commands

```bash
# Check TypeScript compilation
bun run build:full

# Test locally
bun run dev

# Check Vercel deployment
vercel logs [deployment-url]
```

## Next Steps

1. Deploy backend: `vercel --prod`
2. Get backend URL from Vercel dashboard
3. Update frontend `VITE_API_URL` environment variable
4. Redeploy frontend with updated API URL
