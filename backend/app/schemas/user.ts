import { z } from "zod"

// Phase II:ProfilePicture Schema
// export const ProfilePictureSchema = z.object({
//   url: z.string().url(),
//   alt: z.string().optional(),
//   width: z.number().optional(),
//   height: z.number().optional(),
//   format: z.enum(["jpg", "jpeg", "png", "gif", "webp"]).optional(),
//   size: z.number().optional(), // file size in bytes
//   uploadedAt: z.date().optional(),
//   isWeatherAppropriate: z.boolean().optional()
// })

// User Schema
export const UserSchema = z.object({
  userId: z.string(),
  // PHASE II: Add these fields with auth.
  // name: z.string(),
  // email: z.string().email(),
  // profilePicture: ProfilePictureSchema.optional(),
  // isWeatherAppropriate: z.boolean().optional()
})

// Type exports
// export type ProfilePicture = z.infer<typeof ProfilePictureSchema>
export type User = z.infer<typeof UserSchema>
