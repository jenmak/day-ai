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
  
  // Set the correct host for the request
  if (forwardedHost) {
    req.headers.host = forwardedHost
  }
  // Note: req.protocol is read-only, so we can't set it directly
  // The forwardedProto is logged for debugging but not used
  
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

// Proxy API requests to backend
// In production, use the Railway backend URL
// In development, use local backend
// IMPORTANT: This must come BEFORE the static file middleware
app.use('/api', express.json(), async (req, res) => {
  console.log(`🚀 API request received: ${req.method} ${req.originalUrl}`)
  console.log(`🔍 Request headers:`, req.headers)
  
  const isProduction = process.env.NODE_ENV === 'production'
  const backendUrl = isProduction 
    ? 'https://dripdropcitybackend-production.up.railway.app'
    : 'http://localhost:3334'
  
  // Log the backend URL being used
  console.log(`🌐 Using backend URL: ${backendUrl}`)
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
    
    // Handle specific error cases
    if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
      res.status(503).json({ 
        error: 'Backend service unavailable', 
        message: 'The backend service is currently unavailable. Please try again later.',
        details: isProduction ? 'Railway backend is not running' : 'Local backend is not running'
      })
    } else {
      res.status(500).json({ 
        error: 'Backend connection failed', 
        details: error.message 
      })
    }
  }
})

// Serve static files from dist directory
// Simplified configuration for better reliability
app.use(express.static(distDir, {
  index: false, // Don't serve index.html automatically
  dotfiles: 'ignore' // Ignore dotfiles
}))

// Handle React Router (SPA) - serve index.html for all non-API routes
// Use app.all() to handle all HTTP methods (GET, POST, PUT, DELETE, etc.)
app.all("*", (req, res) => {
  try {
    console.log("📥 SPA route request:", req.path)
    console.log("🔍 Request method:", req.method)
    console.log("🔍 Request URL:", req.url)
    
    const indexPath = path.join(distDir, "index.html")
    console.log("📁 Serving index.html from:", indexPath)
    
    // Check if index.html exists
    if (!fs.existsSync(indexPath)) {
      console.error("❌ index.html not found at:", indexPath)
      return res.status(404).json({ error: "index.html not found" })
    }
    
    res.sendFile(indexPath)
  } catch (error) {
    console.error("❌ Error serving SPA route:", error)
    res.status(500).json({ error: "Internal server error", details: error.message })
  }
})

// Global error handler
app.use((error, req, res, next) => {
  console.error("❌ Global error handler:", error)
  res.status(500).json({ 
    error: "Internal server error", 
    details: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
  })
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
