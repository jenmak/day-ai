import { Context, Next } from "hono"
import { ZodError, ZodSchema } from "zod"
import { sanitizeErrorMessage } from "../security/envValidation"

/**
 * Validation Middleware for Hono
 *
 * This middleware provides comprehensive input validation for API endpoints
 * using Zod schemas with proper error handling and sanitization.
 */

interface ValidationOptions {
  schema: ZodSchema
  source?: "body" | "query" | "params" | "header"
  sanitizeErrors?: boolean
  transform?: boolean
}

/**
 * Create validation middleware for request data
 */
export function createValidationMiddleware(options: ValidationOptions) {
  const { schema, source = "body", sanitizeErrors = true, transform = true } = options

  return async (c: Context, next: Next) => {
    try {
      let data: unknown

      // Get data from the specified source
      switch (source) {
        case "body":
          data = await c.req.json()
          break
        case "query":
          data = c.req.query()
          break
        case "params":
          data = c.req.param()
          break
        case "header":
          const headers: Record<string, string> = {}
          const headerObj = c.req.header()
          Object.entries(headerObj).forEach(([key, value]) => {
            headers[key.toLowerCase()] = value
          })
          data = headers
          break
        default:
          throw new Error(`Invalid validation source: ${source}`)
      }

      // Validate the data
      const validatedData = transform ? schema.parse(data) : schema.parse(data)

      // Store validated data in context
      c.set("validatedData", validatedData)
      c.set("validationSource", source)

      await next()
    } catch (error) {
      if (error instanceof ZodError) {
        // Format validation errors
        const validationErrors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
          code: err.code,
          received: "received" in err ? err.received : undefined
        }))

        // Log validation errors (without sensitive data)
        console.warn("Validation failed:", {
          source,
          errors: validationErrors.map((err) => `${err.field}: ${err.message}`),
          timestamp: new Date().toISOString()
        })

        // Return validation error response
        return c.json(
          {
            error: "Validation Failed",
            message: "Invalid input data",
            details: validationErrors,
            timestamp: new Date().toISOString()
          },
          400
        )
      }

      // Handle other errors
      const errorMessage = sanitizeErrors
        ? sanitizeErrorMessage(error)
        : error instanceof Error
          ? error.message
          : "Unknown validation error"

      console.error("Validation middleware error:", errorMessage)

      return c.json(
        {
          error: "Validation Error",
          message: errorMessage,
          timestamp: new Date().toISOString()
        },
        500
      )
    }
  }
}

/**
 * Validate request body
 */
export function validateBody<T>(schema: ZodSchema<T>) {
  return createValidationMiddleware({ schema, source: "body" })
}

/**
 * Validate query parameters
 */
export function validateQuery<T>(schema: ZodSchema<T>) {
  return createValidationMiddleware({ schema, source: "query" })
}

/**
 * Validate route parameters
 */
export function validateParams<T>(schema: ZodSchema<T>) {
  return createValidationMiddleware({ schema, source: "params" })
}

/**
 * Validate headers
 */
export function validateHeaders<T>(schema: ZodSchema<T>) {
  return createValidationMiddleware({ schema, source: "header" })
}

/**
 * Get validated data from context
 */
export function getValidatedData<T>(c: Context): T {
  const data = c.get("validatedData")
  if (!data) {
    throw new Error("No validated data found in context")
  }
  return data as T
}

/**
 * Check if data has been validated
 */
export function hasValidatedData(c: Context): boolean {
  return c.get("validatedData") !== undefined
}

/**
 * Create a validation error response
 */
export function createValidationErrorResponse(errors: ZodError["errors"]) {
  return {
    error: "Validation Failed",
    message: "Input validation failed",
    details: errors.map((err) => ({
      field: err.path.join("."),
      message: err.message,
      code: err.code,
      received: "received" in err ? err.received : undefined
    })),
    timestamp: new Date().toISOString()
  }
}

/**
 * Validate multiple sources at once
 */
