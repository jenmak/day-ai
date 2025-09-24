import { PlaceStore } from "../app/stores/PlaceStore"
import { CacheStore } from "./CacheStore"
import { asValue, createContainer } from "awilix"

type Cradle = {
  places: PlaceStore
  cache: CacheStore
}

const container = createContainer<Cradle>()

const placeStore = new PlaceStore()
const cacheStore = new CacheStore()

container.register({
  places: asValue(placeStore),
  cache: asValue(cacheStore)
})

export { container }
