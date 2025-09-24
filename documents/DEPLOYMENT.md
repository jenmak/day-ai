# Vercel Deployment Guide

This guide will help you deploy both the frontend and backend of your Drip Drop application to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI**: Install globally with `npm i -g vercel`
3. **Environment Variables**: You'll need API keys for:
   - OpenAI API (for LLM service)
   - OpenCage API (for geocoding)
   - Open-Meteo API (for weather - free, no key needed)

## Project Structure

```
/workspace/
├── backend/          # Hono + TRPC API
├── frontend/         # React + Vite SPA
└── package.json      # Monorepo root
```

## Deployment Steps

### 1. Deploy Backend (API)

#### Option A: Deploy via Vercel CLI

```bash
# Navigate to backend directory
cd backend

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name: dayai-backend (or your preferred name)
# - Directory: ./
# - Override settings? N
```

#### Option B: Deploy via Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your Git repository
4. Set **Root Directory** to `backend`
5. Set **Framework Preset** to "Other"
6. Set **Build Command** to `npm run build` (or leave empty)
7. Set **Output Directory** to `.` (or leave empty)
8. Click "Deploy"

### 2. Deploy Frontend (SPA)

#### Option A: Deploy via Vercel CLI

```bash
# Navigate to frontend directory
cd frontend

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name: dayai-frontend (or your preferred name)
# - Directory: ./
# - Override settings? N

```

#### Option B: Deploy via Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your Git repository
4. Set **Root Directory** to `frontend`
5. Set **Framework Preset** to "Vite"
6. Set **Build Command** to `npm run build`
7. Set **Output Directory** to `dist`
8. Click "Deploy"

### 3. Configure Environment Variables

#### Backend Environment Variables

In your Vercel dashboard, go to your backend project → Settings → Environment Variables:

```
OPENAI_API_KEY=your_openai_api_key_here
OPENCAGE_API_KEY=your_opencage_api_key_here
NODE_ENV=production
```

#### Frontend Environment Variables

In your Vercel dashboard, go to your frontend project → Settings → Environment Variables:

```
VITE_API_URL=https://your-backend-domain.vercel.app
```

### 4. Update Frontend API Configuration

After deploying the backend, you'll need to update the frontend to point to your deployed API.

1. Get your backend URL from Vercel dashboard
2. Update the frontend environment variable `VITE_API_URL`
3. Redeploy the frontend

## Important Notes

### Backend Considerations

- **Runtime**: Vercel will use Node.js runtime for your Hono app
- **Cold Starts**: Serverless functions may have cold start delays
- **Timeout**: Configured for 30s max duration in vercel.json
- **Memory**: Default 1024MB, can be increased
- **Entry Point**: Uses `src/index.ts` as the main entry point
- **Environment**: Only loads `.env` files in development mode

### Frontend Considerations

- **SPA Routing**: Vercel will handle client-side routing automatically
- **Build Output**: Vite builds to `dist/` directory
- **Environment Variables**: Must be prefixed with `VITE_` to be available in browser

### API Integration

Your frontend will make requests to your backend API. Make sure:

1. Backend is deployed and accessible
2. Frontend `VITE_API_URL` points to correct backend URL
3. CORS is properly configured (already set up in your Hono app)

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check that all dependencies are in `package.json`
   - Ensure build commands are correct
   - Check for TypeScript errors with `bun run build:full`

2. **Environment Variables**:
   - Make sure they're set in Vercel dashboard
   - Restart deployments after adding env vars
   - Check variable names match exactly

3. **API Connection**:
   - Verify backend URL is correct
   - Check CORS settings
   - Test API endpoints directly
   - Use the test script: `bun run test:deployment [url]`

4. **Routing Issues**:
   - Frontend should handle all routes with `index.html`
   - Backend should handle API routes properly

5. **Import Errors**:
   - Ensure all imports use correct paths
   - Check that TypeScript compilation works locally
   - Verify Vercel can resolve all module imports

### Useful Commands

```bash
# Check deployment status
vercel ls

# View deployment logs
vercel logs [deployment-url]

# Remove deployment
vercel remove [project-name]

# Update environment variables
vercel env add [variable-name]
```

## Production Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Environment variables configured
- [ ] API integration working
- [ ] CORS properly configured
- [ ] Error handling in place
- [ ] Performance optimized
- [ ] Security considerations addressed

## URLs After Deployment

- **Frontend**: `https://your-frontend-project.vercel.app`
- **Backend API**: `https://your-backend-project.vercel.app`
- **API Health Check**: `https://your-backend-project.vercel.app/`

## Next Steps

1. Set up custom domains (optional)
2. Configure monitoring and analytics
3. Set up CI/CD with Git integration
4. Configure preview deployments for branches
5. Set up error tracking (Sentry, etc.)
