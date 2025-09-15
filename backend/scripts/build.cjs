const { build } = require('esbuild')
const path = require('path')

async function buildProject() {
  try {
    console.log('Building with esbuild...')
    
    await build({
      entryPoints: ['src/index.ts'],
      bundle: true,
      outfile: 'api/index.js',
      platform: 'node',
      target: 'node18',
      format: 'esm',
      external: [
        // Keep these as external dependencies
        'dotenv',
        'hono',
        'hono/cors',
        '@hono/trpc-server',
        '@trpc/server',
        'zod',
        'openai',
        'superjson',
        'awilix'
      ],
      sourcemap: false,
      minify: false,
      keepNames: true,
      logLevel: 'info'
    })
    
    console.log('Build completed successfully!')
  } catch (error) {
    console.error('Build failed:', error)
    process.exit(1)
  }
}

buildProject()
