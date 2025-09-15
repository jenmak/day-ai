import { config } from "dotenv"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { appRouter } from "../app/router/index.js"
import { createContext } from "../core/trpc.js"
import { trpcServer } from "@hono/trpc-server"

// Load environment variables from .env file (only in development)
if (process.env.NODE_ENV !== 'production') {
  config()
}

console.log("Starting server...")

const app = new Hono()
  .use(cors())
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
} catch (error: any) {
  console.error("Failed to load TRPC components:", error)
  app.get("/trpc/*", (c) => {
    return c.json({ error: "TRPC not available", message: error.message }, 500)
  })
}

// For Vercel deployment
export default app

// For local development (Node.js compatible)
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT ? parseInt(process.env.PORT) : 3333
  const host = process.env.HOST || "0.0.0.0"
  
  // Simple HTTP server for local development
  const http = await import('http')
  const server = http.createServer(async (req, res) => {
    try {
      const response = await app.fetch(req as any)
      const headers: Record<string, string> = {}
      response.headers.forEach((value, key) => {
        headers[key] = value
      })
      res.writeHead(response.status, headers)
      
      if (response.body) {
        const reader = response.body.getReader()
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          res.write(value)
        }
        res.end()
      } else {
        res.end()
      }
    } catch (error) {
      res.writeHead(500)
      res.end('Internal Server Error')
    }
  })
  
  server.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}`)
  })
}
