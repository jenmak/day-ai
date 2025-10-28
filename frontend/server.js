#!/usr/bin/env node

import express from "express"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = process.env.PORT || 8080
const distDir = path.join(__dirname, "dist")

console.log("🚀 Starting production static server...")
console.log("📁 Serving files from:", distDir)
console.log("🌐 Port:", port)
console.log("🔍 Current working directory:", process.cwd())

// Check if dist directory exists
if (!fs.existsSync(distDir)) {
  console.error("❌ ERROR: dist directory not found!")
  console.error("📋 Current working directory:", process.cwd())
  console.error("📋 Listing current directory:")
  try {
    const files = fs.readdirSync(".")
    console.error("Files:", files)
  } catch (e) {
    console.error("Could not list directory:", e.message)
  }
  process.exit(1)
}

// Trust Railway's proxy headers for custom domain support
// This is crucial for Railway deployments with custom domains
app.set('trust proxy', true)

// CORS middleware for Safari compatibility
app.use((req, res, next) => {
  // Set CORS headers for Safari compatibility
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  res.header('Access-Control-Allow-Credentials', 'true')
  
  // Handle preflight requests (Safari is strict about this)
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  
  next()
})

// Parse JSON bodies for API requests
app.use('/api', express.json())

// Middleware to log proxy headers for debugging
app.use((req, res, next) => {
  const forwardedHost = req.get('X-Forwarded-Host')
  const forwardedProto = req.get('X-Forwarded-Proto')
  const originalHost = req.get('Host')
  
  console.log("🔍 Request headers:", {
    'X-Forwarded-Host': forwardedHost,
    'X-Forwarded-Proto': forwardedProto,
    'Host': originalHost,
    'Original URL': req.originalUrl
  })
  
  // Set the correct host and protocol for the request
  if (forwardedHost) {
    req.headers.host = forwardedHost
  }
  if (forwardedProto) {
    req.protocol = forwardedProto
  }
  
  next()
})

// Health check endpoint for Railway
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  })
})

// Proxy API requests to local backend
// This allows the production frontend to work with a local backend
// IMPORTANT: This must come BEFORE the static file middleware
app.use('/api', async (req, res) => {
  const backendUrl = 'http://localhost:3334'
  const targetUrl = `${backendUrl}${req.originalUrl}`
  
  try {
    console.log(`🔄 Proxying API request: ${req.method} ${req.originalUrl} -> ${targetUrl}`)
    console.log(`📦 Request body:`, req.body)
    
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'Origin': req.get('Origin') || 'https://dripdropcity.com'
      },
      body: req.method !== 'GET' && req.body ? JSON.stringify(req.body) : undefined
    })
    
    const data = await response.text()
    console.log(`✅ Proxy response status: ${response.status}`)
    
    // Forward response headers
    res.status(response.status)
    res.set('Content-Type', response.headers.get('Content-Type') || 'application/json')
    res.set('Access-Control-Allow-Origin', '*')
    res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin')
    
    res.send(data)
  } catch (error) {
    console.error('❌ Proxy error:', error)
    console.error('❌ Error details:', {
      message: error.message,
      stack: error.stack,
      targetUrl: targetUrl,
      method: req.method,
      body: req.body
    })
    res.status(500).json({ error: 'Backend connection failed', details: error.message })
  }
})

// Serve static files from dist directory only
// Explicitly serve from dist directory to avoid conflicts with root index.html
app.use(express.static(distDir, {
  index: false, // Don't serve index.html automatically
  dotfiles: 'ignore', // Ignore dotfiles
  setHeaders: (res, path) => {
    // Safari-specific headers for better compatibility
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8')
      res.setHeader('Cache-Control', 'public, max-age=31536000')
    } else if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css; charset=utf-8')
      res.setHeader('Cache-Control', 'public, max-age=31536000')
    } else if (path.endsWith('.html')) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8')
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
    }
    
    // Security headers for Safari
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('X-Frame-Options', 'DENY')
    res.setHeader('X-XSS-Protection', '1; mode=block')
  }
}))

// Serve specific static files that might be requested from root
app.use('/favicon.ico', express.static(path.join(distDir, 'favicon.ico')))
app.use('/images', express.static(path.join(distDir, 'images')))
app.use('/assets', express.static(path.join(distDir, 'assets')))

// Handle React Router (SPA) - serve index.html for all non-API routes
// Use app.all() to handle all HTTP methods (GET, POST, PUT, DELETE, etc.)
app.all("*", (req, res) => {
  console.log("📥 SPA route request:", req.path)
  console.log("🔍 Request method:", req.method)
  console.log("🔍 Request URL:", req.url)
  console.log("🔍 Request headers:", req.headers)
  
  const indexPath = path.join(distDir, "index.html")
  console.log("📁 Serving index.html from:", indexPath)
  
  // Check if index.html exists
  if (!fs.existsSync(indexPath)) {
    console.error("❌ index.html not found at:", indexPath)
    return res.status(404).json({ error: "index.html not found" })
  }
  
  res.sendFile(indexPath)
})

// Function to start server with port fallback
function startServer(portToTry) {
  const server = app.listen(portToTry, "0.0.0.0", () => {
    console.log("✅ Static server running on port", portToTry)
    console.log("🌐 Server URL: http://localhost:" + portToTry)
    console.log("🔧 Trusting proxy headers for Railway custom domain support")
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`⚠️  Port ${portToTry} is in use, trying port ${portToTry + 1}...`)
      startServer(portToTry + 1)
    } else {
      console.error("❌ Server failed to start:", err)
      process.exit(1)
    }
  })
}

startServer(port)
