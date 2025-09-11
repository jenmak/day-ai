import { type WeatherCondition, WeatherConditionEnum } from "#app/schemas/weatherConditions.ts"

// TikTok Shop Clothing Categories
export const ClothingCategoryEnum = {
  // Tops
  T_SHIRT: "t-shirt",
  TANK_TOP: "tank-top",
  LONG_SLEEVE: "long-sleeve",
  SWEATSHIRT: "sweatshirt",
  HOODIE: "hoodie",
  BLAZER: "blazer",
  JACKET: "jacket",
  COAT: "coat",
  RAIN_JACKET: "rain-jacket",
  WINTER_COAT: "winter-coat",
  
  // Bottoms
  SHORTS: "shorts",
  JEANS: "jeans",
  PANTS: "pants",
  LEGGINGS: "leggings",
  SWEATPANTS: "sweatpants",
  RAIN_PANTS: "rain-pants",
  
  // Dresses & Skirts
  DRESS: "dress",
  SKIRT: "skirt",
  MAXI_DRESS: "maxi-dress",
  MINI_DRESS: "mini-dress",
  
  // Footwear
  SNEAKERS: "sneakers",
  SANDALS: "sandals",
  BOOTS: "boots",
  RAIN_BOOTS: "rain-boots",
  WINTER_BOOTS: "winter-boots",
  HEELS: "heels",
  FLATS: "flats",
  
  // Accessories
  HAT: "hat",
  BEANIE: "beanie",
  SUN_HAT: "sun-hat",
  SCARF: "scarf",
  GLOVES: "gloves",
  UMBRELLA: "umbrella",
  SUNGLASSES: "sunglasses"
} as const

export type ClothingCategory = typeof ClothingCategoryEnum[keyof typeof ClothingCategoryEnum]

// Temperature ranges for clothing recommendations
export const TemperatureRanges = {
  VERY_HOT: { min: 85, max: 120 }, // 85°F+
  HOT: { min: 75, max: 84 },       // 75-84°F
  WARM: { min: 65, max: 74 },      // 65-74°F
  MILD: { min: 55, max: 64 },      // 55-64°F
  COOL: { min: 45, max: 54 },      // 45-54°F
  COLD: { min: 32, max: 44 },      // 32-44°F
  VERY_COLD: { min: -20, max: 31 } // Below 32°F
} as const

