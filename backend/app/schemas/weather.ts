import { z } from "zod"
import { ClothingCategoryEnum, TEMPERATURE_RANGES } from "../consts"

// Temperature range category enum
export const TemperatureRangeCategorySchema = z.enum([
  'VERY_HOT',
  'HOT', 
  'WARM',
  'MILD',
  'COOL',
  'COLD',
  'VERY_COLD'
] as const)

// Zod schema for Open-Meteo weather codes (using the numeric keys)
export const OpenMeteoWeatherCodeSchema = z.number().int().min(0).max(99)

// Open-Meteo API Response Schema
export const OpenMeteoDailySchema = z.object({
  time: z.array(z.string()),
  temperature_2m_max: z.array(z.number()),
  temperature_2m_min: z.array(z.number()),
  precipitation_probability_max: z.array(z.number()),
  windspeed_10m_max: z.array(z.number()),
  weathercode: z.array(z.number())
})

export const OpenMeteoResponseSchema = z.object({
  daily: OpenMeteoDailySchema
})

// Temperature Range Schema
export const TemperatureRangeSchema = z.object({
  temperatureMinimum: z.number(),
  temperatureMaximum: z.number(),
})

// Weather Schema
export const WeatherSchema = z.object({
  date: z.string(),
  degreesFahrenheit: z.number(),
  temperatureRange: TemperatureRangeSchema,
  temperatureRangeCategory: TemperatureRangeCategorySchema,
  rainProbabilityPercentage: z.number().min(0).max(100),
  windSpeedMph: z.number(),
  condition: OpenMeteoWeatherCodeSchema,
  clothing: z.array(z.nativeEnum(ClothingCategoryEnum))
})
