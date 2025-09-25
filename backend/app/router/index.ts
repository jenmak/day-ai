import { router } from "../../core/trpc"
import { places } from "./places"

/**
 * This is the main tRPC router. For more information on tRPC, visit https://trpc.io/.
 */
export const appRouter = router({
  places
})

export type AppRouter = typeof appRouter
