import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react-swc"
import path from "path"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react({
      jsxRuntime: "automatic",
      jsxImportSource: "react"
    })
  ],
  clearScreen: false,
  server: {
    port: process.env.PORT || 3000,
    host: "0.0.0.0",
    // Allow all hosts for Railway deployment flexibility
    // Railway will handle domain validation through proxy headers
    allowedHosts: "all"
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  define: {
    "import.meta.env.VITE_API_URL": JSON.stringify(
      process.env.NODE_ENV === "development"
        ? "http://localhost:3333" // Local development
        : "https://dripdropcitybackend-production.up.railway.app" // Railway backend
    ),
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development")
  },
  build: {
    target: "esnext",
    minify: "esbuild",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router"]
        }
      }
    },
    outDir: "dist"
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router"]
  },
  preview: {
    host: "0.0.0.0",
    port: process.env.PORT || 4173,
    allowedHosts: "all" // Also for production preview
  }
})
