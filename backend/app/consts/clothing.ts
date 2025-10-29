import { TEMPERATURE_RANGES } from "./weather"

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

// Rules for weather conditions and clothing recommendations using Open-Meteo codes
export const WEATHER_CLOTHING_RULES = {
  // Clear/Sunny weather (codes 0, 1)
  0: {
    TEMPERATURE_RANGES: [TEMPERATURE_RANGES.VERY_HOT, TEMPERATURE_RANGES.HOT],
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

  1: {
    TEMPERATURE_RANGES: [TEMPERATURE_RANGES.HOT, TEMPERATURE_RANGES.WARM],
    recommended: [
      ClothingCategoryEnum.T_SHIRT,
      ClothingCategoryEnum.SHORTS,
      ClothingCategoryEnum.SNEAKERS,
      ClothingCategoryEnum.SUNGLASSES,
      ClothingCategoryEnum.DRESS
    ],
    avoid: [ClothingCategoryEnum.WINTER_COAT, ClothingCategoryEnum.RAIN_JACKET]
  },

  // Partly cloudy (code 2)
  2: {
    TEMPERATURE_RANGES: [TEMPERATURE_RANGES.WARM, TEMPERATURE_RANGES.MILD],
    recommended: [
      ClothingCategoryEnum.LONG_SLEEVE,
      ClothingCategoryEnum.JEANS,
      ClothingCategoryEnum.SNEAKERS,
      ClothingCategoryEnum.SWEATSHIRT
    ],
    avoid: [ClothingCategoryEnum.TANK_TOP, ClothingCategoryEnum.SHORTS]
  },

  // Overcast (code 3)
  3: {
    TEMPERATURE_RANGES: [TEMPERATURE_RANGES.MILD, TEMPERATURE_RANGES.COOL],
    recommended: [
      ClothingCategoryEnum.LONG_SLEEVE,
      ClothingCategoryEnum.JEANS,
      ClothingCategoryEnum.SWEATSHIRT,
      ClothingCategoryEnum.SNEAKERS
    ],
    avoid: [ClothingCategoryEnum.TANK_TOP, ClothingCategoryEnum.SHORTS]
  },

  // Foggy weather (codes 45, 48)
  45: {
    TEMPERATURE_RANGES: [TEMPERATURE_RANGES.MILD, TEMPERATURE_RANGES.COOL],
    recommended: [
      ClothingCategoryEnum.LONG_SLEEVE,
      ClothingCategoryEnum.JEANS,
      ClothingCategoryEnum.SWEATSHIRT,
      ClothingCategoryEnum.SNEAKERS
    ],
    avoid: [ClothingCategoryEnum.SHORTS, ClothingCategoryEnum.TANK_TOP]
  },

  48: {
    TEMPERATURE_RANGES: [TEMPERATURE_RANGES.COLD, TEMPERATURE_RANGES.VERY_COLD],
    recommended: [
      ClothingCategoryEnum.JACKET,
      ClothingCategoryEnum.PANTS,
      ClothingCategoryEnum.BOOTS,
      ClothingCategoryEnum.SCARF
    ],
    avoid: [ClothingCategoryEnum.SHORTS, ClothingCategoryEnum.SANDALS]
  },

  // Light precipitation (codes 51, 53, 55, 56, 57, 80, 81)
  51: {
    TEMPERATURE_RANGES: [TEMPERATURE_RANGES.WARM, TEMPERATURE_RANGES.MILD],
    recommended: [
      ClothingCategoryEnum.RAIN_JACKET,
      ClothingCategoryEnum.UMBRELLA,
      ClothingCategoryEnum.SNEAKERS,
      ClothingCategoryEnum.LONG_SLEEVE
    ],
    avoid: [ClothingCategoryEnum.SANDALS, ClothingCategoryEnum.SHORTS]
  },

  53: {
    TEMPERATURE_RANGES: [TEMPERATURE_RANGES.WARM, TEMPERATURE_RANGES.MILD],
    recommended: [
      ClothingCategoryEnum.RAIN_JACKET,
      ClothingCategoryEnum.UMBRELLA,
      ClothingCategoryEnum.SNEAKERS,
      ClothingCategoryEnum.LONG_SLEEVE
    ],
    avoid: [ClothingCategoryEnum.SANDALS, ClothingCategoryEnum.SHORTS]
  },

  55: {
    TEMPERATURE_RANGES: [TEMPERATURE_RANGES.WARM, TEMPERATURE_RANGES.MILD],
    recommended: [
      ClothingCategoryEnum.RAIN_JACKET,
      ClothingCategoryEnum.UMBRELLA,
      ClothingCategoryEnum.SNEAKERS,
      ClothingCategoryEnum.LONG_SLEEVE
    ],
    avoid: [ClothingCategoryEnum.SANDALS, ClothingCategoryEnum.SHORTS]
  },

  56: {
    TEMPERATURE_RANGES: [TEMPERATURE_RANGES.COOL, TEMPERATURE_RANGES.COLD],
    recommended: [
      ClothingCategoryEnum.RAIN_JACKET,
      ClothingCategoryEnum.UMBRELLA,
      ClothingCategoryEnum.BOOTS,
      ClothingCategoryEnum.LONG_SLEEVE,
      ClothingCategoryEnum.GLOVES
    ],
    avoid: [ClothingCategoryEnum.SANDALS, ClothingCategoryEnum.SHORTS]
  },

  57: {
    TEMPERATURE_RANGES: [TEMPERATURE_RANGES.COOL, TEMPERATURE_RANGES.COLD],
    recommended: [
      ClothingCategoryEnum.RAIN_JACKET,
      ClothingCategoryEnum.UMBRELLA,
      ClothingCategoryEnum.BOOTS,
      ClothingCategoryEnum.LONG_SLEEVE,
      ClothingCategoryEnum.GLOVES
    ],
    avoid: [ClothingCategoryEnum.SANDALS, ClothingCategoryEnum.SHORTS]
  },

  80: {
    TEMPERATURE_RANGES: [TEMPERATURE_RANGES.WARM, TEMPERATURE_RANGES.MILD],
    recommended: [
      ClothingCategoryEnum.RAIN_JACKET,
      ClothingCategoryEnum.UMBRELLA,
      ClothingCategoryEnum.SNEAKERS,
      ClothingCategoryEnum.LONG_SLEEVE
    ],
    avoid: [ClothingCategoryEnum.SANDALS, ClothingCategoryEnum.SHORTS]
  },

  81: {
    TEMPERATURE_RANGES: [TEMPERATURE_RANGES.WARM, TEMPERATURE_RANGES.MILD],
    recommended: [
      ClothingCategoryEnum.RAIN_JACKET,
      ClothingCategoryEnum.UMBRELLA,
      ClothingCategoryEnum.SNEAKERS,
      ClothingCategoryEnum.LONG_SLEEVE
    ],
    avoid: [ClothingCategoryEnum.SANDALS, ClothingCategoryEnum.SHORTS]
  },

  // Heavy precipitation (codes 61, 63, 65, 66, 67, 82)
  61: {
    TEMPERATURE_RANGES: [TEMPERATURE_RANGES.MILD, TEMPERATURE_RANGES.COOL],
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

  63: {
    TEMPERATURE_RANGES: [TEMPERATURE_RANGES.MILD, TEMPERATURE_RANGES.COOL],
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

  65: {
    TEMPERATURE_RANGES: [TEMPERATURE_RANGES.MILD, TEMPERATURE_RANGES.COOL],
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

  66: {
    TEMPERATURE_RANGES: [TEMPERATURE_RANGES.COOL, TEMPERATURE_RANGES.COLD],
    recommended: [
      ClothingCategoryEnum.RAIN_JACKET,
      ClothingCategoryEnum.RAIN_BOOTS,
      ClothingCategoryEnum.UMBRELLA,
      ClothingCategoryEnum.PANTS,
      ClothingCategoryEnum.LONG_SLEEVE,
      ClothingCategoryEnum.GLOVES
    ],
    avoid: [
      ClothingCategoryEnum.SANDALS,
      ClothingCategoryEnum.SHORTS,
      ClothingCategoryEnum.TANK_TOP
    ]
  },

  67: {
    TEMPERATURE_RANGES: [TEMPERATURE_RANGES.COOL, TEMPERATURE_RANGES.COLD],
    recommended: [
      ClothingCategoryEnum.RAIN_JACKET,
      ClothingCategoryEnum.RAIN_BOOTS,
      ClothingCategoryEnum.UMBRELLA,
      ClothingCategoryEnum.PANTS,
      ClothingCategoryEnum.LONG_SLEEVE,
      ClothingCategoryEnum.GLOVES
    ],
    avoid: [
      ClothingCategoryEnum.SANDALS,
      ClothingCategoryEnum.SHORTS,
      ClothingCategoryEnum.TANK_TOP
    ]
  },

  82: {
    TEMPERATURE_RANGES: [TEMPERATURE_RANGES.MILD, TEMPERATURE_RANGES.COOL],
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

  // Snow (codes 71, 73, 75, 77, 85, 86)
  71: {
    TEMPERATURE_RANGES: [TEMPERATURE_RANGES.COLD, TEMPERATURE_RANGES.VERY_COLD],
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

  73: {
    TEMPERATURE_RANGES: [TEMPERATURE_RANGES.COLD, TEMPERATURE_RANGES.VERY_COLD],
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

  75: {
    TEMPERATURE_RANGES: [TEMPERATURE_RANGES.COLD, TEMPERATURE_RANGES.VERY_COLD],
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

  77: {
    TEMPERATURE_RANGES: [TEMPERATURE_RANGES.COLD, TEMPERATURE_RANGES.VERY_COLD],
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

  85: {
    TEMPERATURE_RANGES: [TEMPERATURE_RANGES.COLD, TEMPERATURE_RANGES.VERY_COLD],
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

  86: {
    TEMPERATURE_RANGES: [TEMPERATURE_RANGES.COLD, TEMPERATURE_RANGES.VERY_COLD],
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

  // Thunderstorms (codes 95, 96, 99)
  95: {
    TEMPERATURE_RANGES: [TEMPERATURE_RANGES.MILD, TEMPERATURE_RANGES.COOL],
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

  96: {
    TEMPERATURE_RANGES: [TEMPERATURE_RANGES.MILD, TEMPERATURE_RANGES.COOL],
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

  99: {
    TEMPERATURE_RANGES: [TEMPERATURE_RANGES.MILD, TEMPERATURE_RANGES.COOL],
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
  }
} as const
