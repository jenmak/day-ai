import { z } from "zod"
import OpenAI from "openai"
import { MOCK_MAPPINGS, OPENAI_API_KEY } from "../consts/PlaceConsts"

// LLM Response Schema
const PlaceNormalizationSchema = z.object({
  slug: z.string(),
  placeNormalized: z.string(),
  confidence: z.number().min(0).max(1),
  reasoning: z.string().optional()
})

export type PlaceNormalization = z.infer<typeof PlaceNormalizationSchema>

export class LLMService {
  /**
   * Normalize a location description using OpenAI LLM
   * Converts descriptions like "Gotham City" to "New York, NY"
   */
  static async normalizePlace(description: string): Promise<PlaceNormalization> {
    try {
      // Check if OpenAI API key is available
      if (!OPENAI_API_KEY) {
        console.warn("OpenAI API key not found, falling back to mock implementation")
        const mockResponse = this.getMockNormalization(description)
        return PlaceNormalizationSchema.parse(mockResponse)
      }

      // Use OpenAI API for location normalization
      const openaiResponse = await this.convertDescriptionToNormalizedPlace(description)
      return PlaceNormalizationSchema.parse(openaiResponse)
    } catch (error) {
      throw new Error("Failed to normalize location from description: " + error)
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

    // If no match found in mock mappings, throw an error
    throw new Error('Description not found.')
  }

  private static async createOpenAICompletion(prompt: string): Promise<PlaceNormalization> {
    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
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
   * Production method for calling OpenAI API for description to normalized location.
   * Converts descriptions like "Gotham City" to "New York, NY".
   */
  private static async convertDescriptionToNormalizedPlace(description: string): Promise<PlaceNormalization> {
    const prompt = `Convert this place description to a normalized format with city and state/country.

Place description: "${description}"

Please respond with a JSON object containing:
- normalizedPlace: The standardized location (e.g., "New York, NY" or "London, UK")
- slug: A URL-friendly slug (e.g., "new-york-ny" or "london-uk")
- confidence: A number between 0 and 1 indicating your confidence
- reasoning: Brief explanation of your choice

Examples:
- "Gotham City" → {"normalizedPlace": "New York, NY", "slug": "new-york-ny", "confidence": 0.95, "reasoning": "Gotham City is commonly associated with New York City"}
- "The Big Apple" → {"normalizedPlace": "New York, NY", "slug": "new-york-ny", "confidence": 0.98, "reasoning": "The Big Apple is a well-known nickname for New York City"}
- "Home of Harvard" → {"normalizedPlace": "Cambridge, MA", "slug": "cambridge-ma", "confidence": 0.95, "reasoning": "Harvard University is located in Cambridge, Massachusetts"}
- "Springfield" → {"normalizedPlace": "Springfield, IL", "slug": "springfield-il", "confidence": 0.85, "reasoning": "Springfield could refer to multiple cities, defaulting to Illinois state capital"}

Respond only with valid JSON:`

    return this.createOpenAICompletion(prompt)
  }
}
