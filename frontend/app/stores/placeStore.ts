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
        console.log("Store: Adding place to store", place)
        set((state) => {
          // Ensure places is always a Map
          const currentPlaces =
            state.places instanceof Map
              ? state.places
              : new Map(Object.entries(state.places || {}) as [string, Place][])
          const newPlaces = new Map(currentPlaces)
          newPlaces.set(place.slug, place)
          console.log("Store: Place added, total places:", newPlaces.size)
          return {
            places: newPlaces,
            currentPlace: place
          }
        })
      },

      setCurrentPlace: (place: Place | null) => {
        console.log("Store: Setting current place", place)
        set({ currentPlace: place })
      },

      getPlaceBySlug: (slug: string) => {
        const state = get()
        // Ensure places is always a Map
        const places =
          state.places instanceof Map
            ? state.places
            : new Map(Object.entries(state.places || {}) as [string, Place][])
        return places.get(slug) || null
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
      // Persist the places Map and currentPlace, not the loading/error states
      partialize: (state) => ({
        places: state.places instanceof Map ? Object.fromEntries(state.places) : state.places,
        currentPlace: state.currentPlace
      }),
      // Convert the persisted object back to a Map on rehydration
      onRehydrateStorage: () => (state) => {
        if (state && state.places && !(state.places instanceof Map)) {
          state.places = new Map(Object.entries(state.places))
        }
      }
    }
  )
)
