import {
  CreatePlaceSchema,
  UpdatePlaceSchema,
} from "../schemas/place"
import { ClothingService } from "../services/clothingService"
import { GeolocationService } from "../services/geolocationService"
import { LLMService } from "../services/llmService"
import { WeatherService } from "../services/weatherService"
import { procedure, router } from "../../core/trpc"
import { TRPCError } from "@trpc/server"
import { z } from "zod"

export const places = router({
  // Get place by normalized place string
  getByNormalizedPlace: procedure
    .input(z.object({ normalizedPlace: z.string() }))
    .query(async ({ ctx, input }) => {
      const place = ctx.cradle.places.getByNormalizedPlace(input.normalizedPlace)

      if (!place) {
        return false
      }

      return place
    }),

  /**
   * Creates a place object from a description.
   * If the place already exists,
   * it updates the place with the new description.
   */
  create: procedure
    .input(CreatePlaceSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // 1. Use LLM to normalize the location description
        const llmResult = await LLMService.normalizePlace(input.description)
        console.log(`LLM normalized "${input.description}" to "${llmResult.normalizedPlace}" (confidence: ${llmResult.confidence})`)
        console.log(`LLM generated slug: "${llmResult.slug}"`)

        // 1b. Check if location already exists, and return it if so.
        const existingPlace = ctx.cradle.locations.getByNormalizedPlace(llmResult.normalizedPlace)

        if (existingPlace) {
          const updatedLocation = ctx.cradle.locations.update(existingPlace.id, { description: input.description })
          return ctx.cradle.locations.toModel(updatedLocation)
        }

        // 2. Geocode the location with the OpenCage API
        const geocodedAddress = await GeolocationService.geocodePlace(llmResult.normalizedPlace)
        console.log(`Geocoded "${llmResult.normalizedPlace}" to:`, geocodedAddress)

        const weatherData = await WeatherService.get7DayForecast({ latitude: geocodedAddress.latitude, longitude: geocodedAddress.longitude })

        // 3. Get clothing recommendations from rules engine
        weatherData.forEach((weather) => {
          weather.clothing = ClothingService.getRecommendations(weather.degreesFahrenheit, weather.condition, weather.rainProbabilityPercentage, weather.windSpeedMph)
        })

        // 4. Save to database
        const placeData = {
          description: input.description,
          normalizedPlace: llmResult.normalizedPlace,
          slug: llmResult.slug,
          geocodedAddress,
          weather: weatherData
        }
        const place = ctx.cradle.locations.createPlace(placeData)

        console.log("Place created:", place)
        const model = ctx.cradle.locations.toModel(place)
        return model

      } catch (error) {
        console.error("Error in create:", error)

        // Handle specific error for description not found
        if (error instanceof Error && error.message === 'Description not found.') {
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
  update: procedure
    .input(UpdatePlaceSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.cradle.locations.update(input.id, { description: input.description })
    }),

  /**
   * Gets a place by slug.
   * If the place does not exist, return an error.
   */
  getBySlug: procedure.input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const place = ctx.cradle.locations.getBySlug(input.slug)

      if (!place) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Place not found with slug: "${input.slug}".`
        })
      }

      return ctx.cradle.locations.toModel(place)
    }),

  /**
   * Get 7-day weather forecast for a place by slug
   */
  getWeatherForecast: procedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const place = ctx.cradle.locations.getBySlug(input.slug)

      if (!place) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Place not found with slug: "${input.slug}".`
        })
      }

      try {
        const forecast = await WeatherService.get7DayForecast({
          latitude: place.geocodedAddress.latitude,
          longitude: place.geocodedAddress.longitude
        })

        return forecast
      } catch (error) {
        console.error("Error fetching weather forecast:", error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch weather forecast"
        })
      }
    }),

  /**
   * Get current day weather for a place by slug
   */
  getCurrentWeather: procedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const place = ctx.cradle.locations.getBySlug(input.slug)

      if (!place) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Place not found with slug: "${input.slug}".`
        })
      }

      try {
        const weather = await WeatherService.getCurrentDayWeather(
          place.geocodedAddress.latitude,
          place.geocodedAddress.longitude
        )

        return weather
      } catch (error) {
        console.error("Error fetching current weather:", error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch current weather"
        })
      }
    }),

  /**
   * Get weather for a specific date for a place by slug
   */
  getWeatherByDate: procedure
    .input(z.object({
      slug: z.string(),
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    }))
    .query(async ({ ctx, input }) => {
      const place = ctx.cradle.locations.getBySlug(input.slug)

      if (!place) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Place not found with slug: "${input.slug}".`
        })
      }

      try {
        const targetDate = new Date(input.date)
        const forecast = await WeatherService.get7DayForecast({
          latitude: place.geocodedAddress.latitude,
          longitude: place.geocodedAddress.longitude,
          startDate: targetDate,
          endDate: targetDate
        })

        if (forecast.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Weather data not found for date: ${input.date}`
          })
        }

        return forecast[0]
      } catch (error) {
        console.error("Error fetching weather by date:", error)
        if (error instanceof TRPCError) {
          throw error
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch weather for the specified date"
        })
      }
    }),

  /**
   * Get weather for a date range for a place by slug
   */
  getWeatherByDateRange: procedure
    .input(z.object({
      slug: z.string(),
      startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Start date must be in YYYY-MM-DD format"),
      endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "End date must be in YYYY-MM-DD format")
    }))
    .query(async ({ ctx, input }) => {
      const place = ctx.cradle.locations.getBySlug(input.slug)

      if (!place) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Place not found with slug: "${input.slug}".`
        })
      }

      try {
        const startDate = new Date(input.startDate)
        const endDate = new Date(input.endDate)

        // Validate date range
        if (startDate > endDate) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Start date must be before or equal to end date"
          })
        }

        // Limit to 7 days maximum
        const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
        if (daysDiff > 6) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Date range cannot exceed 7 days"
          })
        }

        const forecast = await WeatherService.get7DayForecast({
          latitude: place.geocodedAddress.latitude,
          longitude: place.geocodedAddress.longitude,
          startDate: startDate,
          endDate: endDate
        })

        return forecast
      } catch (error) {
        console.error("Error fetching weather by date range:", error)
        if (error instanceof TRPCError) {
          throw error
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch weather for the specified date range"
        })
      }
    }),
})
