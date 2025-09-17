var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/index.ts
import { config as config2 } from "dotenv";
import { Hono } from "hono";
import { cors } from "hono/cors";

// app/schemas/place.ts
import { z as z2 } from "zod";

// app/schemas/weather.ts
import { z } from "zod";

// app/consts/index.ts
import { config } from "dotenv";

// app/consts/weather.ts
var TEMPERATURE_RANGES = {
  VERY_HOT: { min: 85, max: 120 },
  // 85°F+
  HOT: { min: 75, max: 84 },
  // 75-84°F
  WARM: { min: 65, max: 74 },
  // 65-74°F
  MILD: { min: 55, max: 64 },
  // 55-64°F
  COOL: { min: 45, max: 54 },
  // 45-54°F
  COLD: { min: 32, max: 44 },
  // 32-44°F
  VERY_COLD: { min: -20, max: 31 }
  // Below 32°F
};

// app/consts/clothing.ts
var ClothingCategoryEnum = {
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
};
var WEATHER_CLOTHING_RULES = {
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
    avoid: [
      ClothingCategoryEnum.WINTER_COAT,
      ClothingCategoryEnum.RAIN_JACKET
    ]
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
    avoid: [
      ClothingCategoryEnum.TANK_TOP,
      ClothingCategoryEnum.SHORTS
    ]
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
    avoid: [
      ClothingCategoryEnum.TANK_TOP,
      ClothingCategoryEnum.SHORTS
    ]
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
    avoid: [
      ClothingCategoryEnum.SHORTS,
      ClothingCategoryEnum.TANK_TOP
    ]
  },
  48: {
    TEMPERATURE_RANGES: [TEMPERATURE_RANGES.COLD, TEMPERATURE_RANGES.VERY_COLD],
    recommended: [
      ClothingCategoryEnum.JACKET,
      ClothingCategoryEnum.PANTS,
      ClothingCategoryEnum.BOOTS,
      ClothingCategoryEnum.SCARF
    ],
    avoid: [
      ClothingCategoryEnum.SHORTS,
      ClothingCategoryEnum.SANDALS
    ]
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
    avoid: [
      ClothingCategoryEnum.SANDALS,
      ClothingCategoryEnum.SHORTS
    ]
  },
  53: {
    TEMPERATURE_RANGES: [TEMPERATURE_RANGES.WARM, TEMPERATURE_RANGES.MILD],
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
  55: {
    TEMPERATURE_RANGES: [TEMPERATURE_RANGES.WARM, TEMPERATURE_RANGES.MILD],
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
  56: {
    TEMPERATURE_RANGES: [TEMPERATURE_RANGES.COOL, TEMPERATURE_RANGES.COLD],
    recommended: [
      ClothingCategoryEnum.RAIN_JACKET,
      ClothingCategoryEnum.UMBRELLA,
      ClothingCategoryEnum.BOOTS,
      ClothingCategoryEnum.LONG_SLEEVE,
      ClothingCategoryEnum.GLOVES
    ],
    avoid: [
      ClothingCategoryEnum.SANDALS,
      ClothingCategoryEnum.SHORTS
    ]
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
    avoid: [
      ClothingCategoryEnum.SANDALS,
      ClothingCategoryEnum.SHORTS
    ]
  },
  80: {
    TEMPERATURE_RANGES: [TEMPERATURE_RANGES.WARM, TEMPERATURE_RANGES.MILD],
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
  81: {
    TEMPERATURE_RANGES: [TEMPERATURE_RANGES.WARM, TEMPERATURE_RANGES.MILD],
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
};

// app/consts/place.ts
var CITY_COORDINATES = {
  "new york": { lat: 40.7128, lng: -74.006 },
  "los angeles": { lat: 34.0522, lng: -118.2437 },
  "chicago": { lat: 41.8781, lng: -87.6298 },
  "houston": { lat: 29.7604, lng: -95.3698 },
  "phoenix": { lat: 33.4484, lng: -112.074 },
  "philadelphia": { lat: 39.9526, lng: -75.1652 },
  "san antonio": { lat: 29.4241, lng: -98.4936 },
  "san diego": { lat: 32.7157, lng: -117.1611 },
  "dallas": { lat: 32.7767, lng: -96.797 },
  "san jose": { lat: 37.3382, lng: -121.8863 },
  "austin": { lat: 30.2672, lng: -97.7431 },
  "jacksonville": { lat: 30.3322, lng: -81.6557 },
  "fort worth": { lat: 32.7555, lng: -97.3308 },
  "columbus": { lat: 39.9612, lng: -82.9988 },
  "charlotte": { lat: 35.2271, lng: -80.8431 },
  "seattle": { lat: 47.6062, lng: -122.3321 },
  "denver": { lat: 39.7392, lng: -104.9903 },
  "washington": { lat: 38.9072, lng: -77.0369 },
  "boston": { lat: 42.3601, lng: -71.0589 },
  "detroit": { lat: 42.3314, lng: -83.0458 },
  "nashville": { lat: 36.1627, lng: -86.7816 },
  "portland": { lat: 45.5152, lng: -122.6784 },
  "las vegas": { lat: 36.1699, lng: -115.1398 },
  "baltimore": { lat: 39.2904, lng: -76.6122 },
  "milwaukee": { lat: 43.0389, lng: -87.9065 },
  "albuquerque": { lat: 35.0844, lng: -106.6504 },
  "tucson": { lat: 32.2226, lng: -110.9747 },
  "fresno": { lat: 36.7378, lng: -119.7871 },
  "mesa": { lat: 33.4152, lng: -111.8315 }
};
var MOCK_MAPPINGS = {
  "gotham city": {
    normalizedPlace: "New York, NY",
    slug: "new-york-ny",
    confidence: 0.95,
    reasoning: "Gotham City is commonly associated with New York City in popular culture"
  },
  "metropolis": {
    normalizedPlace: "New York, NY",
    slug: "new-york-ny",
    confidence: 0.9,
    reasoning: "Metropolis is often depicted as New York City in Superman comics"
  },
  "springfield": {
    normalizedPlace: "Springfield, IL",
    slug: "springfield-il",
    confidence: 0.85,
    reasoning: "Springfield could refer to multiple cities, defaulting to Illinois state capital"
  },
  "home of the school that's better than yale": {
    normalizedPlace: "Cambridge, MA",
    slug: "cambridge-ma",
    confidence: 0.95,
    reasoning: "This refers to Harvard University in Cambridge, Massachusetts"
  },
  "the big apple": {
    normalizedPlace: "New York, NY",
    slug: "new-york-ny",
    confidence: 0.98,
    reasoning: "The Big Apple is a well-known nickname for New York City"
  },
  "la la land": {
    normalizedPlace: "Los Angeles, CA",
    slug: "los-angeles-ca",
    confidence: 0.9,
    reasoning: "La La Land is a nickname for Los Angeles"
  },
  "the windy city": {
    normalizedPlace: "Chicago, IL",
    slug: "chicago-il",
    confidence: 0.95,
    reasoning: "The Windy City is a nickname for Chicago"
  },
  "the city of angels": {
    normalizedPlace: "Los Angeles, CA",
    slug: "los-angeles-ca",
    confidence: 0.9,
    reasoning: "The City of Angels is a nickname for Los Angeles"
  },
  "the city that never sleeps": {
    normalizedPlace: "New York, NY",
    slug: "new-york-ny",
    confidence: 0.95,
    reasoning: "The City That Never Sleeps is a nickname for New York City"
  },
  "the emerald city": {
    normalizedPlace: "Seattle, WA",
    slug: "seattle-wa",
    confidence: 0.85,
    reasoning: "The Emerald City is a nickname for Seattle"
  },
  "the city of brotherly love": {
    normalizedPlace: "Philadelphia, PA",
    slug: "philadelphia-pa",
    confidence: 0.9,
    reasoning: "The City of Brotherly Love is a nickname for Philadelphia"
  },
  "the mile high city": {
    normalizedPlace: "Denver, CO",
    slug: "denver-co",
    confidence: 0.9,
    reasoning: "The Mile High City is a nickname for Denver"
  },
  "the motor city": {
    normalizedPlace: "Detroit, MI",
    slug: "detroit-mi",
    confidence: 0.9,
    reasoning: "The Motor City is a nickname for Detroit"
  },
  "the music city": {
    normalizedPlace: "Nashville, TN",
    slug: "nashville-tn",
    confidence: 0.9,
    reasoning: "The Music City is a nickname for Nashville"
  },
  "the queen city": {
    normalizedPlace: "Charlotte, NC",
    slug: "charlotte-nc",
    confidence: 0.8,
    reasoning: "The Queen City is a nickname for Charlotte"
  },
  "the space city": {
    normalizedPlace: "Houston, TX",
    slug: "houston-tx",
    confidence: 0.9,
    reasoning: "The Space City is a nickname for Houston"
  },
  "the alamo city": {
    normalizedPlace: "San Antonio, TX",
    slug: "san-antonio-tx",
    confidence: 0.9,
    reasoning: "The Alamo City is a nickname for San Antonio"
  },
  "the valley of the sun": {
    normalizedPlace: "Phoenix, AZ",
    slug: "phoenix-az",
    confidence: 0.85,
    reasoning: "The Valley of the Sun is a nickname for Phoenix"
  },
  "the gateway to the west": {
    normalizedPlace: "St. Louis, MO",
    slug: "st-louis-mo",
    confidence: 0.85,
    reasoning: "The Gateway to the West is a nickname for St. Louis"
  }
};

// app/consts/index.ts
config();
var OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// app/schemas/weather.ts
var TemperatureRangeCategorySchema = z.enum([
  "VERY_HOT",
  "HOT",
  "WARM",
  "MILD",
  "COOL",
  "COLD",
  "VERY_COLD"
]);
var OpenMeteoWeatherCodeSchema = z.number().int().min(0).max(99);
var OpenMeteoDailySchema = z.object({
  time: z.array(z.string()),
  temperature_2m_max: z.array(z.number()),
  temperature_2m_min: z.array(z.number()),
  precipitation_probability_max: z.array(z.number()),
  windspeed_10m_max: z.array(z.number()),
  weathercode: z.array(z.number())
});
var OpenMeteoResponseSchema = z.object({
  daily: OpenMeteoDailySchema
});
var TemperatureRangeSchema = z.object({
  temperatureMinimum: z.number(),
  temperatureMaximum: z.number()
});
var WeatherSchema = z.object({
  date: z.string(),
  degreesFahrenheit: z.number(),
  temperatureRange: TemperatureRangeSchema,
  temperatureRangeCategory: TemperatureRangeCategorySchema,
  rainProbabilityPercentage: z.number().min(0).max(100),
  windSpeedMph: z.number(),
  condition: OpenMeteoWeatherCodeSchema,
  clothing: z.array(z.nativeEnum(ClothingCategoryEnum))
});

// app/schemas/place.ts
var AddressSchema = z2.object({
  city: z2.string(),
  state: z2.string(),
  postalCode: z2.string(),
  country: z2.string(),
  street: z2.string().optional(),
  streetNumber: z2.string().optional()
});
var GeocodedAddressSchema = z2.object({
  latitude: z2.number(),
  longitude: z2.number(),
  formattedAddress: z2.string(),
  structuredAddress: AddressSchema
});
var PlaceSchema = z2.object({
  id: z2.string(),
  description: z2.string().optional(),
  normalizedPlace: z2.string(),
  slug: z2.string(),
  geocodedAddress: GeocodedAddressSchema.nullable(),
  weather: z2.array(WeatherSchema).optional(),
  temperatureRangeCategory: TemperatureRangeCategorySchema.optional(),
  createdAt: z2.date().transform((date) => date.toISOString())
});
var CreatePlaceSchema = z2.object({
  description: z2.string()
});
var UpdatePlaceSchema = z2.object({
  id: z2.string(),
  description: z2.string()
});
var PlaceNormalizationSchema = z2.object({
  slug: z2.string(),
  normalizedPlace: z2.string(),
  confidence: z2.number().min(0).max(1),
  reasoning: z2.string().optional()
});

// app/rules/clothingRules.ts
function getClothingRecommendations(temperature, weatherCode, rainProbability, windSpeed) {
  const recommendations = [];
  const conditionRule = WEATHER_CLOTHING_RULES[weatherCode];
  if (conditionRule) {
    const isInRange = conditionRule.TEMPERATURE_RANGES.some(
      (range) => temperature >= range.min && temperature <= range.max
    );
    if (isInRange) {
      recommendations.push(...conditionRule.recommended);
    }
  }
  if (temperature >= TEMPERATURE_RANGES.VERY_HOT.min) {
    recommendations.push(
      ClothingCategoryEnum.TANK_TOP,
      ClothingCategoryEnum.SHORTS,
      ClothingCategoryEnum.SANDALS,
      ClothingCategoryEnum.SUN_HAT
    );
  } else if (temperature >= TEMPERATURE_RANGES.HOT.min) {
    recommendations.push(
      ClothingCategoryEnum.T_SHIRT,
      ClothingCategoryEnum.SHORTS,
      ClothingCategoryEnum.SNEAKERS
    );
  } else if (temperature >= TEMPERATURE_RANGES.WARM.min) {
    recommendations.push(
      ClothingCategoryEnum.LONG_SLEEVE,
      ClothingCategoryEnum.JEANS,
      ClothingCategoryEnum.SNEAKERS
    );
  } else if (temperature >= TEMPERATURE_RANGES.MILD.min) {
    recommendations.push(
      ClothingCategoryEnum.SWEATSHIRT,
      ClothingCategoryEnum.JEANS,
      ClothingCategoryEnum.SNEAKERS
    );
  } else if (temperature >= TEMPERATURE_RANGES.COOL.min) {
    recommendations.push(
      ClothingCategoryEnum.JACKET,
      ClothingCategoryEnum.PANTS,
      ClothingCategoryEnum.SNEAKERS
    );
  } else if (temperature >= TEMPERATURE_RANGES.COLD.min) {
    recommendations.push(
      ClothingCategoryEnum.COAT,
      ClothingCategoryEnum.PANTS,
      ClothingCategoryEnum.BOOTS
    );
  } else {
    recommendations.push(
      ClothingCategoryEnum.WINTER_COAT,
      ClothingCategoryEnum.WINTER_BOOTS,
      ClothingCategoryEnum.GLOVES,
      ClothingCategoryEnum.SCARF
    );
  }
  if (rainProbability > 30) {
    recommendations.push(
      ClothingCategoryEnum.RAIN_JACKET,
      ClothingCategoryEnum.UMBRELLA
    );
    if (rainProbability > 70) {
      recommendations.push(ClothingCategoryEnum.RAIN_BOOTS);
    }
  }
  if (windSpeed > 15) {
    recommendations.push(
      ClothingCategoryEnum.SCARF,
      ClothingCategoryEnum.JACKET
    );
  }
  return [...new Set(recommendations)];
}
__name(getClothingRecommendations, "getClothingRecommendations");

// app/services/clothingService.ts
var ClothingService = class {
  static {
    __name(this, "ClothingService");
  }
  /**
   * Get clothing recommendations based on weather data
   */
  static getRecommendations(temperature, weatherCode, rainProbability, windSpeed) {
    return getClothingRecommendations(temperature, weatherCode, rainProbability, windSpeed);
  }
  /**
   * Get clothing recommendations for a specific date
   */
  static getRecommendationsForDate(weatherData) {
    const categories = this.getRecommendations(
      weatherData.temperature,
      weatherData.weatherCode,
      weatherData.rainProbability,
      weatherData.windSpeed
    );
    return {
      categories
    };
  }
  /**
   * Get weather-appropriate clothing score (0-100)
   * Higher score means more weather-appropriate
   */
  static getWeatherAppropriatenessScore(clothingCategory, temperature, weatherCode, rainProbability, windSpeed) {
    const recommendations = this.getRecommendations(temperature, weatherCode, rainProbability, windSpeed);
    if (recommendations.includes(clothingCategory)) {
      return 100;
    }
    let score = 0;
    if (temperature >= 85) {
      if (["t-shirt", "tank-top", "shorts", "sandals", "dress", "skirt"].includes(clothingCategory)) {
        score += 80;
      } else if (["long-sleeve", "jeans", "sneakers"].includes(clothingCategory)) {
        score += 40;
      } else if (["hoodie", "jacket", "coat", "boots"].includes(clothingCategory)) {
        score += 10;
      }
    } else if (temperature >= 75) {
      if (["t-shirt", "shorts", "sneakers", "dress"].includes(clothingCategory)) {
        score += 90;
      } else if (["long-sleeve", "jeans", "sweatshirt"].includes(clothingCategory)) {
        score += 70;
      } else if (["jacket", "coat"].includes(clothingCategory)) {
        score += 30;
      }
    } else if (temperature >= 65) {
      if (["long-sleeve", "jeans", "sneakers", "sweatshirt"].includes(clothingCategory)) {
        score += 90;
      } else if (["t-shirt", "shorts"].includes(clothingCategory)) {
        score += 50;
      } else if (["jacket", "coat"].includes(clothingCategory)) {
        score += 60;
      }
    } else if (temperature >= 45) {
      if (["jacket", "pants", "sneakers", "long-sleeve"].includes(clothingCategory)) {
        score += 90;
      } else if (["coat", "boots"].includes(clothingCategory)) {
        score += 70;
      } else if (["t-shirt", "shorts"].includes(clothingCategory)) {
        score += 20;
      }
    } else {
      if (["coat", "winter-coat", "boots", "winter-boots", "gloves", "scarf"].includes(clothingCategory)) {
        score += 95;
      } else if (["jacket", "pants", "long-sleeve"].includes(clothingCategory)) {
        score += 60;
      } else if (["t-shirt", "shorts", "sandals"].includes(clothingCategory)) {
        score += 5;
      }
    }
    if (rainProbability > 50) {
      if (["rain-jacket", "rain-boots", "umbrella"].includes(clothingCategory)) {
        score += 20;
      } else if (["sandals", "shorts", "tank-top"].includes(clothingCategory)) {
        score -= 30;
      }
    }
    if (windSpeed > 15) {
      if (["scarf", "jacket", "coat"].includes(clothingCategory)) {
        score += 15;
      } else if (["dress", "skirt"].includes(clothingCategory)) {
        score -= 20;
      }
    }
    return Math.max(0, Math.min(100, score));
  }
};

// app/services/geolocationService.ts
var GeolocationService = class {
  static {
    __name(this, "GeolocationService");
  }
  /**
   * Geocode a place description using OpenCage API
   * Converts place descriptions to structured address data with coordinates
   */
  static async geocodePlace(description) {
    try {
      if (!process.env.OPENCAGE_API_KEY) {
        console.warn("OpenCage API key not found, falling back to mock implementation");
        return this.getMockGeocoding(description);
      }
      const opencageResponse = await this.callOpenCageAPI(description);
      return this.parseOpenCageResponse(opencageResponse, description);
    } catch (error) {
      console.error("Error geocoding place:", error);
      console.warn("OpenCage API failed, falling back to mock implementation");
      try {
        return this.getMockGeocoding(description);
      } catch (mockError) {
        console.error("Mock implementation also failed:", mockError);
        throw new Error("Failed to geocode place description");
      }
    }
  }
  /**
   * Mock implementation for fallback when OpenCage API is unavailable
   */
  static getMockGeocoding(description) {
    const mockCoordinates = this.getMockCoordinates(description);
    return {
      latitude: mockCoordinates.lat,
      longitude: mockCoordinates.lng,
      formattedAddress: description,
      structuredAddress: this.parseStructuredAddress(description)
    };
  }
  /**
   * Get mock coordinates for common places
   */
  static getMockCoordinates(description) {
    const place = description.toLowerCase();
    for (const [city, coords] of Object.entries(CITY_COORDINATES)) {
      if (place.includes(city)) {
        return coords;
      }
    }
    return { lat: 40.7128, lng: -74.006 };
  }
  /**
   * Parse structured address from place description
   */
  static parseStructuredAddress(description) {
    const parts = description.split(",").map((part) => part.trim());
    return {
      city: parts[0] || "",
      state: parts[1] || "",
      postalCode: "",
      country: parts.length > 2 ? parts[2] : "US"
    };
  }
  /**
   * Call OpenCage Geocoding API
   */
  static async callOpenCageAPI(description) {
    const apiKey = process.env.OPENCAGE_API_KEY;
    const encodedPlace = encodeURIComponent(description);
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodedPlace}&key=${apiKey}&limit=1&no_annotations=1`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`OpenCage API error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      if (data.status.code !== 200) {
        throw new Error(`OpenCage API error: ${data.status.message}`);
      }
      return data;
    } catch (error) {
      console.error("OpenCage API error:", error);
      throw new Error("Failed to geocode place with OpenCage API");
    }
  }
  /**
   * Parse OpenCage API response into our GeocodedAddress format
   */
  static parseOpenCageResponse(response, _originalDescription) {
    if (!response.results || response.results.length === 0) {
      throw new Error("No geocoding results found");
    }
    const result = response.results[0];
    const components = result.components;
    return {
      latitude: result.geometry.lat,
      longitude: result.geometry.lng,
      formattedAddress: result.formatted,
      structuredAddress: {
        city: components.city || "",
        state: components.state || "",
        postalCode: components.postcode || "",
        country: components.country || "",
        street: components.road || void 0,
        streetNumber: components.house_number || void 0
      }
    };
  }
};

// app/services/llmService.ts
import OpenAI from "openai";

// app/prompts/descriptionToNormalizedPlacePrompt.ts
var DESCRIPTION_TO_NORMALIZED_PLACE_PROMPT = /* @__PURE__ */ __name((description) => `Convert this place description to a normalized format with city and state/country.

Place description: "${description}"

Please respond with a JSON object containing:
- normalizedPlace: The standardized place (e.g., "New York, NY" or "London, UK")
- slug: A URL-friendly slug (e.g., "new-york-ny" or "london-uk")
- confidence: A number between 0 and 1 indicating your confidence
- reasoning: Brief explanation of your choice

Examples:
- "Gotham City" \u2192 {"normalizedPlace": "New York, NY", "slug": "new-york-ny", "confidence": 0.95, "reasoning": "Gotham City is commonly associated with New York City"}
- "The Big Apple" \u2192 {"normalizedPlace": "New York, NY", "slug": "new-york-ny", "confidence": 0.98, "reasoning": "The Big Apple is a well-known nickname for New York City"}
- "Home of Harvard" \u2192 {"normalizedPlace": "Cambridge, MA", "slug": "cambridge-ma", "confidence": 0.95, "reasoning": "Harvard University is located in Cambridge, Massachusetts"}
- "Springfield" \u2192 {"normalizedPlace": "Springfield, IL", "slug": "springfield-il", "confidence": 0.85, "reasoning": "Springfield could refer to multiple cities, defaulting to Illinois state capital"}

Respond only with valid JSON:`, "DESCRIPTION_TO_NORMALIZED_PLACE_PROMPT");

// app/services/llmService.ts
var LLMService = class {
  static {
    __name(this, "LLMService");
  }
  /**
   * Normalize a place description using OpenAI LLM
   * Converts descriptions like "Gotham City" to "New York, NY"
   */
  static async normalizePlace(description) {
    try {
      if (!OPENAI_API_KEY) {
        console.warn("OpenAI API key not found, falling back to mock implementation");
        const mockResponse = this.getMockNormalization(description);
        return PlaceNormalizationSchema.parse(mockResponse);
      }
      const openaiResponse = await this.convertDescriptionToNormalizedPlace(description);
      return PlaceNormalizationSchema.parse(openaiResponse);
    } catch (error) {
      throw new Error("Failed to normalize place from description: " + error);
    }
  }
  /**
   * Mock implementation for fallback when OpenAI API is unavailable
   * Used when API key is missing or API calls fail
   */
  static getMockNormalization(description) {
    const lowerDescription = description.toLowerCase().trim();
    if (MOCK_MAPPINGS[lowerDescription]) {
      return MOCK_MAPPINGS[lowerDescription];
    }
    for (const [key, value] of Object.entries(MOCK_MAPPINGS)) {
      if (lowerDescription.includes(key) || key.includes(lowerDescription)) {
        return {
          ...value,
          confidence: value.confidence * 0.8
          // Reduce confidence for partial matches
        };
      }
    }
    return {
      normalizedPlace: "No specific location found",
      slug: "no-specific-location-found",
      confidence: 0,
      reasoning: "Could not identify a specific location from the description"
    };
  }
  static async createOpenAICompletion(prompt) {
    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY
    });
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a place normalization expert. Always respond with valid JSON."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 200
      });
      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error("No response from OpenAI");
      }
      const parsed = JSON.parse(response);
      return PlaceNormalizationSchema.parse(parsed);
    } catch (error) {
      console.error("OpenAI API error:", error);
      throw new Error("Failed to normalize place with OpenAI");
    }
  }
  /**
   * Production method for calling OpenAI API for description to normalized place.
   * Converts descriptions like "Gotham City" to "New York, NY".
   */
  static async convertDescriptionToNormalizedPlace(description) {
    const prompt = DESCRIPTION_TO_NORMALIZED_PLACE_PROMPT(description);
    return this.createOpenAICompletion(prompt);
  }
};

