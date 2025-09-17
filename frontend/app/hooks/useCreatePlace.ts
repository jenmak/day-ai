import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router"
import { Place as PlaceType } from "@dayai/backend/schemas"
import { useLocationStore } from "../stores/placeStore"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3333"

interface useCreatePlaceOptions {
  onSuccess?: (place: any) => void
  onError?: (error: any) => void
}

export const useCreatePlace = (options?: useCreatePlaceOptions) => {
  const { onSuccess, onError } = options || {}
  // const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { setLocation } = useLocationStore()
  
  const createPlaceMutation = useMutation({
    mutationFn: async (description: string): Promise<PlaceType> => {
      if (!description.trim()) {
        throw new Error("Place description is required")
      }
      
      try {
        const response = await fetch(`${API_BASE_URL}/trpc/places.create`, {
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
    onSuccess: (data: PlaceType) => {
      console.log("Place created or updated successfully. Setting place in store and navigating to place page.", data)

      setLocation(data)
      
      // Invalidate and refetch place queries
      // queryClient.invalidateQueries({ queryKey: trpc.places.list.queryKey() })
      
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
    reset: createPlaceMutation.reset,
  }
}

// Legacy export for backward compatibility
export const useCreateLocation = useCreatePlace