// Rules for weather conditions and clothing recommendations
export const WeatherClothingRules = {
  // Hot weather rules
  [WeatherConditionEnum.SUNNY]: {
    temperatureRanges: [TemperatureRanges.VERY_HOT, TemperatureRanges.HOT],
    recommended: [
      ClothingCategoryEnum.T_SHIRT,
      ClothingCategoryEnum.TANK_TOP,
      ClothingCategoryEnum.SHORTS,
      ClothingCategoryEnum.SANDALS,
      ClothingCategoryEnum.SUN_HAT,
      ClothingCategoryEnum.SUNGLASSES,
      ClothingCategoryEnum.DRESS,
      ClothingCategoryEnum.SKIRT
    ],
    avoid: [
      ClothingCategoryEnum.HOODIE,
      ClothingCategoryEnum.JACKET,
      ClothingCategoryEnum.COAT,
      ClothingCategoryEnum.LONG_SLEEVE,
      ClothingCategoryEnum.BOOTS
    ]
  },

  [WeatherConditionEnum.PARTLY_SUNNY]: {
    temperatureRanges: [TemperatureRanges.HOT, TemperatureRanges.WARM],
    recommended: [
      ClothingCategoryEnum.T_SHIRT,
      ClothingCategoryEnum.SHORTS,
      ClothingCategoryEnum.SNEAKERS,
      ClothingCategoryEnum.SUNGLASSES,
      ClothingCategoryEnum.DRESS
    ],
    avoid: [
      ClothingCategoryEnum.WINTER_COAT,
      ClothingCategoryEnum.RAIN_JACKET
    ]
  },

  // Warm weather rules
  [WeatherConditionEnum.PARTLY_CLOUDY]: {
    temperatureRanges: [TemperatureRanges.WARM, TemperatureRanges.MILD],
    recommended: [
      ClothingCategoryEnum.LONG_SLEEVE,
      ClothingCategoryEnum.JEANS,
      ClothingCategoryEnum.SNEAKERS,
      ClothingCategoryEnum.SWEATSHIRT
    ],
    avoid: [
      ClothingCategoryEnum.TANK_TOP,
      ClothingCategoryEnum.SHORTS
    ]
  },

  [WeatherConditionEnum.CLOUDY]: {
    temperatureRanges: [TemperatureRanges.MILD, TemperatureRanges.COOL],
    recommended: [
      ClothingCategoryEnum.LONG_SLEEVE,
      ClothingCategoryEnum.JEANS,
      ClothingCategoryEnum.SWEATSHIRT,
      ClothingCategoryEnum.SNEAKERS
    ],
    avoid: [
      ClothingCategoryEnum.TANK_TOP,
      ClothingCategoryEnum.SHORTS
    ]
  },

  // Rainy weather rules
  [WeatherConditionEnum.RAINY]: {
    temperatureRanges: [TemperatureRanges.MILD, TemperatureRanges.COOL],
    recommended: [
      ClothingCategoryEnum.RAIN_JACKET,
      ClothingCategoryEnum.RAIN_BOOTS,
      ClothingCategoryEnum.UMBRELLA,
      ClothingCategoryEnum.PANTS,
      ClothingCategoryEnum.LONG_SLEEVE
    ],
    avoid: [
      ClothingCategoryEnum.SANDALS,
      ClothingCategoryEnum.SHORTS,
      ClothingCategoryEnum.TANK_TOP
    ]
  },

  [WeatherConditionEnum.LIGHT_SHOWERS]: {
    temperatureRanges: [TemperatureRanges.WARM, TemperatureRanges.MILD],
    recommended: [
      ClothingCategoryEnum.RAIN_JACKET,
      ClothingCategoryEnum.UMBRELLA,
      ClothingCategoryEnum.SNEAKERS,
      ClothingCategoryEnum.LONG_SLEEVE
    ],
    avoid: [
      ClothingCategoryEnum.SANDALS,
      ClothingCategoryEnum.SHORTS
    ]
  },

  // Cold weather rules
  [WeatherConditionEnum.SNOWY]: {
    temperatureRanges: [TemperatureRanges.COLD, TemperatureRanges.VERY_COLD],
    recommended: [
      ClothingCategoryEnum.WINTER_COAT,
      ClothingCategoryEnum.WINTER_BOOTS,
      ClothingCategoryEnum.GLOVES,
      ClothingCategoryEnum.SCARF,
      ClothingCategoryEnum.BEANIE,
      ClothingCategoryEnum.LONG_SLEEVE,
      ClothingCategoryEnum.PANTS
    ],
    avoid: [
      ClothingCategoryEnum.SHORTS,
      ClothingCategoryEnum.SANDALS,
      ClothingCategoryEnum.TANK_TOP
    ]
  },

  // Stormy weather rules
  [WeatherConditionEnum.STORMY]: {
    temperatureRanges: [TemperatureRanges.MILD, TemperatureRanges.COOL],
    recommended: [
      ClothingCategoryEnum.RAIN_JACKET,
      ClothingCategoryEnum.RAIN_BOOTS,
      ClothingCategoryEnum.UMBRELLA,
      ClothingCategoryEnum.LONG_SLEEVE,
      ClothingCategoryEnum.PANTS
    ],
    avoid: [
      ClothingCategoryEnum.SANDALS,
      ClothingCategoryEnum.SHORTS,
      ClothingCategoryEnum.TANK_TOP
    ]
  },

  // Windy weather rules
  [WeatherConditionEnum.WINDY]: {
    temperatureRanges: [TemperatureRanges.COOL, TemperatureRanges.COLD],
    recommended: [
      ClothingCategoryEnum.JACKET,
      ClothingCategoryEnum.SCARF,
      ClothingCategoryEnum.LONG_SLEEVE,
      ClothingCategoryEnum.PANTS,
      ClothingCategoryEnum.SNEAKERS
    ],
    avoid: [
      ClothingCategoryEnum.SHORTS,
      ClothingCategoryEnum.SANDALS
    ]
  },

  // Foggy weather rules
  [WeatherConditionEnum.FOGGY]: {
    temperatureRanges: [TemperatureRanges.MILD, TemperatureRanges.COOL],
    recommended: [
      ClothingCategoryEnum.LONG_SLEEVE,
      ClothingCategoryEnum.JEANS,
      ClothingCategoryEnum.SWEATSHIRT,
      ClothingCategoryEnum.SNEAKERS
    ],
    avoid: [
      ClothingCategoryEnum.SHORTS,
      ClothingCategoryEnum.TANK_TOP
    ]
  }
} as const

