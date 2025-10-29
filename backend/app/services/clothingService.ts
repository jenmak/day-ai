import type {
  ClothingCategory,
  OpenMeteoWeatherCode
} from "../schemas"
import { getClothingRecommendations } from "../rules/clothingRules"

export class ClothingService {
  /**
   * Get clothing recommendations based on weather data
   */
  static getRecommendations(
    temperature: number,
    weatherCode: OpenMeteoWeatherCode,
    rainProbability: number,
    windSpeed: number
  ): ClothingCategory[] {
    return getClothingRecommendations(
      temperature,
      weatherCode,
      rainProbability,
      windSpeed
    )
  }
}
