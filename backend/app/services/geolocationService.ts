import { type GeocodedAddress, type Address } from "../types"
import { CITY_COORDINATES } from "../consts/place"
import { CacheStore } from "../../core/CacheStore"
import { CacheUtils } from "../../core/cacheUtils"

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
   * Geocode a place description using OpenCage API
   * Converts place descriptions to structured address data with coordinates
   */
  static async geocodePlace(
    description: string, 
    cache?: CacheStore
  ): Promise<GeocodedAddress> {
    // Generate cache key for geocoding using utility
    const cacheKey = CacheUtils.generateCacheKeys.geocode(description)

    // Check cache first if cache store is provided
    if (cache) {
      const cached = await cache.getCached<GeocodedAddress>(cacheKey)
      if (cached) {
        console.log("Geocoding data served from cache")
        return cached
      }
    }
    try {
      // Check if OpenCage API key is available
      if (!process.env.OPENCAGE_API_KEY) {
        console.warn("OpenCage API key not found, falling back to mock implementation")
        const mockResult = this.getMockGeocoding(description)
        
        // Cache mock result for 1 hour
        if (cache) {
          await cache.setCache(cacheKey, mockResult, CacheUtils.TTL.MOCK)
        }
        
        return mockResult
      }

      // Use OpenCage API for geocoding
      const opencageResponse = await this.callOpenCageAPI(description)
      const result = this.parseOpenCageResponse(opencageResponse, description)
      
      // Cache successful result for 24 hours
      if (cache) {
        await cache.setCache(cacheKey, result, CacheUtils.TTL.GEOCODE)
      }
      
      return result
    } catch (error) {
      console.error("Error geocoding place:", error)

      // Fallback to mock implementation if OpenCage fails
      console.warn("OpenCage API failed, falling back to mock implementation")
      try {
        const mockResult = this.getMockGeocoding(description)
        
        // Cache mock result for 1 hour on fallback
        if (cache) {
          await cache.setCache(cacheKey, mockResult, CacheUtils.TTL.MOCK)
        }
        
        return mockResult
      } catch (mockError) {
        console.error("Mock implementation also failed:", mockError)
        throw new Error("Failed to geocode place description")
      }
    }
  }

  /**
   * Mock implementation for fallback when OpenCage API is unavailable
   */
  private static getMockGeocoding(description: string): GeocodedAddress {
    // Simple mock implementation that provides basic coordinates
    // In a real implementation, this could use a local geocoding database
    const mockCoordinates = this.getMockCoordinates(description)

    return {
      latitude: mockCoordinates.lat,
      longitude: mockCoordinates.lng,
      formattedAddress: description,
      structuredAddress: this.parseStructuredAddress(description)
    }
  }

  /**
   * Get mock coordinates for common places
   */
  private static getMockCoordinates(description: string): { lat: number; lng: number } {
    const place = description.toLowerCase()

    // Try to find a matching city
    for (const [city, coords] of Object.entries(CITY_COORDINATES)) {
      if (place.includes(city)) {
        return coords
      }
    }

    // Default to New York if no match found
    return { lat: 40.7128, lng: -74.006 }
  }

  /**
   * Parse structured address from place description
   */
  private static parseStructuredAddress(description: string): Address {
    const parts = description.split(",").map((part) => part.trim())

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
  private static async callOpenCageAPI(description: string): Promise<OpenCageResponse> {
    const apiKey = process.env.OPENCAGE_API_KEY
    const encodedPlace = encodeURIComponent(description)
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodedPlace}&key=${apiKey}&limit=1&no_annotations=1`

    try {
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`OpenCage API error: ${response.status} ${response.statusText}`)
      }

      const data = (await response.json()) as OpenCageResponse

      if (data.status.code !== 200) {
        throw new Error(`OpenCage API error: ${data.status.message}`)
      }

      return data as OpenCageResponse
    } catch (error) {
      console.error("OpenCage API error:", error)
      throw new Error("Failed to geocode place with OpenCage API")
    }
  }

  /**
   * Parse OpenCage API response into our GeocodedAddress format
   */
  private static parseOpenCageResponse(
    response: OpenCageResponse,
    _originalDescription: string
  ): GeocodedAddress {
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
