import { trpcServer } from "@hono/trpc-server"
import { config } from "dotenv"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { CONFIG, ENV } from "../app/config.js"
import { appRouter } from "../app/router/index.js"
import { createContext } from "../core/trpc.js"

// Load environment variables from .env file (only in development)
if (process.env.NODE_ENV !== "production") {
  config()
}

console.log("Starting server...")

// CORS configuration
const corsConfig = {
  origin: (origin: string, c: any) => {
    // Allow all origins in development if CORS is disabled
    if (ENV.DISABLE_CORS && ENV.IS_DEVELOPMENT) {
      console.log(`CORS: Disabled - allowing all origins`)
      return origin
    }

    // Get allowed origins based on environment
    const baseOrigins = ENV.IS_PRODUCTION
      ? CONFIG.SERVER.CORS_ORIGINS.PRODUCTION
      : CONFIG.SERVER.CORS_ORIGINS.DEVELOPMENT

    // Add additional origins from environment variables
    const allowedOrigins = [...baseOrigins, ...ENV.ADDITIONAL_CORS_ORIGINS]

    // Check if origin is allowed
    const isAllowed = allowedOrigins.includes(origin)

    // Log CORS decisions in development
    if (ENV.IS_DEVELOPMENT) {
      console.log(`CORS: Origin "${origin}" ${isAllowed ? "allowed" : "blocked"}`)
      if (!isAllowed) {
        console.log(`CORS: Allowed origins: ${allowedOrigins.join(", ")}`)
      }
    }

    return isAllowed ? origin : null
  },
  credentials: CONFIG.SERVER.CORS_SETTINGS.CREDENTIALS,
  allowMethods: CONFIG.SERVER.CORS_SETTINGS.ALLOWED_METHODS,
  allowHeaders: CONFIG.SERVER.CORS_SETTINGS.ALLOWED_HEADERS,
  exposeHeaders: CONFIG.SERVER.CORS_SETTINGS.EXPOSE_HEADERS,
  maxAge: CONFIG.SERVER.CORS_SETTINGS.MAX_AGE,
  optionsSuccessStatus: CONFIG.SERVER.CORS_SETTINGS.OPTIONS_SUCCESS_STATUS
}

const app = new Hono()
  .use(cors(corsConfig))
  .get("/", (c) => {
    console.log("Health check endpoint hit")
    return c.text("OK")
  })
  .get("/test", (c) => {
    console.log("Test endpoint hit")
    return c.json({ message: "Test successful", timestamp: new Date().toISOString() })
  })
  .get("/cors-test", (c) => {
    console.log("CORS test endpoint hit")
    const origin = c.req.header("Origin")
    return c.json({
      message: "CORS test successful",
      origin,
      timestamp: new Date().toISOString(),
      corsEnabled: !ENV.DISABLE_CORS
    })
  })
  .onError((err, c) => {
    console.error("Error:", err)
    console.error("Error stack:", err.stack)
    return c.json(
      { error: "Internal Server Error", message: err.message },
      CONFIG.SERVER.HTTP_STATUS.INTERNAL_SERVER_ERROR
    )
  })

// Configure TRPC
try {
  console.log("Loading TRPC components...")
  app.use("/trpc/*", trpcServer({ router: appRouter, createContext }))
  console.log("TRPC server configured")
} catch (error: Error | unknown) {
  console.error("Failed to load TRPC components:", error)
  app.get("/trpc/*", (c) => {
    return c.json(
      {
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      CONFIG.SERVER.HTTP_STATUS.INTERNAL_SERVER_ERROR
    )
  })
}

// For Vercel deployment
export default app

// For local development (Bun compatible)
if (ENV.IS_DEVELOPMENT) {
  const port = ENV.PORT
  const host = ENV.HOST

  Bun.serve({
    port,
    hostname: host,
    fetch: app.fetch
  })

  console.log(`Server running at http://${host}:${port}`)
}
