import { config } from "dotenv"
import type { LocationNormalization } from "../services/llmService.ts"

// Load environment variables
config()

export const OPENAI_API_KEY = process.env.OPENAI_API_KEY

export const MOCK_MAPPINGS: Record<string, LocationNormalization> = {
  "gotham city": {
    normalizedLocation: "New York, NY",
    slug: "new-york-ny",
    confidence: 0.95,
    reasoning: "Gotham City is commonly associated with New York City in popular culture"
  },
  "metropolis": {
    normalizedLocation: "New York, NY", 
    slug: "new-york-ny",
    confidence: 0.90,
    reasoning: "Metropolis is often depicted as New York City in Superman comics"
  },
  "springfield": {
    normalizedLocation: "Springfield, IL",
    slug: "springfield-il",
    confidence: 0.85,
    reasoning: "Springfield could refer to multiple cities, defaulting to Illinois state capital"
  },
  "home of the school that's better than yale": {
    normalizedLocation: "Cambridge, MA",
    slug: "cambridge-ma",
    confidence: 0.95,
    reasoning: "This refers to Harvard University in Cambridge, Massachusetts"
  },
  "the big apple": {
    normalizedLocation: "New York, NY",
    slug: "new-york-ny",
    confidence: 0.98,
    reasoning: "The Big Apple is a well-known nickname for New York City"
  },
  "la la land": {
    normalizedLocation: "Los Angeles, CA",
    slug: "los-angeles-ca",
    confidence: 0.90,
    reasoning: "La La Land is a nickname for Los Angeles"
  },
  "the windy city": {
    normalizedLocation: "Chicago, IL",
    slug: "chicago-il",
    confidence: 0.95,
    reasoning: "The Windy City is a nickname for Chicago"
  },
  "the city of angels": {
    normalizedLocation: "Los Angeles, CA",
    slug: "los-angeles-ca",
    confidence: 0.90,
    reasoning: "The City of Angels is a nickname for Los Angeles"
  },
  "the city that never sleeps": {
    normalizedLocation: "New York, NY",
    slug: "new-york-ny",
    confidence: 0.95,
    reasoning: "The City That Never Sleeps is a nickname for New York City"
  },
  "the emerald city": {
    normalizedLocation: "Seattle, WA",
    slug: "seattle-wa",
    confidence: 0.85,
    reasoning: "The Emerald City is a nickname for Seattle"
  },
  "the city of brotherly love": {
    normalizedLocation: "Philadelphia, PA",
    slug: "philadelphia-pa",
    confidence: 0.90,
    reasoning: "The City of Brotherly Love is a nickname for Philadelphia"
  },
  "the mile high city": {
    normalizedLocation: "Denver, CO",
    slug: "denver-co",
    confidence: 0.90,
    reasoning: "The Mile High City is a nickname for Denver"
  },
  "the motor city": {
    normalizedLocation: "Detroit, MI",
    slug: "detroit-mi",
    confidence: 0.90,
    reasoning: "The Motor City is a nickname for Detroit"
  },
  "the music city": {
    normalizedLocation: "Nashville, TN",
    slug: "nashville-tn",
    confidence: 0.90,
    reasoning: "The Music City is a nickname for Nashville"
  },
  "the queen city": {
    normalizedLocation: "Charlotte, NC",
    slug: "charlotte-nc",
    confidence: 0.80,
    reasoning: "The Queen City is a nickname for Charlotte"
  },
  "the space city": {
    normalizedLocation: "Houston, TX",
    slug: "houston-tx",
    confidence: 0.90,
    reasoning: "The Space City is a nickname for Houston"
  },
  "the alamo city": {
    normalizedLocation: "San Antonio, TX",
    slug: "san-antonio-tx",
    confidence: 0.90,
    reasoning: "The Alamo City is a nickname for San Antonio"
  },
  "the valley of the sun": {
    normalizedLocation: "Phoenix, AZ",
    slug: "phoenix-az",
    confidence: 0.85,
    reasoning: "The Valley of the Sun is a nickname for Phoenix"
  },
  "the gateway to the west": {
    normalizedLocation: "St. Louis, MO",
    slug: "st-louis-mo",
    confidence: 0.85,
    reasoning: "The Gateway to the West is a nickname for St. Louis"
  }
}