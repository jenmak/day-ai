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
  maxLength: (max: number) => z.string().max(max, `Must be ${max} characters or less`),

  // String with minimum and maximum length
  lengthRange: (min: number, max: number) =>
    z
      .string()
      .min(min, `Must be at least ${min} characters`)
      .max(max, `Must be at most ${max} characters`),

  // Alphanumeric string
  alphanumeric: z.string().regex(/^[a-zA-Z0-9]+$/, "Must contain only letters and numbers"),

  // Slug format (lowercase, hyphens, alphanumeric)
  slug: z.string().regex(/^[a-z0-9-]+$/, "Must be a valid slug (lowercase, numbers, hyphens only)"),

  // Email format
  email: z.string().email("Must be a valid email address"),

  // URL format
  url: z.string().url("Must be a valid URL"),

  // Postal code (flexible format)
  postalCode: z.string().regex(/^[a-zA-Z0-9\s-]{3,10}$/, "Must be a valid postal code"),

  // Phone number (flexible format)
  phoneNumber: z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, "Must be a valid phone number"),

  // No special characters (for names, places)
  noSpecialChars: z.string().regex(/^[a-zA-Z0-9\s\-'\.]+$/, "Contains invalid characters"),

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
 * Common number validation patterns
 */
export const NumberValidation = {
  // Positive number
  positive: z.number().positive("Must be a positive number"),

  // Non-negative number
  nonNegative: z.number().nonnegative("Must be a non-negative number"),

  // Integer
  integer: z.number().int("Must be an integer"),

  // Number within range
  range: (min: number, max: number) =>
    z.number().min(min, `Must be at least ${min}`).max(max, `Must be at most ${max}`),

  // Latitude (-90 to 90)
  latitude: z
    .number()
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90"),

  // Longitude (-180 to 180)
  longitude: z
    .number()
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180"),

  // Percentage (0-100)
  percentage: z
    .number()
    .min(0, "Percentage must be between 0 and 100")
    .max(100, "Percentage must be between 0 and 100"),

  // Temperature in Fahrenheit (reasonable range)
  temperatureF: z.number().min(-50, "Temperature too low").max(150, "Temperature too high"),

  // Wind speed in MPH (reasonable range)
  windSpeedMph: z.number().min(0, "Wind speed cannot be negative").max(200, "Wind speed too high")
}

/**
 * Common date validation patterns
 */
export const DateValidation = {
  // ISO date string
  isoString: z.string().datetime("Must be a valid ISO date string"),

  // Date object
  date: z.date(),

  // Date string that can be parsed
  dateString: z.string().transform((str) => {
    const date = new Date(str)
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date format")
    }
    return date
  }),

  // Future date
  future: z.date().refine((date) => date > new Date(), "Date must be in the future"),

  // Past date
  past: z.date().refine((date) => date < new Date(), "Date must be in the past")
}

// ============================================================================
// USER INPUT VALIDATION SCHEMAS
// ============================================================================

/**
 * Place description input validation
 */
export const PlaceDescriptionSchema = z.object({
  description: StringValidation.required
    .min(1, "Place description cannot be empty")
    .max(500, "Place description must be 500 characters or less")
    .refine((desc) => desc.trim().length > 0, "Place description cannot be only whitespace")
    .transform((desc) => desc.trim())
})

/**
 * Location search input validation
 */
export const LocationSearchSchema = z.object({
  query: StringValidation.required
    .min(1, "Search query cannot be empty")
    .max(200, "Search query must be 200 characters or less")
    .transform((query) => query.trim())
})

/**
 * Coordinates input validation
 */
export const CoordinatesSchema = z.object({
  latitude: NumberValidation.latitude,
  longitude: NumberValidation.longitude
})

/**
 * Weather request validation
 */
export const WeatherRequestSchema = z.object({
  latitude: NumberValidation.latitude,
  longitude: NumberValidation.longitude,
  days: NumberValidation.range(1, 14).default(7)
})

// ============================================================================
// API REQUEST VALIDATION SCHEMAS
// ============================================================================

/**
 * Pagination parameters
 */
export const PaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: NumberValidation.range(1, 100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc")
})

/**
 * Filter parameters
 */
export const FilterSchema = z.object({
  search: z.string().optional(),
  dateFrom: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
  dateTo: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
  temperatureMin: z.number().min(-50).max(150).optional(),
  temperatureMax: z.number().min(-50).max(150).optional(),
  weatherCondition: z.string().optional(),
  location: z.string().optional()
})

/**
 * API response metadata
 */
export const ApiResponseMetadataSchema = z.object({
  timestamp: DateValidation.isoString,
  requestId: z.string().uuid(),
  version: z.string(),
  pagination: PaginationSchema.optional(),
  filters: FilterSchema.optional()
})

// ============================================================================
// SERVICE INPUT VALIDATION SCHEMAS
// ============================================================================

/**
 * LLM service input validation
 */
export const LLMInputSchema = z.object({
  prompt: StringValidation.required
    .min(1, "Prompt cannot be empty")
    .max(2000, "Prompt must be 2000 characters or less"),
  temperature: NumberValidation.range(0, 2).default(0.1),
  maxTokens: NumberValidation.range(1, 4000).default(200),
  model: z.enum(["gpt-3.5-turbo", "gpt-4", "gpt-4-turbo"]).default("gpt-3.5-turbo")
})

/**
 * Geocoding service input validation
 */
