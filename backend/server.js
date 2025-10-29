#!/usr/bin/env bun

// Simple server entry point that works reliably with Railway
console.log("🚀 Starting DripDrop City Backend Server...")

// Import the main app
const { default: app } = await import("./src/index.ts")

// Get port from environment
const port = process.env.PORT || 3000
const isRailway = process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_PROJECT_ID

console.log(`🏗️  Environment: ${isRailway ? "Railway" : "Local Development"}`)
console.log(`🚀 Starting server on port ${port}`)

// Start the server using Bun's serve function
try {
  const server = Bun.serve({
    fetch: async (request) => {
      try {
        console.log(`🔍 Incoming request: ${request.method} ${request.url}`)
        const response = await app.fetch(request)
        console.log(`✅ Response status: ${response.status}`)
        return response
      } catch (error) {
        console.error(`❌ Error handling request:`, error)
        return new Response(JSON.stringify({
          error: "Internal Server Error",
          message: error.message
        }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        })
      }
    },
    port: Number(port),
    hostname: "0.0.0.0"
  })

  console.log(`✅ Server running on port ${server.port}`)
  console.log(`🌐 Server URL: http://localhost:${server.port}`)

  // Keep the process alive
  process.on("SIGINT", () => {
    console.log("🛑 Shutting down server...")
    process.exit(0)
  })

  process.on("SIGTERM", () => {
    console.log("🛑 Shutting down server...")
    process.exit(0)
  })
} catch (error) {
  console.error(`❌ Failed to start server:`, error)
  process.exit(1)
}
