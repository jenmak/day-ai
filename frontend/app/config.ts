/**
 * Centralized configuration for the entire application
 * This file contains all configurable values that were previously hardcoded
 */

// Environment-based configuration
export const CONFIG = {
  // Server Configuration
  SERVER: {
    // Default ports
    FRONTEND_PORT: 6173,
    BACKEND_PORT: 3333,
    
    // Default hosts
    HOST: "0.0.0.0",
    LOCALHOST: "localhost",
    
    // Default URLs
    FRONTEND_URL: "http://localhost:6173",
    BACKEND_URL: "http://localhost:3333",
    
    // Production URLs (can be overridden by environment variables)
    PRODUCTION_FRONTEND_URL: "https://dripdropcity-frontend.vercel.app",
    PRODUCTION_BACKEND_URL: "https://dripdropcity-backend.vercel.app",
    
    // CORS configuration
    CORS_ORIGINS: [
      "http://localhost:6173",
      "https://dripdropcity-frontend.vercel.app"
    ],
    
    // HTTP status codes
    HTTP_STATUS: {
      OK: 200,
      BAD_REQUEST: 400,
      UNAUTHORIZED: 401,
      FORBIDDEN: 403,
      NOT_FOUND: 404,
      INTERNAL_SERVER_ERROR: 500,
      SERVICE_UNAVAILABLE: 503,
      REQUEST_TIMEOUT: 408,
      TOO_MANY_REQUESTS: 429
    }
  },

  // API Configuration
  API: {
    // External API endpoints
    OPEN_METEO_BASE_URL: "https://api.open-meteo.com/v1/forecast",
    OPENCAGE_BASE_URL: "https://api.opencagedata.com/geocode/v1/json",
    OPENAI_BASE_URL: "https://api.openai.com/v1/chat/completions",
    
    // API request limits and timeouts
    REQUEST_TIMEOUT: 30000, // 30 seconds
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000, // 1 second
    
    // Rate limiting
    RATE_LIMIT_WINDOW: 60000, // 1 minute
    RATE_LIMIT_MAX_REQUESTS: 100,
    
    // Pagination
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100
  },

  // Weather Service Configuration
  WEATHER: {
    // Forecast settings
    DEFAULT_FORECAST_DAYS: 7,
    MAX_FORECAST_DAYS: 14,
    
    // API parameters
    DEFAULT_UNIT: "fahrenheit",
    DEFAULT_TIMEZONE: "auto",
    
    // Temperature ranges (in Fahrenheit)
    TEMPERATURE_RANGES: {
      VERY_HOT: { min: 85, max: 120 },
      HOT: { min: 75, max: 84 },
      WARM: { min: 65, max: 74 },
      MILD: { min: 55, max: 64 },
      COOL: { min: 45, max: 54 },
      COLD: { min: 35, max: 44 },
      VERY_COLD: { min: -20, max: 34 }
    },
    
    // Weather condition thresholds
    RAIN_THRESHOLD_LIGHT: 30, // 30% probability
    RAIN_THRESHOLD_HEAVY: 70, // 70% probability
    
    // Wind speed thresholds (in mph)
    WIND_THRESHOLD_LIGHT: 10,
    WIND_THRESHOLD_MODERATE: 20,
    WIND_THRESHOLD_STRONG: 30
  },

  // Geocoding Service Configuration
  GEOCODING: {
    // API parameters
    DEFAULT_LIMIT: 1,
    NO_ANNOTATIONS: true,
    
    // Fallback coordinates (New York City)
    DEFAULT_COORDINATES: {
      latitude: 40.7128,
      longitude: -74.006
    },
    
    // Common city coordinates (for mock fallback)
    COMMON_CITIES: {
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
    }
  },

  // LLM Service Configuration
  LLM: {
    // OpenAI API settings
    DEFAULT_MODEL: "gpt-3.5-turbo",
    DEFAULT_TEMPERATURE: 0.1,
    DEFAULT_MAX_TOKENS: 200,
    
    // Request limits
    MAX_INPUT_LENGTH: 500,
    MIN_INPUT_LENGTH: 1,
    
    // Response validation
    MIN_CONFIDENCE: 0.5,
    MAX_CONFIDENCE: 1.0
  },

  // Caching Configuration
  CACHE: {
    // TTL values (in minutes)
    TTL: {
      WEATHER: 30, // 30 minutes - weather changes frequently
      GEOCODE: 24 * 60, // 24 hours - locations rarely change
      LLM: 7 * 24 * 60, // 7 days - LLM responses are stable
      PLACE: 60, // 1 hour - place data changes moderately
      MOCK: 60 // 1 hour - mock data should be short-lived
    },
    
    // Cache size limits
    MAX_ENTRIES: 1000,
    MAX_MEMORY_MB: 100,
    
    // Cleanup intervals
    CLEANUP_INTERVAL: 60 * 60 * 1000, // 1 hour in milliseconds
    EXPIRED_CHECK_INTERVAL: 10 * 60 * 1000 // 10 minutes in milliseconds
  },

  // Database Configuration
  DATABASE: {
    // Store file paths
    PLACES_STORE_PATH: "tmp/places.json",
    CACHE_STORE_PATH: "tmp/cache.json",
    
    // Backup settings
    BACKUP_INTERVAL: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    MAX_BACKUPS: 7
  },

  // Frontend Configuration
  FRONTEND: {
    // UI settings
    DEFAULT_SEARCH_PLACEHOLDER: "Enter a location...",
    SEARCH_DEBOUNCE_MS: 300,
    
    // Animation settings
    LOADING_ANIMATION_DURATION: 2000, // 2 seconds
    FADE_TRANSITION_DURATION: 300, // 300ms
    
    // Layout settings
    MAX_CARD_WIDTH: 350,
    DEFAULT_CARD_PADDING: 24,
    
    // Color scheme
    COLORS: {
      BACKGROUND: "white",
      TEXT: "black",
      RING: "black",
      RING_BACKGROUND: "white"
    }
  },

  // Development Configuration
  DEVELOPMENT: {
    // Logging levels
    LOG_LEVEL: "info", // debug, info, warn, error
    
    // Debug settings
    ENABLE_DEBUG_LOGS: true,
    ENABLE_PERFORMANCE_LOGS: false,
    
    // Hot reload settings
    HOT_RELOAD_PORT: 5173
  },

  // Production Configuration
  PRODUCTION: {
    // Security settings
    ENABLE_CORS: true,
    ENABLE_RATE_LIMITING: true,
    ENABLE_REQUEST_LOGGING: true,
    
    // Performance settings
    ENABLE_COMPRESSION: true,
    ENABLE_CACHING: true,
    
    // Monitoring
    ENABLE_ERROR_TRACKING: true,
    ENABLE_PERFORMANCE_MONITORING: true
  }
} as const

