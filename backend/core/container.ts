import { asValue, createContainer } from "awilix"
import { PlaceStore } from "../app/stores/PlaceStore"

type Cradle = {
  places: PlaceStore
}

const container = createContainer<Cradle>()

const placeStore = new PlaceStore()

container.register({
  places: asValue(placeStore)
})

export { container }
