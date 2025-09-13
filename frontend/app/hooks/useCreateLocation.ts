import { trpcClient } from "@/lib/trpc"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router"
import { Location as LocationType } from "@dayai/backend/schemas"
import { useLocationStore } from "../stores/locationStore"

interface useCreateLocationOptions {
  onSuccess?: (location: any) => void
  onError?: (error: any) => void
}

export const useCreateLocation = (options?: useCreateLocationOptions) => {
  const { onSuccess, onError } = options || {}
  // const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { setLocation } = useLocationStore()
  
  const createLocationMutation = useMutation({
    mutationFn: async (description: string) => {
      if (!description.trim()) {
        throw new Error("Location description is required")
      }
      
      return trpcClient.locations.create.mutate({ description })
    },
    onSuccess: (data: LocationType) => {
      console.log("Location created or updated successfully", data)

      setLocation(data)
      
      // Invalidate and refetch location queries
      // queryClient.invalidateQueries({ queryKey: trpc.locations.list.queryKey() })
      
      // Navigate to the location page
      navigate(`/${data.slug}`)
      
      onSuccess?.(data)
    },
    onError: (error) => {
      console.error("Error decoding location", error)
      onError?.(error)
    }
  })

  const createLocation = async (description: string) => {
    try {
      const result = await createLocationMutation.mutateAsync(description)
      return result
    } catch (error) {
      throw error
    }
  }

  return {
    createLocation,
    isLoading: createLocationMutation.isPending,
    error: createLocationMutation.error,
    isSuccess: createLocationMutation.isSuccess,
    reset: createLocationMutation.reset,
  }
}
