/**
 * Secure API Key Management
 *
 * This module provides secure access to API keys with proper validation,
 * masking, and error handling to prevent exposure.
 */

/**
 * Custom error class for API key issues
 */
export class ApiKeyError extends Error {
  public readonly code: string
  public readonly missingKeys: string[]
  public readonly helpMessage: string

  constructor(message: string, code: string, missingKeys: string[] = []) {
    super(message)
    this.name = "ApiKeyError"
    this.code = code
    this.missingKeys = missingKeys
    this.helpMessage = this.generateHelpMessage()
  }

  private generateHelpMessage(): string {
    if (this.missingKeys.length === 0) return ""

    let help = "\n\n🔧 To fix this issue:\n"

    if (this.missingKeys.includes("OPENAI_API_KEY")) {
      help +=
        "1. Get your OpenAI API key from: https://platform.openai.com/api-keys\n"
      help += "2. Set OPENAI_API_KEY in your environment variables\n"
    }

    if (this.missingKeys.includes("OPENCAGE_API_KEY")) {
      help +=
        "1. Get your OpenCage API key from: https://opencagedata.com/api\n"
      help += "2. Set OPENCAGE_API_KEY in your environment variables\n"
    }

    help += "\nFor Railway deployment:\n"
    help += "- Go to your Railway project dashboard\n"
    help += "- Navigate to Variables tab\n"
    help += "- Add the missing environment variables\n"

    return help
  }
}

interface ApiKeyConfig {
  openai: string
  opencage: string
}

interface ApiKeyStatus {
  openai: {
    available: boolean
    masked: string
  }
  opencage: {
    available: boolean
    masked: string
  }
}

/**
 * Mask API key for logging purposes
 * Shows only first 4 and last 4 characters
 */
function maskApiKey(apiKey: string): string {
  if (!apiKey || apiKey.length < 8) {
    return "***MASKED***"
  }

  const start = apiKey.substring(0, 4)
  const end = apiKey.substring(apiKey.length - 4)
  const middle = "*".repeat(Math.max(0, apiKey.length - 8))

  return `${start}${middle}${end}`
}

/**
 * Validate API key format
 */
function validateApiKey(apiKey: string, type: "openai" | "opencage"): boolean {
  if (!apiKey || typeof apiKey !== "string") {
    return false
  }

  // Remove any whitespace
  const cleanKey = apiKey.trim()

  if (cleanKey.length === 0) {
    return false
  }

  switch (type) {
    case "openai":
      // OpenAI API keys start with 'sk-' and are typically 51+ characters long
      // Support both old format (sk-xxx...xxx) and new format (sk-proj-xxx...xxx)
      return (
        (cleanKey.startsWith("sk-") && cleanKey.length >= 40) ||
        (cleanKey.startsWith("sk-proj-") && cleanKey.length >= 50)
      )
    case "opencage":
      // OpenCage API keys are typically 32+ characters long and alphanumeric
      return cleanKey.length >= 20 && /^[a-zA-Z0-9]+$/.test(cleanKey)
    default:
      return false
  }
}

/**
 * Secure API Key Manager
 */
export class ApiKeyManager {
  private static instance: ApiKeyManager
  private keys: ApiKeyConfig | null = null
  private status: ApiKeyStatus | null = null

  private constructor() {
    this.initializeKeys()
  }

  /**
   * Get singleton instance
   */
  static getInstance(): ApiKeyManager {
    if (!ApiKeyManager.instance) {
      ApiKeyManager.instance = new ApiKeyManager()
    }
    return ApiKeyManager.instance
  }

  /**
   * Initialize API keys with validation
   */
  private initializeKeys(): void {
    const openaiKey = process.env.OPENAI_API_KEY
    const opencageKey = process.env.OPENCAGE_API_KEY

    // Debug logging (only in development or when debugging)
    if (process.env.NODE_ENV !== "production" || process.env.DEBUG_API_KEYS) {
      console.log("🔍 API Key Debug Info:")
      console.log("  OPENAI_API_KEY exists:", !!openaiKey)
      console.log("  OPENAI_API_KEY length:", openaiKey?.length || 0)
      console.log(
        "  OPENAI_API_KEY starts with sk-:",
        openaiKey?.startsWith("sk-") || false
      )
      console.log("  OPENCAGE_API_KEY exists:", !!opencageKey)
      console.log("  OPENCAGE_API_KEY length:", opencageKey?.length || 0)
    }

    // During build time, don't validate API keys as they may not be available
    if (process.env.NODE_ENV === "production" && !openaiKey && !opencageKey) {
      console.log(
        "⚠️  API keys not available during build - will validate at runtime"
      )
    }

    // Validate and store keys
    this.keys = {
      openai: openaiKey || "",
      opencage: opencageKey || ""
    }

    // Create status object with masked keys
    // During build time, don't fail if keys are missing
    const isBuildTime =
      process.env.NODE_ENV === "production" && !openaiKey && !opencageKey

    this.status = {
      openai: {
        available: isBuildTime
          ? true
          : validateApiKey(this.keys.openai, "openai"),
        masked: maskApiKey(this.keys.openai)
      },
      opencage: {
        available: isBuildTime
          ? true
          : validateApiKey(this.keys.opencage, "opencage"),
        masked: maskApiKey(this.keys.opencage)
      }
    }

    // Log status (with masked keys)
    this.logApiKeyStatus()
  }