// app/services/dateService.ts
var DateService = class {
  static {
    __name(this, "DateService");
  }
  /**
   * Format a date to YYYY-MM-DD string format
   */
  static formatDate(date) {
    return date.toISOString().split("T")[0];
  }
  /**
   * Parse a YYYY-MM-DD string to a Date object
   */
  static parseDate(dateString) {
    const date = /* @__PURE__ */ new Date(dateString + "T00:00:00.000Z");
    if (isNaN(date.getTime())) {
      throw new Error(`Invalid date format: ${dateString}. Expected YYYY-MM-DD format.`);
    }
    return date;
  }
  /**
   * Get today's date in YYYY-MM-DD format
   */
  static getToday() {
    return this.formatDate(/* @__PURE__ */ new Date());
  }
  /**
   * Get tomorrow's date in YYYY-MM-DD format
   */
  static getTomorrow() {
    const tomorrow = /* @__PURE__ */ new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return this.formatDate(tomorrow);
  }
  /**
   * Get a date N days from today in YYYY-MM-DD format
   */
  static getDateFromToday(days) {
    const date = /* @__PURE__ */ new Date();
    date.setDate(date.getDate() + days);
    return this.formatDate(date);
  }
  /**
   * Get the start of the week (Monday) for a given date
   */
  static getStartOfWeek(date) {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek;
  }
  /**
   * Get the end of the week (Sunday) for a given date
   */
  static getEndOfWeek(date) {
    const endOfWeek = new Date(date);
    const day = endOfWeek.getDay();
    const diff = endOfWeek.getDate() - day + 7;
    endOfWeek.setDate(diff);
    endOfWeek.setHours(23, 59, 59, 999);
    return endOfWeek;
  }
  /**
   * Check if a date is today
   */
  static isToday(date) {
    const today = /* @__PURE__ */ new Date();
    return this.formatDate(date) === this.formatDate(today);
  }
  /**
   * Check if a date is tomorrow
   */
  static isTomorrow(date) {
    const tomorrow = /* @__PURE__ */ new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return this.formatDate(date) === this.formatDate(tomorrow);
  }
  /**
   * Get the number of days between two dates
   */
  static getDaysDifference(startDate, endDate) {
    const timeDiff = endDate.getTime() - startDate.getTime();
    return Math.ceil(timeDiff / (1e3 * 3600 * 24));
  }
  /**
   * Validate that a date string is in YYYY-MM-DD format
   */
  static isValidDateFormat(dateString) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) {
      return false;
    }
    const date = /* @__PURE__ */ new Date(dateString + "T00:00:00.000Z");
    return !isNaN(date.getTime());
  }
  /**
   * Get a human-readable relative date string (e.g., "Today", "Tomorrow", "In 3 days")
   */
  static getRelativeDateString(date) {
    const today = /* @__PURE__ */ new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const todayStr = this.formatDate(today);
    const tomorrowStr = this.formatDate(tomorrow);
    const dateStr = this.formatDate(date);
    if (dateStr === todayStr) {
      return "Today";
    } else if (dateStr === tomorrowStr) {
      return "Tomorrow";
    } else {
      const daysDiff = this.getDaysDifference(today, date);
      if (daysDiff > 0) {
        return `In ${daysDiff} day${daysDiff === 1 ? "" : "s"}`;
      } else {
        return `${Math.abs(daysDiff)} day${Math.abs(daysDiff) === 1 ? "" : "s"} ago`;
      }
    }
  }
  /**
   * Get a formatted date string for display (e.g., "Monday, January 15, 2024")
   */
  static getFormattedDateString(date) {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }
};

