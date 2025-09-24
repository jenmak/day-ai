import { trpcServer } from "@hono/trpc-server"
import { config } from "dotenv"
import { Hono } from "hono"
import { cors } from "hono/cors"
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
      origin: "http://localhost:6173",
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
    return c.json({ error: "Internal Server Error", message: err.message }, 500)
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
        error: "TRPC not available",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      500
    )
  })
}

// For Vercel deployment
export default app

// For local development (Bun compatible)
if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT ? parseInt(process.env.PORT) : 3333
  const host = process.env.HOST || "0.0.0.0"

  Bun.serve({
    port,
    hostname: host,
    fetch: app.fetch
  })

  console.log(`Server running at http://${host}:${port}`)
}
