import { z } from "zod"

/**
 * Frontend Input Validation Schemas
 *
 * This module provides client-side input validation for user inputs,
 * form data, and API responses using Zod schemas.
 */

// ============================================================================
// COMMON VALIDATION UTILITIES
// ============================================================================

/**
 * Common string validation patterns for frontend
 */
export const StringValidation = {
  // Non-empty string with length constraints
  required: z.string().min(1, "This field is required"),

  // Optional string with length constraints
  optional: () => z.string().optional(),

  // String with maximum length
  maxLength: (max: number) => z.string().max(max, `Must be ${max} characters or less`),

  // String with minimum and maximum length
  lengthRange: (min: number, max: number) =>
    z
      .string()
      .min(min, `Must be at least ${min} characters`)
      .max(max, `Must be at most ${max} characters`),

  // Trimmed string
  trimmed: z.string().transform((str) => str.trim()),

  // Sanitized string (removes potentially dangerous characters)
  sanitized: z.string().transform((str) =>
    str.replace(/[<>\"'&]/g, (match) => {
      const entities: Record<string, string> = {
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#x27;",
        "&": "&amp;"
      }
      return entities[match]
    })
  )
}

/**
 * Common number validation patterns for frontend
 */
export const NumberValidation = {
  // Positive number
  positive: z.number().positive("Must be a positive number"),

  // Non-negative number
  nonNegative: z.number().nonnegative("Must be a non-negative number"),

  // Integer
  integer: () => z.number().int("Must be an integer"),

  // Number within range
  range: (min: number, max: number) =>
    z.number().min(min, `Must be at least ${min}`).max(max, `Must be at most ${max}`)
}

// ============================================================================
// USER INPUT VALIDATION SCHEMAS
// ============================================================================

/**
 * Search input validation
 */
export const SearchInputSchema = z.object({
  query: z
    .string()
    .min(1, "Please enter a location to search")
    .max(200, "Search query must be 200 characters or less")
    .transform((query) => query.trim())
    .refine((query) => query.length > 0, "Search query cannot be empty")
    .refine((query) => !/^[\s\-_]+$/.test(query), "Search query cannot be only spaces, dashes, or underscores")
})

/**
 * Place description validation
 */
export const PlaceDescriptionSchema = z.object({
  description: StringValidation.required
    .min(1, "Please enter a place description")
    .max(500, "Place description must be 500 characters or less")
    .transform((desc) => desc.trim())
    .refine((desc) => desc.length > 0, "Place description cannot be empty")
    .refine((desc) => !/^[\s\-_]+$/.test(desc), "Place description cannot be only spaces, dashes, or underscores")
})

/**
 * Form validation schemas
 */
export const FormValidationSchemas = {
  // Contact form
  contact: z.object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be 100 characters or less")
      .regex(/^[a-zA-Z\s\-'\.]+$/, "Name contains invalid characters"),

    email: z.string().email("Must be a valid email address"),

    message: z
      .string()
      .min(10, "Message must be at least 10 characters")
      .max(1000, "Message must be 1000 characters or less")
  }),

  // Feedback form
  feedback: z.object({
    rating: z.number().min(1).max(5),
    comment: z.string().max(500, "Comment must be 500 characters or less").optional(),
    category: z.enum(["bug", "feature", "general", "other"]),
    email: z.string().email().optional()
  }),

  // Settings form
  settings: z.object({
    temperatureUnit: z.enum(["fahrenheit", "celsius"]).default("fahrenheit"),
    language: z.string().max(10).default("en"),
    notifications: z.boolean().default(true),
    theme: z.enum(["light", "dark", "auto"]).default("auto")
  })
}

// ============================================================================
// API RESPONSE VALIDATION SCHEMAS
// ============================================================================

/**
 * API response wrapper validation
 */
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.unknown().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
  timestamp: z.string().datetime().optional()
})

/**
 * Paginated response validation
 */
export const PaginatedResponseSchema = z.object({
  data: z.array(z.unknown()),
  total: NumberValidation.nonNegative,
  limit: NumberValidation.positive,
  offset: NumberValidation.nonNegative,
  hasMore: z.boolean()
})

/**
 * Error response validation
 */
export const ErrorResponseSchema = z.object({
  error: z.string(),
  message: z.string(),
  details: z
    .array(
      z.object({
        field: z.string(),
        message: z.string(),
        code: z.string(),
        received: z.unknown().optional()
      })
    )
    .optional(),
  timestamp: z.string().datetime()
})

// ============================================================================
// WEATHER DATA VALIDATION
// ============================================================================

/**
 * Weather condition validation
 */
export const WeatherConditionSchema = z.object({
  code: z.number().min(0).max(99),
  name: z.string().max(50),
  description: z.string().max(200),
  icon: z.string().max(50).optional()
})

/**
 * Weather data validation
 */
export const WeatherDataSchema = z.object({
  date: z.string().datetime(),
  degreesFahrenheit: z.number().min(-50).max(150),
  temperatureRange: z.object({
    temperatureMinimum: z.number().min(-50).max(150),
    temperatureMaximum: z.number().min(-50).max(150)
  }),
  temperatureRangeCategory: z.enum([
    "VERY_HOT",
    "HOT",
    "WARM",
    "MILD",
    "COOL",
    "COLD",
    "VERY_COLD"
  ]),
  rainProbabilityPercentage: NumberValidation.range(0, 100),
  windSpeedMph: NumberValidation.range(0, 200),
  condition: NumberValidation.range(0, 99),
  clothing: z.array(z.string()).min(1).max(10)
})

