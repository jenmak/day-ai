// Type declarations for @dayai/backend
declare module '@dayai/backend' {
  export interface AppRouter {
    places: {
      create: {
        mutate: (input: { description: string }) => Promise<Place>
      }
      getByNormalizedLocation: {
        query: (input: { normalizedLocation: string }) => Promise<Place | false>
      }
      getBySlug: {
        query: (input: { slug: string }) => Promise<Place>
      }
      getWeatherForecast: {
        query: (input: { slug: string }) => Promise<Weather[]>
      }
      getCurrentWeather: {
        query: (input: { slug: string }) => Promise<Weather>
      }
      getWeatherByDate: {
        query: (input: { slug: string; date: string }) => Promise<Weather>
      }
      getWeatherByDateRange: {
        query: (input: { slug: string; startDate: string; endDate: string }) => Promise<Weather[]>
      }
    }
    // Legacy alias for backward compatibility
    locations: {
      create: {
        mutate: (input: { description: string }) => Promise<Place>
      }
      getByNormalizedLocation: {
        query: (input: { normalizedLocation: string }) => Promise<Place | false>
      }
      getBySlug: {
        query: (input: { slug: string }) => Promise<Place>
      }
      getWeatherForecast: {
        query: (input: { slug: string }) => Promise<Weather[]>
      }
      getCurrentWeather: {
        query: (input: { slug: string }) => Promise<Weather>
      }
      getWeatherByDate: {
        query: (input: { slug: string; date: string }) => Promise<Weather>
      }
      getWeatherByDateRange: {
        query: (input: { slug: string; startDate: string; endDate: string }) => Promise<Weather[]>
      }
    }
    _def: any
    createCaller: any
  }
  
  // Export the AppRouter as a type
  export type { AppRouter }
}

declare module '@dayai/backend/schemas' {
  export interface Place {
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
    temperatureRangeCategory?: 'VERY_HOT' | 'HOT' | 'WARM' | 'MILD' | 'COOL' | 'COLD' | 'VERY_COLD'
    createdAt: string
  }

  // Legacy alias for backward compatibility
  export interface Location extends Place {}

  export interface Weather {
    date: string
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
