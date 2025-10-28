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
const backendUrl = ENV.BACKEND_URL

export const trpcClient = createTRPCClient({
  links: [
    loggerLink(),
    httpLink({
      url: `${backendUrl}/api/trpc`,
      transformer: superjson
    })
  ]
})