// Environment variable helpers
export const ENV = {
  // Server URLs
  get FRONTEND_URL() {
    return process.env.VITE_FRONTEND_URL || CONFIG.SERVER.FRONTEND_URL
  },
  
  get BACKEND_URL() {
    return process.env.VITE_API_URL || CONFIG.SERVER.BACKEND_URL
  },
  
  get PRODUCTION_FRONTEND_URL() {
    return process.env.PRODUCTION_FRONTEND_URL || CONFIG.SERVER.PRODUCTION_FRONTEND_URL
  },
  
  get PRODUCTION_BACKEND_URL() {
    return process.env.PRODUCTION_BACKEND_URL || CONFIG.SERVER.PRODUCTION_BACKEND_URL
  },
  
  // API Keys
  get OPENAI_API_KEY() {
    return process.env.OPENAI_API_KEY || ""
  },
  
  get OPENCAGE_API_KEY() {
    return process.env.OPENCAGE_API_KEY || ""
  },
  
  // Server Configuration
  get PORT() {
    return process.env.PORT ? parseInt(process.env.PORT) : CONFIG.SERVER.BACKEND_PORT
  },
  
  get HOST() {
    return process.env.HOST || CONFIG.SERVER.HOST
  },
  
  // Environment Detection
  get IS_PRODUCTION() {
    return process.env.NODE_ENV === "production"
  },
  
  get IS_DEVELOPMENT() {
    return process.env.NODE_ENV === "development" || !process.env.NODE_ENV
  },
  
  // Feature Flags
  get ENABLE_CACHING() {
    return process.env.ENABLE_CACHING !== "false"
  },
  
  get ENABLE_MOCK_SERVICES() {
    return process.env.ENABLE_MOCK_SERVICES === "true"
  }
} as const

// Configuration validation
export function validateConfig(): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  // Validate required environment variables in production
  if (ENV.IS_PRODUCTION) {
    if (!ENV.OPENAI_API_KEY) {
      errors.push("OPENAI_API_KEY is required in production")
    }
    if (!ENV.OPENCAGE_API_KEY) {
      errors.push("OPENCAGE_API_KEY is required in production")
    }
  }
  
  // Validate port ranges
  if (ENV.PORT < 1 || ENV.PORT > 65535) {
    errors.push("PORT must be between 1 and 65535")
  }
  
  // Validate cache TTL values
  Object.entries(CONFIG.CACHE.TTL).forEach(([key, value]) => {
    if (value < 1) {
      errors.push(`Cache TTL for ${key} must be positive`)
    }
  })
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Configuration getters for easy access
export const getConfig = () => CONFIG
export const getEnv = () => ENV

// Export types for TypeScript
export type Config = typeof CONFIG
export type Environment = typeof ENV
export type TemperatureRange = typeof CONFIG.WEATHER.TEMPERATURE_RANGES[keyof typeof CONFIG.WEATHER.TEMPERATURE_RANGES]
export type CacheTTL = typeof CONFIG.CACHE.TTL
