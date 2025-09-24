/**
 * Centralized error messages and constants for consistent error handling
 * across the entire application (frontend and backend)
 */

// Error message categories
export const ERROR_MESSAGES = {
  // User-facing messages (friendly, actionable)
  USER: {
    INVALID_PAGE: "You have reached an invalid page. Please try a different location.",
    LOCATION_NOT_FOUND:
      "The location you searched for was not found. Please try a different location.",
    LOCATION_NOT_APPLICABLE:
      "This location is not applicable for weather data. Please try a different location.",
    NO_WEATHER_DATA:
      "The place you searched for does not contain any weather data. Please try a different location.",
    GENERIC_ERROR: "Something went wrong. Please try again.",
    NETWORK_ERROR: "Unable to connect to the server. Please check your connection and try again.",
    VALIDATION_ERROR: "Please provide a valid location description.",
    SERVER_ERROR: "Our servers are experiencing issues. Please try again later."
  },

  // Developer-facing messages (technical, for logging)
  DEVELOPER: {
    PLACE_NOT_FOUND: "Place not found with slug",
    PLACE_CREATION_FAILED: "Failed to create place",
    WEATHER_FETCH_FAILED: "Failed to fetch weather data",
    GEOCODING_FAILED: "Failed to geocode place description",
    LLM_NORMALIZATION_FAILED: "Failed to normalize place with LLM",
    API_KEY_MISSING: "API key not found, falling back to mock implementation",
    CACHE_ERROR: "Cache operation failed",
    DATABASE_ERROR: "Database operation failed"
  },

  // HTTP status messages
  HTTP: {
    BAD_REQUEST: "Bad Request",
    UNAUTHORIZED: "Unauthorized",
    FORBIDDEN: "Forbidden",
    NOT_FOUND: "Not Found",
    INTERNAL_SERVER_ERROR: "Internal Server Error",
    SERVICE_UNAVAILABLE: "Service Unavailable"
  }
} as const

// Error codes for programmatic handling
export const ERROR_CODES = {
  // User errors
  INVALID_PAGE: "INVALID_PAGE",
  LOCATION_NOT_FOUND: "LOCATION_NOT_FOUND",
  LOCATION_NOT_APPLICABLE: "LOCATION_NOT_APPLICABLE",
  NO_WEATHER_DATA: "NO_WEATHER_DATA",
  VALIDATION_ERROR: "VALIDATION_ERROR",

  // System errors
  NETWORK_ERROR: "NETWORK_ERROR",
  SERVER_ERROR: "SERVER_ERROR",
  API_ERROR: "API_ERROR",
  DATABASE_ERROR: "DATABASE_ERROR",

  // Service-specific errors
  WEATHER_API_ERROR: "WEATHER_API_ERROR",
  GEOCODING_API_ERROR: "GEOCODING_API_ERROR",
  LLM_API_ERROR: "LLM_API_ERROR"
} as const

// Special slug constants for error handling
export const ERROR_SLUGS = {
  NO_SPECIFIC_LOCATION_FOUND: "no-specific-location-found",
  UNKNOWN: "unknown",
  NOT_APPLICABLE: "not-applicable"
} as const

// Error severity levels
export const ERROR_SEVERITY = {
  LOW: "low", // User can continue, minor issue
  MEDIUM: "medium", // User should be aware, may affect functionality
  HIGH: "high", // User cannot continue, major issue
  CRITICAL: "critical" // System failure, requires immediate attention
} as const

// Error types for TypeScript
export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES]
export type ErrorSeverity = (typeof ERROR_SEVERITY)[keyof typeof ERROR_SEVERITY]

// Standard error response interface
export interface StandardErrorResponse {
  code: ErrorCode
  message: string
  severity: ErrorSeverity
  timestamp: string
  details?: string
  retryable: boolean
}

// Error factory functions
export class ErrorFactory {
  /**
   * Create a user-friendly error message
   */
  static createUserError(code: ErrorCode, details?: string): StandardErrorResponse {
    const message = this.getUserMessage(code)
    return {
      code,
      message,
      severity: this.getSeverity(code),
      timestamp: new Date().toISOString(),
      details,
      retryable: this.isRetryable(code)
    }
  }

  /**
   * Create a developer error message (for logging)
   */
  static createDeveloperError(code: ErrorCode, details?: string): StandardErrorResponse {
    const message = this.getDeveloperMessage(code)
    return {
      code,
      message,
      severity: this.getSeverity(code),
      timestamp: new Date().toISOString(),
      details,
      retryable: this.isRetryable(code)
    }
  }

