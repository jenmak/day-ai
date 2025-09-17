import { WeatherConditionEnum } from "../consts/WeatherConsts"
import { z } from "zod"

// Re-export the enum for backward compatibility
export { WeatherConditionEnum }

export const WeatherConditionZodEnum = z.nativeEnum(WeatherConditionEnum)

// Type exports
export type WeatherCondition = z.infer<typeof WeatherConditionZodEnum>
