# Frontend Railway Deployment Guide

## 🚀 Quick Deploy

### Option 1: Deploy from Frontend Directory (Recommended)

```bash
# Navigate to frontend directory
cd /workspace/frontend

# Install Railway CLI if not already installed
npm install -g @railway/cli

# Login to Railway
railway login

# Create new project
railway new

# Deploy
railway up
```

### Option 2: Deploy from Monorepo Root

```bash
# Navigate to project root
cd /workspace

# Deploy specific service
railway up --service frontend
```

## 🔧 Environment Variables

Set these in your Railway project dashboard:

- `NODE_ENV=production`
- `BACKEND_URL=https://dripdropcitybackend-production.up.railway.app`

## 📁 Project Structure

```
frontend/
├── server.js              # Express server for serving build
├── railway.json           # Railway configuration
├── railway.toml           # Railway TOML config
├── nixpacks.toml          # Nixpacks build configuration
├── package.json           # Dependencies and scripts
├── dist/                  # Built frontend (created during build)
└── app/                   # React application source
```

## 🛠️ Build Process

1. **Install Dependencies**: `bun install`
2. **Build Frontend**: `bun run build` (creates `dist/` folder)
3. **Start Server**: `bun run start` (serves from `dist/`)

## 🌐 Expected URLs

- **Frontend**: `https://your-frontend-name.up.railway.app`
- **Backend**: `https://dripdropcitybackend-production.up.railway.app`

## 🔍 Troubleshooting

### Build Fails with "cd frontend: No such file or directory"

- Make sure you're deploying from the `frontend/` directory
- Or use the monorepo deployment method with proper service configuration

### Frontend can't connect to backend

- Check that `BACKEND_URL` environment variable is set correctly
- Verify backend is running and accessible

### Port conflicts

- Railway automatically assigns ports via `PORT` environment variable
- No manual port configuration needed

## ✅ Verification

After deployment, test:

1. Frontend loads at Railway URL
2. Search functionality works
3. Backend API calls succeed
4. No console errors in browser
