import z from "zod";
import { AddressSchema, CreatePlaceSchema, GeocodedAddressSchema, PlaceNormalizationSchema, PlaceSchema, TemperatureRangeSchema, TemperatureRangeCategorySchema, UpdatePlaceSchema, UserSchema, WeatherSchema, ClothingCategorySchema, ClothingRecommendationSchema, WeatherClothingRecommendationsSchema } from "../schemas";
import { WEATHER_CONDITION } from "../consts";

export type TemperatureRange = z.infer<typeof TemperatureRangeSchema>
export type TemperatureRangeCategory = z.infer<typeof TemperatureRangeCategorySchema>
export type Weather = z.infer<typeof WeatherSchema>
export type User = z.infer<typeof UserSchema>
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
