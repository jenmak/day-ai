import { TRPCError } from "@trpc/server"
import { procedure, router } from "../../core/trpc"
import { CreatePlaceSchema, GetPlaceBySlugSchema, UpdatePlaceSchema } from "../schemas/place"
import { validateInput } from "../schemas/validation"
import { ClothingService } from "../services/clothingService"
import { GeolocationService } from "../services/geolocationService"
import { LLMService } from "../services/llmService"
import { WeatherService } from "../services/weatherService"
import { OpenMeteoWeatherCode } from "../types"
import {
  ensureTemperatureRangeCategory,
  getPlaceTemperatureRangeCategory
} from "../utils/temperatureUtils"

export const places = router({
  /**
   * Creates a place object from a description.
   * If the place already exists,
   * it updates the place with the new description.
   */
  create: procedure.input(CreatePlaceSchema).mutation(async ({ ctx, input }) => {
    try {
      // Validate input with enhanced validation
      const validatedInput = validateInput(CreatePlaceSchema, input)

      // 1. Use LLM to normalize the location description
      const llmResult = await LLMService.normalizePlace(validatedInput.description)
      console.log(
        `LLM normalized "${input.description}" to "${llmResult.normalizedPlace}" (confidence: ${llmResult.confidence})`
      )
      console.log(`LLM generated slug: "${llmResult.slug}"`)

      // 1a. Handle unknown/not found/not applicable locations
      if (
        llmResult.slug === "no-specific-location-found" ||
        llmResult.slug === "unknown" ||
        llmResult.slug === "not-applicable"
      ) {
        const placeData = {
          description: input.description,
          normalizedPlace: llmResult.normalizedPlace,
          slug: llmResult.slug,
          geocodedAddress: null,
          weather: [],
          temperatureRangeCategory: null
        }
        const place = ctx.cradle.places.add(placeData)
        console.log("Place created for error location:", place)
        const model = ctx.cradle.places.toModel(place)
        return model
      }

      // 1b. Check if location already exists, and return it if so.
      const existingPlace = ctx.cradle.places.getByNormalizedPlace(llmResult.normalizedPlace)

      if (existingPlace) {
        const updatedPlace = ctx.cradle.places.update(existingPlace.id, {
          description: input.description
        })
        return ctx.cradle.places.toModel(updatedPlace)
      }

      // 2. Geocode the location with the OpenCage API
      const geocodedAddress = await GeolocationService.geocodePlace(llmResult.normalizedPlace)
      console.log(`Geocoded "${llmResult.normalizedPlace}" to:`, geocodedAddress)

      const weatherData = await WeatherService.get7DayForecast({
        latitude: geocodedAddress.latitude,
        longitude: geocodedAddress.longitude
      })

      // 3. Get clothing recommendations from rules engine
      weatherData.forEach((weather) => {
        weather.clothing = ClothingService.getRecommendations(
          weather.degreesFahrenheit,
          weather.condition as OpenMeteoWeatherCode,
          weather.rainProbabilityPercentage,
          weather.windSpeedMph
        )
      })

      // 4. Calculate overall temperature range category for the place
      const temperatureRangeCategory = getPlaceTemperatureRangeCategory(weatherData)

      // 5. Save to database
      const placeData = {
        description: input.description,
        normalizedPlace: llmResult.normalizedPlace,
        slug: llmResult.slug,
        geocodedAddress,
        weather: weatherData,
        temperatureRangeCategory
      }
      const place = ctx.cradle.places.createPlace(placeData)

      console.log("Place created:", place)
      const model = ctx.cradle.places.toModel(place)
      return ensureTemperatureRangeCategory(model)
    } catch (error) {
      console.error("Error in create:", error)

      // Handle specific error for description not found
      if (error instanceof Error && error.message === "Description not found.") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Description not found."
        })
      }

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create place"
      })
    }
  }),

  /**
   * Updates a place with a new description.
   */
  update: procedure.input(UpdatePlaceSchema).mutation(async ({ ctx, input }) => {
    return ctx.cradle.places.update(input.id, { description: input.description })
  }),

  /**
   * Gets a place by slug.
   * If the place does not exist, returns an error.
   * If today is not the first day in weather data, fetches fresh weather data starting from today.
   */
  getBySlug: procedure.input(GetPlaceBySlugSchema).query(async ({ ctx, input }) => {
    try {
      // Validate input with enhanced validation
      const validatedInput = validateInput(GetPlaceBySlugSchema, input)

      const place = ctx.cradle.places.getBySlug(validatedInput.slug)

      if (!place) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Place not found with slug: "${input.slug}".`
        })
      }

      // Check if we need to update weather data
      if (place.weather && place.weather.length > 0 && place.geocodedAddress) {
        const firstWeatherDate = new Date(place.weather[0].date)
        const now = new Date()

        // Calculate the age of the weather data in days
        const daysSinceWeatherFetch = Math.floor(
          (now.getTime() - firstWeatherDate.getTime()) / (1000 * 60 * 60 * 24)
        )

        // If weather data is outdated (first date is in the past), fetch fresh data
        if (daysSinceWeatherFetch > 0) {
          try {
            console.log(
              `Weather data is outdated. First date: ${place.weather[0].date} (${daysSinceWeatherFetch} days old). Fetching fresh data.`
            )

            // Fetch fresh 7-day weather data starting from today
            const freshWeatherData = await WeatherService.get7DayForecast({
              latitude: place.geocodedAddress.latitude,
              longitude: place.geocodedAddress.longitude
            })

            // Get clothing recommendations for the fresh weather data
            freshWeatherData.forEach((weather) => {
              weather.clothing = ClothingService.getRecommendations(
                weather.degreesFahrenheit,
                weather.condition as OpenMeteoWeatherCode,
                weather.rainProbabilityPercentage,
                weather.windSpeedMph
              )
            })

            // Update the place with fresh weather data
            const updatedPlace = ctx.cradle.places.update(place.id, {
              weather: freshWeatherData,
              temperatureRangeCategory: getPlaceTemperatureRangeCategory(freshWeatherData)
            })

            const model = ctx.cradle.places.toModel(updatedPlace)
            return ensureTemperatureRangeCategory(model)
          } catch (error) {
            console.error("Error fetching fresh weather data:", error)
            // If weather update fails, return the existing place data
            console.log("Falling back to existing weather data")
          }
        }
      }

      const model = ctx.cradle.places.toModel(place)
      return ensureTemperatureRangeCategory(model)
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error
      }
      console.error("Error getting place by slug:", error)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get place"
      })
    }
  })

  // /**
  //  * Get cache statistics and health metrics
  //  */
  // getCacheStats: procedure.query(async ({ ctx }) => {
  //   const metrics = CacheUtils.getCacheMetrics(ctx.cradle.cache)
  //   return metrics
  // }),

  // /**
  //  * Clean up expired cache entries
  //  */
  // cleanupCache: procedure.mutation(async ({ ctx }) => {
  //   const cleaned = await CacheUtils.cleanupExpiredEntries(ctx.cradle.cache)
  //   return { cleanedEntries: cleaned }
  // }),

  // /**
  //  * Monitor cache health and return status
  //  */
  // monitorCacheHealth: procedure.query(async ({ ctx }) => {
  //   CacheUtils.monitorCacheHealth(ctx.cradle.cache)
  //   const metrics = CacheUtils.getCacheMetrics(ctx.cradle.cache)
  //   return {
  //     status: "healthy",
  //     metrics,
  //     timestamp: new Date().toISOString()
  //   }
  // }),
})
