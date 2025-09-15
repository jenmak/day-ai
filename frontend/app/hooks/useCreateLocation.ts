import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router"
import { Location as LocationType } from "@dayai/backend/schemas"
import { useLocationStore } from "../stores/locationStore"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3333"

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
    mutationFn: async (description: string): Promise<LocationType> => {
      if (!description.trim()) {
        throw new Error("Location description is required")
      }
      
      try {
        const response = await fetch(`${API_BASE_URL}/trpc/locations.create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "json": { 
              description: description
            }
          })
        })
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        return data.result.data.json
      } catch (error) {
        throw error
      }
    },
    onSuccess: (data: LocationType) => {
      console.log("Location created or updated successfully. Setting location in store and navigating to location page.", data)

      setLocation(data)
      
      // Invalidate and refetch location queries
      // queryClient.invalidateQueries({ queryKey: trpc.locations.list.queryKey() })
      
      // Navigate to the location page
      navigate(`/${data.slug}`)
      
      onSuccess?.(data)
    },
    onError: (error) => {
      console.error("Error creating location:", error)
      onError?.(error)
    }
  })

  const createLocation = (description: string) => {
    createLocationMutation.mutate(description)
  }

  return {
    createLocation,
    isLoading: createLocationMutation.isPending,
    error: createLocationMutation.error,
    isSuccess: createLocationMutation.isSuccess,
    reset: createLocationMutation.reset,
  }
}
