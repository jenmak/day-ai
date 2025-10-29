// Ultra-minimal server for Railway
import http from 'http'

const port = process.env.PORT || 3000

console.log('Starting minimal server on port', port)

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`)
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200)
    res.end()
    return
  }
  
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end('OK - Minimal Server v2.0 - ' + new Date().toISOString())
  } else if (req.url === '/api/trpc/places.create' && req.method === 'POST') {
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
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Not found' }))
  }
})

server.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`)
})

process.on('SIGTERM', () => process.exit(0))
process.on('SIGINT', () => process.exit(0))
