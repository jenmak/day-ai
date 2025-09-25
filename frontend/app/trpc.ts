import { QueryClient } from "@tanstack/react-query"
import { createTRPCClient, httpBatchLink, loggerLink } from "@trpc/client"
import superjson from "superjson"
import { ENV } from "./config"

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
      url: `${ENV.BACKEND_URL}/api/trpc`,
      transformer: superjson
    })
  ]
})