  /**
   * Get user-friendly message for error code
   */
  private static getUserMessage(code: ErrorCode): string {
    switch (code) {
      case ERROR_CODES.INVALID_PAGE:
        return ERROR_MESSAGES.USER.INVALID_PAGE
      case ERROR_CODES.LOCATION_NOT_FOUND:
        return ERROR_MESSAGES.USER.LOCATION_NOT_FOUND
      case ERROR_CODES.LOCATION_NOT_APPLICABLE:
        return ERROR_MESSAGES.USER.LOCATION_NOT_APPLICABLE
      case ERROR_CODES.NO_WEATHER_DATA:
        return ERROR_MESSAGES.USER.NO_WEATHER_DATA
      case ERROR_CODES.VALIDATION_ERROR:
        return ERROR_MESSAGES.USER.VALIDATION_ERROR
      case ERROR_CODES.NETWORK_ERROR:
        return ERROR_MESSAGES.USER.NETWORK_ERROR
      case ERROR_CODES.SERVER_ERROR:
        return ERROR_MESSAGES.USER.SERVER_ERROR
      default:
        return ERROR_MESSAGES.USER.GENERIC_ERROR
    }
  }

  /**
   * Get developer message for error code
   */
  private static getDeveloperMessage(code: ErrorCode): string {
    switch (code) {
      case ERROR_CODES.WEATHER_API_ERROR:
        return ERROR_MESSAGES.DEVELOPER.WEATHER_FETCH_FAILED
      case ERROR_CODES.GEOCODING_API_ERROR:
        return ERROR_MESSAGES.DEVELOPER.GEOCODING_FAILED
      case ERROR_CODES.LLM_API_ERROR:
        return ERROR_MESSAGES.DEVELOPER.LLM_NORMALIZATION_FAILED
      case ERROR_CODES.SERVER_ERROR:
        return ERROR_MESSAGES.DEVELOPER.PLACE_CREATION_FAILED
      default:
        return ERROR_MESSAGES.DEVELOPER.PLACE_CREATION_FAILED
    }
  }

  /**
   * Get severity level for error code
   */
  private static getSeverity(code: ErrorCode): ErrorSeverity {
    switch (code) {
      case ERROR_CODES.INVALID_PAGE:
      case ERROR_CODES.LOCATION_NOT_FOUND:
        return ERROR_SEVERITY.LOW
      case ERROR_CODES.LOCATION_NOT_APPLICABLE:
      case ERROR_CODES.NO_WEATHER_DATA:
        return ERROR_SEVERITY.MEDIUM
      case ERROR_CODES.NETWORK_ERROR:
      case ERROR_CODES.VALIDATION_ERROR:
        return ERROR_SEVERITY.HIGH
      case ERROR_CODES.SERVER_ERROR:
      case ERROR_CODES.API_ERROR:
      case ERROR_CODES.DATABASE_ERROR:
        return ERROR_SEVERITY.CRITICAL
      default:
        return ERROR_SEVERITY.MEDIUM
    }
  }

  /**
   * Check if error is retryable
   */
  private static isRetryable(code: ErrorCode): boolean {
    switch (code) {
      case ERROR_CODES.NETWORK_ERROR:
      case ERROR_CODES.SERVER_ERROR:
      case ERROR_CODES.API_ERROR:
        return true
      case ERROR_CODES.INVALID_PAGE:
      case ERROR_CODES.LOCATION_NOT_FOUND:
      case ERROR_CODES.LOCATION_NOT_APPLICABLE:
      case ERROR_CODES.VALIDATION_ERROR:
        return false
      default:
        return false
    }
  }
}

// Utility functions for common error patterns
export const ErrorUtils = {
  /**
   * Check if error is a known error slug
   */
  isErrorSlug: (slug: string): boolean => {
    return Object.values(ERROR_SLUGS).includes(slug as any)
  },

  /**
   * Get error code from slug
   */
  getErrorCodeFromSlug: (slug: string): ErrorCode | null => {
    switch (slug) {
      case ERROR_SLUGS.NO_SPECIFIC_LOCATION_FOUND:
      case ERROR_SLUGS.UNKNOWN:
        return ERROR_CODES.LOCATION_NOT_FOUND
      case ERROR_SLUGS.NOT_APPLICABLE:
        return ERROR_CODES.LOCATION_NOT_APPLICABLE
      default:
        return null
    }
  },

  /**
   * Format error for logging
   */
  formatForLogging: (error: Error, context?: string): string => {
    const timestamp = new Date().toISOString()
    const contextStr = context ? ` [${context}]` : ""
    return `${timestamp}${contextStr}: ${error.message}`
  },

  /**
   * Check if HTTP status indicates retryable error
   */
  isRetryableHttpStatus: (status: number): boolean => {
    return status >= 500 || status === 429 || status === 408
  }
}
