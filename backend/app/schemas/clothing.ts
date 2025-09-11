import { z } from "zod"

// Image Schema
export const ImageSchema = z.object({
  url: z.string().url(),
  alt: z.string().optional()
})

// Phase II: Clothing Schema for TikTok Shop API integration
export const ClothingSchema = z.object({
  images: z.array(ImageSchema),
  buyLink: z.string().url(),
  // Additional TikTok Shop attributes can be added here
  title: z.string().optional(),
  price: z.number().optional(),
  brand: z.string().optional(),
  category: z.string().optional(),
  description: z.string().optional()
})

// Type exports
export type Image = z.infer<typeof ImageSchema>
export type Clothing = z.infer<typeof ClothingSchema>
