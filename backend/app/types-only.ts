// Types-only exports for frontend consumption
// This file contains only type definitions without implementation

export interface TemperatureRange {
  temperatureMinimum: number
  temperatureMaximum: number
}

export type TemperatureRangeCategory =
  | "VERY_HOT"
  | "HOT"
  | "WARM"
  | "MILD"
  | "COOL"
  | "COLD"
  | "VERY_COLD"

export interface Weather {
  date: string
  degreesFahrenheit: number
  temperatureRange: TemperatureRange
  temperatureRangeCategory: TemperatureRangeCategory
  rainProbabilityPercentage: number
  windSpeedMph: number
  condition: number
  clothing: string[]
}

export interface User {
  id: string
  email: string
  name: string
  createdAt: string
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

export interface Place {
  id: string
  description?: string
  normalizedPlace: string
  slug: string
  geocodedAddress: GeocodedAddress | null
  weather?: Weather[]
  temperatureRangeCategory?: TemperatureRangeCategory
  createdAt: string
}

export interface CreatePlace {
  description: string
}

export interface UpdatePlace {
  description?: string
  normalizedPlace?: string
  slug?: string
  geocodedAddress?: GeocodedAddress
  weather?: Weather[]
  temperatureRangeCategory?: TemperatureRangeCategory
}

export interface PlaceNormalization {
  normalizedPlace: string
  slug: string
  confidence: number
  reasoning?: string
}

export type ClothingCategory =
  | "t-shirt"
  | "long-sleeve"
  | "hoodie"
  | "jacket"
  | "coat"
  | "shorts"
  | "pants"
  | "jeans"
  | "dress"
  | "skirt"
  | "sandals"
  | "sneakers"
  | "boots"
  | "umbrella"
  | "hat"
  | "gloves"
  | "scarf"

export interface ClothingRecommendation {
  category: ClothingCategory
  description: string
  temperatureRange: TemperatureRange
  weatherConditions: number[]
}

export interface WeatherClothingRecommendations {
  temperature: number
  recommendations: ClothingRecommendation[]
}

export type OpenMeteoWeatherCode =
  | 0
  | 1
  | 2
  | 3
  | 45
  | 48
  | 51
  | 53
  | 55
  | 56
  | 57
  | 61
  | 63
  | 65
  | 66
  | 67
  | 71
  | 73
  | 75
  | 77
  | 80
  | 81
  | 82
  | 85
  | 86
  | 95
  | 96
  | 99
