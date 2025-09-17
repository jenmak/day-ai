import { useParams } from "react-router"
import { useLocationBySlug } from "../hooks/useLocationBySlug"
import { Spinner } from "../../src/components/ui/spinner"
import { PageWrapper } from "../components/PageWrapper"
import { Weather } from "../../src/types/api"
import { WeatherCard } from "../components/WeatherCard"
import { Header } from "../components/Header"
import { Subheading } from "../components/Subheading"
import { Heading } from "../components/Heading"

export function Location() {

  // TODO: Deal with these views
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

  if (!location || !location.weather) {
    return (
      <PageWrapper>
        <div>Location with weather data not found.</div>
      </PageWrapper>
    )
  }

  // Determine background colors based on weather conditions
  // hot
  // cool
  // rainy

  return (
    <PageWrapper>
      <Header />
      {location && (
        <div className="flex flex-col text-center text-white">
          <Subheading>{location.description}</Subheading>
          <Heading>{location.normalizedLocation}</Heading>
        </div>
      )}
      {
        location.weather.map((weather: Weather) => (
          <WeatherCard key={weather.date.toString()} weather={weather} />
        ))
      }
      {/* <div className="text-white">
        {location.weather?.temperatureRange.temperatureMinimum}
        {location.weather.temperatureRange.temperatureMaximum}
        {location.weather?.rainProbabilityPercentage}
        {location.weather?.windSpeedMph}
        {location.weather?.clothing.join(", ")}
      </div> */}

      {/* <h1 className="text-title font-heading">{location.normalizedLocation}</h1>
      <p className="font-body">{location.description}</p>
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
      <p>Weather: {location.weather?.map((weather: Weather) => weather.clothing.join(", ")).join(", ")}</p>
      </div> */}

    </PageWrapper>
  )
}