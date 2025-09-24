// Type declarations for @dripdropcity/backend
declare module "@dripdropcity/backend" {
  export interface AppRouter {
    places: {
      create: {
        mutate: (input: { description: string }) => Promise<Place>
      }
      getByNormalizedPlace: {
        query: (input: { normalizedPlace: string }) => Promise<Place | false>
      }
      getBySlug: {
        query: (input: { slug: string }) => Promise<Place>
      }
    }
    _def: any
    createCaller: any
  }

  // Export the AppRouter as a type
  export type { AppRouter }
}

declare module "@dripdropcity/backend/schemas" {
  export interface Place {
    id: string
    description?: string
    normalizedPlace: string
    slug: string
    geocodedAddress: {
      latitude: number
      longitude: number
      formattedAddress: string
      structuredAddress: {
        city: string
        state: string
        postalCode: string
        country: string
        street?: string
        streetNumber?: string
      }
    }
    weather?: Weather[]
    temperatureRangeCategory?: "VERY_HOT" | "HOT" | "WARM" | "MILD" | "COOL" | "COLD" | "VERY_COLD"
    createdAt: string
  }

  export interface Weather {
    date: string
    condition: number
    degreesFahrenheit: number
    degreesCelsius: number
    temperatureRange: {
      temperatureMinimum: number
      temperatureMaximum: number
    }
    rainProbabilityPercentage: number
    windSpeedMph: number
    clothing: string[]
  }

  export interface Address {
    city: string
    state: string
    postalCode: string
    country: string
    street?: string
    streetNumber?: string
  }

  export interface GeocodedAddress {
    latitude: number
    longitude: number
    formattedAddress: string
    structuredAddress: Address
  }
}
