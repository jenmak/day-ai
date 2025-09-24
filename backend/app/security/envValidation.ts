/**
 * Environment Variable Validation
 *
 * This module validates environment variables and ensures
 * sensitive data is not exposed in logs or error messages.
 */

import { apiKeys } from "./apiKeys"

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

/**
 * Safe logging of environment variables
 */
export function logEnvVar(key: string, value: string): void {
  const maskedValue = maskSensitiveEnvVar(key, value)
  console.log(`  ${key}: ${maskedValue}`)
}

/**
 * Validate environment variables for security
 */
export function validateEnvironmentVariables(): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Check for required environment variables
  const requiredVars = ["NODE_ENV"]

  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      errors.push(`Required environment variable ${varName} is missing`)
    }
  }

  // Check for potentially sensitive variables in logs
  const envKeys = Object.keys(process.env)
  const suspiciousVars = envKeys.filter(
    (key) =>
      key.includes("PASSWORD") ||
      key.includes("SECRET") ||
      key.includes("KEY") ||
      key.includes("TOKEN")
  )

  for (const varName of suspiciousVars) {
    if (!SENSITIVE_VARS.includes(varName)) {
      warnings.push(
        `Potentially sensitive variable ${varName} found - consider adding to SENSITIVE_VARS list`
      )
    }
  }

  // Validate API keys
  const apiKeyValidation = apiKeys.validateKeys()
  if (!apiKeyValidation.isValid) {
    warnings.push(...apiKeyValidation.errors)
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Log environment configuration safely
 */
export function logEnvironmentConfig(): void {
  console.log("🌍 Environment Configuration:")

  // Log non-sensitive environment variables
  const safeVars = ["NODE_ENV", "PORT", "HOST", "VITE_API_URL", "VITE_FRONTEND_URL"]

  for (const varName of safeVars) {
    const value = process.env[varName]
    if (value !== undefined) {
      logEnvVar(varName, value)
    }
  }

  // Log API key status (already masked by ApiKeyManager)
  console.log("🔐 API Key Status:")
  const status = apiKeys.getStatus()
  console.log(
    `  OpenAI: ${status.openai.available ? "✅ Available" : "❌ Missing/Invalid"} (${status.openai.masked})`
  )
  console.log(
    `  OpenCage: ${status.opencage.available ? "✅ Available" : "❌ Missing/Invalid"} (${status.opencage.masked})`
  )
}

/**
 * Check for environment variable leaks
 */
export function checkForEnvLeaks(): string[] {
  const leaks: string[] = []

  // Check if sensitive variables are being logged anywhere
  const envString = JSON.stringify(process.env)
  for (const sensitiveVar of SENSITIVE_VARS) {
    if (envString.includes(process.env[sensitiveVar] || "")) {
      leaks.push(`Potential leak detected: ${sensitiveVar} found in environment string`)
    }
  }

  return leaks
}

/**
 * Sanitize error messages to remove sensitive data
 */
export function sanitizeErrorMessage(error: unknown): string {
  if (typeof error === "string") {
    let sanitized = error

    // Remove potential API keys from error messages
    for (const sensitiveVar of SENSITIVE_VARS) {
      const value = process.env[sensitiveVar]
      if (value && sanitized.includes(value)) {
        sanitized = sanitized.replace(value, maskSensitiveEnvVar(sensitiveVar, value))
      }
    }

    return sanitized
  }

  if (error instanceof Error) {
    return sanitizeErrorMessage(error.message)
  }

  return "Unknown error occurred"
}
