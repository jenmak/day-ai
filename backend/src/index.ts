import { fetchRequestHandler } from "@trpc/server/adapters/fetch"
import { config } from "dotenv"
import { Hono } from "hono"
import { appRouter } from "../app/router/index"

// Load environment variables from .env file (for local development)
// In production (Railway), environment variables are set in the dashboard
if (process.env.NODE_ENV !== "production") {
  config()
} else {
  // In production, environment variables should be set in Railway dashboard
  console.log("🔧 Production mode: Using Railway environment variables")
}

console.log("Starting server...")
console.log("🔍 Environment check:")
console.log("  NODE_ENV:", process.env.NODE_ENV)
console.log("  PORT:", process.env.PORT)
console.log("  RAILWAY_ENVIRONMENT:", process.env.RAILWAY_ENVIRONMENT)
console.log("  RAILWAY_PROJECT_ID:", process.env.RAILWAY_PROJECT_ID)
console.log("  OPENAI_API_KEY exists:", !!process.env.OPENAI_API_KEY)
console.log("  OPENAI_API_KEY length:", process.env.OPENAI_API_KEY?.length || 0)
console.log("  OPENAI_API_KEY starts with sk-:", process.env.OPENAI_API_KEY?.startsWith("sk-") || false)
console.log("  OPENCAGE_API_KEY exists:", !!process.env.OPENCAGE_API_KEY)
console.log("  OPENCAGE_API_KEY length:", process.env.OPENCAGE_API_KEY?.length || 0)
console.log("  🔧 Environment loading:", process.env.NODE_ENV === "production" ? "Railway dashboard" : ".env file")

const app = new Hono()

// Add CORS middleware to root app as well
app.use("*", async (c, next) => {
  const allowedOrigins = [
    "https://www.dripdrop.city",
    "https://dripdrop.city",
    "https://dripdropcity.com",
    "https://www.dripdropcity.com",
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
  c.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, PATCH"
  )
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
console.log("🏗️ Creating API app")
apiApp
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

    console.log(
      "🌐 CORS Middleware - Origin:",
      origin,
      "Method:",
      method,
      "Path:",
      path
    )

    // Set CORS headers for all requests
    if (origin && allowedOrigins.includes(origin)) {
      c.header("Access-Control-Allow-Origin", origin)
      console.log("✅ Set Access-Control-Allow-Origin:", origin)
    } else if (origin) {
      console.log("❌ Origin not allowed:", origin)
    }

    c.header("Access-Control-Allow-Credentials", "true")
    c.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS, PATCH"
    )
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
    return c.json({
      message: "Test successful",
      timestamp: new Date().toISOString()
    })
  })
  .get("/health/keys", async (c) => {
    try {
      // Import the API key manager
      const { ApiKeyManager } = await import("../app/security/apiKeys.js")
      const keyManager = ApiKeyManager.getInstance()
      const status = keyManager.getStatus()

      return c.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        apiKeys: {
          openai: {
            available: status.openai.available,
            masked: status.openai.masked
          },
          opencage: {
            available: status.opencage.available,
            masked: status.opencage.masked
          }
        }
      })
    } catch (error) {
      console.error("Health check error:", error)
      return c.json(
        {
          status: "error",
          timestamp: new Date().toISOString(),
          error: error instanceof Error ? error.message : "Unknown error",
          apiKeys: {
            openai: { available: false, masked: "***" },
            opencage: { available: false, masked: "***" }
          }
        },
        500
      )
    }
  })
  .onError((err, c) => {
    console.error("❌ API Error Handler:", err)
    console.error("Error path:", c.req.path)
    console.error("Error method:", c.req.method)

    // Don't handle tRPC errors here - let tRPC handle them
    if (c.req.path.startsWith("/api/trpc/")) {
      console.log("Skipping API error handler for tRPC request")
      throw err // Re-throw to let tRPC handler catch it
    }

    return c.json({ error: "Internal Server Error", message: err.message }, 500)
  })

// Mount the API app on the main app
console.log("🔗 Mounting API app on /api")
console.log("API app type:", typeof apiApp)
console.log("API app methods:", Object.getOwnPropertyNames(apiApp))
app.route("/api", apiApp)
console.log("✅ API app mounted successfully")

// Add startup validation
console.log("🔍 Starting server initialization validation...")

