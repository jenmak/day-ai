import { Hono } from "hono"
import { cors } from "hono/cors"

console.log("Starting simple server...")

const app = new Hono()
  .use(cors())
  .get("/", (c) => {
    console.log("Health check endpoint hit")
    return c.text("OK")
  })
  .get("/test", (c) => {
    console.log("Test endpoint hit")
    return c.json({ 
      message: "Test successful", 
      timestamp: new Date().toISOString(),
      env: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL: process.env.VERCEL
      }
    })
  })
  .onError((err, c) => {
    console.error("Error:", err)
    console.error("Error stack:", err.stack)
    return c.json({ error: "Internal Server Error", message: err.message }, 500)
  })

// For Vercel deployment
export default app
