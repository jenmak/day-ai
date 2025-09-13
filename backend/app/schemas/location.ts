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

// Location Schema
export const LocationSchema = z.object({
  id: z.string(),
  description: z.string().optional(),
  normalizedLocation: z.string(),
  slug: z.string(),
  geocodedAddress: GeocodedAddressSchema,
  weather: z.array(WeatherSchema).optional(),
  createdAt: z.date().transform((date) => date.toISOString())
})

// Create Location Schema
export const CreateLocationSchema = z.object({
  description: z.string()
})

// Update Location Schema
export const UpdateLocationSchema = z.object({
  id: z.string(),
  description: z.string()
})

// Type exports
export type Address = z.infer<typeof AddressSchema>
export type GeocodedAddress = z.infer<typeof GeocodedAddressSchema>
export type Location = z.infer<typeof LocationSchema>
export type CreateLocation = z.infer<typeof CreateLocationSchema>
export type UpdateLocation = z.infer<typeof UpdateLocationSchema>
