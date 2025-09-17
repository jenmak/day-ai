import { PlaceStore } from "../app/stores/PlaceStore"
import { asValue, createContainer } from "awilix"

type Cradle = {
  places: PlaceStore
  // Legacy alias for backward compatibility
  locations: PlaceStore
}

const container = createContainer<Cradle>()

const placeStore = new PlaceStore()
container.register({
  places: asValue(placeStore),
  locations: asValue(placeStore) // Legacy alias
})

export { container }
