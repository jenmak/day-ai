import {
  CreateLocationSchema,
  LocationSchema,
  UpdateLocationSchema,
  type Location,
} from "#app/schemas/location.ts"
// import { ClothingService } from "#app/services/clothingService.ts"
import { GeolocationService } from "#app/services/geolocationService.ts"
import { LLMService, type LocationNormalization } from "#app/services/llmService.ts"
// import type { ClothingCategory } from "#app/rules/clothingRules.ts"
import { procedure, router } from "#core/trpc.ts"
import { TRPCError } from "@trpc/server"
import { z } from "zod"

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

          // 3. Create new location with input description, normalized location, slug, geocoded address, and weather.
          const locationData = {
            description: input.description,
            normalizedLocation: llmResult.normalizedLocation,
            slug: llmResult.slug,
            geocodedAddress
          }

          // TODO: Fetching weather data from Open-Meteo API
          // TODO: Getting clothing recommendations from rules engine

          // 4. Save to database
          const location = ctx.cradle.locations.createLocation(locationData)
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

    return location
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
