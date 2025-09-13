import { trpcClient } from "@/lib/trpc"
import { useQuery } from "@tanstack/react-query"
import { Location as LocationType } from "@dayai/backend/schemas"
import { useLocationStore } from "../stores/locationStore"
import { useEffect } from "react"

interface useLocationBySlugOptions {
  slug: string
  onSuccess?: (location: LocationType) => void
  onError?: (error: any) => void
}

export const useLocationBySlug = (options?: useLocationBySlugOptions) => {
  const { slug, onSuccess, onError } = options || { slug: ''}
  const { setLocation } = useLocationStore()

  const query = useQuery({
    queryKey: ["location", "slug", slug],
    queryFn: () => trpcClient.locations.getBySlug.query({ slug }),
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