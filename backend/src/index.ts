import { appRouter } from "#app/router/index.ts"
import { createContext } from "#core/trpc.ts"
import { trpcServer } from "@hono/trpc-server"
import { Hono } from "hono"
import { cors } from "hono/cors"

const app = new Hono()
  .use(cors())
  .get("/", (c) => c.text("OK"))
  .use("/trpc/*", trpcServer({ router: appRouter, createContext }))
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

const port = import.meta.env.PORT ? parseInt(import.meta.env.PORT) : 3333
const host = import.meta.env.HOST || "0.0.0.0"

export default { fetch: app.fetch, port, hostname: host }
