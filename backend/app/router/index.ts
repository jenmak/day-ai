import { locations } from "#app/router/locations.ts"
import { router } from "#core/trpc.ts"

/**
 * This is the main tRPC router. For more information on tRPC, visit https://trpc.io/.
 */
export const appRouter = router({
  locations: locations
})
