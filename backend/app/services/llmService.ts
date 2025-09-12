import { z } from "zod"
import OpenAI from "openai"

// LLM Response Schema
const LocationNormalizationSchema = z.object({
  normalizedLocation: z.string(),
  confidence: z.number().min(0).max(1),
  reasoning: z.string().optional()
})

export type LocationNormalization = z.infer<typeof LocationNormalizationSchema>

export class LLMService {
  /**
   * Normalize a location description using OpenAI LLM
   * Converts descriptions like "Gotham City" to "New York, NY"
   */
  static async normalizeLocation(description: string): Promise<LocationNormalization> {
    try {
      // Check if OpenAI API key is available
      if (!import.meta.env.OPENAI_API_KEY) {
        console.warn("OpenAI API key not found, falling back to mock implementation")
        const mockResponse = this.getMockNormalization(description)
        return LocationNormalizationSchema.parse(mockResponse)
      }

      // Use OpenAI API for location normalization
      const openaiResponse = await this.callOpenAI(description)
      return LocationNormalizationSchema.parse(openaiResponse)
    } catch (error) {
      console.error("Error normalizing location:", error)
      
      // Fallback to mock implementation if OpenAI fails
      console.warn("OpenAI API failed, falling back to mock implementation")
      try {
        const mockResponse = this.getMockNormalization(description)
        return LocationNormalizationSchema.parse(mockResponse)
      } catch (mockError) {
        console.error("Mock implementation also failed:", mockError)
        throw new Error("Failed to normalize location description")
      }
    }
  }

  /**
   * Mock implementation for fallback when OpenAI API is unavailable
   * Used when API key is missing or API calls fail
   */
  private static getMockNormalization(description: string): LocationNormalization {
    const lowerDescription = description.toLowerCase().trim()
    
    // Mock mappings for common fictional/descriptive locations
    const mockMappings: Record<string, LocationNormalization> = {
      "gotham city": {
        normalizedLocation: "New York, NY",
        confidence: 0.95,
        reasoning: "Gotham City is commonly associated with New York City in popular culture"
      },
      "metropolis": {
        normalizedLocation: "New York, NY", 
        confidence: 0.90,
        reasoning: "Metropolis is often depicted as New York City in Superman comics"
      },
      "springfield": {
        normalizedLocation: "Springfield, IL",
        confidence: 0.85,
        reasoning: "Springfield could refer to multiple cities, defaulting to Illinois state capital"
      },
      "home of the school that's better than yale": {
        normalizedLocation: "Cambridge, MA",
        confidence: 0.95,
        reasoning: "This refers to Harvard University in Cambridge, Massachusetts"
      },
      "the big apple": {
        normalizedLocation: "New York, NY",
        confidence: 0.98,
        reasoning: "The Big Apple is a well-known nickname for New York City"
      },
      "la la land": {
        normalizedLocation: "Los Angeles, CA",
        confidence: 0.90,
        reasoning: "La La Land is a nickname for Los Angeles"
      },
      "the windy city": {
        normalizedLocation: "Chicago, IL",
        confidence: 0.95,
        reasoning: "The Windy City is a nickname for Chicago"
      },
      "the city of angels": {
        normalizedLocation: "Los Angeles, CA",
        confidence: 0.90,
        reasoning: "The City of Angels is a nickname for Los Angeles"
      },
      "the city that never sleeps": {
        normalizedLocation: "New York, NY",
        confidence: 0.95,
        reasoning: "The City That Never Sleeps is a nickname for New York City"
      },
      "the emerald city": {
        normalizedLocation: "Seattle, WA",
        confidence: 0.85,
        reasoning: "The Emerald City is a nickname for Seattle"
      },
      "the city of brotherly love": {
        normalizedLocation: "Philadelphia, PA",
        confidence: 0.90,
        reasoning: "The City of Brotherly Love is a nickname for Philadelphia"
      },
      "the mile high city": {
        normalizedLocation: "Denver, CO",
        confidence: 0.90,
        reasoning: "The Mile High City is a nickname for Denver"
      },
      "the motor city": {
        normalizedLocation: "Detroit, MI",
        confidence: 0.90,
        reasoning: "The Motor City is a nickname for Detroit"
      },
      "the music city": {
        normalizedLocation: "Nashville, TN",
        confidence: 0.90,
        reasoning: "The Music City is a nickname for Nashville"
      },
      "the queen city": {
        normalizedLocation: "Charlotte, NC",
        confidence: 0.80,
        reasoning: "The Queen City is a nickname for Charlotte"
      },
      "the space city": {
        normalizedLocation: "Houston, TX",
        confidence: 0.90,
        reasoning: "The Space City is a nickname for Houston"
      },
      "the alamo city": {
        normalizedLocation: "San Antonio, TX",
        confidence: 0.90,
        reasoning: "The Alamo City is a nickname for San Antonio"
      },
      "the valley of the sun": {
        normalizedLocation: "Phoenix, AZ",
        confidence: 0.85,
        reasoning: "The Valley of the Sun is a nickname for Phoenix"
      },
      "the gateway to the west": {
        normalizedLocation: "St. Louis, MO",
        confidence: 0.85,
        reasoning: "The Gateway to the West is a nickname for St. Louis"
      }
    }

    // Check for exact matches first
    if (mockMappings[lowerDescription]) {
      return mockMappings[lowerDescription]
    }

    // Check for partial matches
    for (const [key, value] of Object.entries(mockMappings)) {
      if (lowerDescription.includes(key) || key.includes(lowerDescription)) {
        return {
          ...value,
          confidence: value.confidence * 0.8 // Reduce confidence for partial matches
        }
      }
    }

    // If no match found, try to extract city/state from the description
    const cityStateMatch = description.match(/([A-Za-z\s]+),\s*([A-Z]{2})/)
    if (cityStateMatch) {
      return {
        normalizedLocation: `${cityStateMatch[1].trim()}, ${cityStateMatch[2]}`,
        confidence: 0.95,
        reasoning: "Extracted city and state from description"
      }
    }

    // Default fallback - clean up the description
    const cleaned = description
      .replace(/[^\w\s,]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
    
    return {
      normalizedLocation: cleaned,
      confidence: 0.5,
      reasoning: "No specific mapping found, using cleaned description"
    }
  }

  /**
   * Production method for calling OpenAI API
   */
  private static async callOpenAI(description: string): Promise<LocationNormalization> {
    const openai = new OpenAI({
      apiKey: import.meta.env.OPENAI_API_KEY,
    })

    const prompt = `Convert this location description to a normalized format with city and state/country.

Location description: "${description}"

Please respond with a JSON object containing:
- normalizedLocation: The standardized location (e.g., "New York, NY" or "London, UK")
- confidence: A number between 0 and 1 indicating your confidence
- reasoning: Brief explanation of your choice

Examples:
- "Gotham City" → "New York, NY" (fictional city based on NYC)
- "The Big Apple" → "New York, NY" (nickname for NYC)
- "Home of Harvard" → "Cambridge, MA" (Harvard is in Cambridge, MA)
- "Springfield" → "Springfield, IL" (most common Springfield)

Respond only with valid JSON:`

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a location normalization expert. Always respond with valid JSON."
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
      return LocationNormalizationSchema.parse(parsed)
    } catch (error) {
      console.error("OpenAI API error:", error)
      throw new Error("Failed to normalize location with OpenAI")
    }
  }
}
