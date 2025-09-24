import { z } from "zod"
import { NumberValidation, StringValidation } from "./validation"
import { TemperatureRangeCategorySchema, WeatherSchema } from "./weather"

// Address Schema with enhanced validation
export const AddressSchema = z.object({
  city: z
    .string()
    .min(1, "City name is required")
    .max(100, "City name must be 100 characters or less")
    .regex(/^[a-zA-Z\s\-'\.]+$/, "City name contains invalid characters"),

  state: z
    .string()
    .min(1, "State name is required")
    .max(100, "State name must be 100 characters or less")
    .regex(/^[a-zA-Z\s\-'\.]+$/, "State name contains invalid characters"),

  postalCode: z.string().regex(/^[a-zA-Z0-9\s\-]{3,10}$/, "Must be a valid postal code"),

  country: z
    .string()
    .min(2, "Country code must be at least 2 characters")
    .max(100, "Country name must be 100 characters or less")
    .regex(/^[a-zA-Z\s\-'\.]+$/, "Country name contains invalid characters"),

  street: z
    .string()
    .max(200, "Street name must be 200 characters or less")
    .regex(/^[a-zA-Z0-9\s\-'\.#]+$/, "Street name contains invalid characters")
    .optional(),

  streetNumber: z
    .string()
    .max(20, "Street number must be 20 characters or less")
    .regex(/^[a-zA-Z0-9\s\-#]+$/, "Street number contains invalid characters")
    .optional()
})

// Geocoded Address Schema with enhanced validation
export const GeocodedAddressSchema = z.object({
  latitude: NumberValidation.latitude,
  longitude: NumberValidation.longitude,
  formattedAddress: StringValidation.required
    .min(1, "Formatted address is required")
    .max(500, "Formatted address must be 500 characters or less"),
  structuredAddress: AddressSchema
})

// Place Schema with enhanced validation
export const PlaceSchema = z.object({
  id: z.string().uuid("Must be a valid UUID"),

  description: z.string().max(500, "Description must be 500 characters or less").optional(),

  normalizedPlace: z
    .string()
    .min(1, "Normalized place name is required")
    .max(200, "Normalized place name must be 200 characters or less"),

  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "Must be a valid slug")
    .min(1, "Slug is required")
    .max(100, "Slug must be 100 characters or less"),

  geocodedAddress: GeocodedAddressSchema.nullable(),

  weather: z.array(WeatherSchema).optional(),

  temperatureRangeCategory: TemperatureRangeCategorySchema.optional(),

  createdAt: z.date().transform((date) => date.toISOString())
})

// Create Place Schema with enhanced validation
export const CreatePlaceSchema = z.object({
  description: StringValidation.required
    .min(1, "Place description cannot be empty")
    .max(500, "Place description must be 500 characters or less")
    .refine((desc) => desc.trim().length > 0, "Place description cannot be only whitespace")
    .transform((desc) => desc.trim())
    .refine((desc) => !/^[0-9\s\-_]+$/.test(desc), "Place description must contain letters")
})

// Update Place Schema with enhanced validation
export const UpdatePlaceSchema = z.object({
  id: z.string().uuid("Must be a valid UUID"),

  description: StringValidation.required
    .min(1, "Place description cannot be empty")
    .max(500, "Place description must be 500 characters or less")
    .transform((desc) => desc.trim())
})

// Get Place by Slug Schema
export const GetPlaceBySlugSchema = z.object({
  slug: StringValidation.slug
    .min(1, "Slug is required")
    .max(100, "Slug must be 100 characters or less")
})

// Get Place by ID Schema
export const GetPlaceByIdSchema = z.object({
  id: z.string().uuid("Must be a valid UUID")
})

// Search Places Schema
export const SearchPlacesSchema = z.object({
  query: StringValidation.required
    .min(1, "Search query cannot be empty")
    .max(200, "Search query must be 200 characters or less")
    .transform((query) => query.trim()),

  limit: NumberValidation.range(1, 100).default(20),

  offset: NumberValidation.nonNegative.default(0)
})

// LLM Response Schema with enhanced validation
export const PlaceNormalizationSchema = z.object({
  slug: StringValidation.slug
    .min(1, "Slug is required")
    .max(100, "Slug must be 100 characters or less"),

  normalizedPlace: StringValidation.required
    .min(1, "Normalized place name is required")
    .max(200, "Normalized place name must be 200 characters or less"),

  confidence: NumberValidation.range(0, 1).refine(
    (val) => val >= 0 && val <= 1,
    "Confidence must be between 0 and 1"
  ),

  reasoning: z.string().max(1000, "Reasoning must be 1000 characters or less").optional()
})
