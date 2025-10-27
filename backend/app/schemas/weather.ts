import { z } from "zod"
import { ClothingCategoryEnum } from "../consts"
import { NumberValidation } from "./validation"

// Temperature range category enum with enhanced validation
export const TemperatureRangeCategorySchema = z.enum(
  ["VERY_HOT", "HOT", "WARM", "MILD", "COOL", "COLD", "VERY_COLD"] as const,
  {
    errorMap: () => ({ message: "Must be a valid temperature range category" })
  }
)

// Enhanced Open-Meteo weather codes schema
export const OpenMeteoWeatherCodeSchema = z
  .number()
  .int("Weather code must be an integer")
  .min(0, "Weather code must be non-negative")
  .max(99, "Weather code must be 99 or less")
  .refine(
    (code) =>
      [
        0, 1, 2, 3, 45, 48, 51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 71, 73, 75,
        77, 80, 81, 82, 85, 86, 95, 96, 99
      ].includes(code),
    "Must be a valid Open-Meteo weather code"
  )

// Enhanced Open-Meteo API Response Schema
export const OpenMeteoDailySchema = z
  .object({
    time: z
      .array(
        z
          .string()
          .regex(
            /^\d{4}-\d{2}-\d{2}$/,
            "Must be a valid date string (YYYY-MM-DD)"
          )
      )
      .min(1, "Time array cannot be empty")
      .max(14, "Cannot request more than 14 days"),

    temperature_2m_max: z
      .array(NumberValidation.temperatureF)
      .min(1, "Temperature max array cannot be empty")
      .max(14, "Cannot request more than 14 days"),

    temperature_2m_min: z
      .array(NumberValidation.temperatureF)
      .min(1, "Temperature min array cannot be empty")
      .max(14, "Cannot request more than 14 days"),

    precipitation_probability_max: z
      .array(NumberValidation.percentage)
      .min(1, "Precipitation probability array cannot be empty")
      .max(14, "Cannot request more than 14 days"),

    windspeed_10m_max: z
      .array(NumberValidation.windSpeedMph)
      .min(1, "Wind speed array cannot be empty")
      .max(14, "Cannot request more than 14 days"),

    weathercode: z
      .array(OpenMeteoWeatherCodeSchema)
      .min(1, "Weather code array cannot be empty")
      .max(14, "Cannot request more than 14 days")
  })
  .refine((data) => {
    const arrayLengths = [
      data.time.length,
      data.temperature_2m_max.length,
      data.temperature_2m_min.length,
      data.precipitation_probability_max.length,
      data.windspeed_10m_max.length,
      data.weathercode.length
    ]
    return arrayLengths.every((length) => length === arrayLengths[0])
  }, "All weather data arrays must have the same length")

export const OpenMeteoResponseSchema = z
  .object({
    daily: OpenMeteoDailySchema
  })
  .refine(
    (data) => data.daily.time.length > 0,
    "Weather data must contain at least one day"
  )

// Enhanced Temperature Range Schema
export const TemperatureRangeSchema = z
  .object({
    temperatureMinimum: NumberValidation.temperatureF,
    temperatureMaximum: NumberValidation.temperatureF
  })
  .refine(
    (range) => range.temperatureMinimum <= range.temperatureMaximum,
    "Minimum temperature must be less than or equal to maximum temperature"
  )

// Enhanced Weather Schema
export const WeatherSchema = z
  .object({
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Must be a valid date string (YYYY-MM-DD)"),

    degreesFahrenheit: NumberValidation.temperatureF,

    temperatureRange: TemperatureRangeSchema,

    temperatureRangeCategory: TemperatureRangeCategorySchema,

    rainProbabilityPercentage: NumberValidation.percentage,

    windSpeedMph: NumberValidation.windSpeedMph,

    condition: OpenMeteoWeatherCodeSchema,

    clothing: z
      .array(z.nativeEnum(ClothingCategoryEnum))
      .min(1, "At least one clothing recommendation is required")
      .max(10, "Cannot have more than 10 clothing recommendations")
  })
  .refine((weather) => {
    const tempRange = weather.temperatureRange
    return (
      weather.degreesFahrenheit >= tempRange.temperatureMinimum &&
      weather.degreesFahrenheit <= tempRange.temperatureMaximum
    )
  }, "Current temperature must be within the temperature range")
