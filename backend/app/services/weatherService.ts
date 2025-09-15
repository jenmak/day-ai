import { z } from "zod"
import { type Weather } from "../schemas/weather"
import { WeatherConditionEnum } from "../schemas/weatherConditions"

// Open-Meteo API Response Schema
const OpenMeteoDailySchema = z.object({
  time: z.array(z.string()),
  temperature_2m_max: z.array(z.number()),
  temperature_2m_min: z.array(z.number()),
  precipitation_probability_max: z.array(z.number()),
  windspeed_10m_max: z.array(z.number()),
  weathercode: z.array(z.number())
})

const OpenMeteoResponseSchema = z.object({
  daily: OpenMeteoDailySchema
})

// Weather code mapping from Open-Meteo to our conditions
const WEATHER_CODE_MAPPING: Record<number, keyof typeof WeatherConditionEnum> = {
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

export interface WeatherServiceOptions {
  latitude: number
  longitude: number
  startDate?: Date
  endDate?: Date
}

export class WeatherService {
  private static readonly BASE_URL = "https://api.open-meteo.com/v1/forecast"
  
  /**
   * Get 7-day weather forecast for given coordinates
   */
  static async get7DayForecast(options: WeatherServiceOptions): Promise<Weather[]> {
    const { latitude, longitude, startDate = new Date(), endDate } = options
    
    // Calculate end date (7 days from start date)
    const forecastEndDate = endDate || new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000)
    
    // Format dates for API
    const startDateStr = startDate.toISOString().split('T')[0]
    const endDateStr = forecastEndDate.toISOString().split('T')[0]
    
    try {
      const url = new URL(this.BASE_URL)
      url.searchParams.set('latitude', latitude.toString())
      url.searchParams.set('longitude', longitude.toString())
      url.searchParams.set('start_date', startDateStr)
      url.searchParams.set('end_date', endDateStr)
      url.searchParams.set('daily', 'temperature_2m_max,temperature_2m_min,precipitation_probability_max,windspeed_10m_max,weathercode')
      url.searchParams.set('temperature_unit', 'fahrenheit')
      url.searchParams.set('windspeed_unit', 'mph')
      url.searchParams.set('precipitation_unit', 'inch')
      url.searchParams.set('timezone', 'auto')
      
      console.log(`Fetching weather data from: ${url.toString()}`)
      
      const response = await fetch(url.toString())
      
      if (!response.ok) {
        throw new Error(`Weather API request failed: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      const validatedData = OpenMeteoResponseSchema.parse(data)
      
      // Transform Open-Meteo data to our Weather schema
      const weatherForecast: Weather[] = []
      
      for (let i = 0; i < validatedData.daily.time.length; i++) {
        const date = new Date(validatedData.daily.time[i])
        const maxTemp = validatedData.daily.temperature_2m_max[i]
        const minTemp = validatedData.daily.temperature_2m_min[i]
        const avgTemp = (maxTemp + minTemp) / 2
        const celsius = this.fahrenheitToCelsius(avgTemp)
        const rainProbability = validatedData.daily.precipitation_probability_max[i]
        const windSpeed = validatedData.daily.windspeed_10m_max[i]
        const weatherCode = validatedData.daily.weathercode[i]
        
        const weather: Weather = {
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
          clothing: [] // Will be populated by clothing service
        }
        
        weatherForecast.push(weather)
      }
      
      console.log(`Successfully fetched ${weatherForecast.length} days of weather data`)
      return weatherForecast
      
    } catch (error) {
      console.error("Error fetching weather data:", error)
      throw new Error(`Failed to fetch weather forecast: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
  
  /**
   * Get current day weather (today's forecast)
   */
  static async getCurrentDayWeather(latitude: number, longitude: number): Promise<Weather> {
    const forecast = await this.get7DayForecast({ latitude, longitude })
    return forecast[0] // First day is today
  }
  
  /**
   * Convert Fahrenheit to Celsius
   */
  private static fahrenheitToCelsius(fahrenheit: number): number {
    return (fahrenheit - 32) * 5 / 9
  }
  
  /**
   * Map Open-Meteo weather code to our weather condition enum
   */
  private static mapWeatherCode(code: number): keyof typeof WeatherConditionEnum {
    return WEATHER_CODE_MAPPING[code] || "CLOUDY"
  }
}
