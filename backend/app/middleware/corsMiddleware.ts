import { Context, Next } from "hono"
import { CONFIG, ENV } from "../config"

/**
 * Enhanced CORS middleware with better error handling and logging
 */
export function corsMiddleware() {
  return async (c: Context, next: Next) => {
    const origin = c.req.header("Origin")

    // Handle preflight requests
    if (c.req.method === "OPTIONS") {
      const allowedOrigins = ENV.IS_PRODUCTION
        ? CONFIG.SERVER.CORS_ORIGINS.PRODUCTION
        : CONFIG.SERVER.CORS_ORIGINS.DEVELOPMENT

      const isAllowed = !origin || allowedOrigins.includes(origin as never)

      if (isAllowed) {
        // Set CORS headers for preflight
        c.header("Access-Control-Allow-Origin", origin || "*")
        c.header(
          "Access-Control-Allow-Methods",
          CONFIG.SERVER.CORS_SETTINGS.ALLOWED_METHODS.join(", ")
        )
        c.header(
          "Access-Control-Allow-Headers",
          CONFIG.SERVER.CORS_SETTINGS.ALLOWED_HEADERS.join(", ")
        )
        c.header(
          "Access-Control-Allow-Credentials",
          CONFIG.SERVER.CORS_SETTINGS.CREDENTIALS.toString()
        )
        c.header("Access-Control-Max-Age", CONFIG.SERVER.CORS_SETTINGS.MAX_AGE.toString())

        if (ENV.IS_DEVELOPMENT) {
          console.log(`CORS Preflight: Origin "${origin}" allowed`)
        }

        return c.text("", 200)
      } else {
        if (ENV.IS_DEVELOPMENT) {
          console.log(`CORS Preflight: Origin "${origin}" blocked`)
        }
        return c.text("CORS policy violation", 403)
      }
    }

    // Handle actual requests
    await next()

    // Add CORS headers to response
    if (origin) {
      const allowedOrigins = ENV.IS_PRODUCTION
        ? CONFIG.SERVER.CORS_ORIGINS.PRODUCTION
        : CONFIG.SERVER.CORS_ORIGINS.DEVELOPMENT

      if (allowedOrigins.includes(origin as never)) {
        c.header("Access-Control-Allow-Origin", origin)
        c.header(
          "Access-Control-Allow-Credentials",
          CONFIG.SERVER.CORS_SETTINGS.CREDENTIALS.toString()
        )

        if (ENV.IS_DEVELOPMENT) {
          console.log(`CORS Response: Origin "${origin}" allowed`)
        }
      }
    }
  }
}

/**
 * CORS error handler middleware
 */
export function corsErrorHandler() {
  return async (c: Context, next: Next) => {
    try {
      await next()
    } catch (error) {
      // Add CORS headers even for errors
      const origin = c.req.header("Origin")
      if (origin) {
        const allowedOrigins = ENV.IS_PRODUCTION
          ? CONFIG.SERVER.CORS_ORIGINS.PRODUCTION
          : CONFIG.SERVER.CORS_ORIGINS.DEVELOPMENT

        if (allowedOrigins.includes(origin as never)) {
          c.header("Access-Control-Allow-Origin", origin)
          c.header(
            "Access-Control-Allow-Credentials",
            CONFIG.SERVER.CORS_SETTINGS.CREDENTIALS.toString()
          )
        }
      }

      throw error
    }
  }
}

/**
 * Validate CORS origin
 */
export function validateCorsOrigin(origin: string | undefined): boolean {
  if (!origin) return true // Allow requests with no origin

  const allowedOrigins = ENV.IS_PRODUCTION
    ? CONFIG.SERVER.CORS_ORIGINS.PRODUCTION
    : CONFIG.SERVER.CORS_ORIGINS.DEVELOPMENT

  return allowedOrigins.includes(origin as never)
}

/**
 * Get CORS headers for a given origin
 */
export function getCorsHeaders(origin: string | undefined): Record<string, string> {
  if (!origin || !validateCorsOrigin(origin as never)) {
    return {}
  }

  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Credentials": CONFIG.SERVER.CORS_SETTINGS.CREDENTIALS.toString(),
    "Access-Control-Expose-Headers": CONFIG.SERVER.CORS_SETTINGS.EXPOSE_HEADERS.join(", ")
  }
}