// app/utils/temperatureUtils.ts
function getTemperatureRangeCategory(temperature) {
  if (temperature >= TEMPERATURE_RANGES.VERY_HOT.min) {
    return "VERY_HOT";
  } else if (temperature >= TEMPERATURE_RANGES.HOT.min) {
    return "HOT";
  } else if (temperature >= TEMPERATURE_RANGES.WARM.min) {
    return "WARM";
  } else if (temperature >= TEMPERATURE_RANGES.MILD.min) {
    return "MILD";
  } else if (temperature >= TEMPERATURE_RANGES.COOL.min) {
    return "COOL";
  } else if (temperature >= TEMPERATURE_RANGES.COLD.min) {
    return "COLD";
  } else {
    return "VERY_COLD";
  }
}
__name(getTemperatureRangeCategory, "getTemperatureRangeCategory");
function getAverageTemperatureRangeCategory(temperatures) {
  if (temperatures.length === 0) {
    return "MILD";
  }
  const rangeCounts = {
    VERY_HOT: 0,
    HOT: 0,
    WARM: 0,
    MILD: 0,
    COOL: 0,
    COLD: 0,
    VERY_COLD: 0
  };
  temperatures.forEach((temp) => {
    const range = getTemperatureRangeCategory(temp);
    rangeCounts[range]++;
  });
  let mostCommonRange = "MILD";
  let maxCount = 0;
  for (const [range, count] of Object.entries(rangeCounts)) {
    if (count > maxCount) {
      maxCount = count;
      mostCommonRange = range;
    }
  }
  return mostCommonRange;
}
__name(getAverageTemperatureRangeCategory, "getAverageTemperatureRangeCategory");
function getPlaceTemperatureRangeCategory(weatherData) {
  const temperatures = weatherData.map((weather) => weather.degreesFahrenheit);
  return getAverageTemperatureRangeCategory(temperatures);
}
__name(getPlaceTemperatureRangeCategory, "getPlaceTemperatureRangeCategory");
function ensureTemperatureRangeCategory(model) {
  if (!model.temperatureRangeCategory && model.weather && model.weather.length > 0) {
    model.temperatureRangeCategory = getPlaceTemperatureRangeCategory(model.weather);
  }
  return model;
}
__name(ensureTemperatureRangeCategory, "ensureTemperatureRangeCategory");

