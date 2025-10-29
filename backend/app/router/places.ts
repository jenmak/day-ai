import {
  CreatePlaceSchema,
  GetPlaceBySlugSchema,
  UpdatePlaceSchema,
  validateInput
} from "../schemas"
import {
  GeocodedAddress,
  OpenMeteoWeatherCode
} from "../types"
import { TRPCError } from "@trpc/server"
import { procedure, publicProcedure, router } from "../../core/trpc"
import { ClothingService } from "../services/clothingService"
import { GeolocationService } from "../services/geolocationService"
import { LLMService } from "../services/llmService"
import { WeatherService } from "../services/weatherService"
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

  create: publicProcedure
    .input(CreatePlaceSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        console.log("🚀 Starting place creation for:", input.description)

        // Validate input with enhanced validation
        const validatedInput = validateInput(CreatePlaceSchema, input)
        console.log("✅ Input validation passed")

        // 1. Use LLM to normalize the location description
        console.log("🤖 Calling LLM service...")
        const llmResult = await LLMService.normalizePlace(
          validatedInput.description
        )
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
          console.log("📍 Creating place for unknown location")
          const placeData = {
            description: input.description,
            normalizedPlace: llmResult.normalizedPlace,
            slug: llmResult.slug,
            geocodedAddress: null,
            weather: [],
            temperatureRangeCategory: "MILD" // Default to MILD for error cases
          }
          const place = ctx.cradle.places.add(placeData)
          console.log("Place created for error location:", place)
          const model = ctx.cradle.places.toModel(place)
          return model
        }

        // 1b. Check if location already exists, and return it if so.
        console.log("🔍 Checking for existing place...")
        const existingPlace = ctx.cradle.places.getByNormalizedPlace(
          llmResult.normalizedPlace
        )

        if (existingPlace) {
          console.log("♻️ Updating existing place")
          const updatedPlace = ctx.cradle.places.update(existingPlace.id, {
            description: input.description
          })
          return ctx.cradle.places.toModel(updatedPlace)
        }

        // 2. Geocode the location with the OpenCage API
        console.log("🌍 Geocoding location...")
        const geocodedAddress = await GeolocationService.geocodePlace(
          llmResult.normalizedPlace
        )
        console.log(
          `Geocoded "${llmResult.normalizedPlace}" to:`,
          geocodedAddress
        )

        console.log("🌤️ Fetching weather data...")
        const weatherData = await WeatherService.get7DayForecast({
          latitude: Number(geocodedAddress.latitude),
          longitude: Number(geocodedAddress.longitude)
        })
        console.log("✅ Weather data fetched:", weatherData.length, "days")

        // 3. Get clothing recommendations from rules engine
        console.log("👕 Generating clothing recommendations...")
        weatherData.forEach((weather) => {
          weather.clothing = ClothingService.getRecommendations(
            weather.degreesFahrenheit,
            weather.condition as OpenMeteoWeatherCode,
            weather.rainProbabilityPercentage,
            weather.windSpeedMph
          )
        })
        console.log("✅ Clothing recommendations generated")

        // 4. Calculate overall temperature range category for the place
        console.log("🌡️ Calculating temperature range category...")
        const temperatureRangeCategory =
          getPlaceTemperatureRangeCategory(weatherData)
        console.log("Temperature range category:", temperatureRangeCategory)

        // 5. Save to database
        console.log("💾 Saving place to database...")
        const placeData = {
          description: input.description,
          normalizedPlace: llmResult.normalizedPlace,
          slug: llmResult.slug,
          geocodedAddress: {
            ...geocodedAddress,
            latitude: geocodedAddress.latitude.toString(),
            longitude: geocodedAddress.longitude.toString()
          } as GeocodedAddress,
          weather: weatherData,
          temperatureRangeCategory
        }
        const place = ctx.cradle.places.createPlace(placeData)
        console.log("✅ Place saved to database:", place.id)

        console.log("🎉 Place creation completed successfully!")
        const model = ctx.cradle.places.toModel(place)
        return ensureTemperatureRangeCategory(model)
      } catch (error) {
        console.error("❌ Error in places.create:", error)
        console.error(
          "Error stack:",
          error instanceof Error ? error.stack : "No stack trace"
        )
        console.error("Error type:", typeof error)
        console.error("Error constructor:", error?.constructor?.name)

        // Handle specific error types
        if (error instanceof Error) {
          // API key errors
          if (
            error.message.includes("API key") ||
            error.message.includes("OPENAI_API_KEY") ||
            error.message.includes("OPENCAGE_API_KEY")
          ) {
            console.error("🔑 API Key Error in place creation:", error.message)
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message:
                "Service temporarily unavailable. Please try again later.",
              cause: error
            })
          }

          // Validation errors
          if (
            error.message.includes("validation") ||
            error.message.includes("invalid")
          ) {
            console.error(
              "📝 Validation Error in place creation:",
              error.message
            )
            throw new TRPCError({
              code: "BAD_REQUEST",
              message:
                "Invalid input provided. Please check your location description.",
              cause: error
            })
          }

          // Network/API errors
          if (
            error.message.includes("fetch") ||
            error.message.includes("network") ||
            error.message.includes("timeout")
          ) {
            console.error("🌐 Network Error in place creation:", error.message)
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Unable to fetch location data. Please try again later.",
              cause: error
            })
          }

          // Description not found
          if (error.message === "Description not found.") {
            console.error("📍 Description not found:", error.message)
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Description not found."
            })
          }
        }

        // Generic error fallback
        console.error("🚨 Unhandled error in place creation:", error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create place. Please try again later.",
          cause: error
        })
      }
    }),

  /**
   * Updates a place with a new description.
   */
  update: procedure
    .input(UpdatePlaceSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.cradle.places.update(input.id, {
        description: input.description
      })
    }),

  /**
   * Gets a place by slug.
   * If the place does not exist, returns an error.
   * If today is not the first day in weather data, fetches fresh weather data starting from today.
   */
  getBySlug: procedure
    .input(GetPlaceBySlugSchema)
    .query(async ({ ctx, input }) => {
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
        if (
          place.weather &&
          place.weather.length > 0 &&
          place.geocodedAddress
        ) {
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
                latitude: Number(place.geocodedAddress.latitude),
                longitude: Number(place.geocodedAddress.longitude)
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
                temperatureRangeCategory:
                  getPlaceTemperatureRangeCategory(freshWeatherData)
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
})
