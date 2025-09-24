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

const app = new Hono()
  .use(
    cors({
      origin: ENV.IS_PRODUCTION
        ? CONFIG.SERVER.PRODUCTION_FRONTEND_URL
        : CONFIG.SERVER.FRONTEND_URL,
      allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization"]
    })
  )
  .get("/", (c) => {
    console.log("Health check endpoint hit")
    return c.text("OK")
  })
  .get("/test", (c) => {
    console.log("Test endpoint hit")
    return c.json({ message: "Test successful", timestamp: new Date().toISOString() })
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
