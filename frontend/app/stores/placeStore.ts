import { Place, Weather } from "@dripdropcity/backend/types"
import { create } from "zustand"
import { devtools } from "zustand/middleware"

interface PlaceState {
  place: {
    description: string
    normalizedPlace: string
    weather: Weather[]
    temperatureRangeCategory: string
  }
  setPlace: (place: Place) => void
}

const initialState = {
  place: {
    description: "",
    normalizedPlace: "",
    weather: [],
    temperatureRangeCategory: ""
  }
}

export const usePlaceStore = create<PlaceState>()(
  devtools((set) => ({
    ...initialState,
    setPlace: (place: Place) =>
      set({
        place: {
          description: place.description || "",
          normalizedPlace: place.normalizedPlace || "",
          weather: place.weather || [],
          temperatureRangeCategory: place.temperatureRangeCategory || ""
        }
      })
  }))
)
