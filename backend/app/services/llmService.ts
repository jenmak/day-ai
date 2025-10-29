import {
  PlaceNormalization,
  PlaceNormalizationSchema
} from "../schemas"
import OpenAI from "openai"
import { MOCK_MAPPINGS } from "../consts"
import { DESCRIPTION_TO_NORMALIZED_PLACE_PROMPT } from "../prompts/descriptionToNormalizedPlacePrompt"
import { apiKeys, getApiKeyWithFallback } from "../security/apiKeys"

export class LLMService {
  /**
   * Normalize a place description using OpenAI LLM
   * Converts descriptions like "Gotham City" to "New York, NY"
   * Also handles zip codes and postal codes
   */
  static async normalizePlace(
    description: string
  ): Promise<PlaceNormalization> {
    try {
      // Check if input is a zip code or postal code
      if (this.isZipCodeOrPostalCode(description)) {
        console.log(`Detected zip/postal code: ${description}`)
        return this.handleZipCodeOrPostalCode(description)
      }

      // Check if OpenAI API key is available
      if (!apiKeys.isOpenAIAvailable()) {
        console.warn(
          "OpenAI API key not available, falling back to mock implementation"
        )
        const mockResponse = this.getMockNormalization(description)
        return PlaceNormalizationSchema.parse(mockResponse)
      }

      // Use OpenAI API for place normalization
      const openaiResponse =
        await this.convertDescriptionToNormalizedPlace(description)
      return PlaceNormalizationSchema.parse(openaiResponse)
    } catch (error) {
      throw new Error("Failed to normalize place from description: " + error)
    }
  }

  /**
   * Mock implementation for fallback when OpenAI API is unavailable
   * Used when API key is missing or API calls fail
   */
  private static getMockNormalization(description: string): PlaceNormalization {
    const lowerDescription = description.toLowerCase().trim()

    // Check for exact matches first
    if (MOCK_MAPPINGS[lowerDescription]) {
      return MOCK_MAPPINGS[lowerDescription]
    }

    // Check for partial matches
    for (const [key, value] of Object.entries(MOCK_MAPPINGS)) {
      if (lowerDescription.includes(key) || key.includes(lowerDescription)) {
        return {
          ...value,
          confidence: value.confidence * 0.8 // Reduce confidence for partial matches
        }
      }
    }

    // If no match found in mock mappings, return a special case
    return {
      normalizedPlace: "No specific location found",
      slug: "no-specific-location-found",
      confidence: 0.0,
      reasoning: "Could not identify a specific location from the description"
    }
  }

