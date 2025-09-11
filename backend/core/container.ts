import { LocationStore } from "#app/stores/LocationStore.ts"
import { asValue, createContainer } from "awilix"

type Cradle = {
  locations: LocationStore
}

const container = createContainer<Cradle>()

container.register({
  locations: asValue(new LocationStore())
})

export { container }
