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
    allowedHosts: true,
    // Development proxy to backend (optional - for consistency with production)
    proxy: {
      '/api': {
        target: 'http://localhost:3334',
        changeOrigin: true,
        secure: false
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  define: {
    // Use same domain for API requests in both development and production
    // Development: Vite proxy handles /api -> backend
    // Production: Express proxy handles /api -> backend
    "import.meta.env.VITE_API_URL": JSON.stringify(""),
    "import.meta.env.MODE": JSON.stringify(
      process.env.NODE_ENV === "production" ? "production" : "development"
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
