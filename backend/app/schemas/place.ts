import { z } from "zod"
import { WeatherSchema, TemperatureRangeCategorySchema } from "./weather"

// Address Schema
export const AddressSchema = z.object({
  city: z.string(),
  state: z.string(),
  postalCode: z.string(),
  country: z.string(),
  street: z.string().optional(),
  streetNumber: z.string().optional()
})

// Geocoded Address Schema
export const GeocodedAddressSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  formattedAddress: z.string(),
  structuredAddress: AddressSchema
})

// Place Schema
export const PlaceSchema = z.object({
  id: z.string(),
  description: z.string().optional(),
  normalizedPlace: z.string(),
  slug: z.string(),
  geocodedAddress: GeocodedAddressSchema.nullable(),
  weather: z.array(WeatherSchema).optional(),
  temperatureRangeCategory: TemperatureRangeCategorySchema.optional(),
  createdAt: z.date().transform((date) => date.toISOString())
})

// Create Place Schema
export const CreatePlaceSchema = z.object({
  description: z.string()
})

// Update Place Schema
export const UpdatePlaceSchema = z.object({
  id: z.string(),
  description: z.string()
})

// LLM Response Schema
export const PlaceNormalizationSchema = z.object({
  slug: z.string(),
  normalizedPlace: z.string(),
  confidence: z.number().min(0).max(1),
  reasoning: z.string().optional()
})
