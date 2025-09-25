#!/usr/bin/env node

import express from "express"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = process.env.PORT || 3000
const distDir = path.join(__dirname, "dist")

console.log("🚀 Starting production static server...")
console.log("📁 Serving files from:", distDir)
console.log("🌐 Port:", port)
console.log("🔍 Current working directory:", process.cwd())

// Check if dist directory exists
if (!fs.existsSync(distDir)) {
  console.error("❌ ERROR: dist directory not found!")
  console.error("📋 Current working directory:", process.cwd())
  console.error("📋 Listing current directory:")
  try {
    const files = fs.readdirSync(".")
    console.error("Files:", files)
  } catch (e) {
    console.error("Could not list directory:", e.message)
  }
  process.exit(1)
}

// Serve static files from dist directory
app.use(express.static(distDir))

// Handle React Router (SPA) - serve index.html for all non-API routes
app.get("*", (req, res) => {
  console.log("📥 SPA route request:", req.path)
  res.sendFile(path.join(distDir, "index.html"))
})

app.listen(port, "0.0.0.0", () => {
  console.log("✅ Static server running on port", port)
  console.log("🌐 Server URL: http://localhost:" + port)
})
