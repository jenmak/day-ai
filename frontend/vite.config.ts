import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react-swc"
import path from "path"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  clearScreen: false,
  server: {
    port: Number(process.env.PORT) || 3000,
    host: "0.0.0.0",
    // Allow all hosts for Railway deployment flexibility
    // Railway will handle domain validation through proxy headers
    allowedHosts: true
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  define: {
    "import.meta.env.VITE_API_URL": JSON.stringify(
      process.env.NODE_ENV === "development"
        ? "http://localhost:3334" // Local development
        : "http://localhost:3334" // Use local backend for now since Railway backend is down
    ),
    "process.env.NODE_ENV": JSON.stringify(
      process.env.NODE_ENV || "development"
    )
  },
  build: {
    target: ["es2020", "safari14"], // Safari compatibility
    minify: "esbuild",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router"]
        },
        // Safari-friendly chunk naming
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    outDir: "dist"
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router"]
  },
  preview: {
    host: "0.0.0.0",
    port: Number(process.env.PORT) || 4173,
    allowedHosts: true // Also for production preview
  }
})