// app/services/weatherService.ts
var WeatherService = class {
  static {
    __name(this, "WeatherService");
  }
  static BASE_URL = "https://api.open-meteo.com/v1/forecast";
  /**
   * Get 7-day weather forecast for given coordinates
   */
  static async get7DayForecast(options) {
    const { latitude, longitude, startDate = /* @__PURE__ */ new Date(), endDate } = options;
    const forecastEndDate = endDate || new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1e3);
    const startDateStr = DateService.formatDate(startDate);
    const endDateStr = DateService.formatDate(forecastEndDate);
    try {
      const url = new URL(this.BASE_URL);
      url.searchParams.set("latitude", latitude.toString());
      url.searchParams.set("longitude", longitude.toString());
      url.searchParams.set("start_date", startDateStr);
      url.searchParams.set("end_date", endDateStr);
      url.searchParams.set("daily", "temperature_2m_max,temperature_2m_min,precipitation_probability_max,windspeed_10m_max,weathercode");
      url.searchParams.set("temperature_unit", "fahrenheit");
      url.searchParams.set("windspeed_unit", "mph");
      url.searchParams.set("precipitation_unit", "inch");
      url.searchParams.set("timezone", "auto");
      console.log(`Fetching weather data from: ${url.toString()}`);
      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`Weather API request failed: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      const validatedData = OpenMeteoResponseSchema.parse(data);
      const weatherForecast = [];
      for (let i = 0; i < validatedData.daily.time.length; i++) {
        const date = new Date(validatedData.daily.time[i]);
        const maxTemp = validatedData.daily.temperature_2m_max[i];
        const minTemp = validatedData.daily.temperature_2m_min[i];
        const avgTemp = (maxTemp + minTemp) / 2;
        const rainProbability = validatedData.daily.precipitation_probability_max[i];
        const windSpeed = validatedData.daily.windspeed_10m_max[i];
        const weatherCode = validatedData.daily.weathercode[i];
        const weather = {
          date: date.toISOString(),
          degreesFahrenheit: Math.round(avgTemp),
          temperatureRange: {
            temperatureMinimum: Math.round(minTemp),
            temperatureMaximum: Math.round(maxTemp)
          },
          temperatureRangeCategory: getTemperatureRangeCategory(Math.round(avgTemp)),
          rainProbabilityPercentage: Math.round(rainProbability),
          windSpeedMph: Math.round(windSpeed),
          condition: weatherCode,
          clothing: []
          // Will be populated by clothing service
        };
        weatherForecast.push(weather);
      }
      console.log(`Successfully fetched ${weatherForecast.length} days of weather data`);
      return weatherForecast;
    } catch (error) {
      console.error("Error fetching weather data:", error);
      throw new Error(`Failed to fetch weather forecast: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
  /**
   * Get current day weather (today's forecast)
   */
  static async getCurrentDayWeather(latitude, longitude) {
    const forecast = await this.get7DayForecast({ latitude, longitude });
    return forecast[0];
  }
};

// core/trpc.ts
import { initTRPC } from "@trpc/server";

// core/Store.ts
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import superjson from "superjson";
var Store = class {
  static {
    __name(this, "Store");
  }
  items;
  storePath;
  get(id) {
    return this.items.get(id);
  }
  getAll() {
    return Array.from(this.items.values());
  }
  toModel(item) {
    return {
      id: item.id,
      createdAt: item.createdAt
    };
  }
  add(item) {
    const newItem = {
      ...item,
      id: this.generateId(),
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.items.set(newItem.id, newItem);
    this.persist();
    return newItem;
  }
  remove(id) {
    this.items.delete(id);
    this.persist();
    return this;
  }
  update(id, item) {
    const existingItem = this.get(id);
    if (!existingItem) {
      throw new Error("Item not found");
    }
    this.items.set(id, { ...existingItem, ...item });
    this.persist();
  }
  /**
   * --------------------------------------------------------------------------
   * Internal methods, feel free to ignore
   * --------------------------------------------------------------------------
   */
  constructor(storeName) {
    this.items = /* @__PURE__ */ new Map();
    this.storePath = path.join(process.cwd(), "tmp", `${storeName}.json`);
    this.load().catch((error) => {
      console.error(`Failed to load store ${storeName}:`, error);
    });
  }
  generateId(length = 16) {
    return crypto.randomBytes(length).toString("hex");
  }
  async persist() {
    if (process.env.VERCEL || process.env.NODE_ENV === "production") {
      console.log("Skipping persistence in serverless environment");
      return;
    }
    try {
      await fs.mkdir(path.dirname(this.storePath), { recursive: true });
      const serialized = superjson.stringify(Array.from(this.items.entries()));
      await fs.writeFile(this.storePath, serialized);
    } catch (error) {
      console.error("Failed to persist store:", error);
    }
  }
  async load() {
    if (process.env.VERCEL || process.env.NODE_ENV === "production") {
      console.log("Skipping store load in serverless environment");
      return;
    }
    try {
      const exists = await fs.access(this.storePath).then(() => true).catch(() => false);
      if (!exists) return;
      const content = await fs.readFile(this.storePath, "utf-8");
      const entries = superjson.parse(content);
      this.items = new Map(entries);
    } catch (error) {
      console.error("Failed to load store:", error);
    }
  }
};

// app/stores/PlaceStore.ts
var PlaceStore = class extends Store {
  static {
    __name(this, "PlaceStore");
  }
  constructor() {
    super("places");
  }
  /**
   * Generate a URL-friendly slug from a normalized place string
   */
  static generateSlug(text) {
    return text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  }
  toModel(item) {
    const model = super.toModel(item);
    return {
      ...model,
      description: item.description,
      normalizedPlace: item.normalizedPlace,
      slug: item.slug,
      geocodedAddress: item.geocodedAddress,
      weather: item.weather,
      temperatureRangeCategory: item.temperatureRangeCategory,
      createdAt: item.createdAt
    };
  }
  getByDescription(description) {
    return this.getAll().find((item) => item.description === description);
  }
  getBySlug(slug) {
    return this.getAll().find((item) => item.slug === slug);
  }
  getByNormalizedPlace(normalizedPlace) {
    return this.getAll().find((item) => item.normalizedPlace === normalizedPlace);
  }
  /**
   * Get place by ID and return as model
   */
  getById(id) {
    const item = this.get(id);
    return item ? this.toModel(item) : void 0;
  }
  /**
   * Get all places as models
   */
  getAllAsModels() {
    return this.getAll().map((item) => this.toModel(item));
  }
  /**
   * Create a complete place with all required fields
   * This method should be used instead of the basic add() method for places
   */
  createPlace(data) {
    const placeData = {
      description: data.description,
      normalizedPlace: data.normalizedPlace,
      slug: data.slug,
      geocodedAddress: data.geocodedAddress,
      weather: data.weather
    };
    return this.add(placeData);
  }
  /**
   * Override update method to return updated item
   */
  update(id, updates) {
    const oldItem = this.get(id);
    if (!oldItem) {
      throw new Error(`Place with id "${id}" not found`);
    }
    super.update(id, updates);
    const updatedItem = this.get(id);
    return updatedItem;
  }
};

// core/container.ts
import { asValue, createContainer } from "awilix";
var container = createContainer();
var placeStore = new PlaceStore();
container.register({
  places: asValue(placeStore)
});

// core/trpc.ts
import superjson2 from "superjson";
var createContext = /* @__PURE__ */ __name(async (opts) => {
  const cradle = container.cradle;
  return {
    req: opts.req,
    cradle
  };
}, "createContext");
var trpc = initTRPC.context().create({
  transformer: superjson2
});
var router = trpc.router;
var procedure = trpc.procedure;

// app/router/places.ts
import { TRPCError } from "@trpc/server";
import { z as z3 } from "zod";
var places = router({
  // Get place by normalized place string
  getByNormalizedPlace: procedure.input(z3.object({ normalizedPlace: z3.string() })).query(async ({ ctx, input }) => {
    const place = ctx.cradle.places.getByNormalizedPlace(input.normalizedPlace);
    if (!place) {
      return false;
    }
    const model = ctx.cradle.places.toModel(place);
    return ensureTemperatureRangeCategory(model);
  }),
  /**
   * Creates a place object from a description.
   * If the place already exists,
   * it updates the place with the new description.
   */
  create: procedure.input(CreatePlaceSchema).mutation(async ({ ctx, input }) => {
    try {
      const llmResult = await LLMService.normalizePlace(input.description);
      console.log(`LLM normalized "${input.description}" to "${llmResult.normalizedPlace}" (confidence: ${llmResult.confidence})`);
      console.log(`LLM generated slug: "${llmResult.slug}"`);
      if (llmResult.slug === "no-specific-location-found") {
        const placeData2 = {
          description: input.description,
          normalizedPlace: llmResult.normalizedPlace,
          slug: llmResult.slug,
          geocodedAddress: null,
          weather: [],
          temperatureRangeCategory: null
        };
        const place2 = ctx.cradle.places.createPlace(placeData2);
        console.log("Place created for no location found:", place2);
        const model2 = ctx.cradle.places.toModel(place2);
        return model2;
      }
      const existingPlace = ctx.cradle.places.getByNormalizedPlace(llmResult.normalizedPlace);
      if (existingPlace) {
        const updatedPlace = ctx.cradle.places.update(existingPlace.id, { description: input.description });
        return ctx.cradle.places.toModel(updatedPlace);
      }
      const geocodedAddress = await GeolocationService.geocodePlace(llmResult.normalizedPlace);
      console.log(`Geocoded "${llmResult.normalizedPlace}" to:`, geocodedAddress);
      const weatherData = await WeatherService.get7DayForecast({ latitude: geocodedAddress.latitude, longitude: geocodedAddress.longitude });
      weatherData.forEach((weather) => {
        weather.clothing = ClothingService.getRecommendations(weather.degreesFahrenheit, weather.condition, weather.rainProbabilityPercentage, weather.windSpeedMph);
      });
      const temperatureRangeCategory = getPlaceTemperatureRangeCategory(weatherData);
      const placeData = {
        description: input.description,
        normalizedPlace: llmResult.normalizedPlace,
        slug: llmResult.slug,
        geocodedAddress,
        weather: weatherData,
        temperatureRangeCategory
      };
      const place = ctx.cradle.places.createPlace(placeData);
      console.log("Place created:", place);
      const model = ctx.cradle.places.toModel(place);
      return ensureTemperatureRangeCategory(model);
    } catch (error) {
      console.error("Error in create:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create place"
      });
    }
  }),
  /**
   * Updates a place with a new description.
   */
  update: procedure.input(UpdatePlaceSchema).mutation(async ({ ctx, input }) => {
    return ctx.cradle.places.update(input.id, { description: input.description });
  }),
  /**
   * Gets a place by slug.
   * If the place does not exist, return an error.
   */
  getBySlug: procedure.input(z3.object({ slug: z3.string() })).query(async ({ ctx, input }) => {
    const place = ctx.cradle.places.getBySlug(input.slug);
    if (!place) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Place not found with slug: "${input.slug}".`
      });
    }
    const model = ctx.cradle.places.toModel(place);
    return ensureTemperatureRangeCategory(model);
  }),
  /**
   * Get 7-day weather forecast for a place by slug
   */
  getWeatherForecast: procedure.input(z3.object({ slug: z3.string() })).query(async ({ ctx, input }) => {
    const place = ctx.cradle.places.getBySlug(input.slug);
    if (!place) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Place not found with slug: "${input.slug}".`
      });
    }
    if (!place.geocodedAddress) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No location data available for this place."
      });
    }
    try {
      const forecast = await WeatherService.get7DayForecast({
        latitude: place.geocodedAddress.latitude,
        longitude: place.geocodedAddress.longitude
      });
      return forecast;
    } catch (error) {
      console.error("Error fetching weather forecast:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch weather forecast"
      });
    }
  }),
  /**
   * Get current day weather for a place by slug
   */
  getCurrentWeather: procedure.input(z3.object({ slug: z3.string() })).query(async ({ ctx, input }) => {
    const place = ctx.cradle.places.getBySlug(input.slug);
    if (!place) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Place not found with slug: "${input.slug}".`
      });
    }
    if (!place.geocodedAddress) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No location data available for this place."
      });
    }
    try {
      const weather = await WeatherService.getCurrentDayWeather(
        place.geocodedAddress.latitude,
        place.geocodedAddress.longitude
      );
      return weather;
    } catch (error) {
      console.error("Error fetching current weather:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch current weather"
      });
    }
  }),
  /**
   * Get weather for a specific date for a place by slug
   */
  getWeatherByDate: procedure.input(z3.object({
    slug: z3.string(),
    date: z3.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
  })).query(async ({ ctx, input }) => {
    const place = ctx.cradle.places.getBySlug(input.slug);
    if (!place) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Place not found with slug: "${input.slug}".`
      });
    }
    if (!place.geocodedAddress) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No location data available for this place."
      });
    }
    try {
      const targetDate = new Date(input.date);
      const forecast = await WeatherService.get7DayForecast({
        latitude: place.geocodedAddress.latitude,
        longitude: place.geocodedAddress.longitude,
        startDate: targetDate,
        endDate: targetDate
      });
      if (forecast.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Weather data not found for date: ${input.date}`
        });
      }
      return forecast[0];
    } catch (error) {
      console.error("Error fetching weather by date:", error);
      if (error instanceof TRPCError) {
        throw error;
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch weather for the specified date"
      });
    }
  }),
  /**
   * Get weather for a date range for a place by slug
   */
  getWeatherByDateRange: procedure.input(z3.object({
    slug: z3.string(),
    startDate: z3.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Start date must be in YYYY-MM-DD format"),
    endDate: z3.string().regex(/^\d{4}-\d{2}-\d{2}$/, "End date must be in YYYY-MM-DD format")
  })).query(async ({ ctx, input }) => {
    const place = ctx.cradle.places.getBySlug(input.slug);
    if (!place) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Place not found with slug: "${input.slug}".`
      });
    }
    if (!place.geocodedAddress) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No location data available for this place."
      });
    }
    try {
      const startDate = new Date(input.startDate);
      const endDate = new Date(input.endDate);
      if (startDate > endDate) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Start date must be before or equal to end date"
        });
      }
      const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1e3 * 60 * 60 * 24));
      if (daysDiff > 6) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Date range cannot exceed 7 days"
        });
      }
      const forecast = await WeatherService.get7DayForecast({
        latitude: place.geocodedAddress.latitude,
        longitude: place.geocodedAddress.longitude,
        startDate,
        endDate
      });
      return forecast;
    } catch (error) {
      console.error("Error fetching weather by date range:", error);
      if (error instanceof TRPCError) {
        throw error;
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch weather for the specified date range"
      });
    }
  })
});

