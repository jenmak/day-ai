import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { Location as LocationType } from "@dayai/backend/schemas"

interface LocationState {
  location: LocationType
  setLocation: (location: LocationType) => void
}

const initialState = {
  location: {
    id: "",
    description: "",
    slug: "",
    normalizedLocation: "",
    geocodedAddress: {
      latitude: 0,
      longitude: 0,
      formattedAddress: "",
      structuredAddress: {
        city: "",
        state: "",
        postalCode: "",
        country: "",
      }
    },
    weather: [],
    createdAt: ""
  },
}

export const useLocationStore = create<LocationState>()(
  devtools(
    (set) => ({
      ...initialState,
      setLocation: (location: LocationType) => set({ location }),
    })
  )
)