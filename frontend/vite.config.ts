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
    port: 6173,
    host: "0.0.0.0",
    allowedHosts: [
      "dripdropcityfrontend-production.up.railway.app",
      "dripdrop.city",
      "www.dripdrop.city"
    ]
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  define: {
    "import.meta.env.VITE_API_URL": JSON.stringify(
      process.env.NODE_ENV === "production"
        ? "https://dripdropcitybackend-production.up.railway.app" // Railway backend
        : "http://localhost:3333" // Local development
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
    }
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router"]
  }
})
