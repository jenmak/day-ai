// Type declarations for @dayai/backend
declare module '@dayai/backend' {
  export interface AppRouter {
    locations: {
      create: {
        mutate: (input: { description: string }) => Promise<Location>
      }
      getByNormalizedLocation: {
        query: (input: { normalizedLocation: string }) => Promise<Location | false>
      }
    }
    _def: any
    createCaller: any
  }
  
  // Export the AppRouter as a type
  export type { AppRouter }
}

declare module '@dayai/backend/schemas' {
  export interface Location {
    id: string
    description?: string
    normalizedLocation: string
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
    createdAt: string
  }

  export interface Weather {
    condition: string
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

  export interface CreateLocation {
    description: string
  }

  export interface UpdateLocation {
    id: string
    description: string
  }
}
