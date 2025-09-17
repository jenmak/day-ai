import { useQuery } from "@tanstack/react-query"
import { Place as PlaceType } from "@dayai/backend/schemas"
import { usePlaceStore } from "../stores/placeStore"
import { useEffect, useRef } from "react"

interface usePlaceBySlugOptions {
  slug: string
  onSuccess?: (place: PlaceType) => void
  onError?: (error: any) => void
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3333"

export const usePlaceBySlug = (options?: usePlaceBySlugOptions) => {
  const { slug, onSuccess, onError } = options || { slug: '' }
  const { setPlace } = usePlaceStore()
  
  // Use refs to store the latest callback functions to avoid stale closures
  const onSuccessRef = useRef(onSuccess)
  const onErrorRef = useRef(onError)
  
  // Update refs when callbacks change
  useEffect(() => {
    onSuccessRef.current = onSuccess
  }, [onSuccess])
  
  useEffect(() => {
    onErrorRef.current = onError
  }, [onError])

  const query = useQuery({
    queryKey: ["place", "slug", slug],
    queryFn: async (): Promise<PlaceType> => {
      if (!slug) {
        throw new Error("Slug is required")
      }
      
      try {
        const response = await fetch(`${API_BASE_URL}/trpc/places.getBySlug?input=${encodeURIComponent(JSON.stringify({ json: { slug } }))}`)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        return data.result.data.json
      } catch (error) {
        console.error("Error fetching place by slug:", error)
        throw error
      }
    },
    enabled: !!slug, // Only run query if slug is provided
  })

  // Handle success with stable dependencies
  useEffect(() => {
    if (query.data) {
      setPlace(query.data)
      console.log("query.data", query.data)
      onSuccessRef.current?.(query.data)
    }
  }, [query.data, setPlace])

  // Handle error with stable dependencies
  useEffect(() => {
    if (query.error) {
      onErrorRef.current?.(query.error)
    }
  }, [query.error])

  return {
    data: query.data,
    isLoading: query.isLoading,
    isPending: query.isPending,
    error: query.error,
    refetch: query.refetch,
    isError: query.isError,
    isSuccess: query.isSuccess,
  }
}