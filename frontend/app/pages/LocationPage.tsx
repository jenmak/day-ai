import { useParams } from "react-router"
import { useLocationBySlug } from "../hooks/useLocationBySlug"
import { Spinner } from "@/components/ui/spinner"
import { PageWrapper } from "../components/PageWrapper"
import { Weather } from "@dayai/backend/schemas"

export function Location() {
  const { slug } = useParams()
  
  if (!slug) {
    return (
      <PageWrapper>
        <div>No slug provided</div>
      </PageWrapper>
    )
  }

  const { data: location, isLoading, error } = useLocationBySlug({ slug })

  if (isLoading) {
    return (
      <PageWrapper>
        <Spinner />
      </PageWrapper>
    )
  }

  if (error) {
    return (
      <PageWrapper>
        <div>Error: {error instanceof Error ? error.message : 'Unknown error'}</div>
      </PageWrapper>
    )
  }

  if (!location) {
    return (
      <PageWrapper>
        <div>Location not found.</div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <h1>{location.normalizedLocation}</h1>
      <p>Coordinates: {location.geocodedAddress.latitude}, {location.geocodedAddress.longitude}</p>
      <p>Address: {location.geocodedAddress.structuredAddress.city}, {location.geocodedAddress.structuredAddress.state} {location.geocodedAddress.structuredAddress.postalCode}</p>
      <p>Country: {location.geocodedAddress.structuredAddress.country}</p>
      <p>Weather: {location.weather?.map((weather: Weather) => weather.condition).join(", ")}</p>
      <p>Weather: {location.weather?.map((weather: Weather) => weather.degreesFahrenheit).join(", ")}</p>
      <p>Weather: {location.weather?.map((weather: Weather) => weather.degreesCelsius).join(", ")}</p>
      <p>Weather: {location.weather?.map((weather: Weather) => weather.temperatureRange.temperatureMinimum).join(", ")}</p>
      <p>Weather: {location.weather?.map((weather: Weather) => weather.temperatureRange.temperatureMaximum).join(", ")}</p>
      <p>Weather: {location.weather?.map((weather: Weather) => weather.rainProbabilityPercentage).join(", ")}</p>
      <p>Weather: {location.weather?.map((weather: Weather) => weather.windSpeedMph).join(", ")}</p>
    </PageWrapper>
  )
}