import { Place } from "@dripdropcity/backend/types"
import { ERROR_MESSAGES, ERROR_SLUGS, ErrorUtils } from "../errors"

export interface PlaceErrorState {
  errorMessage: string
  hasError: boolean
  errorCode?: string
}

export function getPlaceErrorState(
  slug: string | undefined,
  error: Error | null,
  isLoading: boolean,
  place: Place | undefined
): PlaceErrorState {
  // No slug provided
  if (!slug) {
    return {
      errorMessage: ERROR_MESSAGES.USER.INVALID_PAGE,
      hasError: true,
      errorCode: "INVALID_PAGE"
    }
  }

  // Known error slugs
  if (slug === ERROR_SLUGS.NO_SPECIFIC_LOCATION_FOUND || slug === ERROR_SLUGS.UNKNOWN) {
    return {
      errorMessage: ERROR_MESSAGES.USER.LOCATION_NOT_FOUND,
      hasError: true,
      errorCode: "LOCATION_NOT_FOUND"
    }
  }

  if (slug === ERROR_SLUGS.NOT_APPLICABLE) {
    return {
      errorMessage: ERROR_MESSAGES.USER.LOCATION_NOT_APPLICABLE,
      hasError: true,
      errorCode: "LOCATION_NOT_APPLICABLE"
    }
  }

  // Network or server errors
  if (error) {
    const isRetryable = ErrorUtils.isRetryableHttpStatus(
      error.message.includes("status:")
        ? parseInt(error.message.split("status:")[1]?.trim()) || 500
        : 500
    )

    return {
      errorMessage: isRetryable
        ? ERROR_MESSAGES.USER.NETWORK_ERROR
        : ERROR_MESSAGES.USER.GENERIC_ERROR,
      hasError: true,
      errorCode: isRetryable ? "NETWORK_ERROR" : "SERVER_ERROR"
    }
  }

  // No weather data available
  if (!isLoading && place && !place.weather) {
    return {
      errorMessage: ERROR_MESSAGES.USER.NO_WEATHER_DATA,
      hasError: true,
      errorCode: "NO_WEATHER_DATA"
    }
  }

  return {
    errorMessage: "",
    hasError: false
  }
}
