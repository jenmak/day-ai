import { TEMPERATURE_RANGES, ClothingCategoryEnum, WEATHER_CLOTHING_RULES } from "../consts"
import { ClothingCategory, OpenMeteoWeatherCode } from "../types"

// Rules engine function
export function getClothingRecommendations(
  temperature: number,
  weatherCode: OpenMeteoWeatherCode,
  rainProbability: number,
  windSpeed: number
): ClothingCategory[] {
  const recommendations: ClothingCategory[] = []

  // Get base recommendations from weather code
  const conditionRule = WEATHER_CLOTHING_RULES[weatherCode]
  if (conditionRule) {
    // Check if temperature falls within recommended ranges
    const isInRange = conditionRule.TEMPERATURE_RANGES.some(
      (range) => temperature >= range.min && temperature <= range.max
    )

    if (isInRange) {
      recommendations.push(...conditionRule.recommended)
    }
  }

  // Add temperature-based recommendations
  if (temperature >= TEMPERATURE_RANGES.VERY_HOT.min) {
    recommendations.push(
      ClothingCategoryEnum.TANK_TOP,
      ClothingCategoryEnum.SHORTS,
      ClothingCategoryEnum.SANDALS,
      ClothingCategoryEnum.SUN_HAT
    )
  } else if (temperature >= TEMPERATURE_RANGES.HOT.min) {
    recommendations.push(
      ClothingCategoryEnum.T_SHIRT,
      ClothingCategoryEnum.SHORTS,
      ClothingCategoryEnum.SNEAKERS
    )
  } else if (temperature >= TEMPERATURE_RANGES.WARM.min) {
    recommendations.push(
      ClothingCategoryEnum.LONG_SLEEVE,
      ClothingCategoryEnum.JEANS,
      ClothingCategoryEnum.SNEAKERS
    )
  } else if (temperature >= TEMPERATURE_RANGES.MILD.min) {
    recommendations.push(
      ClothingCategoryEnum.SWEATSHIRT,
      ClothingCategoryEnum.JEANS,
      ClothingCategoryEnum.SNEAKERS
    )
  } else if (temperature >= TEMPERATURE_RANGES.COOL.min) {
    recommendations.push(
      ClothingCategoryEnum.JACKET,
      ClothingCategoryEnum.PANTS,
      ClothingCategoryEnum.SNEAKERS
    )
  } else if (temperature >= TEMPERATURE_RANGES.COLD.min) {
    recommendations.push(
      ClothingCategoryEnum.COAT,
      ClothingCategoryEnum.PANTS,
      ClothingCategoryEnum.BOOTS
    )
  } else {
    recommendations.push(
      ClothingCategoryEnum.WINTER_COAT,
      ClothingCategoryEnum.WINTER_BOOTS,
      ClothingCategoryEnum.GLOVES,
      ClothingCategoryEnum.SCARF
    )
  }

  // Add rain-specific recommendations
  if (rainProbability > 30) {
    recommendations.push(ClothingCategoryEnum.RAIN_JACKET, ClothingCategoryEnum.UMBRELLA)
    if (rainProbability > 70) {
      recommendations.push(ClothingCategoryEnum.RAIN_BOOTS)
    }
  }

  // Add wind-specific recommendations
  if (windSpeed > 15) {
    recommendations.push(ClothingCategoryEnum.SCARF, ClothingCategoryEnum.JACKET)
  }

  // Remove duplicates and return
  return [...new Set(recommendations)]
}

export function getTikTokShopClothingQuery(
  temperature: number,
  weatherCode: OpenMeteoWeatherCode,
  rainProbability: number,
  windSpeed: number
): string[] {
  const categories = getClothingRecommendations(
    temperature,
    weatherCode,
    rainProbability,
    windSpeed
  )

  // Convert categories to search terms for TikTok Shop API
  return categories.map((category) => {
    switch (category) {
      case ClothingCategoryEnum.T_SHIRT:
        return "t-shirt"
      case ClothingCategoryEnum.TANK_TOP:
        return "tank top"
      case ClothingCategoryEnum.LONG_SLEEVE:
        return "long sleeve shirt"
      case ClothingCategoryEnum.SWEATSHIRT:
        return "sweatshirt"
      case ClothingCategoryEnum.HOODIE:
        return "hoodie"
      case ClothingCategoryEnum.JACKET:
        return "jacket"
      case ClothingCategoryEnum.COAT:
        return "coat"
      case ClothingCategoryEnum.RAIN_JACKET:
        return "rain jacket"
      case ClothingCategoryEnum.WINTER_COAT:
        return "winter coat"
      case ClothingCategoryEnum.SHORTS:
        return "shorts"
      case ClothingCategoryEnum.JEANS:
        return "jeans"
      case ClothingCategoryEnum.PANTS:
        return "pants"
      case ClothingCategoryEnum.LEGGINGS:
        return "leggings"
      case ClothingCategoryEnum.SWEATPANTS:
        return "sweatpants"
      case ClothingCategoryEnum.DRESS:
        return "dress"
      case ClothingCategoryEnum.SKIRT:
        return "skirt"
      case ClothingCategoryEnum.SNEAKERS:
        return "sneakers"
      case ClothingCategoryEnum.SANDALS:
        return "sandals"
      case ClothingCategoryEnum.BOOTS:
        return "boots"
      case ClothingCategoryEnum.RAIN_BOOTS:
        return "rain boots"
      case ClothingCategoryEnum.WINTER_BOOTS:
        return "winter boots"
      case ClothingCategoryEnum.HAT:
        return "hat"
      case ClothingCategoryEnum.BEANIE:
        return "beanie"
      case ClothingCategoryEnum.SUN_HAT:
        return "sun hat"
      case ClothingCategoryEnum.SCARF:
        return "scarf"
      case ClothingCategoryEnum.GLOVES:
        return "gloves"
      case ClothingCategoryEnum.UMBRELLA:
        return "umbrella"
      case ClothingCategoryEnum.SUNGLASSES:
        return "sunglasses"
      default:
        return category
    }
  })
}
