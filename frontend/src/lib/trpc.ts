import type { AppRouter } from "@dayai/backend"
import { QueryClient } from "@tanstack/react-query"
import { createTRPCClient, httpBatchLink, loggerLink } from "@trpc/client"
import superjson from "superjson"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false
    }
  }
})

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    loggerLink(),
    httpBatchLink({
      url: import.meta.env.VITE_API_URL || "http://localhost:3333",
      transformer: superjson
    })
  ]
})
