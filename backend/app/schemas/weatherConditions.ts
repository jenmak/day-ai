import { z } from "zod"

// Weather Condition Enum
export const WeatherConditionEnum = {
  PARTLY_SUNNY: "PartlySunny",
  SUNNY: "Sunny",
  PARTLY_CLOUDY: "PartlyCloudy",
  CLOUDY: "Cloudy",
  RAINY: "Rainy",
  LIGHT_SHOWERS: "LightShowers",
  SNOWY: "Snowy",
  STORMY: "Stormy",
  FOGGY: "Foggy",
  WINDY: "Windy"
} as const

export const WeatherConditionZodEnum = z.nativeEnum(WeatherConditionEnum)

// Type exports
export type WeatherCondition = z.infer<typeof WeatherConditionZodEnum>