  private static async createOpenAICompletion(
    prompt: string
  ): Promise<PlaceNormalization> {
    const apiKey = getApiKeyWithFallback(
      "openai",
      "Failed to get OpenAI API key"
    )
    if (!apiKey) {
      throw new Error("OpenAI API key not available")
    }

    const openai = new OpenAI({
      apiKey: apiKey
    })

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a place normalization expert. Always respond with valid JSON."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 200
      })

      const response = completion.choices[0]?.message?.content
      if (!response) {
        throw new Error("No response from OpenAI")
      }

      const parsed = JSON.parse(response)
      return PlaceNormalizationSchema.parse(parsed)
    } catch (error) {
      console.error("OpenAI API error:", error)
      throw new Error("Failed to normalize place with OpenAI")
    }
  }

  /**
   * Production method for calling OpenAI API for description to normalized place.
   * Converts descriptions like "Gotham City" to "New York, NY".
   */
  private static async convertDescriptionToNormalizedPlace(
    description: string
  ): Promise<PlaceNormalization> {
    const prompt = DESCRIPTION_TO_NORMALIZED_PLACE_PROMPT(description)
    return this.createOpenAICompletion(prompt)
  }

  /**
   * Check if input is a zip code or postal code
   */
  private static isZipCodeOrPostalCode(input: string): boolean {
    const trimmed = input.trim()

    // US zip code (5 digits or 5+4 format)
    const isUSZipCode = /^\d{5}(-\d{4})?$/.test(trimmed)

    // International postal code (alphanumeric with spaces and hyphens, contains letters)
    const isInternationalPostalCode = /^[a-zA-Z0-9\s-]{2,10}$/.test(trimmed) && /[a-zA-Z]/.test(trimmed)

    return isUSZipCode || isInternationalPostalCode
  }

  /**
   * Handle zip code or postal code input
   * For zip codes, we'll let the geocoding service handle the conversion
   * For postal codes, we'll use the LLM to convert to a location
   */
  private static async handleZipCodeOrPostalCode(
    input: string
  ): Promise<PlaceNormalization> {
    const trimmed = input.trim()

    // US zip code - let geocoding service handle it
    if (/^\d{5}(-\d{4})?$/.test(trimmed)) {
      return {
        normalizedPlace: trimmed, // Pass zip code directly to geocoding service
        slug: `zip-${trimmed.replace('-', '')}`, // Create slug from zip code
        confidence: 1.0, // High confidence for zip codes
        reasoning: "US zip code detected, will be geocoded directly"
      }
    }

    // International postal code - use LLM to convert to location
    if (apiKeys.isOpenAIAvailable()) {
      try {
        const prompt = this.createPostalCodePrompt(trimmed)
        const response = await this.createOpenAICompletion(prompt)
        return response
      } catch (error) {
        console.error("Error processing postal code with LLM:", error)
        // Fallback to mock response
        return this.getMockPostalCodeNormalization(trimmed)
      }
    } else {
      // Fallback to mock response when OpenAI is not available
      return this.getMockPostalCodeNormalization(trimmed)
    }
  }

  /**
   * Create prompt for international postal code conversion
   */
  private static createPostalCodePrompt(postalCode: string): string {
    return `Convert this postal code to a normalized place format.

Postal code: "${postalCode}"

Please respond with a JSON object containing:
- normalizedPlace: The standardized place (e.g., "London, UK" or "Toronto, ON, Canada")
- slug: A URL-friendly slug (e.g., "london-uk" or "toronto-on-canada")
- confidence: A number between 0 and 1 indicating your confidence
- reasoning: Brief explanation of your choice

Examples:
- "SW1A 1AA" → {"normalizedPlace": "London, UK", "slug": "london-uk", "confidence": 0.95, "reasoning": "SW1A 1AA is a London postal code"}
- "M5V 3A8" → {"normalizedPlace": "Toronto, ON, Canada", "slug": "toronto-on-canada", "confidence": 0.9, "reasoning": "M5V 3A8 is a Toronto postal code"}

Respond only with valid JSON:`
  }

  /**
   * Mock implementation for postal code normalization
   */
  private static getMockPostalCodeNormalization(postalCode: string): PlaceNormalization {
    // Simple mock for common postal codes
    const mockMappings: Record<string, PlaceNormalization> = {
      "SW1A 1AA": {
        normalizedPlace: "London, UK",
        slug: "london-uk",
        confidence: 0.95,
        reasoning: "SW1A 1AA is a London postal code"
      },
      "M5V 3A8": {
        normalizedPlace: "Toronto, ON, Canada",
        slug: "toronto-on-canada",
        confidence: 0.9,
        reasoning: "M5V 3A8 is a Toronto postal code"
      },
      "10001": {
        normalizedPlace: "New York, NY",
        slug: "new-york-ny",
        confidence: 0.95,
        reasoning: "10001 is a New York City zip code"
      }
    }

    if (mockMappings[postalCode]) {
      return mockMappings[postalCode]
    }

    // Default fallback
    return {
      normalizedPlace: postalCode,
      slug: `postal-${postalCode.toLowerCase().replace(/\s+/g, '-')}`,
      confidence: 0.5,
      reasoning: "Postal code detected but not in mock database"
    }
  }
}
