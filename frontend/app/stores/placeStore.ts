import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Place as BackendPlace } from "../types/backend"

export type Place = BackendPlace

interface PlaceStore {
  places: Map<string, Place>
  currentPlace: Place | null
  isLoading: boolean
  error: string | null

  // Actions
  addPlace: (place: Place) => void
  setCurrentPlace: (place: Place | null) => void
  getPlaceBySlug: (slug: string) => Place | null
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
}

export const usePlaceStore = create<PlaceStore>()(
  persist(
    (set, get) => ({
      places: new Map(),
      currentPlace: null,
      isLoading: false,
      error: null,

      addPlace: (place: Place) => {
        set((state) => {
          const newPlaces = new Map(state.places)
          newPlaces.set(place.slug, place)
          return {
            places: newPlaces,
            currentPlace: place
          }
        })
      },

      setCurrentPlace: (place: Place | null) => {
        set({ currentPlace: place })
      },

      getPlaceBySlug: (slug: string) => {
        return get().places.get(slug) || null
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      setError: (error: string | null) => {
        set({ error })
      },

      clearError: () => {
        set({ error: null })
      }
    }),
    {
      name: "place-store",
      // Only persist the places Map, not the loading/error states
      partialize: (state) => ({ places: state.places })
    }
  )
)
