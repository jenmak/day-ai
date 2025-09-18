import { useQuery } from "@tanstack/react-query"
import { Place as PlaceType } from "@dayai/backend/schemas"
import { usePlaceStore } from "../stores/placeStore"
import { useEffect } from "react"

interface usePlaceBySlugOptions {
  slug: string
  onSuccess?: (place: PlaceType) => void
  onError?: (error: any) => void
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3333"

export const usePlaceBySlug = (options?: usePlaceBySlugOptions) => {
  const { slug, onSuccess, onError } = options || { slug: '' }
  const { setPlace } = usePlaceStore()
  
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
    enabled: !!slug,
  })

  useEffect(() => {
    if (query.data) {
      setPlace(query.data)
      onSuccess?.(query.data)
    }
  }, [query.data, setPlace])

  useEffect(() => {
    if (query.error) {
      onError?.(query.error)
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