export const GeocodingInputSchema = z.object({
  address: StringValidation.required
    .min(1, "Address cannot be empty")
    .max(500, "Address must be 500 characters or less"),
  limit: NumberValidation.range(1, 10).default(1),
  countrycode: z
    .string()
    .regex(/^[a-zA-Z0-9]+$/)
    .max(2)
    .optional(),
  language: z
    .string()
    .regex(/^[a-zA-Z0-9]+$/)
    .max(5)
    .default("en")
})

/**
 * Weather service input validation
 */
export const WeatherServiceInputSchema = z.object({
  latitude: NumberValidation.latitude,
  longitude: NumberValidation.longitude,
  days: NumberValidation.range(1, 14).default(7),
  unit: z.enum(["fahrenheit", "celsius"]).default("fahrenheit"),
  timezone: z.string().optional()
})

// ============================================================================
// FILE UPLOAD VALIDATION SCHEMAS
// ============================================================================

/**
 * File upload validation
 */
export const FileUploadSchema = z.object({
  filename: z.string().max(255),
  mimetype: z
    .string()
    .regex(
      /^[a-zA-Z0-9][a-zA-Z0-9!#$&\-\^_]*\/[a-zA-Z0-9][a-zA-Z0-9!#$&\-\^_]*$/,
      "Invalid MIME type"
    ),
  size: NumberValidation.positive.max(10 * 1024 * 1024, "File size must be less than 10MB"), // 10MB limit
  encoding: z.string().optional()
})

/**
 * Image upload validation
 */
export const ImageUploadSchema = FileUploadSchema.extend({
  mimetype: z.enum(["image/jpeg", "image/png", "image/gif", "image/webp"], {
    errorMap: () => ({ message: "Must be a valid image file (JPEG, PNG, GIF, WebP)" })
  }),
  size: NumberValidation.positive.max(5 * 1024 * 1024, "Image size must be less than 5MB") // 5MB limit
})

// ============================================================================
// CONFIGURATION VALIDATION SCHEMAS
// ============================================================================

/**
 * Environment variable validation
 */
export const EnvironmentSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: NumberValidation.range(1, 65535).default(3333),
  HOST: StringValidation.required.default("0.0.0.0"),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
  API_RATE_LIMIT: NumberValidation.positive.default(100),
  API_RATE_WINDOW: NumberValidation.positive.default(60000) // 1 minute
})

/**
 * API key validation
 */
export const ApiKeyValidationSchema = z.object({
  openai: z
    .string()
    .regex(/^sk-[a-zA-Z0-9]{48}$/, "Invalid OpenAI API key format")
    .optional(),
  opencage: z
    .string()
    .min(32, "OpenCage API key too short")
    .max(64, "OpenCage API key too long")
    .optional()
})

// ============================================================================
// SECURITY VALIDATION SCHEMAS
// ============================================================================

/**
 * CORS origin validation
 */
export const CorsOriginSchema = z
  .string()
  .url("Must be a valid URL")
  .or(
    z
      .literal("*")
      .refine(
        () => process.env.NODE_ENV === "development",
        "Wildcard CORS only allowed in development"
      )
  )

/**
 * Rate limiting validation
 */
export const RateLimitSchema = z.object({
  windowMs: NumberValidation.positive.default(60000), // 1 minute
  maxRequests: NumberValidation.positive.default(100),
  skipSuccessfulRequests: z.boolean().default(false),
  skipFailedRequests: z.boolean().default(false)
})

/**
 * Request ID validation
 */
export const RequestIdSchema = z.string().uuid("Must be a valid UUID")

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

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
 * Validate input and throw detailed error if invalid
 */
export function validateInput<T>(schema: z.ZodSchema<T>, input: unknown): T {
  try {
    return schema.parse(input)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
        code: err.code
      }))

      throw new Error(`Validation failed: ${JSON.stringify(errorMessages)}`)
    }
    throw error
  }
}

/**
 * Validate input and return result with errors
 */
export function safeValidateInput<T>(
  schema: z.ZodSchema<T>,
  input: unknown
): {
  success: boolean
  data?: T
  errors?: string[]
} {
  try {
    const data = schema.parse(input)
    return { success: true, data }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((err) => `${err.path.join(".")}: ${err.message}`)
      return { success: false, errors }
    }
    return { success: false, errors: ["Unknown validation error"] }
  }
}

/**
 * Transform and validate input
 */
export function transformAndValidate<T, U>(
  schema: z.ZodSchema<T>,
  input: unknown,
  transformer: (data: T) => U
): U {
  const validated = validateInput(schema, input)
  return transformer(validated)
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

  // Strong password validation
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be less than 128 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),

  // Phone number validation (international)
  phoneNumber: z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, "Must be a valid phone number"),

  // URL validation
  url: z.string().url("Must be a valid URL"),

  // IPv4 address validation
  ipv4: z.string().ip("Must be a valid IPv4 address"),

  // IPv6 address validation
  ipv6: z.string().ip("Must be a valid IPv6 address"),

  // UUID validation
  uuid: z.string().uuid("Must be a valid UUID"),

  // Base64 validation
  base64: z.string().regex(/^[A-Za-z0-9+/]*={0,2}$/, "Must be valid base64"),

  // JSON string validation
  jsonString: z.string().transform((str, ctx) => {
    try {
      return JSON.parse(str)
    } catch {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Must be valid JSON" })
      return z.NEVER
    }
  })
}

// ============================================================================
// RE-EXPORT ZOD FOR CONVENIENCE
// ============================================================================

export { z }
