import { fetchRequestHandler } from "@trpc/server/adapters/fetch"
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

// Mount the API app on the main app
app.route("/api", apiApp)

// Configure TRPC with complete manual implementation
try {
  console.log("Loading TRPC components...")

  // Handle tRPC requests with complete manual implementation
  app.use("/api/trpc/*", async (c) => {
    // Get the original path and strip the /api/trpc/ prefix
    const originalPath = c.req.path
    const strippedPath = originalPath.replace(/^\/api\/trpc\//, "")

    console.log("🔍 Manual tRPC Handler:")
    console.log("  Original Path:", originalPath)
    console.log("  Stripped Path:", strippedPath)

    // Create a new URL with the stripped path
    const newUrl = new URL(c.req.url)
    newUrl.pathname = `/${strippedPath}`

    console.log("  Modified URL:", newUrl.toString())

    // Get the request body if it exists
    let body: BodyInit | undefined = undefined
    if (c.req.method !== "GET" && c.req.method !== "HEAD") {
      const contentType = c.req.header("content-type")
      if (contentType?.includes("application/json")) {
        body = JSON.stringify(await c.req.json())
      } else {
        body = await c.req.arrayBuffer()
      }
    }

    // Create a new request with the modified URL
    const newRequest = new Request(newUrl.toString(), {
      method: c.req.method,
      headers: c.req.header(),
      body: body
    })

    // Import the context creation function
    const { createContext } = await import("../core/trpc.js")

    // Use the fetchRequestHandler directly from tRPC
    const response = await fetchRequestHandler({
      endpoint: "/",
      req: newRequest,
      router: appRouter,
      createContext: async (opts) => {
        return createContext(opts)
      },
      onError: ({ error, path }) => {
        console.error("tRPC Error:", error, "Path:", path)
      }
    })

    // Convert the Response to Hono response format
    const responseBody = await response.text()
    const responseHeaders: Record<string, string> = {}
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value
    })

    console.log("✅ tRPC Response:", response.status, responseBody.substring(0, 100))

    return c.text(responseBody, response.status, responseHeaders)
  })

  console.log("TRPC server configured with complete manual implementation")
} catch (error) {
  console.error("Failed to load TRPC components:", error)
  app.get("/api/trpc/*", (c) => {
    return c.json(
      {
        error: "TRPC Error",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      500
    )
  })
}

// Export the app for compatibility
export default app

// Server startup is now handled by server.js
// This file only exports the app configuration
