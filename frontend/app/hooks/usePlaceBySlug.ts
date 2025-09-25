import { useQuery } from "@tanstack/react-query"
import { useEffect, useMemo } from "react"
import { ENV } from "../config"
import { ERROR_MESSAGES } from "../errors"
import { usePlaceStore } from "../stores/placeStore"
import { Place as PlaceType } from "../types/backend"

interface usePlaceBySlugOptions {
  slug: string
  onSuccess?: (place: PlaceType) => void
  onError?: (error: Error) => void
}

export const usePlaceBySlug = (options?: usePlaceBySlugOptions) => {
  const { slug, onSuccess, onError } = options || { slug: "" }
  const { getPlaceBySlug, setCurrentPlace } = usePlaceStore()

  // Check if place exists in Zustand store first
  const storePlace = useMemo(() => {
    return slug ? getPlaceBySlug(slug) : null
  }, [slug, getPlaceBySlug])

  const query = useQuery({
    queryKey: ["place", "slug", slug],
    queryFn: async (): Promise<PlaceType> => {
      if (!slug) {
        throw new Error(ERROR_MESSAGES.USER.VALIDATION_ERROR)
      }

      try {
        const response = await fetch(
          `${ENV.BACKEND_URL}/api/trpc/places.getBySlug?batch=1&input=${encodeURIComponent(JSON.stringify({ "0": { json: { slug } } }))}`
        )

        if (!response.ok) {
          const errorMessage =
            response.status >= 500
              ? ERROR_MESSAGES.USER.SERVER_ERROR
              : ERROR_MESSAGES.USER.NETWORK_ERROR
          throw new Error(`${errorMessage} (HTTP ${response.status})`)
        }

        const data = await response.json()
        return data[0].result.data.json
      } catch (error) {
        console.error("Error fetching place by slug:", error)
        throw error
      }
    },
    enabled: !!slug && !storePlace // Only fetch if not in store
  })

  useEffect(() => {
    if (storePlace) {
      setCurrentPlace(storePlace)
      onSuccess?.(storePlace)
    } else if (query.data) {
      setCurrentPlace(query.data)
      onSuccess?.(query.data)
    }
  }, [storePlace, query.data, setCurrentPlace, onSuccess])

  useEffect(() => {
    if (query.error) {
      onError?.(query.error)
    }
  }, [query.error, onError])

  // Return store data if available, otherwise return query data
  const data = storePlace || query.data
  const isLoading = !storePlace && query.isLoading
  const isPending = !storePlace && query.isPending
  const error = query.error
  const isError = query.isError
  const isSuccess = !!data

  return {
    data,
    isLoading,
    isPending,
    error,
    refetch: query.refetch,
    isError,
    isSuccess
  }
}
