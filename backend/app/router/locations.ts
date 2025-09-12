import {
  CreateLocationSchema,
  UpdateLocationSchema
} from "#app/schemas/location.ts"
import { ClothingService } from "#app/services/clothingService.ts"
import { LLMService } from "#app/services/llmService.ts"
import type { ClothingCategory } from "#app/rules/clothingRules.ts"
import { procedure, router } from "#core/trpc.ts"
import { TRPCError } from "@trpc/server"
import { z } from "zod"

export const locations = router({
  // Phase II:
  // Get a specific location by ID
  // get: procedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
  //   const location = ctx.cradle.locations.get(input.id)

  //   if (!location) {
  //     throw new TRPCError({
  //       code: "NOT_FOUND",
  //       message: "Location not found."
  //     })
  //   }

  //   return location
  // }),

  // Phase II:
  // Get location by normalized location string
  // getByNormalizedLocation: procedure
  //   .input(z.object({ normalizedLocation: z.string() }))
  //   .query(async ({ ctx, input }) => {
  //     const location = ctx.cradle.locations.getByNormalizedLocation(input.normalizedLocation)

  //     if (!location) {
  //       throw new TRPCError({
  //         code: "NOT_FOUND",
  //         message: "Location not found."
  //       })
  //     }

  //     return location
  //   }),

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

  // Creates a location object from a description.
  createLocation: procedure
    .input(z.object({ description: z.string().min(1, "Description is required") }))
    .mutation(async ({ ctx, input }) => {
      try {
        // 1. Use LLM to normalize the location description
        const llmResult = await LLMService.normalizeLocation(input.description)
        console.log(`LLM normalized "${input.description}" to "${llmResult.normalizedLocation}" (confidence: ${llmResult.confidence})`)
        
        // Phase II:
        // Check if location already exists
        // const existingLocation = ctx.cradle.locations.getByNormalizedLocation(llmResult.normalizedLocation)
        // if (existingLocation) {
        //   console.log(`Location "${llmResult.normalizedLocation}" already exists`)
        //   return ctx.cradle.locations.toModel(existingLocation)
        // update existing location with new description
        // }
        
        // 2. TODO: Geocoding using OpenCage API to get lat/lng and structured address
        // 3. TODO: Fetching weather data from Open-Meteo API
        // 4. TODO: Getting clothing recommendations from rules engine
        // 5. Save to database
        
        // Create new location with LLM-normalized data
        const locationData = {
          description: input.description,
          normalizedLocation: llmResult.normalizedLocation,
          slug: llmResult.normalizedLocation.toLowerCase().replace(/ /g, "-").replace(/,/g, ""),
          geocodedAddress: {
            latitude: 0, // Would be filled by geocoding API
            longitude: 0, // Would be filled by geocoding API
            formattedAddress: llmResult.normalizedLocation,
            structuredAddress: {
              city: llmResult.normalizedLocation.split(',')[0]?.trim() || "",
              state: llmResult.normalizedLocation.split(',')[1]?.trim() || "",
              postalCode: "",
              country: ""
            }
          },
          // weather: [] // Would be filled by weather API
        }
        
        const location = ctx.cradle.locations.add(locationData)
        console.log(`Created new location: ${llmResult.normalizedLocation}`)
        return ctx.cradle.locations.toModel(location)
        
      } catch (error) {
        console.error("Error in createLocation:", error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to decode location description"
        })
      }
    }),

  // Create a new location
  create: procedure.input(CreateLocationSchema).mutation(async ({ ctx, input }) => {
    // This would typically involve:
    // 1. Normalizing the location description using LLM
    // 2. Geocoding using OpenCage API
    // 3. Fetching weather data from Open-Meteo API
    // 4. Get list of clothing from Clothing rules engine
    // Phase II:
    // 5. Getting clothing recommendations from TikTok Shop API
    
    const location = ctx.cradle.locations.add(input)
    return ctx.cradle.locations.toModel(location)
  }),

  // Update an existing location
  update: procedure.input(UpdateLocationSchema).mutation(async ({ ctx, input }) => {
    const location = ctx.cradle.locations.get(input.locationId)

    if (!location) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Location not found."
      })
    }

    ctx.cradle.locations.update(input.locationId, input)
    const updatedLocation = ctx.cradle.locations.get(input.locationId)!
    return ctx.cradle.locations.toModel(updatedLocation)
  }),

  // Phase II:
  //  Delete a location
  // delete: procedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
  //   const location = ctx.cradle.locations.get(input.id)

  //   if (!location) {
  //     throw new TRPCError({
  //       code: "NOT_FOUND",
  //       message: "Location not found."
  //     })
  //   }

  //   ctx.cradle.locations.remove(input.id)
  //   return { success: true, message: "Location deleted successfully" }
  // }),

  // Get weather for a specific location
  getWeather: procedure
    .input(z.object({ locationId: z.string() }))
    .query(async ({ ctx, input }) => {
      const location = ctx.cradle.locations.get(input.locationId)

      if (!location) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Location not found."
        })
      }

      return location.weather
    }),


  // Refresh weather data for a location
  refreshWeather: procedure
    .input(z.object({ locationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const location = ctx.cradle.locations.get(input.locationId)

      if (!location) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Location not found."
        })
      }

      // This would typically:
      // 1. Fetch fresh weather data from Open-Meteo API
      // 2. Get updated clothing recommendations from TikTok Shop API
      // 3. Update the location with new weather data
      
      // For now, we'll just return the existing weather
      // In a real implementation, this would call external APIs
      return location.weather
    }),

  // Get clothing recommendations using the rules engine
  getClothingRecommendations: procedure
    .input(
      z.object({
        locationId: z.string(),
        date: z.date().optional() // If not provided, use current date
      })
    )
    .query(async ({ ctx, input }) => {
      const location = ctx.cradle.locations.get(input.locationId)

      if (!location) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Location not found."
        })
      }

      const targetDate = input.date || new Date()
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
    }),

  // Get weather appropriateness score for a specific clothing item
  getClothingScore: procedure
    .input(
      z.object({
        locationId: z.string(),
        clothingCategory: z.string(),
        date: z.date().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      const location = ctx.cradle.locations.get(input.locationId)

      if (!location) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Location not found."
        })
      }

      const targetDate = input.date || new Date()
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
    })
})
