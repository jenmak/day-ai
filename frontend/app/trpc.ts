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

export const trpcClient = createTRPCClient({
  links: [
    loggerLink(),
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson
    })
  ]
})
