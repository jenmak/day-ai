import { z } from "zod"
import { ClothingCategoryEnum } from "../consts"
import { DateValidation, NumberValidation } from "./validation"

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
        0, 1, 2, 3, 45, 48, 51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 71, 73, 75, 77, 80, 81, 82, 85,
        86, 95, 96, 99
      ].includes(code),
    "Must be a valid Open-Meteo weather code"
  )

// Enhanced Open-Meteo API Response Schema
export const OpenMeteoDailySchema = z
  .object({
    time: z
      .array(DateValidation.isoString)
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
  .refine((data) => data.daily.time.length > 0, "Weather data must contain at least one day")

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
    date: DateValidation.isoString,

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

// Weather Request Schema
export const WeatherRequestSchema = z.object({
  latitude: NumberValidation.latitude,
  longitude: NumberValidation.longitude,
  days: NumberValidation.range(1, 14).default(7),
  unit: z.enum(["fahrenheit", "celsius"]).default("fahrenheit"),
  timezone: z.string().max(50).optional()
})

// Weather Forecast Schema
export const WeatherForecastSchema = z.object({
  location: z.object({
    latitude: NumberValidation.latitude,
    longitude: NumberValidation.longitude,
    name: z.string().max(200).optional()
  }),
  forecast: z.array(WeatherSchema).min(1).max(14),
  generatedAt: DateValidation.isoString,
  validUntil: DateValidation.isoString
})

// Weather Condition Schema
export const WeatherConditionSchema = z.object({
  code: OpenMeteoWeatherCodeSchema,
  name: z.string().max(50),
  description: z.string().max(200),
  icon: z.string().max(50).optional()
})