// Rules engine function
export function getClothingRecommendations(
  temperature: number,
  condition: WeatherCondition,
  rainProbability: number,
  windSpeed: number
): ClothingCategory[] {
  const recommendations: ClothingCategory[] = []
  
  // Get base recommendations from weather condition
  const conditionRule = WeatherClothingRules[condition]
  if (conditionRule) {
    // Check if temperature falls within recommended ranges
    const isInRange = conditionRule.temperatureRanges.some(range => 
      temperature >= range.min && temperature <= range.max
    )
    
    if (isInRange) {
      recommendations.push(...conditionRule.recommended)
    }
  }
  
  // Add temperature-based recommendations
  if (temperature >= TemperatureRanges.VERY_HOT.min) {
    recommendations.push(
      ClothingCategoryEnum.TANK_TOP,
      ClothingCategoryEnum.SHORTS,
      ClothingCategoryEnum.SANDALS,
      ClothingCategoryEnum.SUN_HAT
    )
  } else if (temperature >= TemperatureRanges.HOT.min) {
    recommendations.push(
      ClothingCategoryEnum.T_SHIRT,
      ClothingCategoryEnum.SHORTS,
      ClothingCategoryEnum.SNEAKERS
    )
  } else if (temperature >= TemperatureRanges.WARM.min) {
    recommendations.push(
      ClothingCategoryEnum.LONG_SLEEVE,
      ClothingCategoryEnum.JEANS,
      ClothingCategoryEnum.SNEAKERS
    )
  } else if (temperature >= TemperatureRanges.MILD.min) {
    recommendations.push(
      ClothingCategoryEnum.SWEATSHIRT,
      ClothingCategoryEnum.JEANS,
      ClothingCategoryEnum.SNEAKERS
    )
  } else if (temperature >= TemperatureRanges.COOL.min) {
    recommendations.push(
      ClothingCategoryEnum.JACKET,
      ClothingCategoryEnum.PANTS,
      ClothingCategoryEnum.SNEAKERS
    )
  } else if (temperature >= TemperatureRanges.COLD.min) {
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
    recommendations.push(
      ClothingCategoryEnum.RAIN_JACKET,
      ClothingCategoryEnum.UMBRELLA
    )
    if (rainProbability > 70) {
      recommendations.push(ClothingCategoryEnum.RAIN_BOOTS)
    }
  }
  
  // Add wind-specific recommendations
  if (windSpeed > 15) {
    recommendations.push(
      ClothingCategoryEnum.SCARF,
      ClothingCategoryEnum.JACKET
    )
  }
  
  // Remove duplicates and return
  return [...new Set(recommendations)]
}

// Phase II: Function to get clothing recommendations for TikTok Shop API
export function getTikTokShopClothingQuery(
  temperature: number,
  condition: WeatherCondition,
  rainProbability: number,
  windSpeed: number
): string[] {
  const categories = getClothingRecommendations(temperature, condition, rainProbability, windSpeed)
  
  // Convert categories to search terms for TikTok Shop API
  return categories.map(category => {
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
