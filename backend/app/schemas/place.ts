import { z } from "zod"
import { WeatherSchema } from "./weather"

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
  normalizedLocation: z.string(),
  slug: z.string(),
  geocodedAddress: GeocodedAddressSchema,
  weather: z.array(WeatherSchema).optional(),
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

// Type exports
export type Address = z.infer<typeof AddressSchema>
export type GeocodedAddress = z.infer<typeof GeocodedAddressSchema>
export type Place = z.infer<typeof PlaceSchema>
export type CreatePlace = z.infer<typeof CreatePlaceSchema>
export type UpdatePlace = z.infer<typeof UpdatePlaceSchema>