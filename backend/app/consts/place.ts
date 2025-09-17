import type { PlaceNormalization } from "../types"

// Common city coordinates
export const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  "new york": { lat: 40.7128, lng: -74.0060 },
  "los angeles": { lat: 34.0522, lng: -118.2437 },
  "chicago": { lat: 41.8781, lng: -87.6298 },
  "houston": { lat: 29.7604, lng: -95.3698 },
  "phoenix": { lat: 33.4484, lng: -112.0740 },
  "philadelphia": { lat: 39.9526, lng: -75.1652 },
  "san antonio": { lat: 29.4241, lng: -98.4936 },
  "san diego": { lat: 32.7157, lng: -117.1611 },
  "dallas": { lat: 32.7767, lng: -96.7970 },
  "san jose": { lat: 37.3382, lng: -121.8863 },
  "austin": { lat: 30.2672, lng: -97.7431 },
  "jacksonville": { lat: 30.3322, lng: -81.6557 },
  "fort worth": { lat: 32.7555, lng: -97.3308 },
  "columbus": { lat: 39.9612, lng: -82.9988 },
  "charlotte": { lat: 35.2271, lng: -80.8431 },
  "seattle": { lat: 47.6062, lng: -122.3321 },
  "denver": { lat: 39.7392, lng: -104.9903 },
  "washington": { lat: 38.9072, lng: -77.0369 },
  "boston": { lat: 42.3601, lng: -71.0589 },
  "detroit": { lat: 42.3314, lng: -83.0458 },
  "nashville": { lat: 36.1627, lng: -86.7816 },
  "portland": { lat: 45.5152, lng: -122.6784 },
  "las vegas": { lat: 36.1699, lng: -115.1398 },
  "baltimore": { lat: 39.2904, lng: -76.6122 },
  "milwaukee": { lat: 43.0389, lng: -87.9065 },
  "albuquerque": { lat: 35.0844, lng: -106.6504 },
  "tucson": { lat: 32.2226, lng: -110.9747 },
  "fresno": { lat: 36.7378, lng: -119.7871 },
  "mesa": { lat: 33.4152, lng: -111.8315 }
}

export const MOCK_MAPPINGS: Record<string, PlaceNormalization> = {
  "gotham city": {
    normalizedPlace: "New York, NY",
    slug: "new-york-ny",
    confidence: 0.95,
    reasoning: "Gotham City is commonly associated with New York City in popular culture"
  },
  "metropolis": {
    normalizedPlace: "New York, NY", 
    slug: "new-york-ny",
    confidence: 0.90,
    reasoning: "Metropolis is often depicted as New York City in Superman comics"
  },
  "springfield": {
    normalizedPlace: "Springfield, IL",
    slug: "springfield-il",
    confidence: 0.85,
    reasoning: "Springfield could refer to multiple cities, defaulting to Illinois state capital"
  },
  "home of the school that's better than yale": {
    normalizedPlace: "Cambridge, MA",
    slug: "cambridge-ma",
    confidence: 0.95,
    reasoning: "This refers to Harvard University in Cambridge, Massachusetts"
  },
  "the big apple": {
    normalizedPlace: "New York, NY",
    slug: "new-york-ny",
    confidence: 0.98,
    reasoning: "The Big Apple is a well-known nickname for New York City"
  },
  "la la land": {
    normalizedPlace: "Los Angeles, CA",
    slug: "los-angeles-ca",
    confidence: 0.90,
    reasoning: "La La Land is a nickname for Los Angeles"
  },
  "the windy city": {
    normalizedPlace: "Chicago, IL",
    slug: "chicago-il",
    confidence: 0.95,
    reasoning: "The Windy City is a nickname for Chicago"
  },
  "the city of angels": {
    normalizedPlace: "Los Angeles, CA",
    slug: "los-angeles-ca",
    confidence: 0.90,
    reasoning: "The City of Angels is a nickname for Los Angeles"
  },
  "the city that never sleeps": {
    normalizedPlace: "New York, NY",
    slug: "new-york-ny",
    confidence: 0.95,
    reasoning: "The City That Never Sleeps is a nickname for New York City"
  },
  "the emerald city": {
    normalizedPlace: "Seattle, WA",
    slug: "seattle-wa",
    confidence: 0.85,
    reasoning: "The Emerald City is a nickname for Seattle"
  },
  "the city of brotherly love": {
    normalizedPlace: "Philadelphia, PA",
    slug: "philadelphia-pa",
    confidence: 0.90,
    reasoning: "The City of Brotherly Love is a nickname for Philadelphia"
  },
  "the mile high city": {
    normalizedPlace: "Denver, CO",
    slug: "denver-co",
    confidence: 0.90,
    reasoning: "The Mile High City is a nickname for Denver"
  },
  "the motor city": {
    normalizedPlace: "Detroit, MI",
    slug: "detroit-mi",
    confidence: 0.90,
    reasoning: "The Motor City is a nickname for Detroit"
  },
  "the music city": {
    normalizedPlace: "Nashville, TN",
    slug: "nashville-tn",
    confidence: 0.90,
    reasoning: "The Music City is a nickname for Nashville"
  },
  "the queen city": {
    normalizedPlace: "Charlotte, NC",
    slug: "charlotte-nc",
    confidence: 0.80,
    reasoning: "The Queen City is a nickname for Charlotte"
  },
  "the space city": {
    normalizedPlace: "Houston, TX",
    slug: "houston-tx",
    confidence: 0.90,
    reasoning: "The Space City is a nickname for Houston"
  },
  "the alamo city": {
    normalizedPlace: "San Antonio, TX",
    slug: "san-antonio-tx",
    confidence: 0.90,
    reasoning: "The Alamo City is a nickname for San Antonio"
  },
  "the valley of the sun": {
    normalizedPlace: "Phoenix, AZ",
    slug: "phoenix-az",
    confidence: 0.85,
    reasoning: "The Valley of the Sun is a nickname for Phoenix"
  },
  "the gateway to the west": {
    normalizedPlace: "St. Louis, MO",
    slug: "st-louis-mo",
    confidence: 0.85,
    reasoning: "The Gateway to the West is a nickname for St. Louis"
  }
}