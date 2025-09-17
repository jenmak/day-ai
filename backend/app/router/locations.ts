import {
  CreateLocationSchema,
  UpdateLocationSchema,
} from "../schemas/location"
import { ClothingService } from "../services/clothingService"
import { GeolocationService } from "../services/geolocationService"
import { LLMService } from "../services/llmService"
import { WeatherService } from "../services/weatherService"
import { procedure, router } from "../../core/trpc"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
// import { ClothingService } from "#app/services/clothingService"
// import type { ClothingCategory } from "#app/rules/clothingRules"

export const locations = router({
  // Get location by normalized location string
  getByNormalizedLocation: procedure
    .input(z.object({ normalizedLocation: z.string() }))
    .query(async ({ ctx, input }) => {
      const location = ctx.cradle.locations.getByNormalizedLocation(input.normalizedLocation)

      if (!location) {
        return false
      }

      return location
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
  create: procedure
    .input(CreateLocationSchema)
    .mutation(async ({ ctx, input }) => {
      try {
          // 1. Use LLM to normalize the location description
          const llmResult = await LLMService.normalizeLocation(input.description)
          console.log(`LLM normalized "${input.description}" to "${llmResult.normalizedLocation}" (confidence: ${llmResult.confidence})`)
          console.log(`LLM generated slug: "${llmResult.slug}"`)

          // 1b. Check if location already exists, and return it if so.
          const existingLocation = ctx.cradle.locations.getByNormalizedLocation(llmResult.normalizedLocation)

          if (existingLocation) {
            const updatedLocation = ctx.cradle.locations.update(existingLocation.id, { description: input.description })
            return ctx.cradle.locations.toModel(updatedLocation)
          }

          // 2. Geocode the location with the OpenCage API
          const geocodedAddress = await GeolocationService.geocodeLocation(llmResult.normalizedLocation)
          console.log(`Geocoded "${llmResult.normalizedLocation}" to:`, geocodedAddress)

          const weatherData = await WeatherService.get7DayForecast({ latitude: geocodedAddress.latitude, longitude: geocodedAddress.longitude })

          // 3. Get clothing recommendations from rules engine
          weatherData.forEach((weather) => {
            weather.clothing = ClothingService.getRecommendations(weather.degreesFahrenheit, weather.condition, weather.rainProbabilityPercentage, weather.windSpeedMph)
          })

          // 4. Save to database
          const locationData = {  
            description: input.description,
            normalizedLocation: llmResult.normalizedLocation,
            slug: llmResult.slug,
            geocodedAddress,
            weather: weatherData
          }
          const location = ctx.cradle.locations.createLocation(locationData)

          console.log("Location created:", location)
          const model = ctx.cradle.locations.toModel(location)
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
          message: "Failed to create location"
        })
      }
    }),

  /**
   * Updates a location with a new description.
   */
  update: procedure
    .input(UpdateLocationSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.cradle.locations.update(input.id, { description: input.description })
    }),

  /**
   * Gets a location by slug.
   * If the location does not exist, return an error.
   */
  getBySlug: procedure.input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
    const location = ctx.cradle.locations.getBySlug(input.slug)

    if (!location) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Location not found with slug: "${input.slug}".`
      })
    }

    return ctx.cradle.locations.toModel(location)
  }),

  /**
   * Deletes a location by id.
   * If the location does not exist, return an error.
   */
  delete: procedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    const location = ctx.cradle.locations.get(input.id)

    if (!location) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Location not found with id: "${input.id}".`
      })
    }

    ctx.cradle.locations.remove(input.id)
    return { success: true, message: "Location deleted successfully" }
  }),

  /**
   * Get 7-day weather forecast for a location by slug
   */
  getWeatherForecast: procedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const location = ctx.cradle.locations.getBySlug(input.slug)

      if (!location) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Location not found with slug: "${input.slug}".`
        })
      }

      try {
        const forecast = await WeatherService.get7DayForecast({
          latitude: location.geocodedAddress.latitude,
          longitude: location.geocodedAddress.longitude
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
   * Get current day weather for a location by slug
   */
  getCurrentWeather: procedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const location = ctx.cradle.locations.getBySlug(input.slug)

      if (!location) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Location not found with slug: "${input.slug}".`
        })
      }

      try {
        const weather = await WeatherService.getCurrentDayWeather(
          location.geocodedAddress.latitude,
          location.geocodedAddress.longitude
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
   * Get weather for a specific date for a location by slug
   */
  getWeatherByDate: procedure
    .input(z.object({ 
      slug: z.string(),
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    }))
    .query(async ({ ctx, input }) => {
      const location = ctx.cradle.locations.getBySlug(input.slug)

      if (!location) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Location not found with slug: "${input.slug}".`
        })
      }

      try {
        const targetDate = new Date(input.date)
        const forecast = await WeatherService.get7DayForecast({
          latitude: location.geocodedAddress.latitude,
          longitude: location.geocodedAddress.longitude,
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
   * Get weather for a date range for a location by slug
   */
  getWeatherByDateRange: procedure
    .input(z.object({ 
      slug: z.string(),
      startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Start date must be in YYYY-MM-DD format"),
      endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "End date must be in YYYY-MM-DD format")
    }))
    .query(async ({ ctx, input }) => {
      const location = ctx.cradle.locations.getBySlug(input.slug)

      if (!location) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Location not found with slug: "${input.slug}".`
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
          latitude: location.geocodedAddress.latitude,
          longitude: location.geocodedAddress.longitude,
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
})
