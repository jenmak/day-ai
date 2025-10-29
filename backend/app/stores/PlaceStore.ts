import { Store, type StoreItem } from "../../core/Store"
import type { Place, TemperatureRangeCategory, Weather } from "../schemas"

export interface PlaceStoreItem
  extends StoreItem,
    Omit<Place, "id" | "createdAt"> {}

export class PlaceStore extends Store<PlaceStoreItem> {
  constructor() {
    super("places")
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

  getBySlug(slug: string): PlaceStoreItem | undefined {
    return this.getAll().find((item) => item.slug === slug)
  }

  getByNormalizedPlace(normalizedPlace: string): PlaceStoreItem | undefined {
    return this.getAll().find(
      (item) => item.normalizedPlace === normalizedPlace
    )
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
      latitude: string
      longitude: string
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
    weather?: Weather[]
    temperatureRangeCategory?: TemperatureRangeCategory
  }): PlaceStoreItem {
    const placeData: Omit<PlaceStoreItem, "id" | "createdAt"> = {
      description: data.description,
      normalizedPlace: data.normalizedPlace,
      slug: data.slug,
      geocodedAddress: data.geocodedAddress,
      weather: data.weather,
      temperatureRangeCategory: data.temperatureRangeCategory
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
