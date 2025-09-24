import { places } from "./places"
import { router } from "../../core/trpc"

/**
 * This is the main tRPC router. For more information on tRPC, visit https://trpc.io/.
 */
export const appRouter = router({
  places
})
