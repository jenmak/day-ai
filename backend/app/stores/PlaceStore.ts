import type { Place } from "../types"
import { Store, type StoreItem } from "../../core/Store"

export interface PlaceStoreItem extends StoreItem, Omit<Place, "id" | "createdAt"> {}

export class PlaceStore extends Store<PlaceStoreItem> {
  constructor() {
    super("places")
  }

  /**
   * Generate a URL-friendly slug from a normalized place string
   */
  static generateSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // Remove all non-alphanumeric characters except spaces and hyphens
      .replace(/\s+/g, "-") // Replace one or more spaces with a single hyphen
      .replace(/-+/g, "-") // Replace multiple consecutive hyphens with a single hyphen
      .replace(/^-|-$/g, "") // Remove leading and trailing hyphens
  }

  toModel(item: PlaceStoreItem): Place {
    const model = super.toModel(item)

    return {
      ...model,
      description: item.description,
      normalizedPlace: item.normalizedPlace,
      slug: item.slug,
      geocodedAddress: item.geocodedAddress,
      weather: item.weather,
      temperatureRangeCategory: item.temperatureRangeCategory,
      createdAt: item.createdAt
    } as Place
  }

  getByDescription(description: string): PlaceStoreItem | undefined {
    return this.getAll().find((item) => item.description === description)
  }

  getBySlug(slug: string): PlaceStoreItem | undefined {
    return this.getAll().find((item) => item.slug === slug)
  }

  getByNormalizedPlace(normalizedPlace: string): PlaceStoreItem | undefined {
    return this.getAll().find((item) => item.normalizedPlace === normalizedPlace)
  }

  /**
   * Get place by ID and return as model
   */
  getById(id: string) {
    const item = this.get(id)
    return item ? this.toModel(item) : undefined
  }

  /**
   * Get all places as models
   */
  getAllAsModels() {
    return this.getAll().map((item) => this.toModel(item))
  }

  /**
   * Create a complete place with all required fields
   * This method should be used instead of the basic add() method for places
   */
  createPlace(data: {
    description: string
    normalizedPlace: string
    slug: string
    geocodedAddress: {
      latitude: number
      longitude: number
      formattedAddress: string
      structuredAddress: {
        city: string
        state: string
        postalCode: string
        country: string
        street?: string
        streetNumber?: string
      }
    }
    weather?: any[]
  }): PlaceStoreItem {
    const placeData: Omit<PlaceStoreItem, "id" | "createdAt"> = {
      description: data.description,
      normalizedPlace: data.normalizedPlace,
      slug: data.slug,
      geocodedAddress: data.geocodedAddress,
      weather: data.weather
    }

    return this.add(placeData)
  }

  /**
   * Override update method to return updated item
   */
  update(id: string, updates: Partial<PlaceStoreItem>): PlaceStoreItem {
    const oldItem = this.get(id)
    if (!oldItem) {
      throw new Error(`Place with id "${id}" not found`)
    }

    super.update(id, updates)
    const updatedItem = this.get(id)!

    return updatedItem
  }
}
