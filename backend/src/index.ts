import { trpcServer } from "@hono/trpc-server"
import { config } from "dotenv"
import { Hono } from "hono"
import { appRouter } from "../app/router/index.js"

// Load environment variables from .env file (only in development)
if (process.env.NODE_ENV !== "production") {
  config()
}

console.log("Starting server...")
console.log("🔍 Environment check:")
console.log("  NODE_ENV:", process.env.NODE_ENV)
console.log("  PORT:", process.env.PORT)
console.log("  RAILWAY_ENVIRONMENT:", process.env.RAILWAY_ENVIRONMENT)
console.log("  RAILWAY_PROJECT_ID:", process.env.RAILWAY_PROJECT_ID)

const app = new Hono()

// Add CORS middleware to root app as well
app.use("*", async (c, next) => {
  const allowedOrigins = [
    "https://www.dripdrop.city",
    "https://dripdrop.city",
    "https://dripdropcity-frontend-mptcpd1j3-jenmaks-projects.vercel.app",
    "https://dripdropcityfrontend-production.up.railway.app",
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:6173",
    "http://localhost:8080"
  ]

  const origin = c.req.header("Origin")
  const method = c.req.method

  // Set CORS headers for all requests
  if (origin && allowedOrigins.includes(origin)) {
    c.header("Access-Control-Allow-Origin", origin)
  }

  c.header("Access-Control-Allow-Credentials", "true")
  c.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH")
  c.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With, Accept, Origin"
  )
  c.header("Access-Control-Max-Age", "86400")

  // Handle preflight OPTIONS requests
  if (method === "OPTIONS") {
    return c.text("", 200)
  }

  await next()
})

// Add root health check endpoint (for Railway health checks)
app.get("/", (c) => {
  console.log("Root health check endpoint hit")
  return c.text("OK")
})

// Add API routes without basePath (we'll mount them on /api)
const apiApp = new Hono()
  .use("*", async (c, next) => {
    const allowedOrigins = [
      "https://www.dripdrop.city",
      "https://dripdrop.city",
      "https://dripdropcity-frontend-mptcpd1j3-jenmaks-projects.vercel.app",
      "https://dripdropcityfrontend-production.up.railway.app",
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:6173",
      "http://localhost:8080"
    ]

    const origin = c.req.header("Origin")
    const method = c.req.method
    const path = c.req.path

    console.log("🌐 CORS Middleware - Origin:", origin, "Method:", method, "Path:", path)

    // Set CORS headers for all requests
    if (origin && allowedOrigins.includes(origin)) {
      c.header("Access-Control-Allow-Origin", origin)
      console.log("✅ Set Access-Control-Allow-Origin:", origin)
    } else if (origin) {
      console.log("❌ Origin not allowed:", origin)
    }

    c.header("Access-Control-Allow-Credentials", "true")
    c.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH")
    c.header(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Requested-With, Accept, Origin"
    )
    c.header("Access-Control-Max-Age", "86400") // 24 hours

    // Handle preflight OPTIONS requests
    if (method === "OPTIONS") {
      console.log("🔄 Handling OPTIONS preflight request")
      return c.text("", 200)
    }

    await next()
  })
  .get("/", (c) => {
    console.log("API health check endpoint hit")
    return c.text("OK")
  })
  .get("/test", (c) => {
    console.log("Test endpoint hit")
    return c.json({ message: "Test successful", timestamp: new Date().toISOString() })
  })
  .onError((err, c) => {
    console.error("Error:", err)
    return c.json({ error: "Internal Server Error", message: err.message }, 500)
  })

// Configure TRPC
try {
  console.log("Loading TRPC components...")

  apiApp.use(
    "/trpc/*",
    trpcServer({
      router: appRouter,
      createContext: async (opts) => {
        // Import the context creation function from the core directory
        const { createContext } = await import("../core/trpc.js")
        return createContext(opts)
      }
    })
  )
  console.log("TRPC server configured")
} catch (error) {
  console.error("Failed to load TRPC components:", error)
  apiApp.get("/trpc/*", (c) => {
    return c.json(
      {
        error: "TRPC Error",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      500
    )
  })
}

// Mount the API app on the main app
app.route("/api", apiApp)

// Export the app for compatibility
export default app

// Server startup is now handled by server.js
// This file only exports the app configuration
