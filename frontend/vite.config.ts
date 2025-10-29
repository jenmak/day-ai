import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react-swc"
import path from "path"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [
    react(),
    tailwindcss()
  ],
  build: {
    outDir: "dist",
    sourcemap: false,
    target: "es2015", // Safari compatibility
    rollupOptions: {
      output: {
        manualChunks: undefined,
        // Safari compatibility
        format: "es"
      }
    }
  },
  preview: {
    port: 3000,
    open: true
  },
  clearScreen: false,
  server: {
    host: "0.0.0.0",
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    allowedHosts: "all"
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  // Safari compatibility
  define: {
    global: "globalThis"
  }
})
