import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router"
import { ERROR_MESSAGES } from "../errors"
// import { SearchInputSchema, validateInput } from "../schemas/validation"
import { usePlaceStore } from "../stores/placeStore"
import { Place as PlaceType } from "../types/backend"
import { trpcClient } from "../trpc"
import { ENV } from "../config"

interface useCreatePlaceOptions {
  onSuccess?: (place: PlaceType) => void
  onError?: (error: Error) => void
}

export const useCreatePlace = (options?: useCreatePlaceOptions) => {
  const { onSuccess, onError } = options || {}
  const navigate = useNavigate()
  const { addPlace, setLoading, setError } = usePlaceStore()

  const createPlaceMutation = useMutation({
    mutationFn: async (description: string): Promise<PlaceType> => {
      setLoading(true)
      setError(null)

      try {
        console.log('About to call tRPC client.places.create.mutate with:', { description })
        console.log('tRPC client:', trpcClient)
        console.log('tRPC client.places:', (trpcClient as any).places)
        console.log('tRPC client.places.create:', (trpcClient as any).places?.create)

        // Use tRPC client to call the backend
        const result = await (trpcClient as any).places.create.mutate({
          description: description
        })

        console.log('tRPC result:', result)
        return result
      } catch (error: any) {
        console.error("tRPC error:", error)
        console.error("Error details:", {
          message: error.message,
          data: error.data,
          cause: error.cause,
          stack: error.stack,
          name: error.name,
          userAgent: navigator.userAgent
        })

        // Detect mobile browsers
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)
        const isChrome = /Chrome/.test(navigator.userAgent)

        console.log('Error context:', {
          isMobile,
          isSafari,
          isChrome,
          errorName: error.name,
          errorMessage: error.message,
          userAgent: navigator.userAgent
        })

        // Handle mobile-specific errors
        if (isMobile && error.name === 'TypeError' && error.message?.includes('Load failed')) {
          console.error("Mobile Load failed error detected")
          throw new Error("Network request failed. Please check your mobile connection and try again.")
        }

        // Handle Safari-specific errors
        if (error.name === 'TypeError' && error.message?.includes('Load failed')) {
          console.error("Safari Load failed error detected")
          throw new Error("Network request failed. Please check your connection and try again.")
        }

        // Handle mobile network errors
        if (isMobile && (error.message?.includes('fetch') || error.message?.includes('network'))) {
          throw new Error("Mobile network error. Please check your connection and try again.")
        }

        // Handle tRPC errors
        if (error.data?.code) {
          const errorMessage = error.message || ERROR_MESSAGES.USER.SERVER_ERROR
          throw new Error(errorMessage)
        }

        // Handle network errors
        if (error.message?.includes('fetch') || error.message?.includes('Load failed')) {
          throw new Error(ERROR_MESSAGES.USER.NETWORK_ERROR)
        }

        // Handle CORS errors (common in mobile browsers)
        if (error.message?.includes('CORS') || error.message?.includes('cross-origin')) {
          throw new Error("Cross-origin request blocked. Please try again.")
        }

        // Handle other errors
        throw new Error(error.message || ERROR_MESSAGES.USER.SERVER_ERROR)
      }
    },
    onSuccess: (data: PlaceType) => {
      console.log(
        "Place created successfully. Adding to store and navigating to place page.",
        data
      )
      console.log("Place data structure:", {
        slug: data.slug,
        description: data.description,
        normalizedPlace: data.normalizedPlace,
        weather: data.weather?.length || 0
      })

      // Check if this is an error slug (unknown, no-specific-location-found, etc.)
      if (
        data.slug === "unknown" ||
        data.slug === "no-specific-location-found" ||
        data.slug === "not-applicable"
      ) {
        console.warn(
          "Backend returned error slug:",
          data.slug,
          "for description:",
          data.description
        )
        setError(
          "The location you searched for could not be found or processed. Please try a different location."
        )
        setLoading(false)
        return
      }

      // Add place to Zustand store
      addPlace(data)
      console.log("Place added to store successfully")

      // Navigate to the place page
      navigate(`/${data.slug}`)

      setLoading(false)
      onSuccess?.(data)
    },
    onError: (error) => {
      console.error("Error creating place:", error)
      setError(error.message)
      setLoading(false)

      // Redirect to error page for backend failures
      navigate("/error")

      onError?.(error)
    }
  })

  const createPlace = (description: string) => {
    console.log('createPlace called with description:', description)
    console.log('Backend URL:', ENV.backendUrl)
    console.log('Environment:', {
      isDevelopment: ENV.isDevelopment,
      isProduction: ENV.isProduction,
      userAgent: navigator.userAgent
    })

    createPlaceMutation.mutate(description)
  }

  return {
    createPlace,
    isLoading: createPlaceMutation.isPending,
    error: createPlaceMutation.error,
    isSuccess: createPlaceMutation.isSuccess,
    reset: createPlaceMutation.reset
  }
}
