#!/usr/bin/env node

// Ultra-simple server for Railway testing
import http from 'http'

const port = process.env.PORT || 3000

console.log("🚀 Starting ultra-simple server...")

const server = http.createServer((req, res) => {
  console.log(`🔍 Request: ${req.method} ${req.url}`)
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200)
    res.end()
    return
  }
  
  // Route handling
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end('OK')
  } else if (req.url === '/test') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ 
      message: 'Backend is working!', 
      timestamp: new Date().toISOString() 
    }))
  } else if (req.url === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ 
      status: 'ok', 
      message: 'API is working' 
    }))
  } else if (req.url === '/api/trpc/places.create' && req.method === 'POST') {
    let body = ''
    req.on('data', chunk => {
      body += chunk.toString()
    })
    req.on('end', () => {
      console.log('tRPC places.create request body:', body)
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({
        result: {
          data: {
            id: 'test-123',
            description: 'Test place',
            slug: 'test-place',
            normalizedPlace: 'Test Location',
            weather: [],
            temperatureRangeCategory: null,
            createdAt: new Date().toISOString()
          }
        }
      }))
    })
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Not found' }))
  }
})

server.listen(port, '0.0.0.0', () => {
  console.log(`✅ Simple server running on port ${port}`)
  console.log(`🌐 Server URL: http://localhost:${port}`)
})

// Handle shutdown
process.on('SIGINT', () => {
  console.log('🛑 Shutting down server...')
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('🛑 Shutting down server...')
  process.exit(0)
})
