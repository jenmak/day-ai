/**
 * Environment Variable Validation
 *
 * This module validates environment variables and ensures
 * sensitive data is not exposed in logs or error messages.
 */

interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

/**
 * Sensitive environment variables that should never be logged
 */
const SENSITIVE_VARS = [
  "OPENAI_API_KEY",
  "OPENCAGE_API_KEY",
  "DATABASE_URL",
  "JWT_SECRET",
  "SESSION_SECRET",
  "ENCRYPTION_KEY"
]

/**
 * Mask sensitive values in environment variables
 */
export function maskSensitiveEnvVar(key: string, value: string): string {
  if (SENSITIVE_VARS.includes(key)) {
    if (!value || value.length < 8) {
      return "***MASKED***"
    }

    const start = value.substring(0, 4)
    const end = value.substring(value.length - 4)
    const middle = "*".repeat(Math.max(0, value.length - 8))

    return `${start}${middle}${end}`
  }

  return value
}
