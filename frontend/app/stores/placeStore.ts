import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { Place } from "@dayai/backend/schemas"

interface PlaceState {
  place: Place
  setPlace: (place: Place) => void
}

const initialState = {
  place: {
    id: "",
    description: "",
    slug: "",
    normalizedPlace: "",
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
    createdAt: "",
    temperatureRangeCategory: ""
  },
}

export const usePlaceStore = create<PlaceState>()(
  devtools(
    (set) => ({
      ...initialState,
      setPlace: (place: Place) => set({ place }),
    })
  )
)