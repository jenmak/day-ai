// Type definitions for the DayAI API
// These should match the backend schemas

export interface Location {
  id: string
  name: string
  slug: string
  address: string
  normalizedLocation: string
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
  createdAt: string
  updatedAt: string
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

// Export types that were previously imported from backend
export type LocationType = Location
export type WeatherType = Weather
export type WeatherConditionType = WeatherCondition
