import { useParams } from "react-router"
import { usePlaceBySlug } from "../hooks/usePlaceBySlug"
import { Spinner } from "../../src/components/ui/spinner"
import { PageWrapper } from "../components/PageWrapper"
import { Weather } from "../../src/types/api"
import { WeatherCard } from "../components/WeatherCard"
import { Header } from "../components/Header"
import { Subheading } from "../components/Subheading"
import { Heading } from "../components/Heading"

export function Place() {

  // TODO: Deal with these views
  const { slug } = useParams()

  if (!slug) {
    return (
      <PageWrapper>
        <div>No slug provided</div>
      </PageWrapper>
    )
  }

  const { data: place, isLoading, error } = usePlaceBySlug({ slug })

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

  if (!place || !place.weather) {
    return (
      <PageWrapper>
        <div>Place with weather data not found.</div>
      </PageWrapper>
    )
  }
  console.log(place)

  // Determine background colors based on weather conditions
  // hot
  // cool
  // rainy

  return (
    <PageWrapper>
      <Header />
      {place && (
        <div className="flex flex-col text-center text-white">
          <Subheading>{place.description}</Subheading>
          <Heading>{place.normalizedLocation}</Heading>
        </div>
      )}
      <div className="flex flex-col md:flex-row gap-6 md:gap-3">
      {
        place.weather.map((weather: Weather) => (
          <WeatherCard key={weather.date.toString()} weather={weather} />
        ))
      }
      </div>

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