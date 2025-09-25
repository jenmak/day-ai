import OpenAI from "openai"
import { MOCK_MAPPINGS } from "../consts"
import { DESCRIPTION_TO_NORMALIZED_PLACE_PROMPT } from "../prompts/descriptionToNormalizedPlacePrompt"
import { PlaceNormalizationSchema } from "../schemas"
import { apiKeys, getApiKeyWithFallback } from "../security/apiKeys"
import { PlaceNormalization } from "../types"

export class LLMService {
  /**
   * Normalize a place description using OpenAI LLM
   * Converts descriptions like "Gotham City" to "New York, NY"
   */
  static async normalizePlace(description: string): Promise<PlaceNormalization> {
    try {
      // Check if OpenAI API key is available
      if (!apiKeys.isOpenAIAvailable()) {
        console.warn("OpenAI API key not available, falling back to mock implementation")
        const mockResponse = this.getMockNormalization(description)
        return PlaceNormalizationSchema.parse(mockResponse)
      }

      // Use OpenAI API for place normalization
      const openaiResponse = await this.convertDescriptionToNormalizedPlace(description)
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

  private static async createOpenAICompletion(prompt: string): Promise<PlaceNormalization> {
    const apiKey = getApiKeyWithFallback("openai", "Failed to get OpenAI API key")
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
            content: "You are a place normalization expert. Always respond with valid JSON."
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
}
