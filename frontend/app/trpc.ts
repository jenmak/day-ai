import { QueryClient } from "@tanstack/react-query"
import { createTRPCClient, httpLink, loggerLink } from "@trpc/client"
import { ENV } from "./config"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false
    }
  }
})

// Get the backend URL from environment configuration
const backendUrl = ENV.backendUrl

// Debug logging for mobile browsers
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)
const isChrome = /Chrome/.test(navigator.userAgent)

console.log('tRPC Configuration:', {
  isDevelopment: ENV.isDevelopment,
  isProduction: ENV.isProduction,
  backendUrl: backendUrl,
  userAgent: navigator.userAgent,
  isMobile,
  isSafari,
  isChrome,
  isMobileSafari: isMobile && isSafari,
  isMobileChrome: isMobile && isChrome
})

export const trpcClient = createTRPCClient<any>({
  links: [
    loggerLink(),
    httpLink({
      url: `${backendUrl}/trpc`,
      // Removed superjson transformer to fix production issues
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      // Mobile-specific fetch configuration
      fetch: (url, options) => {
        console.log('tRPC Mobile Fetch Request:', {
          url,
          method: options?.method,
          isMobile,
          userAgent: navigator.userAgent
        })

        // Mobile-specific fetch options
        const mobileOptions = {
          ...options,
          mode: 'cors',
          cache: 'no-cache',
          credentials: 'omit', // Mobile browsers are strict about credentials
          headers: {
            ...options?.headers,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }

        return fetch(url, mobileOptions).catch(error => {
          console.error('tRPC Mobile Fetch Error:', {
            url,
            error: error.message,
            name: error.name,
            isMobile,
            userAgent: navigator.userAgent
          })
          throw error
        })
      }
    })
  ]
})
