#!/usr/bin/env bun

import { file, serve } from "bun"
import { existsSync } from "fs"
import { join } from "path"

const port = process.env.PORT || 3000
const distDir = "dist"

console.log(`🚀 Starting production static server...`)
console.log(`📁 Serving files from: ${distDir}`)
console.log(`🌐 Port: ${port}`)
console.log(`🔍 Current working directory: ${process.cwd()}`)

// Check if dist directory exists
const distExists = existsSync(distDir)
console.log(`📂 Dist directory exists: ${distExists}`)

if (!distExists) {
  console.error(`❌ ERROR: ${distDir} directory not found!`)
  console.error(`📋 Current working directory: ${process.cwd()}`)
  console.error(`📋 Listing current directory:`)
  try {
    const { readdirSync } = await import("fs")
    const files = readdirSync(".")
    console.error("Files:", files)
  } catch (e) {
    console.error("Could not list directory:", e.message)
  }
  process.exit(1)
}

serve({
  port: Number(port),
  hostname: "0.0.0.0",
  async fetch(request) {
    const url = new URL(request.url)
    let pathname = url.pathname

    console.log(`📥 Request: ${pathname}`)

    // Serve index.html for root and SPA routes
    if (pathname === "/" || !pathname.includes(".")) {
      pathname = "/index.html"
    }

    // Remove leading slash for file system
    const filePath = pathname.startsWith("/") ? pathname.slice(1) : pathname
    const fullPath = join(distDir, filePath)

    console.log(`📄 Looking for file: ${fullPath}`)

    try {
      const fileResponse = file(fullPath)
      if (await fileResponse.exists()) {
        console.log(`✅ Serving: ${pathname}`)
        return new Response(fileResponse, {
          headers: {
            "Content-Type": getContentType(filePath)
          }
        })
      } else {
        console.log(`❌ File not found: ${pathname}, serving index.html`)
        // Fallback to index.html for SPA routing
        const indexFile = file(join(distDir, "index.html"))
        return new Response(indexFile, {
          headers: {
            "Content-Type": "text/html"
          }
        })
      }
    } catch (error) {
      console.error(`❌ Error serving ${pathname}:`, error)
      return new Response("File not found", { status: 404 })
    }
  }
})

function getContentType(filePath) {
  const ext = filePath.split(".").pop()?.toLowerCase()
  const types = {
    html: "text/html",
    css: "text/css",
    js: "application/javascript",
    json: "application/json",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    svg: "image/svg+xml",
    ico: "image/x-icon",
    woff: "font/woff",
    woff2: "font/woff2",
    ttf: "font/ttf",
    eot: "application/vnd.ms-fontobject"
  }
  return types[ext] || "text/plain"
}

console.log(`✅ Static server running on port ${port}`)
