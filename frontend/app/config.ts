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

// Environment configuration with Safari compatibility
export const getEnvironmentConfig = () => {
  // Safari-compatible environment detection
  const isDevelopment = typeof import.meta !== 'undefined' ? import.meta.env?.DEV : process.env.NODE_ENV === 'development'
  const isProduction = typeof import.meta !== 'undefined' ? import.meta.env?.PROD : process.env.NODE_ENV === 'production'

  // Fallback for Safari compatibility
  const getEnvVar = (key: string, fallback: string): string => {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      return import.meta.env[key] || fallback
    }
    // Fallback for older browsers or server-side rendering
    return fallback
  }

  // Determine backend URL based on environment
  let backendUrl: string
  if (isDevelopment) {
    backendUrl = "http://localhost:3333"
  } else {
    // Production backend URL
    backendUrl = "https://dripdropcitybackend-production.up.railway.app"
  }

  return {
    isDevelopment,
    isProduction,
    isTest: getEnvVar('VITE_MODE', 'development') === "test",
    apiUrl: backendUrl,
    backendUrl: backendUrl,
    frontendUrl: getEnvVar('VITE_FRONTEND_URL', "http://localhost:3000")
  }
}

// Environment object for easy access
export const ENV = getEnvironmentConfig()
