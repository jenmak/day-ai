import type { Location } from "../schemas/location"
import { Store, type StoreItem } from "../../core/Store"

export interface LocationStoreItem extends StoreItem, Omit<Location, 'id' | 'createdAt'> { }

export class LocationStore extends Store<LocationStoreItem> {
  constructor() {
    super("locations")
  }

  /**
   * Generate a URL-friendly slug from a location string
   */
  static generateSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove all non-alphanumeric characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace one or more spaces with a single hyphen
      .replace(/-+/g, '-') // Replace multiple consecutive hyphens with a single hyphen
      .replace(/^-|-$/g, '') // Remove leading and trailing hyphens
  }

  toModel(item: LocationStoreItem) {
    const model = super.toModel(item)

    return {
      ...model,
      description: item.description,
      normalizedLocation: item.normalizedLocation,
      slug: item.slug,
      geocodedAddress: item.geocodedAddress,
      weather: item.weather,
      createdAt: item.createdAt
    }
  }


  getByDescription(description: string): LocationStoreItem | undefined {
    return this.getAll().find(item => item.description === description)
  }

  getBySlug(slug: string): LocationStoreItem | undefined {
    return this.getAll().find(item => item.slug === slug)
  }

  getByNormalizedLocation(normalizedLocation: string): LocationStoreItem | undefined {
    return this.getAll().find(item => item.normalizedLocation === normalizedLocation)
  }

  /**
   * Get location by ID and return as model
   */
  getById(id: string) {
    const item = this.get(id)
    return item ? this.toModel(item) : undefined
  }

  /**
   * Get all locations as models
   */
  getAllAsModels() {
    return this.getAll().map(item => this.toModel(item))
  }

  /**
   * Create a complete location with all required fields
   * This method should be used instead of the basic add() method for locations
   */
  createLocation(data: {
    description: string
    normalizedLocation: string
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
  }): LocationStoreItem {
    const locationData: Omit<LocationStoreItem, "id" | "createdAt"> = {
      description: data.description,
      normalizedLocation: data.normalizedLocation,
      slug: data.slug,
      geocodedAddress: data.geocodedAddress,
      weather: data.weather
    }

    return this.add(locationData)
  }

  /**
   * Override update method to return updated item
   */
  update(id: string, updates: Partial<LocationStoreItem>): LocationStoreItem {
    const oldItem = this.get(id)
    if (!oldItem) {
      throw new Error(`Location with id "${id}" not found`)
    }
    
    super.update(id, updates)
    const updatedItem = this.get(id)!
    
    return updatedItem
  }
}
