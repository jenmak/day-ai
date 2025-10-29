import {
  type Address,
  type GeocodedAddress
} from "../schemas"
import { apiKeys, getApiKeyWithFallback } from "../security/apiKeys"

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
   * Also handles zip codes and postal codes
   */
  static async geocodePlace(description: string): Promise<GeocodedAddress> {
    try {
      // Check if OpenCage API key is available
      if (!apiKeys.isOpenCageAvailable()) {
        console.warn(
          "OpenCage API key not available, falling back to mock implementation"
        )
        const mockResult = this.getMockGeocoding(description)

        return mockResult
      }

      // Use OpenCage API for geocoding
      const opencageResponse = await this.callOpenCageAPI(description)
      const result = this.parseOpenCageResponse(opencageResponse, description)

      return result
    } catch (error) {
      console.error("Error geocoding place:", error)

      // Fallback to mock implementation if OpenCage fails
      console.warn("OpenCage API failed, falling back to mock implementation")
      try {
        const mockResult = this.getMockGeocoding(description)

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
      latitude: Number(mockCoordinates.lat).toFixed(6),
      longitude: Number(mockCoordinates.lng).toFixed(6),
      formattedAddress: description,
      structuredAddress: this.parseStructuredAddress(description)
    }
  }

  /**
   * Get mock coordinates for common places and zip codes
   */
  private static getMockCoordinates(description: string): {
    lat: number
    lng: number
  } {
    const place = description.toLowerCase().trim()

    // Check if it's a zip code first
    if (/^\d{5}(-\d{4})?$/.test(place)) {
      return this.getZipCodeCoordinates(place)
    }

    // Try to find a matching city
    for (const [city, coords] of Object.entries({
      "new york": { lat: 40.7128, lng: -74.006 },
      "los angeles": { lat: 34.0522, lng: -118.2437 },
      chicago: { lat: 41.8781, lng: -87.6298 },
      houston: { lat: 29.7604, lng: -95.3698 },
      phoenix: { lat: 33.4484, lng: -112.074 },
      philadelphia: { lat: 39.9526, lng: -75.1652 },
      "san antonio": { lat: 29.4241, lng: -98.4936 },
      "san diego": { lat: 32.7157, lng: -117.1611 },
      dallas: { lat: 32.7767, lng: -96.797 },
      "san jose": { lat: 37.3382, lng: -121.8863 },
      austin: { lat: 30.2672, lng: -97.7431 },
      jacksonville: { lat: 30.3322, lng: -81.6557 },
      "fort worth": { lat: 32.7555, lng: -97.3308 },
      columbus: { lat: 39.9612, lng: -82.9988 },
      charlotte: { lat: 35.2271, lng: -80.8431 },
      seattle: { lat: 47.6062, lng: -122.3321 },
      denver: { lat: 39.7392, lng: -104.9903 },
      washington: { lat: 38.9072, lng: -77.0369 },
      boston: { lat: 42.3601, lng: -71.0589 },
      detroit: { lat: 42.3314, lng: -83.0458 },
      nashville: { lat: 36.1627, lng: -86.7816 },
      portland: { lat: 45.5152, lng: -122.6784 },
      "las vegas": { lat: 36.1699, lng: -115.1398 },
      baltimore: { lat: 39.2904, lng: -76.6122 },
      milwaukee: { lat: 43.0389, lng: -87.9065 },
      albuquerque: { lat: 35.0844, lng: -106.6504 },
      tucson: { lat: 32.2226, lng: -110.9747 },
      fresno: { lat: 36.7378, lng: -119.7871 },
      mesa: { lat: 33.4152, lng: -111.8315 }
    })) {
      if (place.includes(city)) {
        return coords as { lat: number; lng: number }
      }
    }

    // Default to configured default coordinates if no match found
    return { lat: 40.7128, lng: -74.006 }
  }

  /**
   * Get mock coordinates for zip codes
   */
  private static getZipCodeCoordinates(zipCode: string): {
    lat: number
    lng: number
  } {
    // Remove any dashes from zip code
    const cleanZip = zipCode.replace('-', '')

    // Mock coordinates for common zip codes
    const zipCodeMappings: Record<string, { lat: number; lng: number }> = {
      "10001": { lat: 40.7505, lng: -73.9934 }, // New York, NY
      "90210": { lat: 34.0901, lng: -118.4065 }, // Beverly Hills, CA
      "60601": { lat: 41.8781, lng: -87.6298 }, // Chicago, IL
      "77001": { lat: 29.7604, lng: -95.3698 }, // Houston, TX
      "85001": { lat: 33.4484, lng: -112.074 }, // Phoenix, AZ
      "19101": { lat: 39.9526, lng: -75.1652 }, // Philadelphia, PA
      "78201": { lat: 29.4241, lng: -98.4936 }, // San Antonio, TX
      "92101": { lat: 32.7157, lng: -117.1611 }, // San Diego, CA
      "75201": { lat: 32.7767, lng: -96.797 }, // Dallas, TX
      "95101": { lat: 37.3382, lng: -121.8863 }, // San Jose, CA
      "78701": { lat: 30.2672, lng: -97.7431 }, // Austin, TX
      "32201": { lat: 30.3322, lng: -81.6557 }, // Jacksonville, FL
      "76101": { lat: 32.7555, lng: -97.3308 }, // Fort Worth, TX
      "43201": { lat: 39.9612, lng: -82.9988 }, // Columbus, OH
      "28201": { lat: 35.2271, lng: -80.8431 }, // Charlotte, NC
      "98101": { lat: 47.6062, lng: -122.3321 }, // Seattle, WA
      "80201": { lat: 39.7392, lng: -104.9903 }, // Denver, CO
      "20001": { lat: 38.9072, lng: -77.0369 }, // Washington, DC
      "02101": { lat: 42.3601, lng: -71.0589 }, // Boston, MA
      "48201": { lat: 42.3314, lng: -83.0458 }, // Detroit, MI
      "37201": { lat: 36.1627, lng: -86.7816 }, // Nashville, TN
      "97201": { lat: 45.5152, lng: -122.6784 }, // Portland, OR
      "89101": { lat: 36.1699, lng: -115.1398 }, // Las Vegas, NV
      "21201": { lat: 39.2904, lng: -76.6122 }, // Baltimore, MD
      "53201": { lat: 43.0389, lng: -87.9065 }, // Milwaukee, WI
      "87101": { lat: 35.0844, lng: -106.6504 }, // Albuquerque, NM
      "85701": { lat: 32.2226, lng: -110.9747 }, // Tucson, AZ
      "93701": { lat: 36.7378, lng: -119.7871 }, // Fresno, CA
      "85201": { lat: 33.4152, lng: -111.8315 } // Mesa, AZ
    }

    if (zipCodeMappings[cleanZip]) {
      return zipCodeMappings[cleanZip]
    }

    // For unknown zip codes, try to estimate based on first 3 digits
    const firstThree = cleanZip.substring(0, 3)
    const regionMappings: Record<string, { lat: number; lng: number }> = {
      "100": { lat: 40.7128, lng: -74.006 }, // New York area
      "200": { lat: 38.9072, lng: -77.0369 }, // Washington DC area
      "300": { lat: 33.7490, lng: -84.3880 }, // Atlanta area
      "400": { lat: 38.2527, lng: -85.7585 }, // Louisville area
      "500": { lat: 41.5868, lng: -93.6250 }, // Des Moines area
      "600": { lat: 41.8781, lng: -87.6298 }, // Chicago area
      "700": { lat: 29.9511, lng: -90.0715 }, // New Orleans area
      "800": { lat: 39.7392, lng: -104.9903 }, // Denver area
      "900": { lat: 34.0522, lng: -118.2437 } // Los Angeles area
    }

    if (regionMappings[firstThree]) {
      return regionMappings[firstThree]
    }

    // Default fallback
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
  private static async callOpenCageAPI(
    description: string
  ): Promise<OpenCageResponse> {
    const apiKey = getApiKeyWithFallback(
      "opencage",
      "Failed to get OpenCage API key"
    )
    if (!apiKey) {
      throw new Error("OpenCage API key not available")
    }

    // For US zip codes, add "USA" to make the search more specific
    let searchQuery = description
    if (/^\d{5}(-\d{4})?$/.test(description.trim())) {
      searchQuery = `${description}, USA`
    }

    const encodedPlace = encodeURIComponent(searchQuery)
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodedPlace}&key=${apiKey}&limit=1&no_annotations=1`

    try {
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(
          `OpenCage API error: ${response.status} ${response.statusText}`
        )
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
      throw new Error("Failed to geocode place with OpenCage API")
    }

    const result = response.results[0]
    const components = result.components

    return {
      latitude: Number(result.geometry.lat).toFixed(6).toString(),
      longitude: Number(result.geometry.lng).toFixed(6).toString(),
      formattedAddress: result.formatted,
      structuredAddress: {
        city: components.city || "",
        state: components.state || "",
        postalCode: components.postcode || "",
        country: components.country || "",
        ...(components.road && { street: components.road }),
        ...(components.house_number && {
          streetNumber: components.house_number
        })
      }
    }
  }
}
