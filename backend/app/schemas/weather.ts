import { z } from "zod"
import { ClothingCategoryEnum } from "../rules/clothingRules"
import { WeatherConditionZodEnum } from "./weatherConditions"

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
  rainProbabilityPercentage: z.number().min(0).max(100),
  windSpeedMph: z.number(),
  condition: WeatherConditionZodEnum,
  clothing: z.array(z.nativeEnum(ClothingCategoryEnum))
})

// Type exports
export type TemperatureRange = z.infer<typeof TemperatureRangeSchema>
export type Weather = z.infer<typeof WeatherSchema>
