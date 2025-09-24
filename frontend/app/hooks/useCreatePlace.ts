import { Place as PlaceType } from "@dripdropcity/backend/types"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router"
import { usePlaceStore } from "../stores/placeStore"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3333"

import { ERROR_MESSAGES } from "../errors"

interface useCreatePlaceOptions {
  onSuccess?: (place: PlaceType) => void
  onError?: (error: Error) => void
}

export const useCreatePlace = (options?: useCreatePlaceOptions) => {
  const { onSuccess, onError } = options || {}
  const navigate = useNavigate()
  const { setPlace } = usePlaceStore()

  const createPlaceMutation = useMutation({
    mutationFn: async (description: string): Promise<PlaceType> => {
      if (!description.trim()) {
        throw new Error(ERROR_MESSAGES.USER.VALIDATION_ERROR)
      }

      const response = await fetch(`${API_BASE_URL}/trpc/places.create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          json: {
            description: description
          }
        })
      })

      if (!response.ok) {
        const errorMessage =
          response.status >= 500
            ? ERROR_MESSAGES.USER.SERVER_ERROR
            : ERROR_MESSAGES.USER.NETWORK_ERROR
        throw new Error(`${errorMessage} (HTTP ${response.status})`)
      }

      const data = await response.json()
      return data.result.data.json
    },
    onSuccess: (data: PlaceType) => {
      console.log(
        "Place created or updated successfully. Setting place in store and navigating to place page.",
        data
      )

      setPlace(data)

      // Navigate to the place page
      navigate(`/${data.slug}`)

      onSuccess?.(data)
    },
    onError: (error) => {
      console.error("Error creating place:", error)
      onError?.(error)
    }
  })

  const createPlace = (description: string) => {
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
