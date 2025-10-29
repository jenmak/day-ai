import { z } from "zod"
import { WEATHER_CONDITION } from "../constants"
import {
    AddressSchema,
    ClothingCategorySchema,
    ClothingRecommendationSchema,
    CreatePlaceSchema,
    GeocodedAddressSchema,
    PlaceNormalizationSchema,
    PlaceSchema,
    TemperatureRangeCategorySchema,
    TemperatureRangeSchema,
    UpdatePlaceSchema,
    WeatherClothingRecommendationsSchema,
    WeatherSchema
} from "../schemas"

// Export all inferred types from schemas
export type TemperatureRange = z.infer<typeof TemperatureRangeSchema>
export type TemperatureRangeCategory = z.infer<typeof TemperatureRangeCategorySchema>
export type Weather = z.infer<typeof WeatherSchema>
export type Address = z.infer<typeof AddressSchema>
export type GeocodedAddress = z.infer<typeof GeocodedAddressSchema>
export type Place = z.infer<typeof PlaceSchema>
export type CreatePlace = z.infer<typeof CreatePlaceSchema>
export type UpdatePlace = z.infer<typeof UpdatePlaceSchema>
export type PlaceNormalization = z.infer<typeof PlaceNormalizationSchema>
export type ClothingCategory = z.infer<typeof ClothingCategorySchema>
export type ClothingRecommendation = z.infer<typeof ClothingRecommendationSchema>
export type WeatherClothingRecommendations = z.infer<typeof WeatherClothingRecommendationsSchema>
export type OpenMeteoWeatherCode = keyof typeof WEATHER_CONDITION

// Re-export schemas for convenience
export * from "../schemas"
