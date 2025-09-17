// Weather Condition Enum
export const WeatherConditionEnum = {
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
} as const

// Weather code mapping from Open-Meteo to our conditions
export const WEATHER_CODE_MAPPING: Record<number, keyof typeof WeatherConditionEnum> = {
  0: "SUNNY",           // Clear sky
  1: "SUNNY",           // Mainly clear
  2: "PARTLY_CLOUDY",   // Partly cloudy
  3: "CLOUDY",          // Overcast
  45: "FOGGY",          // Fog
  48: "FOGGY",          // Depositing rime fog
  51: "LIGHT_SHOWERS",  // Light drizzle
  53: "LIGHT_SHOWERS",  // Moderate drizzle
  55: "LIGHT_SHOWERS",  // Dense drizzle
  56: "LIGHT_SHOWERS",  // Light freezing drizzle
  57: "LIGHT_SHOWERS",  // Dense freezing drizzle
  61: "RAINY",          // Slight rain
  63: "RAINY",          // Moderate rain
  65: "RAINY",          // Heavy rain
  66: "RAINY",          // Light freezing rain
  67: "RAINY",          // Heavy freezing rain
  71: "SNOWY",          // Slight snow fall
  73: "SNOWY",          // Moderate snow fall
  75: "SNOWY",          // Heavy snow fall
  77: "SNOWY",          // Snow grains
  80: "LIGHT_SHOWERS",  // Slight rain showers
  81: "LIGHT_SHOWERS",  // Moderate rain showers
  82: "RAINY",          // Violent rain showers
  85: "SNOWY",          // Slight snow showers
  86: "SNOWY",          // Heavy snow showers
  95: "STORMY",         // Thunderstorm
  96: "STORMY",         // Thunderstorm with slight hail
  99: "STORMY"          // Thunderstorm with heavy hail
}