// app/router/index.ts
var appRouter = router({
  places
});

// src/index.ts
import { trpcServer } from "@hono/trpc-server";
if (process.env.NODE_ENV !== "production") {
  config2();
}
console.log("Starting server...");
var app = new Hono().use(cors({
  origin: "http://localhost:6173",
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"]
})).get("/", (c) => {
  console.log("Health check endpoint hit");
  return c.text("OK");
}).get("/test", (c) => {
  console.log("Test endpoint hit");
  return c.json({ message: "Test successful", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
}).onError((err, c) => {
  console.error("Error:", err);
  console.error("Error stack:", err.stack);
  return c.json({ error: "Internal Server Error", message: err.message }, 500);
});
try {
  console.log("Loading TRPC components...");
  app.use("/trpc/*", trpcServer({ router: appRouter, createContext }));
  console.log("TRPC server configured");
} catch (error) {
  console.error("Failed to load TRPC components:", error);
  app.get("/trpc/*", (c) => {
    return c.json({ error: "TRPC not available", message: error.message }, 500);
  });
}
var index_default = app;
if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT ? parseInt(process.env.PORT) : 3333;
  const host = process.env.HOST || "0.0.0.0";
  Bun.serve({
    port,
    hostname: host,
    fetch: app.fetch
  });
  console.log(`Server running at http://${host}:${port}`);
}
export {
  index_default as default
};
