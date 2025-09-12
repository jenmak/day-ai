import { trpcClient } from "@/lib/trpc"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router"
import { Location as LocationType } from "@dayai/backend/schemas"

interface UseDecodeLocationOptions {
  onSuccess?: (location: any) => void
  onError?: (error: any) => void
}

export const useDecodeLocation = (options?: UseDecodeLocationOptions) => {
  const { onSuccess, onError } = options || {}
  // const queryClient = useQueryClient()
  const navigate = useNavigate()
  
  const decodeLocationMutation = useMutation({
    mutationFn: async (description: string) => {
      if (!description.trim()) {
        throw new Error("Location description is required")
      }
      
      return trpcClient.locations.decodeLocation.mutate({ description })
    },
    onSuccess: (data: LocationType) => {
      console.log("Location decoded successfully", data)
      
      // Phase II:
      // Save location to store
      // setLocation(data)
      
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

  const decodeLocation = async (description: string) => {
    try {
      const result = await decodeLocationMutation.mutateAsync(description)
      return result
    } catch (error) {
      throw error
    }
  }

  return {
    decodeLocation,
    isLoading: decodeLocationMutation.isPending,
    error: decodeLocationMutation.error,
    isSuccess: decodeLocationMutation.isSuccess,
    reset: decodeLocationMutation.reset,
  }
}
