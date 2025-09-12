import { z } from "zod"
import { ClothingCategoryEnum } from "#app/rules/clothingRules.ts"
import { WeatherConditionEnum, WeatherConditionZodEnum } from "#app/schemas/weatherConditions.ts"

// Temperature Range Schema
export const TemperatureRangeSchema = z.object({
  temperatureMinimum: z.number(),
  temperatureMaximum: z.number(),
})

// Weather Schema
export const WeatherSchema = z.object({
  date: z.string().transform((str) => new Date(str)),
  degreesFahrenheit: z.number(),
  degreesCelsius: z.number(),
  temperatureRange: TemperatureRangeSchema,
  rainProbabilityPercentage: z.number().min(0).max(100),
  windSpeedMph: z.number(),
  condition: WeatherConditionZodEnum,
  clothing: z.array(z.nativeEnum(ClothingCategoryEnum))
  // Phase II: Add ClothingSchema
  // clothing: z.array(ClothingSchema)
})

// Type exports
export type WeatherCondition = z.infer<typeof WeatherConditionZodEnum>
export type TemperatureRange = z.infer<typeof TemperatureRangeSchema>
export type Weather = z.infer<typeof WeatherSchema>