/**
 * Place data validation
 */
export const PlaceDataSchema = z.object({
  id: z.string().uuid(),
  description: z.string().max(500).optional(),
  normalizedPlace: z.string().max(200),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Must be a valid slug"),
  geocodedAddress: z
    .object({
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180),
      formattedAddress: z.string().max(500),
      structuredAddress: z.object({
        city: z.string().max(100),
        state: z.string().max(100),
        postalCode: z.string().max(10),
        country: z.string().max(100),
        street: z.string().max(200).optional(),
        streetNumber: z.string().max(20).optional()
      })
    })
    .nullable(),
  weather: z.array(WeatherDataSchema).optional(),
  temperatureRangeCategory: z
    .enum(["VERY_HOT", "HOT", "WARM", "MILD", "COOL", "COLD", "VERY_COLD"])
    .optional(),
  createdAt: z.string().datetime()
})

// ============================================================================
// URL PARAMETER VALIDATION
// ============================================================================

/**
 * URL parameter validation schemas
 */
export const UrlParamSchemas = {
  // Place slug parameter
  placeSlug: z.object({
    slug: z
      .string()
      .min(1, "Slug is required")
      .max(100, "Slug must be 100 characters or less")
      .regex(/^[a-z0-9-]+$/, "Must be a valid slug format")
  }),

  // Place ID parameter
  placeId: z.object({
    id: z.string().uuid("Must be a valid UUID")
  }),

  // Search parameters
  searchParams: z.object({
    q: z
      .string()
      .max(200, "Search query must be 200 characters or less")
      .transform((query) => query?.trim())
      .optional(),
    page: z
      .string()
      .regex(/^\d+$/, "Page must be a number")
      .transform((page) => parseInt(page, 10))
      .refine((page) => page > 0, "Page must be positive")
      .default("1"),
    limit: z
      .string()
      .regex(/^\d+$/, "Limit must be a number")
      .transform((limit) => parseInt(limit, 10))
      .refine((limit) => limit > 0 && limit <= 100, "Limit must be between 1 and 100")
      .default("20")
  })
}

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Validate input and return detailed error information
 */
export function validateInput<T>(
  schema: z.ZodSchema<T>,
  input: unknown
): {
  success: boolean
  data?: T
  errors?: Array<{
    field: string
    message: string
    code: string
  }>
} {
  try {
    const data = schema.parse(input)
    return { success: true, data }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
        code: err.code
      }))
      return { success: false, errors }
    }
    return {
      success: false,
      errors: [{ field: "unknown", message: "Unknown validation error", code: "custom" }]
    }
  }
}

/**
 * Validate input and throw error if invalid
 */
export function validateInputOrThrow<T>(schema: z.ZodSchema<T>, input: unknown): T {
  try {
    return schema.parse(input)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((err) => `${err.path.join(".")}: ${err.message}`)
      throw new Error(`Validation failed: ${errorMessages.join(", ")}`)
    }
    throw error
  }
}

/**
 * Create a validation schema with custom error messages
 */
export function createValidationSchema<T extends z.ZodRawShape>(
  shape: T,
  errorMap?: z.ZodErrorMap
): z.ZodObject<T> {
  return z.object(shape, { errorMap })
}

/**
 * Sanitize input data to prevent XSS
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
 * Validate and sanitize form data
 */
export function validateAndSanitizeFormData<T>(
  schema: z.ZodSchema<T>,
  formData: FormData
): {
  success: boolean
  data?: T
  errors?: Array<{ field: string; message: string; code: string }>
} {
  try {
    // Convert FormData to object
    const data: Record<string, unknown> = {}
    for (const [key, value] of formData.entries()) {
      data[key] = value
    }

    // Sanitize the data
    const sanitizedData = sanitizeInput(data)

    // Validate the data
    const result = validateInput(schema, sanitizedData)
    return result
  } catch (error) {
    return {
      success: false,
      errors: [{ field: "form", message: "Failed to process form data", code: "custom" }]
    }
  }
}

// ============================================================================
// COMMON VALIDATION PATTERNS
// ============================================================================

/**
 * Common validation patterns for reuse
 */
export const ValidationPatterns = {
  // Email validation
  email: z.string().email("Must be a valid email address"),

  // URL validation
  url: z.string().url("Must be a valid URL"),

  // Phone number validation
  phoneNumber: z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, "Must be a valid phone number"),

  // UUID validation
  uuid: z.string().uuid("Must be a valid UUID"),

  // Slug validation
  slug: z.string().regex(/^[a-z0-9-]+$/, "Must be a valid slug (lowercase, numbers, hyphens only)"),

  // Alphanumeric validation
  alphanumeric: z.string().regex(/^[a-zA-Z0-9]+$/, "Must contain only letters and numbers"),

  // No special characters (for names, places)
  noSpecialChars: z.string().regex(/^[a-zA-Z0-9\s\-'\.]+$/, "Contains invalid characters")
}
