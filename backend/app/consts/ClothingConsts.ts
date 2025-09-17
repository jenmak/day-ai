import { z } from "zod"
import { ClothingCategoryEnum } from "../rules/clothingRules"

// Clothing category schema
export const ClothingCategorySchema = z.enum([
  ClothingCategoryEnum.T_SHIRT,
  ClothingCategoryEnum.TANK_TOP,
  ClothingCategoryEnum.LONG_SLEEVE,
  ClothingCategoryEnum.SWEATSHIRT,
  ClothingCategoryEnum.HOODIE,
  ClothingCategoryEnum.BLAZER,
  ClothingCategoryEnum.JACKET,
  ClothingCategoryEnum.COAT,
  ClothingCategoryEnum.RAIN_JACKET,
  ClothingCategoryEnum.WINTER_COAT,
  ClothingCategoryEnum.SHORTS,
  ClothingCategoryEnum.JEANS,
  ClothingCategoryEnum.PANTS,
  ClothingCategoryEnum.LEGGINGS,
  ClothingCategoryEnum.SWEATPANTS,
  ClothingCategoryEnum.RAIN_PANTS,
  ClothingCategoryEnum.DRESS,
  ClothingCategoryEnum.SKIRT,
  ClothingCategoryEnum.MAXI_DRESS,
  ClothingCategoryEnum.MINI_DRESS,
  ClothingCategoryEnum.SNEAKERS,
  ClothingCategoryEnum.SANDALS,
  ClothingCategoryEnum.BOOTS,
  ClothingCategoryEnum.RAIN_BOOTS,
  ClothingCategoryEnum.WINTER_BOOTS,
  ClothingCategoryEnum.HEELS,
  ClothingCategoryEnum.FLATS,
  ClothingCategoryEnum.HAT,
  ClothingCategoryEnum.BEANIE,
  ClothingCategoryEnum.SUN_HAT,
  ClothingCategoryEnum.SCARF,
  ClothingCategoryEnum.GLOVES,
  ClothingCategoryEnum.UMBRELLA,
  ClothingCategoryEnum.SUNGLASSES
])

export type ClothingCategory = z.infer<typeof ClothingCategorySchema>

// Clothing recommendation schema
export const ClothingRecommendationSchema = z.object({
  category: ClothingCategorySchema,
  reason: z.string().optional(),
  priority: z.number().min(1).max(5).optional()
})

export type ClothingRecommendation = z.infer<typeof ClothingRecommendationSchema>

// Weather-based clothing recommendations schema
export const WeatherClothingRecommendationsSchema = z.object({
  temperature: z.number(),
  condition: z.string(),
  rainProbability: z.number().min(0).max(100),
  windSpeed: z.number(),
  recommendations: z.array(ClothingCategorySchema),
  searchTerms: z.array(z.string())
})

export type WeatherClothingRecommendations = z.infer<typeof WeatherClothingRecommendationsSchema>
