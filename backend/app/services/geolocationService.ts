import { type GeocodedAddress, type Address } from "../schemas/place"

export interface OpenCageResponse {
  results: Array<{
    geometry: {
      lat: number
      lng: number
    }
    formatted: string
    components: {
      city?: string
      state?: string
      postcode?: string
      country?: string
      road?: string
      house_number?: string
    }
  }>
  status: {
    code: number
    message: string
  }
}

export class GeolocationService {
  /**
   * Geocode a location description using OpenCage API
   * Converts location descriptions to structured address data with coordinates
   */
  static async geocodeLocation(locationDescription: string): Promise<GeocodedAddress> {
    try {
      // Check if OpenCage API key is available
      if (!process.env.OPENCAGE_API_KEY) {
        console.warn("OpenCage API key not found, falling back to mock implementation")
        return this.getMockGeocoding(locationDescription)
      }

      // Use OpenCage API for geocoding
      const opencageResponse = await this.callOpenCageAPI(locationDescription)
      return this.parseOpenCageResponse(opencageResponse, locationDescription)
    } catch (error) {
      console.error("Error geocoding location:", error)
      
      // Fallback to mock implementation if OpenCage fails
      console.warn("OpenCage API failed, falling back to mock implementation")
      try {
        return this.getMockGeocoding(locationDescription)
      } catch (mockError) {
        console.error("Mock implementation also failed:", mockError)
        throw new Error("Failed to geocode location description")
      }
    }
  }

  /**
   * Mock implementation for fallback when OpenCage API is unavailable
   */
  private static getMockGeocoding(locationDescription: string): GeocodedAddress {
    // Simple mock implementation that provides basic coordinates
    // In a real implementation, this could use a local geocoding database
    const mockCoordinates = this.getMockCoordinates(locationDescription)
    
    return {
      latitude: mockCoordinates.lat,
      longitude: mockCoordinates.lng,
      formattedAddress: locationDescription,
      structuredAddress: this.parseStructuredAddress(locationDescription)
    }
  }

  /**
   * Get mock coordinates for common locations
   */
  private static getMockCoordinates(locationDescription: string): { lat: number; lng: number } {
    const location = locationDescription.toLowerCase()
    
    // Common city coordinates
    const cityCoordinates: Record<string, { lat: number; lng: number }> = {
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

    // Try to find a matching city
    for (const [city, coords] of Object.entries(cityCoordinates)) {
      if (location.includes(city)) {
        return coords
      }
    }

    // Default to New York if no match found
    return { lat: 40.7128, lng: -74.0060 }
  }

  /**
   * Parse structured address from location description
   */
  private static parseStructuredAddress(locationDescription: string): Address {
    const parts = locationDescription.split(',').map(part => part.trim())
    
    return {
      city: parts[0] || "",
      state: parts[1] || "",
      postalCode: "",
      country: parts.length > 2 ? parts[2] : "US"
    }
  }

  /**
   * Call OpenCage Geocoding API
   */
  private static async callOpenCageAPI(locationDescription: string): Promise<OpenCageResponse> {
    const apiKey = process.env.OPENCAGE_API_KEY
    const encodedLocation = encodeURIComponent(locationDescription)
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodedLocation}&key=${apiKey}&limit=1&no_annotations=1`

    try {
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`OpenCage API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json() as OpenCageResponse
      
      if (data.status.code !== 200) {
        throw new Error(`OpenCage API error: ${data.status.message}`)
      }

      return data as OpenCageResponse
    } catch (error) {
      console.error("OpenCage API error:", error)
      throw new Error("Failed to geocode location with OpenCage API")
    }
  }

  /**
   * Parse OpenCage API response into our GeocodedAddress format
   */
  private static parseOpenCageResponse(response: OpenCageResponse, _originalDescription: string): GeocodedAddress {
    if (!response.results || response.results.length === 0) {
      throw new Error("No geocoding results found")
    }

    const result = response.results[0]
    const components = result.components

    return {
      latitude: result.geometry.lat,
      longitude: result.geometry.lng,
      formattedAddress: result.formatted,
      structuredAddress: {
        city: components.city || "",
        state: components.state || "",
        postalCode: components.postcode || "",
        country: components.country || "",
        street: components.road || undefined,
        streetNumber: components.house_number || undefined
      }
    }
  }
}
