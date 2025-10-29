import { z } from "zod"

/**
 * Comprehensive Input Validation Schemas
 *
 * This module provides robust input validation for all user inputs,
 * API requests, and data transformations using Zod schemas.
 */

// ============================================================================
// COMMON VALIDATION UTILITIES
// ============================================================================

/**
 * Common string validation patterns
 */
export const StringValidation = {
  // Non-empty string with length constraints
  required: z.string().min(1, "Field is required"),

  // Optional string with length constraints
  optional: z.string().optional(),

  // String with maximum length
  maxLength: (max: number) =>
    z.string().max(max, `Must be ${max} characters or less`),

  // String with minimum and maximum length
  lengthRange: (min: number, max: number) =>
    z
      .string()
      .min(min, `Must be at least ${min} characters`)
      .max(max, `Must be at most ${max} characters`),

  // Alphanumeric string
  alphanumeric: z
    .string()
    .regex(/^[a-zA-Z0-9]+$/, "Must contain only letters and numbers"),

  // Slug format (lowercase, hyphens, alphanumeric)
  slug: z
    .string()
    .regex(
      /^[a-z0-9-]+$/,
      "Must be a valid slug (lowercase, numbers, hyphens only)"
    ),

  // Email format
  email: z.string().email("Must be a valid email address"),

  // URL format
  url: z.string().url("Must be a valid URL"),

  // Postal code (flexible format)
  postalCode: z
    .string()
    .regex(/^[a-zA-Z0-9\s-]{3,10}$/, "Must be a valid postal code"),

  // Phone number (flexible format)
  phoneNumber: z
    .string()
    .regex(/^[\+]?[1-9][\d]{0,15}$/, "Must be a valid phone number"),

  // UUID format
  uuid: z.string().uuid("Must be a valid UUID"),

  // ISO date string
  isoDate: z.string().datetime("Must be a valid ISO date string"),

  // JSON string
  json: z.string().refine((str) => {
    try {
      JSON.parse(str)
      return true
    } catch {
      return false
    }
  }, "Must be valid JSON")
}

/**
 * Common number validation patterns
 */
export const NumberValidation = {
  // Positive number
  positive: z.number().positive("Must be a positive number"),

  // Non-negative number
  nonNegative: z.number().min(0, "Must be a non-negative number"),

  // Number within range
  range: (min: number, max: number) =>
    z
      .number()
      .min(min, `Must be at least ${min}`)
      .max(max, `Must be at most ${max}`),

  // Latitude validation (-90 to 90) - stored as string for precision
  latitude: z
    .union([z.string(), z.number()])
    .transform((val) => {
      const num = Number(val)
      if (isNaN(num)) {
        throw new Error("Latitude must be a valid number")
      }
      return num.toFixed(6) // Store as string with 6 decimal places
    })
    .refine((val) => {
      const num = Number(val)
      return num >= -90 && num <= 90
    }, "Latitude must be between -90 and 90"),

  // Longitude validation (-180 to 180) - stored as string for precision
  longitude: z
    .union([z.string(), z.number()])
    .transform((val) => {
      const num = Number(val)
      if (isNaN(num)) {
        throw new Error("Longitude must be a valid number")
      }
      return num.toFixed(6) // Store as string with 6 decimal places
    })
    .refine((val) => {
      const num = Number(val)
      return num >= -180 && num <= 180
    }, "Longitude must be between -180 and 180"),

  // Temperature in Fahrenheit (-50 to 150)
  temperatureF: z
    .number()
    .min(-50, "Temperature must be between -50°F and 150°F")
    .max(150, "Temperature must be between -50°F and 150°F"),

  // Temperature in Celsius (-50 to 65)
  temperatureC: z
    .number()
    .min(-50, "Temperature must be between -50°C and 65°C")
    .max(65, "Temperature must be between -50°C and 65°C"),

  // Percentage (0 to 100)
  percentage: z
    .number()
    .min(0, "Percentage must be between 0 and 100")
    .max(100, "Percentage must be between 0 and 100"),

  // Wind speed in MPH (0 to 200)
  windSpeedMph: z
    .number()
    .min(0, "Wind speed must be between 0 and 200 MPH")
    .max(200, "Wind speed must be between 0 and 200 MPH"),

  // Integer
  integer: z.number().int("Must be an integer"),

  // Float
  float: z.number().finite("Must be a finite number")
}

/**
 * Common date validation patterns
 */
export const DateValidation = {
  // ISO string date
  isoString: z.string().datetime("Must be a valid ISO date string"),

  // Date object
  date: z.date({ message: "Must be a valid date" }),

  // Date string that can be parsed
  dateString: z
    .string()
    .refine((str) => !isNaN(Date.parse(str)), "Must be a valid date string")
}

// ============================================================================
// VALIDATION UTILITY FUNCTIONS
// ============================================================================

/**
 * Create a validation schema with common patterns
 */
export function createValidationSchema<T extends z.ZodRawShape>(
  shape: T,
  options?: {
    required?: boolean
    minLength?: number
    maxLength?: number
  }
) {
  const schema = z.object(shape)

  if (options?.required) {
    return schema.required()
  }

  return schema
}

/**
 * Validate input against a schema and throw on error
 */
export function validateInput<T>(schema: z.ZodSchema<T>, input: unknown): T {
  try {
    return schema.parse(input)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ")
      throw new Error(`Validation failed: ${errorMessages}`)
    }
    throw error
  }
}

/**
 * Validate input against a schema and return result
 */
export function safeValidateInput<T>(
  schema: z.ZodSchema<T>,
  input: unknown
): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(input)
  if (result.success) {
    return { success: true, data: result.data }
  } else {
    return { success: false, error: result.error }
  }
}

/**
 * Transform and validate input
 */
export function transformAndValidate<T, U>(
  schema: z.ZodSchema<T>,
  transformer: (input: T) => U,
  input: unknown
): U {
  const validated = validateInput(schema, input)
  return transformer(validated)
}

/**
 * Sanitize input by trimming strings and removing extra whitespace
 */
export function sanitizeInput<T>(input: T): T {
  if (typeof input === "string") {
    return input.trim().replace(/\s+/g, " ") as T
  }

  if (Array.isArray(input)) {
    return input.map(sanitizeInput) as T
  }

  if (input && typeof input === "object") {
    const sanitized = {} as T
    for (const [key, value] of Object.entries(input)) {
      ;(sanitized as any)[key] = sanitizeInput(value)
    }
    return sanitized
  }

  return input
}

/**
 * Common validation patterns
 */
export const ValidationPatterns = {
  // Email pattern
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  // Phone pattern (flexible)
  phone: /^[\+]?[1-9][\d]{0,15}$/,

  // URL pattern
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,

  // Slug pattern
  slug: /^[a-z0-9-]+$/,

  // UUID pattern
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,

  // Postal code pattern (flexible)
  postalCode: /^[a-zA-Z0-9\s-]{3,10}$/,

  // Alphanumeric pattern
  alphanumeric: /^[a-zA-Z0-9]+$/,

  // JSON pattern (basic check)
  json: /^[\],:{}\s]*$/
}

// ============================================================================
// SPECIFIC SCHEMAS
// ============================================================================

/**
 * Search input validation schema
 */
export const SearchInputSchema = z.object({
  searchTerm: z
    .string()
    .min(1, "Search term is required")
    .max(100, "Search term must be 100 characters or less")
    .transform((val) => val.trim())
})

// Re-export zod for convenience
export { z }
