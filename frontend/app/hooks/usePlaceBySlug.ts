import { useQuery } from "@tanstack/react-query"
import { Place as PlaceType } from "@dayai/backend/schemas"
import { useLocationStore } from "../stores/placeStore"
import { useEffect } from "react"

interface usePlaceBySlugOptions {
  slug: string
  onSuccess?: (place: PlaceType) => void
  onError?: (error: any) => void
}

// const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3333"

export const usePlaceBySlug = (options?: usePlaceBySlugOptions) => {
  const { slug, onSuccess, onError } = options || { slug: ''}
  const { setLocation } = useLocationStore()

  const query = useQuery({
    queryKey: ["place", "slug", slug],
    queryFn: async (): Promise<PlaceType> => {
      // For now, return a mock place until the backend is properly connected
      const mockPlace: PlaceType = {
        id: `mock-${slug}`,
        description: slug.replace(/-/g, ' '),
        slug: slug,
        normalizedLocation: slug.replace(/-/g, ' '),
        geocodedAddress: {
          latitude: 40.7128,
          longitude: -74.0060,
          formattedAddress: "New York, NY 10001, US",
          structuredAddress: {
            city: "New York",
            state: "NY", 
            postalCode: "10001",
            country: "US"
          }
        },
        weather: [
          {
            condition: "Sunny",
            degreesFahrenheit: 72,
            degreesCelsius: 22,
            temperatureRange: {
              temperatureMinimum: 65,
              temperatureMaximum: 78
            },
            rainProbabilityPercentage: 10,
            windSpeedMph: 8,
            clothing: ["T-shirt", "Shorts", "Sunglasses"]
          }
        ],
        createdAt: new Date().toISOString()
      }
      return mockPlace
    },
  })

  useEffect(() => {
    if (query.data) {
      setLocation(query.data)
      onSuccess?.(query.data)
    } else {
      onError?.(query.error)
    }
  }, [query.data])

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch
  }
}

// Legacy export for backward compatibility
export const useLocationBySlug = usePlaceBySlug