  /**
   * Log API key status (with masked keys for security)
   */
  private logApiKeyStatus(): void {
    if (!this.status) return

    console.log("🔐 API Key Status:")
    console.log(
      `  OpenAI: ${this.status.openai.available ? "✅ Available" : "❌ Missing/Invalid"} (${this.status.openai.masked})`
    )
    console.log(
      `  OpenCage: ${this.status.opencage.available ? "✅ Available" : "❌ Missing/Invalid"} (${this.status.opencage.masked})`
    )

    if (!this.status.openai.available) {
      console.warn(
        "⚠️  OpenAI API key missing - LLM service will use mock implementation"
      )
    }

    if (!this.status.opencage.available) {
      console.warn(
        "⚠️  OpenCage API key missing - Geocoding service will use mock implementation"
      )
    }
  }

  /**
   * Get OpenAI API key (secure access)
   */
  getOpenAIKey(): string {
    if (!this.keys?.openai) {
      const missingKeys = this.getMissingKeys()
      throw new ApiKeyError(
        "OpenAI API key not available",
        "OPENAI_API_KEY_MISSING",
        missingKeys
      )
    }

    if (!this.status?.openai.available) {
      const missingKeys = this.getMissingKeys()
      throw new ApiKeyError(
        "OpenAI API key is invalid or missing",
        "OPENAI_API_KEY_INVALID",
        missingKeys
      )
    }

    return this.keys.openai
  }

  /**
   * Get OpenCage API key (secure access)
   */
  getOpenCageKey(): string {
    if (!this.keys?.opencage) {
      const missingKeys = this.getMissingKeys()
      throw new ApiKeyError(
        "OpenCage API key not available",
        "OPENCAGE_API_KEY_MISSING",
        missingKeys
      )
    }

    if (!this.status?.opencage.available) {
      const missingKeys = this.getMissingKeys()
      throw new ApiKeyError(
        "OpenCage API key is invalid or missing",
        "OPENCAGE_API_KEY_INVALID",
        missingKeys
      )
    }

    return this.keys.opencage
  }

  /**
   * Check if OpenAI API key is available
   */
  isOpenAIAvailable(): boolean {
    return this.status?.openai.available || false
  }

  /**
   * Check if OpenCage API key is available
   */
  isOpenCageAvailable(): boolean {
    return this.status?.opencage.available || false
  }

  /**
   * Get API key status (with masked keys)
   */
  getStatus(): ApiKeyStatus {
    if (!this.status) {
      throw new Error("API keys not initialized")
    }

    return {
      openai: {
        available: this.status.openai.available,
        masked: this.status.openai.masked
      },
      opencage: {
        available: this.status.opencage.available,
        masked: this.status.opencage.masked
      }
    }
  }

  /**
   * Get list of missing API keys
   */
  private getMissingKeys(): string[] {
    const missing: string[] = []

    if (!this.keys?.openai || !this.status?.openai.available) {
      missing.push("OPENAI_API_KEY")
    }

    if (!this.keys?.opencage || !this.status?.opencage.available) {
      missing.push("OPENCAGE_API_KEY")
    }

    return missing
  }

  /**
   * Validate all API keys
   */
  validateKeys(): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!this.status) {
      errors.push("API keys not initialized")
      return { isValid: false, errors }
    }

    if (!this.status.openai.available) {
      errors.push("OpenAI API key is missing or invalid")
    }

    if (!this.status.opencage.available) {
      errors.push("OpenCage API key is missing or invalid")
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * Refresh API keys (useful for testing or key rotation)
   */
  refreshKeys(): void {
    this.initializeKeys()
  }
}

/**
 * Export singleton instance
 */
export const apiKeys = ApiKeyManager.getInstance()

/**
 * Utility functions for backward compatibility
 */
export const getOpenAIKey = () => apiKeys.getOpenAIKey()
export const getOpenCageKey = () => apiKeys.getOpenCageKey()
export const isOpenAIAvailable = () => apiKeys.isOpenAIAvailable()
export const isOpenCageAvailable = () => apiKeys.isOpenCageAvailable()

/**
 * Secure API key access with fallback
 */
export function getApiKeyWithFallback(
  type: "openai" | "opencage",
  fallbackMessage: string
): string | null {
  try {
    if (type === "openai") {
      return apiKeys.getOpenAIKey()
    } else if (type === "opencage") {
      return apiKeys.getOpenCageKey()
    }
  } catch (error) {
    console.warn(
      `${fallbackMessage}: ${error instanceof Error ? error.message : "Unknown error"}`
    )
    return null
  }

  return null
}
