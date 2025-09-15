var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/index.ts
import { config as config2 } from "dotenv";
import { Hono } from "hono";
import { cors } from "hono/cors";

// app/schemas/location.ts
import { z as z3 } from "zod";

// app/schemas/weather.ts
import { z as z2 } from "zod";

// app/schemas/weatherConditions.ts
import { z } from "zod";
var WeatherConditionEnum = {
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
};
var WeatherConditionZodEnum = z.nativeEnum(WeatherConditionEnum);

// app/rules/clothingRules.ts
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
var TemperatureRanges = {
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
var WeatherClothingRules = {
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
};
function getClothingRecommendations(temperature, condition, rainProbability, windSpeed) {
  const recommendations = [];
  const conditionRule = WeatherClothingRules[condition];
  if (conditionRule) {
    const isInRange = conditionRule.temperatureRanges.some(
      (range) => temperature >= range.min && temperature <= range.max
    );
    if (isInRange) {
      recommendations.push(...conditionRule.recommended);
    }
  }
  if (temperature >= TemperatureRanges.VERY_HOT.min) {
    recommendations.push(
      ClothingCategoryEnum.TANK_TOP,
      ClothingCategoryEnum.SHORTS,
      ClothingCategoryEnum.SANDALS,
      ClothingCategoryEnum.SUN_HAT
    );
  } else if (temperature >= TemperatureRanges.HOT.min) {
    recommendations.push(
      ClothingCategoryEnum.T_SHIRT,
      ClothingCategoryEnum.SHORTS,
      ClothingCategoryEnum.SNEAKERS
    );
  } else if (temperature >= TemperatureRanges.WARM.min) {
    recommendations.push(
      ClothingCategoryEnum.LONG_SLEEVE,
      ClothingCategoryEnum.JEANS,
      ClothingCategoryEnum.SNEAKERS
    );
  } else if (temperature >= TemperatureRanges.MILD.min) {
    recommendations.push(
      ClothingCategoryEnum.SWEATSHIRT,
      ClothingCategoryEnum.JEANS,
      ClothingCategoryEnum.SNEAKERS
    );
  } else if (temperature >= TemperatureRanges.COOL.min) {
    recommendations.push(
      ClothingCategoryEnum.JACKET,
      ClothingCategoryEnum.PANTS,
      ClothingCategoryEnum.SNEAKERS
    );
  } else if (temperature >= TemperatureRanges.COLD.min) {
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

// app/schemas/weather.ts
var TemperatureRangeSchema = z2.object({
  temperatureMinimum: z2.number(),
  temperatureMaximum: z2.number()
});
var WeatherSchema = z2.object({
  date: z2.string(),
  degreesFahrenheit: z2.number(),
  degreesCelsius: z2.number(),
  temperatureRange: TemperatureRangeSchema,
  rainProbabilityPercentage: z2.number().min(0).max(100),
  windSpeedMph: z2.number(),
  condition: WeatherConditionZodEnum,
  clothing: z2.array(z2.nativeEnum(ClothingCategoryEnum))
  // Phase II: Add ClothingSchema
  // clothing: z.array(ClothingSchema)
});

// app/schemas/location.ts
var AddressSchema = z3.object({
  city: z3.string(),
  state: z3.string(),
  postalCode: z3.string(),
  country: z3.string(),
  street: z3.string().optional(),
  streetNumber: z3.string().optional()
});
var GeocodedAddressSchema = z3.object({
  latitude: z3.number(),
  longitude: z3.number(),
  formattedAddress: z3.string(),
  structuredAddress: AddressSchema
});
var LocationSchema = z3.object({
  id: z3.string(),
  description: z3.string().optional(),
  normalizedLocation: z3.string(),
  slug: z3.string(),
  geocodedAddress: GeocodedAddressSchema,
  weather: z3.array(WeatherSchema).optional(),
  createdAt: z3.date().transform((date) => date.toISOString())
});
var CreateLocationSchema = z3.object({
  description: z3.string()
});
var UpdateLocationSchema = z3.object({
  id: z3.string(),
  description: z3.string()
});

// app/services/clothingService.ts
var ClothingService = class {
  static {
    __name(this, "ClothingService");
  }
  /**
   * Get clothing recommendations based on weather data
   */
  static getRecommendations(temperature, condition, rainProbability, windSpeed) {
    return getClothingRecommendations(temperature, condition, rainProbability, windSpeed);
  }
  /**
   * Phase II:
   * Get TikTok Shop search queries for clothing recommendations
   */
  // static getTikTokShopQueries(
  //   temperature: number,
  //   condition: WeatherCondition,
  //   rainProbability: number,
  //   windSpeed: number
  // ): string[] {
  //   return getTikTokShopClothingQuery(temperature, condition, rainProbability, windSpeed)
  // }
  /**
   * Get clothing recommendations for a specific date
   */
  static getRecommendationsForDate(weatherData) {
    const categories = this.getRecommendations(
      weatherData.temperature,
      weatherData.condition,
      weatherData.rainProbability,
      weatherData.windSpeed
    );
    return {
      categories
      // searchQueries
    };
  }
  /**
   * Get weather-appropriate clothing score (0-100)
   * Higher score means more weather-appropriate
   */
  static getWeatherAppropriatenessScore(clothingCategory, temperature, condition, rainProbability, windSpeed) {
    const recommendations = this.getRecommendations(temperature, condition, rainProbability, windSpeed);
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
   * Geocode a location description using OpenCage API
   * Converts location descriptions to structured address data with coordinates
   */
  static async geocodeLocation(locationDescription) {
    try {
      if (!process.env.OPENCAGE_API_KEY) {
        console.warn("OpenCage API key not found, falling back to mock implementation");
        return this.getMockGeocoding(locationDescription);
      }
      const opencageResponse = await this.callOpenCageAPI(locationDescription);
      return this.parseOpenCageResponse(opencageResponse, locationDescription);
    } catch (error) {
      console.error("Error geocoding location:", error);
      console.warn("OpenCage API failed, falling back to mock implementation");
      try {
        return this.getMockGeocoding(locationDescription);
      } catch (mockError) {
        console.error("Mock implementation also failed:", mockError);
        throw new Error("Failed to geocode location description");
      }
    }
  }
  /**
   * Mock implementation for fallback when OpenCage API is unavailable
   */
  static getMockGeocoding(locationDescription) {
    const mockCoordinates = this.getMockCoordinates(locationDescription);
    return {
      latitude: mockCoordinates.lat,
      longitude: mockCoordinates.lng,
      formattedAddress: locationDescription,
      structuredAddress: this.parseStructuredAddress(locationDescription)
    };
  }
  /**
   * Get mock coordinates for common locations
   */
  static getMockCoordinates(locationDescription) {
    const location = locationDescription.toLowerCase();
    const cityCoordinates = {
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
    for (const [city, coords] of Object.entries(cityCoordinates)) {
      if (location.includes(city)) {
        return coords;
      }
    }
    return { lat: 40.7128, lng: -74.006 };
  }
  /**
   * Parse structured address from location description
   */
  static parseStructuredAddress(locationDescription) {
    const parts = locationDescription.split(",").map((part) => part.trim());
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
  static async callOpenCageAPI(locationDescription) {
    const apiKey = process.env.OPENCAGE_API_KEY;
    const encodedLocation = encodeURIComponent(locationDescription);
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodedLocation}&key=${apiKey}&limit=1&no_annotations=1`;
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
      throw new Error("Failed to geocode location with OpenCage API");
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
import { z as z4 } from "zod";
import OpenAI from "openai";

// app/consts/LocationConsts.ts
import { config } from "dotenv";
config();
var OPENAI_API_KEY = process.env.OPENAI_API_KEY;
var MOCK_MAPPINGS = {
  "gotham city": {
    normalizedLocation: "New York, NY",
    slug: "new-york-ny",
    confidence: 0.95,
    reasoning: "Gotham City is commonly associated with New York City in popular culture"
  },
  "metropolis": {
    normalizedLocation: "New York, NY",
    slug: "new-york-ny",
    confidence: 0.9,
    reasoning: "Metropolis is often depicted as New York City in Superman comics"
  },
  "springfield": {
    normalizedLocation: "Springfield, IL",
    slug: "springfield-il",
    confidence: 0.85,
    reasoning: "Springfield could refer to multiple cities, defaulting to Illinois state capital"
  },
  "home of the school that's better than yale": {
    normalizedLocation: "Cambridge, MA",
    slug: "cambridge-ma",
    confidence: 0.95,
    reasoning: "This refers to Harvard University in Cambridge, Massachusetts"
  },
  "the big apple": {
    normalizedLocation: "New York, NY",
    slug: "new-york-ny",
    confidence: 0.98,
    reasoning: "The Big Apple is a well-known nickname for New York City"
  },
  "la la land": {
    normalizedLocation: "Los Angeles, CA",
    slug: "los-angeles-ca",
    confidence: 0.9,
    reasoning: "La La Land is a nickname for Los Angeles"
  },
  "the windy city": {
    normalizedLocation: "Chicago, IL",
    slug: "chicago-il",
    confidence: 0.95,
    reasoning: "The Windy City is a nickname for Chicago"
  },
  "the city of angels": {
    normalizedLocation: "Los Angeles, CA",
    slug: "los-angeles-ca",
    confidence: 0.9,
    reasoning: "The City of Angels is a nickname for Los Angeles"
  },
  "the city that never sleeps": {
    normalizedLocation: "New York, NY",
    slug: "new-york-ny",
    confidence: 0.95,
    reasoning: "The City That Never Sleeps is a nickname for New York City"
  },
  "the emerald city": {
    normalizedLocation: "Seattle, WA",
    slug: "seattle-wa",
    confidence: 0.85,
    reasoning: "The Emerald City is a nickname for Seattle"
  },
  "the city of brotherly love": {
    normalizedLocation: "Philadelphia, PA",
    slug: "philadelphia-pa",
    confidence: 0.9,
    reasoning: "The City of Brotherly Love is a nickname for Philadelphia"
  },
  "the mile high city": {
    normalizedLocation: "Denver, CO",
    slug: "denver-co",
    confidence: 0.9,
    reasoning: "The Mile High City is a nickname for Denver"
  },
  "the motor city": {
    normalizedLocation: "Detroit, MI",
    slug: "detroit-mi",
    confidence: 0.9,
    reasoning: "The Motor City is a nickname for Detroit"
  },
  "the music city": {
    normalizedLocation: "Nashville, TN",
    slug: "nashville-tn",
    confidence: 0.9,
    reasoning: "The Music City is a nickname for Nashville"
  },
  "the queen city": {
    normalizedLocation: "Charlotte, NC",
    slug: "charlotte-nc",
    confidence: 0.8,
    reasoning: "The Queen City is a nickname for Charlotte"
  },
  "the space city": {
    normalizedLocation: "Houston, TX",
    slug: "houston-tx",
    confidence: 0.9,
    reasoning: "The Space City is a nickname for Houston"
  },
  "the alamo city": {
    normalizedLocation: "San Antonio, TX",
    slug: "san-antonio-tx",
    confidence: 0.9,
    reasoning: "The Alamo City is a nickname for San Antonio"
  },
  "the valley of the sun": {
    normalizedLocation: "Phoenix, AZ",
    slug: "phoenix-az",
    confidence: 0.85,
    reasoning: "The Valley of the Sun is a nickname for Phoenix"
  },
  "the gateway to the west": {
    normalizedLocation: "St. Louis, MO",
    slug: "st-louis-mo",
    confidence: 0.85,
    reasoning: "The Gateway to the West is a nickname for St. Louis"
  }
};

// app/services/llmService.ts
var LocationNormalizationSchema = z4.object({
  slug: z4.string(),
  normalizedLocation: z4.string(),
  confidence: z4.number().min(0).max(1),
  reasoning: z4.string().optional()
});
var LLMService = class {
  static {
    __name(this, "LLMService");
  }
  /**
   * Normalize a location description using OpenAI LLM
   * Converts descriptions like "Gotham City" to "New York, NY"
   */
  static async normalizeLocation(description) {
    try {
      if (!OPENAI_API_KEY) {
        console.warn("OpenAI API key not found, falling back to mock implementation");
        const mockResponse = this.getMockNormalization(description);
        return LocationNormalizationSchema.parse(mockResponse);
      }
      const openaiResponse = await this.convertDescriptionToNormalizedLocation(description);
      return LocationNormalizationSchema.parse(openaiResponse);
    } catch (error) {
      throw new Error("Failed to normalize location from description: " + error);
    }
  }
  /**
   * Normalize a slug using OpenAI LLM
   * Converts slugs like "new-york-ny" to "New York, NY"
   */
  // static async normalizeLocationWithSlug(slug: string): Promise<LocationNormalization> {
  //   try {
  //     // Check if OpenAI API key is available
  //     if (!OPENAI_API_KEY) {
  //       console.warn("OpenAI API key not found, falling back to mock implementation")
  //       const mockResponse = this.getMockNormalizationWithSlug(slug)
  //       return LocationNormalizationSchema.parse(mockResponse)
  //     }
  //     // Use OpenAI API for location normalization with slug
  //     const openaiResponse = await this.convertSlugToNormalizedLocation(slug)
  //     return LocationNormalizationSchema.parse(openaiResponse)
  //   } catch (error) {
  //     console.error("Error normalizing location with slug:", error)
  //     throw new Error("Failed to normalize location with slug")
  //   }
  // }
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
    throw new Error("Description not found.");
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
            content: "You are a location normalization expert. Always respond with valid JSON."
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
      return LocationNormalizationSchema.parse(parsed);
    } catch (error) {
      console.error("OpenAI API error:", error);
      throw new Error("Failed to normalize location with OpenAI");
    }
  }
  /**
   * Production method for calling OpenAI API for description to normalized location.
   * Converts descriptions like "Gotham City" to "New York, NY".
   */
  static async convertDescriptionToNormalizedLocation(description) {
    const prompt = `Convert this location description to a normalized format with city and state/country.

Location description: "${description}"

Please respond with a JSON object containing:
- normalizedLocation: The standardized location (e.g., "New York, NY" or "London, UK")
- slug: A URL-friendly slug (e.g., "new-york-ny" or "london-uk")
- confidence: A number between 0 and 1 indicating your confidence
- reasoning: Brief explanation of your choice

Examples:
- "Gotham City" \u2192 {"normalizedLocation": "New York, NY", "slug": "new-york-ny", "confidence": 0.95, "reasoning": "Gotham City is commonly associated with New York City"}
- "The Big Apple" \u2192 {"normalizedLocation": "New York, NY", "slug": "new-york-ny", "confidence": 0.98, "reasoning": "The Big Apple is a well-known nickname for New York City"}
- "Home of Harvard" \u2192 {"normalizedLocation": "Cambridge, MA", "slug": "cambridge-ma", "confidence": 0.95, "reasoning": "Harvard University is located in Cambridge, Massachusetts"}
- "Springfield" \u2192 {"normalizedLocation": "Springfield, IL", "slug": "springfield-il", "confidence": 0.85, "reasoning": "Springfield could refer to multiple cities, defaulting to Illinois state capital"}

Respond only with valid JSON:`;
    return this.createOpenAICompletion(prompt);
  }
};

// app/services/weatherService.ts
import { z as z5 } from "zod";
var OpenMeteoDailySchema = z5.object({
  time: z5.array(z5.string()),
  temperature_2m_max: z5.array(z5.number()),
  temperature_2m_min: z5.array(z5.number()),
  precipitation_probability_max: z5.array(z5.number()),
  windspeed_10m_max: z5.array(z5.number()),
  weathercode: z5.array(z5.number())
});
var OpenMeteoResponseSchema = z5.object({
  daily: OpenMeteoDailySchema
});
var WEATHER_CODE_MAPPING = {
  0: "SUNNY",
  // Clear sky
  1: "SUNNY",
  // Mainly clear
  2: "PARTLY_CLOUDY",
  // Partly cloudy
  3: "CLOUDY",
  // Overcast
  45: "FOGGY",
  // Fog
  48: "FOGGY",
  // Depositing rime fog
  51: "LIGHT_SHOWERS",
  // Light drizzle
  53: "LIGHT_SHOWERS",
  // Moderate drizzle
  55: "LIGHT_SHOWERS",
  // Dense drizzle
  56: "LIGHT_SHOWERS",
  // Light freezing drizzle
  57: "LIGHT_SHOWERS",
  // Dense freezing drizzle
  61: "RAINY",
  // Slight rain
  63: "RAINY",
  // Moderate rain
  65: "RAINY",
  // Heavy rain
  66: "RAINY",
  // Light freezing rain
  67: "RAINY",
  // Heavy freezing rain
  71: "SNOWY",
  // Slight snow fall
  73: "SNOWY",
  // Moderate snow fall
  75: "SNOWY",
  // Heavy snow fall
  77: "SNOWY",
  // Snow grains
  80: "LIGHT_SHOWERS",
  // Slight rain showers
  81: "LIGHT_SHOWERS",
  // Moderate rain showers
  82: "RAINY",
  // Violent rain showers
  85: "SNOWY",
  // Slight snow showers
  86: "SNOWY",
  // Heavy snow showers
  95: "STORMY",
  // Thunderstorm
  96: "STORMY",
  // Thunderstorm with slight hail
  99: "STORMY"
  // Thunderstorm with heavy hail
};
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
    const startDateStr = startDate.toISOString().split("T")[0];
    const endDateStr = forecastEndDate.toISOString().split("T")[0];
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
        const celsius = this.fahrenheitToCelsius(avgTemp);
        const rainProbability = validatedData.daily.precipitation_probability_max[i];
        const windSpeed = validatedData.daily.windspeed_10m_max[i];
        const weatherCode = validatedData.daily.weathercode[i];
        const weather = {
          date: date.toISOString(),
          degreesFahrenheit: Math.round(avgTemp),
          degreesCelsius: Math.round(celsius),
          temperatureRange: {
            temperatureMinimum: Math.round(minTemp),
            temperatureMaximum: Math.round(maxTemp)
          },
          rainProbabilityPercentage: Math.round(rainProbability),
          windSpeedMph: Math.round(windSpeed),
          condition: WeatherConditionEnum[this.mapWeatherCode(weatherCode)],
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
  /**
   * Convert Fahrenheit to Celsius
   */
  static fahrenheitToCelsius(fahrenheit) {
    return (fahrenheit - 32) * 5 / 9;
  }
  /**
   * Map Open-Meteo weather code to our weather condition enum
   */
  static mapWeatherCode(code) {
    return WEATHER_CODE_MAPPING[code] || "CLOUDY";
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

// app/stores/LocationStore.ts
var LocationStore = class extends Store {
  static {
    __name(this, "LocationStore");
  }
  constructor() {
    super("locations");
  }
  /**
   * Generate a URL-friendly slug from a location string
   */
  static generateSlug(text) {
    return text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  }
  toModel(item) {
    const model = super.toModel(item);
    return {
      ...model,
      description: item.description,
      normalizedLocation: item.normalizedLocation,
      slug: item.slug,
      geocodedAddress: item.geocodedAddress,
      weather: item.weather,
      createdAt: item.createdAt
    };
  }
  getByDescription(description) {
    return this.getAll().find((item) => item.description === description);
  }
  getBySlug(slug) {
    return this.getAll().find((item) => item.slug === slug);
  }
  getByNormalizedLocation(normalizedLocation) {
    return this.getAll().find((item) => item.normalizedLocation === normalizedLocation);
  }
  /**
   * Get location by ID and return as model
   */
  getById(id) {
    const item = this.get(id);
    return item ? this.toModel(item) : void 0;
  }
  /**
   * Get all locations as models
   */
  getAllAsModels() {
    return this.getAll().map((item) => this.toModel(item));
  }
  /**
   * Create a complete location with all required fields
   * This method should be used instead of the basic add() method for locations
   */
  createLocation(data) {
    const locationData = {
      description: data.description,
      normalizedLocation: data.normalizedLocation,
      slug: data.slug,
      geocodedAddress: data.geocodedAddress,
      weather: data.weather
    };
    return this.add(locationData);
  }
  /**
   * Override update method to return updated item
   */
  update(id, updates) {
    const oldItem = this.get(id);
    if (!oldItem) {
      throw new Error(`Location with id "${id}" not found`);
    }
    super.update(id, updates);
    const updatedItem = this.get(id);
    return updatedItem;
  }
};

// core/container.ts
import { asValue, createContainer } from "awilix";
var container = createContainer();
container.register({
  locations: asValue(new LocationStore())
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

// app/router/locations.ts
import { TRPCError } from "@trpc/server";
import { z as z6 } from "zod";
var locations = router({
  // Get location by normalized location string
  getByNormalizedLocation: procedure.input(z6.object({ normalizedLocation: z6.string() })).query(async ({ ctx, input }) => {
    const location = ctx.cradle.locations.getByNormalizedLocation(input.normalizedLocation);
    if (!location) {
      return false;
    }
    return location;
  }),
  // Phase II: List all locations
  // list: procedure.query(async ({ ctx }) => {
  //   const records = ctx.cradle.locations.getAll()
  //   return records.map((record) => ({
  //     id: record.id,
  //     createdAt: record.createdAt,
  //     description: record.description,
  //     normalizedLocation: record.normalizedLocation,
  //     geocodedAddress: record.geocodedAddress,
  //     weather: record.weather
  //   }))
  // }),
  /**
   * Creates a location object from a description.
   * If the location already exists,
   * it updates the location with the new description.
   */
  create: procedure.input(CreateLocationSchema).mutation(async ({ ctx, input }) => {
    try {
      const llmResult = await LLMService.normalizeLocation(input.description);
      console.log(`LLM normalized "${input.description}" to "${llmResult.normalizedLocation}" (confidence: ${llmResult.confidence})`);
      console.log(`LLM generated slug: "${llmResult.slug}"`);
      const existingLocation = ctx.cradle.locations.getByNormalizedLocation(llmResult.normalizedLocation);
      if (existingLocation) {
        const updatedLocation = ctx.cradle.locations.update(existingLocation.id, { description: input.description });
        return ctx.cradle.locations.toModel(updatedLocation);
      }
      const geocodedAddress = await GeolocationService.geocodeLocation(llmResult.normalizedLocation);
      console.log(`Geocoded "${llmResult.normalizedLocation}" to:`, geocodedAddress);
      const weatherData = await WeatherService.get7DayForecast({ latitude: geocodedAddress.latitude, longitude: geocodedAddress.longitude });
      weatherData.forEach((weather) => {
        weather.clothing = ClothingService.getRecommendations(weather.degreesFahrenheit, weather.condition, weather.rainProbabilityPercentage, weather.windSpeedMph);
      });
      const locationData = {
        description: input.description,
        normalizedLocation: llmResult.normalizedLocation,
        slug: llmResult.slug,
        geocodedAddress,
        weather: weatherData
      };
      const location = ctx.cradle.locations.createLocation(locationData);
      console.log("Location created:", location);
      const model = ctx.cradle.locations.toModel(location);
      return model;
    } catch (error) {
      console.error("Error in create:", error);
      if (error instanceof Error && error.message === "Description not found.") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Description not found."
        });
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create location"
      });
    }
  }),
  /**
   * Updates a location with a new description.
   */
  update: procedure.input(UpdateLocationSchema).mutation(async ({ ctx, input }) => {
    return ctx.cradle.locations.update(input.id, { description: input.description });
  }),
  /**
   * Gets a location by slug.
   * If the location does not exist, return an error.
   */
  getBySlug: procedure.input(z6.object({ slug: z6.string() })).query(async ({ ctx, input }) => {
    const location = ctx.cradle.locations.getBySlug(input.slug);
    if (!location) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Location not found with slug: "${input.slug}".`
      });
    }
    return ctx.cradle.locations.toModel(location);
  }),
  /**
   * Deletes a location by id.
   * If the location does not exist, return an error.
   */
  delete: procedure.input(z6.object({ id: z6.string() })).mutation(async ({ ctx, input }) => {
    const location = ctx.cradle.locations.get(input.id);
    if (!location) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Location not found with id: "${input.id}".`
      });
    }
    ctx.cradle.locations.remove(input.id);
    return { success: true, message: "Location deleted successfully" };
  }),
  /**
   * Get 7-day weather forecast for a location by slug
   */
  getWeatherForecast: procedure.input(z6.object({ slug: z6.string() })).query(async ({ ctx, input }) => {
    const location = ctx.cradle.locations.getBySlug(input.slug);
    if (!location) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Location not found with slug: "${input.slug}".`
      });
    }
    try {
      const forecast = await WeatherService.get7DayForecast({
        latitude: location.geocodedAddress.latitude,
        longitude: location.geocodedAddress.longitude
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
   * Get current day weather for a location by slug
   */
  getCurrentWeather: procedure.input(z6.object({ slug: z6.string() })).query(async ({ ctx, input }) => {
    const location = ctx.cradle.locations.getBySlug(input.slug);
    if (!location) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Location not found with slug: "${input.slug}".`
      });
    }
    try {
      const weather = await WeatherService.getCurrentDayWeather(
        location.geocodedAddress.latitude,
        location.geocodedAddress.longitude
      );
      return weather;
    } catch (error) {
      console.error("Error fetching current weather:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch current weather"
      });
    }
  })
  // Get weather for a specific location
  // getWeather: procedure
  //   .input(z.object({ locationId: z.string() }))
  //   .query(async ({ ctx, input }) => {
  //     const location = ctx.cradle.locations.get(input.locationId)
  //     if (!location) {
  //       throw new TRPCError({
  //         code: "NOT_FOUND",
  //         message: "Location not found."
  //       })
  //     }
  //     return location.weather
  //   }),
  // Refresh weather data for a location
  // refreshWeather: procedure
  //   .input(z.object({ locationId: z.string() }))
  //   .mutation(async ({ ctx, input }) => {
  //     const location = ctx.cradle.locations.get(input.locationId)
  //     if (!location) {
  //       throw new TRPCError({
  //         code: "NOT_FOUND",
  //         message: "Location not found."
  //       })
  //     }
  //     // This would typically:
  //     // 1. Fetch fresh weather data from Open-Meteo API
  //     // 2. Get updated clothing recommendations from TikTok Shop API
  //     // 3. Update the location with new weather data
  //     // For now, we'll just return the existing weather
  //     // In a real implementation, this would call external APIs
  //     return location.weather
  //   }),
  // Get clothing recommendations using the rules engine
  // getClothingRecommendations: procedure
  //   .input(
  //     z.object({
  //       locationId: z.string(),
  //       date: z.date().optional() // If not provided, use current date
  //     })
  //   )
  //   .query(async ({ ctx, input }) => {
  //     const location = ctx.cradle.locations.get(input.locationId)
  //     if (!location) {
  //       throw new TRPCError({
  //         code: "NOT_FOUND",
  //         message: "Location not found."
  //       })
  //     }
  //     const targetDate = input.date || new Date()
  // const weatherForDate = location.weather.find(
  //   (w) => w.date.toDateString() === targetDate.toDateString()
  // )
  // if (!weatherForDate) {
  //   throw new TRPCError({
  //     code: "NOT_FOUND",
  //     message: "Weather data not found for the specified date."
  //   })
  // }
  // const recommendations = ClothingService.getRecommendationsForDate({
  //   temperature: weatherForDate.degreesFahrenheit,
  //   condition: weatherForDate.condition,
  //   rainProbability: weatherForDate.rainProbabilityPercentage,
  //   windSpeed: weatherForDate.windSpeedMph
  // })
  // return {
  //   weather: weatherForDate,
  //   clothingRecommendations: recommendations.categories
  //   // Phase II: tikTokShopQueries: recommendations.searchQueries
  // }
  // }),
  // Get weather appropriateness score for a specific clothing item
  // getClothingScore: procedure
  //   .input(
  //     z.object({
  //       locationId: z.string(),
  //       clothingCategory: z.string(),
  //       date: z.date().optional()
  //     })
  //   )
  //   .query(async ({ ctx, input }) => {
  //     const location = ctx.cradle.locations.get(input.locationId)
  //     if (!location) {
  //       throw new TRPCError({
  //         code: "NOT_FOUND",
  //         message: "Location not found."
  //       })
  //     }
  //     const targetDate = input.date || new Date()
  // const weatherForDate = location.weather.find(
  //   (w) => w.date.toDateString() === targetDate.toDateString()
  // )
  // if (!weatherForDate) {
  //   throw new TRPCError({
  //     code: "NOT_FOUND",
  //     message: "Weather data not found for the specified date."
  //   })
  // }
  // const score = ClothingService.getWeatherAppropriatenessScore(
  //   input.clothingCategory as ClothingCategory,
  //   weatherForDate.degreesFahrenheit,
  //   weatherForDate.condition,
  //   weatherForDate.rainProbabilityPercentage,
  //   weatherForDate.windSpeedMph
  // )
  // return {
  //   clothingCategory: input.clothingCategory,
  //   weather: weatherForDate,
  //   appropriatenessScore: score,
  //   recommendation: score >= 80 ? "Highly recommended" : 
  //                  score >= 60 ? "Good choice" : 
  //                  score >= 40 ? "Consider alternatives" : 
  //                  "Not recommended for this weather"
  // }
  // })
});

// app/router/index.ts
var appRouter = router({
  locations
});

// src/index.ts
import { trpcServer } from "@hono/trpc-server";
if (process.env.NODE_ENV !== "production") {
  config2();
}
console.log("Starting server...");
var app = new Hono().use(cors()).get("/", (c) => {
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
  const http = await import("http");
  const server = http.createServer(async (req, res) => {
    try {
      const response = await app.fetch(req);
      const headers = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });
      res.writeHead(response.status, headers);
      if (response.body) {
        const reader = response.body.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(value);
        }
        res.end();
      } else {
        res.end();
      }
    } catch (error) {
      res.writeHead(500);
      res.end("Internal Server Error");
    }
  });
  server.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}`);
  });
}
export {
  index_default as default
};
