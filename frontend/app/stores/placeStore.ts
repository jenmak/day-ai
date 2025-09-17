import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { Place as PlaceType } from "@dayai/backend/schemas"

interface PlaceState {
  place: PlaceType
  setPlace: (place: PlaceType) => void
}

const initialState = {
  place: {
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

export const usePlaceStore = create<PlaceState>()(
  devtools(
    (set) => ({
      ...initialState,
      setPlace: (place: PlaceType) => set({ place }),
    })
  )
)

// Legacy exports for backward compatibility
export const useLocationStore = create<{ location: PlaceType; setLocation: (location: PlaceType) => void }>()(
  devtools(
    (set) => ({
      location: initialState.place,
      setLocation: (location: PlaceType) => set({ location }),
    })
  )
)