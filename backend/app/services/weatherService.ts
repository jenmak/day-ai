import { OpenMeteoResponseSchema } from "../schemas"
import { Weather } from "../types"
import { getTemperatureRangeCategory } from "../utils/temperatureUtils"
import { DateService } from "./dateService"
// import { CacheStore } from "../../core/CacheStore"
// import { CacheUtils } from "../../core/cacheUtils"

export interface WeatherServiceOptions {
  latitude: number
  longitude: number
  startDate?: Date
  endDate?: Date
  // cache?: CacheStore
}

export class WeatherService {
  private static readonly BASE_URL = "https://api.open-meteo.com/v1/forecast"

  /**
   * Get 7-day weather forecast for given coordinates
   */
  static async get7DayForecast(options: WeatherServiceOptions): Promise<Weather[]> {
    const { latitude, longitude, startDate = new Date(), endDate } = options
    // const { cache } = options

    // Calculate end date (7 days from start date)
    const forecastEndDate = endDate || new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000)

    // Format dates for API using DateService
    const startDateStr = DateService.formatDate(startDate)
    const endDateStr = DateService.formatDate(forecastEndDate)

    // Generate cache key using utility
    // const cacheKey = CacheUtils.generateCacheKeys.weather(
    //   latitude,
    //   longitude,
    //   startDateStr,
    //   endDateStr
    // )

    // Check cache first if cache store is provided
    // if (cache) {
    //   const cached = await cache.getCached<Weather[]>(cacheKey)
    //   if (cached) {
    //     console.log("Weather data served from cache")
    //     return cached
    //   }
    // }

    try {
      const url = new URL(this.BASE_URL)
      url.searchParams.set("latitude", latitude.toString())
      url.searchParams.set("longitude", longitude.toString())
      url.searchParams.set("start_date", startDateStr)
      url.searchParams.set("end_date", endDateStr)
      url.searchParams.set(
        "daily",
        "temperature_2m_max,temperature_2m_min,precipitation_probability_max,windspeed_10m_max,weathercode"
      )
      url.searchParams.set("temperature_unit", "fahrenheit")
      url.searchParams.set("windspeed_unit", "mph")
      url.searchParams.set("precipitation_unit", "inch")
      url.searchParams.set("timezone", "auto")

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
        const rainProbability = validatedData.daily.precipitation_probability_max[i]
        const windSpeed = validatedData.daily.windspeed_10m_max[i]
        const weatherCode = validatedData.daily.weathercode[i]

        const weather: Weather = {
          date: DateService.formatDate(date),
          degreesFahrenheit: Math.round(avgTemp),
          temperatureRange: {
            temperatureMinimum: Math.round(minTemp),
            temperatureMaximum: Math.round(maxTemp)
          },
          temperatureRangeCategory: getTemperatureRangeCategory(Math.round(avgTemp)),
          rainProbabilityPercentage: Math.round(rainProbability),
          windSpeedMph: Math.round(windSpeed),
          condition: weatherCode,
          clothing: [] // Will be populated by clothing service
        }

        weatherForecast.push(weather)
      }

      console.log(`Successfully fetched ${weatherForecast.length} days of weather data`)

      // Cache the result if cache store is provided (30 minutes TTL)
      // if (cache) {
      //   await cache.setCache(cacheKey, weatherForecast, CacheUtils.TTL.WEATHER)
      // }

      return weatherForecast
    } catch (error) {
      console.error("Error fetching weather data:", error)
      throw new Error(
        `Failed to fetch weather forecast: ${error instanceof Error ? error.message : "Unknown error"}`
      )
    }
  }

  /**
   * Get current day weather (today's forecast)
   */
  static async getCurrentDayWeather(
    latitude: number,
    longitude: number
    // cache?: CacheStore
  ): Promise<Weather> {
    const forecast = await this.get7DayForecast({ latitude, longitude })
    return forecast[0] // First day is today
  }
}
