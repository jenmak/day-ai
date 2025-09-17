import type { OpenMeteoWeatherCode, ClothingCategory } from "../types"
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
    return getClothingRecommendations(temperature, weatherCode, rainProbability, windSpeed)
  }
  /**
   * Get clothing recommendations for a specific date
   */
  static getRecommendationsForDate(
    weatherData: {
      temperature: number
      weatherCode: OpenMeteoWeatherCode
      rainProbability: number
      windSpeed: number
    }
  ): {
    categories: ClothingCategory[]
  } {
    const categories = this.getRecommendations(
      weatherData.temperature,
      weatherData.weatherCode,
      weatherData.rainProbability,
      weatherData.windSpeed
    )

    return {
      categories,
    }
  }

  /**
   * Get weather-appropriate clothing score (0-100)
   * Higher score means more weather-appropriate
   */
  static getWeatherAppropriatenessScore(
    clothingCategory: ClothingCategory,
    temperature: number,
    weatherCode: OpenMeteoWeatherCode,
    rainProbability: number,
    windSpeed: number
  ): number {
    const recommendations = this.getRecommendations(temperature, weatherCode, rainProbability, windSpeed)
    
    if (recommendations.includes(clothingCategory)) {
      return 100
    }

    // Calculate partial score based on temperature appropriateness
    let score = 0
    
    // Temperature-based scoring
    if (temperature >= 85) {
      // Hot weather - prefer light clothing
      if (['t-shirt', 'tank-top', 'shorts', 'sandals', 'dress', 'skirt'].includes(clothingCategory)) {
        score += 80
      } else if (['long-sleeve', 'jeans', 'sneakers'].includes(clothingCategory)) {
        score += 40
      } else if (['hoodie', 'jacket', 'coat', 'boots'].includes(clothingCategory)) {
        score += 10
      }
    } else if (temperature >= 75) {
      // Warm weather
      if (['t-shirt', 'shorts', 'sneakers', 'dress'].includes(clothingCategory)) {
        score += 90
      } else if (['long-sleeve', 'jeans', 'sweatshirt'].includes(clothingCategory)) {
        score += 70
      } else if (['jacket', 'coat'].includes(clothingCategory)) {
        score += 30
      }
    } else if (temperature >= 65) {
      // Mild weather
      if (['long-sleeve', 'jeans', 'sneakers', 'sweatshirt'].includes(clothingCategory)) {
        score += 90
      } else if (['t-shirt', 'shorts'].includes(clothingCategory)) {
        score += 50
      } else if (['jacket', 'coat'].includes(clothingCategory)) {
        score += 60
      }
    } else if (temperature >= 45) {
      // Cool weather
      if (['jacket', 'pants', 'sneakers', 'long-sleeve'].includes(clothingCategory)) {
        score += 90
      } else if (['coat', 'boots'].includes(clothingCategory)) {
        score += 70
      } else if (['t-shirt', 'shorts'].includes(clothingCategory)) {
        score += 20
      }
    } else {
      // Cold weather
      if (['coat', 'winter-coat', 'boots', 'winter-boots', 'gloves', 'scarf'].includes(clothingCategory)) {
        score += 95
      } else if (['jacket', 'pants', 'long-sleeve'].includes(clothingCategory)) {
        score += 60
      } else if (['t-shirt', 'shorts', 'sandals'].includes(clothingCategory)) {
        score += 5
      }
    }

    // Rain probability adjustment
    if (rainProbability > 50) {
      if (['rain-jacket', 'rain-boots', 'umbrella'].includes(clothingCategory)) {
        score += 20
      } else if (['sandals', 'shorts', 'tank-top'].includes(clothingCategory)) {
        score -= 30
      }
    }

    // Wind speed adjustment
    if (windSpeed > 15) {
      if (['scarf', 'jacket', 'coat'].includes(clothingCategory)) {
        score += 15
      } else if (['dress', 'skirt'].includes(clothingCategory)) {
        score -= 20
      }
    }

    return Math.max(0, Math.min(100, score))
  }
}
