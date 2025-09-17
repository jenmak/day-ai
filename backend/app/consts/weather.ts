// Open-Meteo Weather Codes with descriptions
export const WEATHER_CONDITION = {
  0: "Clear sky",
  1: "Mainly clear", 
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle", 
  55: "Dense drizzle",
  56: "Light freezing drizzle",
  57: "Dense freezing drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Light freezing rain",
  67: "Heavy freezing rain",
  71: "Slight snow fall",
  73: "Moderate snow fall",
  75: "Heavy snow fall", 
  77: "Snow grains",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  85: "Slight snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail"
} as const

// Temperature ranges for clothing recommendations
export const TEMPERATURE_RANGES = {
  VERY_HOT: { min: 85, max: 120 }, // 85°F+
  HOT: { min: 75, max: 84 },       // 75-84°F
  WARM: { min: 65, max: 74 },      // 65-74°F
  MILD: { min: 55, max: 64 },      // 55-64°F
  COOL: { min: 45, max: 54 },      // 45-54°F
  COLD: { min: 32, max: 44 },      // 32-44°F
  VERY_COLD: { min: -20, max: 31 } // Below 32°F
} as const