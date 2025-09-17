import { TEMPERATURE_RANGES } from "../consts/weather"

// Type for temperature range categories
export type TemperatureRangeCategory = keyof typeof TEMPERATURE_RANGES

/**
 * Determine the temperature range category based on temperature in Fahrenheit
 * @param temperature - Temperature in Fahrenheit
 * @returns The temperature range category (e.g., 'VERY_HOT', 'COLD', etc.)
 */
export function getTemperatureRangeCategory(temperature: number): TemperatureRangeCategory {
  if (temperature >= TEMPERATURE_RANGES.VERY_HOT.min) {
    return 'VERY_HOT'
  } else if (temperature >= TEMPERATURE_RANGES.HOT.min) {
    return 'HOT'
  } else if (temperature >= TEMPERATURE_RANGES.WARM.min) {
    return 'WARM'
  } else if (temperature >= TEMPERATURE_RANGES.MILD.min) {
    return 'MILD'
  } else if (temperature >= TEMPERATURE_RANGES.COOL.min) {
    return 'COOL'
  } else if (temperature >= TEMPERATURE_RANGES.COLD.min) {
    return 'COLD'
  } else {
    return 'VERY_COLD'
  }
}

/**
 * Get the average temperature range category from multiple temperature readings
 * @param temperatures - Array of temperatures in Fahrenheit
 * @returns The most common temperature range category
 */
export function getAverageTemperatureRangeCategory(temperatures: number[]): TemperatureRangeCategory {
  if (temperatures.length === 0) {
    return 'MILD' // Default fallback
  }

  // Count occurrences of each temperature range
  const rangeCounts: Record<TemperatureRangeCategory, number> = {
    VERY_HOT: 0,
    HOT: 0,
    WARM: 0,
    MILD: 0,
    COOL: 0,
    COLD: 0,
    VERY_COLD: 0
  }

  // Count each temperature's range
  temperatures.forEach(temp => {
    const range = getTemperatureRangeCategory(temp)
    rangeCounts[range]++
  })

  // Find the most common range
  let mostCommonRange: TemperatureRangeCategory = 'MILD'
  let maxCount = 0

  for (const [range, count] of Object.entries(rangeCounts) as [TemperatureRangeCategory, number][]) {
    if (count > maxCount) {
      maxCount = count
      mostCommonRange = range
    }
  }

  return mostCommonRange
}

/**
 * Get temperature range category for a place based on its weather data
 * @param weatherData - Array of weather data for the place
 * @returns The temperature range category for the place
 */
export function getPlaceTemperatureRangeCategory(weatherData: Array<{ degreesFahrenheit: number }>): TemperatureRangeCategory {
  const temperatures = weatherData.map(weather => weather.degreesFahrenheit)
  return getAverageTemperatureRangeCategory(temperatures)
}

/**
 * Ensure temperature range category is calculated for existing places
 * @param model - The place model
 * @returns The place model with the temperature range category
 */
export function ensureTemperatureRangeCategory(model: any) {
  if (!model.temperatureRangeCategory && model.weather && model.weather.length > 0) {
    model.temperatureRangeCategory = getPlaceTemperatureRangeCategory(model.weather)
  }
  return model
}