export function validateMultiple(schemas: {
  body?: ZodSchema
  query?: ZodSchema
  params?: ZodSchema
  headers?: ZodSchema
}) {
  return async (c: Context, next: Next) => {
    const validatedData: Record<string, unknown> = {}
    const errors: ZodError["errors"] = []

    // Validate each source if schema is provided
    for (const [source, schema] of Object.entries(schemas)) {
      if (!schema) continue

      try {
        let data: unknown

        switch (source) {
          case "body":
            data = await c.req.json()
            break
          case "query":
            data = c.req.query()
            break
          case "params":
            data = c.req.param()
            break
          case "headers":
            const headers: Record<string, string> = {}
            const headerObj = c.req.header()
            Object.entries(headerObj).forEach(([key, value]) => {
              headers[key.toLowerCase()] = value
            })
            data = headers
            break
          default:
            throw new Error(`Invalid validation source: ${source}`)
        }

        const validated = schema.parse(data)
        validatedData[source] = validated
      } catch (error) {
        if (error instanceof ZodError) {
          errors.push(...error.errors)
        } else {
          console.error(`Validation error for ${source}:`, error)
          errors.push({
            code: "custom",
            message: `Failed to validate ${source}`,
            path: [source]
          })
        }
      }
    }

    // If there are validation errors, return them
    if (errors.length > 0) {
      console.warn("Multiple validation failed:", {
        errors: errors.map((err) => `${err.path.join(".")}: ${err.message}`),
        timestamp: new Date().toISOString()
      })

      return c.json(createValidationErrorResponse(errors), 400)
    }

    // Store all validated data in context
    c.set("validatedData", validatedData)
    c.set("validationSource", "multiple")

    await next()
  }
}

/**
 * Sanitize input data to prevent XSS and other attacks
 */
export function sanitizeInput<T>(data: T): T {
  if (typeof data === "string") {
    return data
      .replace(/[<>\"'&]/g, (match) => {
        const entities: Record<string, string> = {
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#x27;",
          "&": "&amp;"
        }
        return entities[match]
      })
      .trim() as T
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeInput(item)) as T
  }

  if (data && typeof data === "object") {
    const sanitized: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = sanitizeInput(value)
    }
    return sanitized as T
  }

  return data
}

/**
 * Rate limiting validation middleware
 */
export function validateRateLimit(maxRequests: number = 100, windowMs: number = 60000) {
  const requests = new Map<string, { count: number; resetTime: number }>()

  return async (c: Context, next: Next) => {
    const clientId = c.req.header("x-forwarded-for") || c.req.header("x-real-ip") || "unknown"

    const now = Date.now()
    const resetTime = now + windowMs

    // Clean up expired entries
    for (const [id, data] of requests.entries()) {
      if (data.resetTime < now) {
        requests.delete(id)
      }
    }

    // Get or create client data
    const clientData = requests.get(clientId) || { count: 0, resetTime }

    // Check if rate limit exceeded
    if (clientData.count >= maxRequests) {
      return c.json(
        {
          error: "Rate Limit Exceeded",
          message: `Too many requests. Limit: ${maxRequests} per ${windowMs / 1000} seconds`,
          retryAfter: Math.ceil((clientData.resetTime - now) / 1000),
          timestamp: new Date().toISOString()
        },
        429
      )
    }

    // Increment request count
    clientData.count++
    requests.set(clientId, clientData)

    // Add rate limit headers
    c.header("X-RateLimit-Limit", maxRequests.toString())
    c.header("X-RateLimit-Remaining", Math.max(0, maxRequests - clientData.count).toString())
    c.header("X-RateLimit-Reset", Math.ceil(clientData.resetTime / 1000).toString())

    await next()
  }
}

/**
 * Content-Type validation middleware
 */
export function validateContentType(allowedTypes: string[] = ["application/json"]) {
  return async (c: Context, next: Next) => {
    const contentType = c.req.header("content-type") || ""
    const isValidType = allowedTypes.some((type) => contentType.includes(type))

    if (!isValidType) {
      return c.json(
        {
          error: "Invalid Content-Type",
          message: `Content-Type must be one of: ${allowedTypes.join(", ")}`,
          received: contentType,
          timestamp: new Date().toISOString()
        },
        415
      )
    }

    await next()
  }
}

/**
 * Request size validation middleware
 */
export function validateRequestSize(maxSizeBytes: number = 1024 * 1024) {
  // 1MB default
  return async (c: Context, next: Next) => {
    const contentLength = c.req.header("content-length")

    if (contentLength && parseInt(contentLength) > maxSizeBytes) {
      return c.json(
        {
          error: "Request Too Large",
          message: `Request body must be less than ${maxSizeBytes} bytes`,
          maxSize: maxSizeBytes,
          received: parseInt(contentLength),
          timestamp: new Date().toISOString()
        },
        413
      )
    }

    await next()
  }
}
