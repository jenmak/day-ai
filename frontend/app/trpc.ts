import { QueryClient } from "@tanstack/react-query"
import { createTRPCClient, httpLink, loggerLink } from "@trpc/client"
import superjson from "superjson"
import { ENV } from "./config"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false
    }
  }
})

// Get the backend URL from environment configuration
// In development, force use of local backend URL
// In production, use the configured backend URL
const backendUrl = ENV.IS_DEVELOPMENT
  ? "http://localhost:3333"
  : ENV.BACKEND_URL

export const trpcClient = createTRPCClient({
  links: [
    loggerLink(),
    httpLink({
      url: `${backendUrl}/trpc`,
      transformer: superjson,
      headers: {
        "Content-Type": "application/json"
      }
    })
  ]
})