// Validate environment variables
console.log("Environment check:")
console.log("- NODE_ENV:", process.env.NODE_ENV)
console.log("- PORT:", process.env.PORT)
console.log(
  "- OPENAI_API_KEY:",
  process.env.OPENAI_API_KEY ? "✅ Set" : "❌ Missing"
)
console.log(
  "- OPENCAGE_API_KEY:",
  process.env.OPENCAGE_API_KEY ? "✅ Set" : "❌ Missing"
)

// Validate container initialization
try {
  console.log("🔍 Validating container initialization...")
  const { container } = await import("../core/container.js")
  const cradle = container.cradle
  console.log("✅ Container initialized successfully")
  console.log("- Places store:", cradle.places ? "✅ Available" : "❌ Missing")
} catch (error) {
  console.error("❌ Container initialization failed:", error)
  throw error
}

// Configure TRPC with complete manual implementation
try {
  console.log("Loading TRPC components...")

  // Handle tRPC requests with complete manual implementation
  app.use("/api/trpc/*", async (c) => {
    try {
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
      let body: string | ArrayBuffer | undefined = undefined
      if (c.req.method !== "GET" && c.req.method !== "HEAD") {
        const contentType = c.req.header("content-type")
        console.log("  Content-Type:", contentType)
        if (contentType?.includes("application/json")) {
          const jsonData = await c.req.json()
          console.log("  Request body:", jsonData)
          body = JSON.stringify(jsonData)
        } else {
          const textData = await c.req.text()
          console.log("  Request body (text):", textData)
          body = textData
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
          try {
            return await createContext(opts)
          } catch (contextError) {
            console.error("❌ Context creation failed:", contextError)
            throw new Error(
              `Context creation failed: ${contextError instanceof Error ? contextError.message : "Unknown error"}`
            )
          }
        },
        onError: ({ error, path, type }) => {
          console.error("tRPC Error:", {
            error: error.message,
            path,
            type,
            stack: error.stack
          })

          // Handle API key errors specifically
          if (
            error.message.includes("API key") ||
            error.message.includes("OPENAI_API_KEY") ||
            error.message.includes("OPENCAGE_API_KEY")
          ) {
            console.error("🔑 API Key Error Detected:", {
              message: error.message,
              path,
              help: "Check Railway environment variables"
            })
          }
        }
      })

      // Convert the Response to Hono response format
      const responseBody = await response.text()
      const responseHeaders: Record<string, string> = {}
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value
      })

      // Ensure Content-Type is set for superjson transformation
      if (!responseHeaders["content-type"]) {
        responseHeaders["content-type"] = "application/json"
      }

      console.log(
        "✅ tRPC Response:",
        response.status,
        "Content-Type:",
        responseHeaders["content-type"]
      )

      return c.text(responseBody, response.status as any, responseHeaders)
    } catch (error) {
      console.error("❌ CRITICAL: Unhandled error in tRPC handler:", error)
      console.error(
        "Error stack:",
        error instanceof Error ? error.stack : "No stack trace"
      )

      // Return a properly formatted tRPC error response
      const errorResponse = {
        error: {
          message:
            error instanceof Error ? error.message : "Internal Server Error",
          code: -32603, // Internal error code
          data: {
            code: "INTERNAL_SERVER_ERROR",
            httpStatus: 500
          }
        }
      }

      return c.json(errorResponse, 500)
    }
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

// Add global error handler for unhandled exceptions
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason)
})

process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error)
  console.error("Error stack:", error.stack)
})

// Add a catch-all error handler for the main app
app.onError((err, c) => {
  console.error("❌ Main App Error Handler:", err)
  console.error("Error path:", c.req.path)
  console.error("Error method:", c.req.method)
  console.error("Error stack:", err.stack)

  // For tRPC requests, return proper tRPC error format
  if (c.req.path.startsWith("/api/trpc/")) {
    const errorResponse = {
      error: {
        message: err.message || "Internal Server Error",
        code: -32603, // Internal error code
        data: {
          code: "INTERNAL_SERVER_ERROR",
          httpStatus: 500
        }
      }
    }
    return c.json(errorResponse, 500)
  }

  // For other requests, return standard error
  return c.json({ error: "Internal Server Error", message: err.message }, 500)
})

// Export the app for compatibility
export default app

// Server startup is now handled by server.js
// This file only exports the app configuration
