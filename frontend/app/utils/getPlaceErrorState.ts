import { Place } from "@dripdropcity/backend/types"
import { NO_SPECIFIC_LOCATION_FOUND, NOT_APPLICABLE, UNKNOWN } from "../consts/Errors"

export interface PlaceErrorState {
  errorMessage: string
  hasError: boolean
}

export function getPlaceErrorState(
  slug: string | undefined,
  error: any,
  isLoading: boolean,
  place: Place | undefined
): PlaceErrorState {
  if (!slug) {
    return {
      errorMessage: "You have reached an invalid page. Please try a different location.",
      hasError: true
    }
  }

  if (slug === NO_SPECIFIC_LOCATION_FOUND || slug === UNKNOWN) {
    return {
      errorMessage: "The location you searched for was not found. Please try a different location.",
      hasError: true
    }
  }

  if (slug === NOT_APPLICABLE) {
    return {
      errorMessage:
        "This location is not applicable for weather data. Please try a different location.",
      hasError: true
    }
  }

  if (error) {
    return {
      errorMessage:
        error instanceof Error ? error.message : "An unknown error occurred. Please try again.",
      hasError: true
    }
  }

  if (!isLoading && place && !place.weather) {
    return {
      errorMessage:
        "The place you searched for does not contain any weather data. Please try a different location.",
      hasError: true
    }
  }

  return {
    errorMessage: "",
    hasError: false
  }
}
