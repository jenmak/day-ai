/**
 * Secure API Key Management
 *
 * This module provides secure access to API keys with proper validation,
 * masking, and error handling to prevent exposure.
 */

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

  switch (type) {
    case "openai":
      // OpenAI API keys start with 'sk-' and are 51 characters long
      return apiKey.startsWith("sk-") && apiKey.length === 51
    case "opencage":
      // OpenCage API keys are typically 32 characters long
      return apiKey.length >= 32 && /^[a-zA-Z0-9]+$/.test(apiKey)
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

    // Validate and store keys
    this.keys = {
      openai: openaiKey || "",
      opencage: opencageKey || ""
    }

    // Create status object with masked keys
    this.status = {
      openai: {
        available: validateApiKey(this.keys.openai, "openai"),
        masked: maskApiKey(this.keys.openai)
      },
      opencage: {
        available: validateApiKey(this.keys.opencage, "opencage"),
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
      console.warn("⚠️  OpenAI API key missing - LLM service will use mock implementation")
    }

    if (!this.status.opencage.available) {
      console.warn("⚠️  OpenCage API key missing - Geocoding service will use mock implementation")
    }
  }

  /**
   * Get OpenAI API key (secure access)
   */
  getOpenAIKey(): string {
    if (!this.keys?.openai) {
      throw new Error("OpenAI API key not available")
    }

    if (!this.status?.openai.available) {
      throw new Error("OpenAI API key is invalid or missing")
    }

    return this.keys.openai
  }

  /**
   * Get OpenCage API key (secure access)
   */
  getOpenCageKey(): string {
    if (!this.keys?.opencage) {
      throw new Error("OpenCage API key not available")
    }

    if (!this.status?.opencage.available) {
      throw new Error("OpenCage API key is invalid or missing")
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
    console.warn(`${fallbackMessage}: ${error instanceof Error ? error.message : "Unknown error"}`)
    return null
  }

  return null
}
