#!/usr/bin/env node

// Express server for Railway compatibility
import express from "express"
import { createProxyMiddleware } from "http-proxy-middleware"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const port = process.env.PORT || 3000

console.log("🚀 Starting Express server for Railway...")

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept, Origin")
  res.header("Access-Control-Allow-Credentials", "true")
  
  if (req.method === "OPTIONS") {
    res.status(200).end()
    return
  }
  
  next()
})

// Health check endpoint
app.get("/", (req, res) => {
  console.log("Root health check endpoint hit")
  res.send("OK")
})

// Test endpoint
app.get("/test", (req, res) => {
  console.log("Test endpoint hit")
  res.json({ message: "Backend is working!", timestamp: new Date().toISOString() })
})

// Proxy to the Hono app
app.use("/api", async (req, res) => {
  try {
    console.log(`🔍 Proxying request: ${req.method} ${req.originalUrl}`)
    
    // Import the Hono app
    const { default: honoApp } = await import("./src/index.ts")
    
    // Create a new request for the Hono app
    const url = new URL(req.originalUrl, `http://localhost:${port}`)
    const honoRequest = new Request(url.toString(), {
      method: req.method,
      headers: req.headers,
      body: req.method !== "GET" && req.method !== "HEAD" ? JSON.stringify(req.body) : undefined
    })
    
    // Call the Hono app
    const response = await honoApp.fetch(honoRequest)
    const responseBody = await response.text()
    
    // Set response headers
    response.headers.forEach((value, key) => {
      res.set(key, value)
    })
    
    res.status(response.status).send(responseBody)
  } catch (error) {
    console.error("❌ Error in proxy:", error)
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message
    })
  }
})

// Start server
app.listen(port, "0.0.0.0", () => {
  console.log(`✅ Express server running on port ${port}`)
  console.log(`🌐 Server URL: http://localhost:${port}`)
})

// Handle shutdown
process.on("SIGINT", () => {
  console.log("🛑 Shutting down server...")
  process.exit(0)
})

process.on("SIGTERM", () => {
  console.log("🛑 Shutting down server...")
  process.exit(0)
})
