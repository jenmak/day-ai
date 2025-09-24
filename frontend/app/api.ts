// Type definitions for the Drip Drop City API
// These should match the backend schemas

export interface Place {
  id: string
  name: string
  slug: string
  address: string
  normalizedPlace: string
  description?: string
  coordinates: {
    lat: number
    lng: number
  }
  geocodedAddress: {
    latitude: number
    longitude: number
    structuredAddress: {
      city: string
      state: string
      postalCode: string
      country: string
    }
  }
  weather?: Weather[]
  temperatureRangeCategory?: "VERY_HOT" | "HOT" | "WARM" | "MILD" | "COOL" | "COLD" | "VERY_COLD"
  createdAt: string
  updatedAt: string
}

export interface Weather {
  date: string
  condition: number
  degreesFahrenheit: number
  temperatureRange: {
    temperatureMinimum: number
    temperatureMaximum: number
  }
  temperatureRangeCategory: string
  rainProbabilityPercentage: number
  windSpeedMph: number
  clothing: string[]
}

export interface WeatherCondition {
  id: string
  name: string
  category: ClothingCategory
  description: string
}

export interface ClothingCategory {
  id: string
  name: string
  description: string
}

// Simple router type for TRPC - we'll use any for now to avoid complex typing
export type AppRouter = any

// Date-related utility types
export interface DateRange {
  startDate: string
  endDate: string
}

export interface WeatherQuery {
  slug: string
  date?: string
  dateRange?: DateRange
}

export type PlaceType = Place
export type WeatherType = Weather
export type WeatherConditionType = WeatherCondition
