#!/usr/bin/env node

import express from "express"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = process.env.PORT || 3000
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

// Serve static files from dist directory
app.use(express.static(distDir))

// Handle React Router (SPA) - serve index.html for all non-API routes
app.get("*", (req, res) => {
  console.log("📥 SPA route request:", req.path)
  res.sendFile(path.join(distDir, "index.html"))
})

app.listen(port, "0.0.0.0", () => {
  console.log("✅ Static server running on port", port)
  console.log("🌐 Server URL: http://localhost:" + port)
  console.log("🔧 Trusting proxy headers for Railway custom domain support")
})
