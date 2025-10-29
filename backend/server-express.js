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

// Simple API endpoints for testing
app.get("/api/health", (req, res) => {
  console.log("API health check endpoint hit")
  res.json({ status: "ok", message: "API is working" })
})

// Placeholder for tRPC endpoints
app.post("/api/trpc/places.create", (req, res) => {
  console.log("tRPC places.create endpoint hit")
  console.log("Request body:", req.body)
  
  // For now, return a simple response to test connectivity
  res.json({
    result: {
      data: {
        id: "test-123",
        description: req.body.description || "Test place",
        slug: "test-place",
        normalizedPlace: "Test Location",
        weather: [],
        temperatureRangeCategory: null,
        createdAt: new Date().toISOString()
      }
    }
  })
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
