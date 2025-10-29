import { initTRPC, TRPCError } from "@trpc/server"
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch"
import { container } from "../core/container"

export const createContext = async (opts: FetchCreateContextFnOptions) => {
  const cradle = container.cradle

  return {
    req: opts.req,
    cradle
  }
}

const trpc = initTRPC.context<typeof createContext>().create({
  // Removed superjson transformer to fix production issues
})

/**
 *    GLOBAL ERROR MIDDLEWARE
 *    Guarantees *any* uncaught exception returns a proper tRPC JSON envelope.
 */
const errorMiddleware = trpc.middleware(async ({ path, type, next }) => {
  try {
    return await next()
  } catch (err: any) {
    // Log on the server (Vercel logs, Sentry, etc.)
    console.error(`tRPC ${type} ${path} →`, err)
    // Re-throw as a TRPCError so the client can parse it
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: err?.message ?? "Unexpected server error"
    })
  }
})

export const router = trpc.router
export const procedure = trpc.procedure
export const publicProcedure = trpc.procedure.use(errorMiddleware)
