import type { Location } from "#app/schemas/location.ts"
import { Store, type StoreItem } from "#core/Store.ts"

export interface LocationStoreItem extends StoreItem, Location {}

export class LocationStore extends Store<LocationStoreItem> {
  constructor() {
    super("locations")
  }

  toModel(item: LocationStoreItem) {
    const model = super.toModel(item)

    return {
      ...model,
      locationId: item.locationId,
      description: item.description,
      normalizedLocation: item.normalizedLocation,
      geocodedAddress: item.geocodedAddress,
      weather: item.weather
    }
  }

  getByNormalizedLocation(normalizedLocation: string): LocationStoreItem | undefined {
    return this.items.get(normalizedLocation)
  }
}
