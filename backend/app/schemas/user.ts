import { z } from "zod"

export const UserSchema = z.object({
  userId: z.string(),
})

// Type exports
export type User = z.infer<typeof UserSchema>
