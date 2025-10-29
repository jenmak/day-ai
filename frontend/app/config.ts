// Shared configuration constants
export const SHARED_CONFIG = {
  // API Configuration
  API: {
    MAX_RETRIES: 3,
    TIMEOUT_MS: 10000,
    RATE_LIMIT_PER_MINUTE: 60
  },

  // Validation Configuration
  VALIDATION: {
    MAX_STRING_LENGTH: 1000,
    MAX_ARRAY_LENGTH: 100,
    MIN_CONFIDENCE: 0.1,
    MAX_CONFIDENCE: 1.0
  },

  // Weather Configuration
  WEATHER: {
    MAX_FORECAST_DAYS: 14,
    MIN_TEMPERATURE_F: -50,
    MAX_TEMPERATURE_F: 150,
    MIN_WIND_SPEED_MPH: 0,
    MAX_WIND_SPEED_MPH: 200
  },

  // Place Configuration
  PLACE: {
    MAX_DESCRIPTION_LENGTH: 500,
    MAX_NORMALIZED_PLACE_LENGTH: 200,
    MAX_SLUG_LENGTH: 100,
    MAX_REASONING_LENGTH: 1000
  }
} as const

// Environment configuration
export const getEnvironmentConfig = () => {
  const isDevelopment = import.meta.env.DEV
  const isProduction = import.meta.env.PROD

  return {
    isDevelopment,
    isProduction,
    isTest: import.meta.env.MODE === "test",
    apiUrl: import.meta.env.VITE_API_URL || "http://localhost:3333",
    backendUrl:
      import.meta.env.VITE_BACKEND_URL ||
      import.meta.env.VITE_API_URL ||
      "http://localhost:3333",
    frontendUrl: import.meta.env.VITE_FRONTEND_URL || "http://localhost:3000"
  }
}

// Environment object for easy access
export const ENV = getEnvironmentConfig()
