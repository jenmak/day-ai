// Phase II:
// import { trpc, trpcClient } from "@/lib/trpc"
// import { useMutation, useQueryClient } from "@tanstack/react-query"

// interface UseLocationsOptions {
//   onSuccess?: (project: any) => void
//   onError?: (error: any) => void
// }

// export const useLocations = (options: UseLocationsOptions) => {
//   const { onSuccess, onError } = options || {}
//   const queryClient = useQueryClient()
  
//   const getLocationsMutation = useMutation({
//     mutationFn: async () => {
//       return trpcClient.locations.list.query()
//     },
//     onSuccess: (data) => {
//       console.log("Locations fetched successfully", data)
//       // Invalidate and refetch project list
//       queryClient.invalidateQueries({ queryKey: trpc.locations.list.queryKey() })

//       onSuccess?.(data)
//     },
//     onError: (error) => {
//       console.error("Error fetching locations", error)
//       onError?.(error)
//     }
//   })

//   const getLocations = async () => {
//     try {
//       const result = await getLocationsMutation.mutateAsync()
//       return result
//     } finally {
//       return getLocationsMutation.error
//     }

//   }

//   return {
//     getLocations,
//     isLoading: getLocationsMutation.isPending,
//     error: getLocationsMutation.error,
//     isSuccess: getLocationsMutation.isSuccess,
//     reset: getLocationsMutation.reset,
//   }
// }