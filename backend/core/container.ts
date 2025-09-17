import { PlaceStore } from "../app/stores/PlaceStore"
import { asValue, createContainer } from "awilix"

type Cradle = {
  places: PlaceStore
}

const container = createContainer<Cradle>()

const placeStore = new PlaceStore()
container.register({
  places: asValue(placeStore),
})

export { container }
