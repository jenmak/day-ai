import { useParams } from "react-router"
import { usePlaceBySlug } from "../hooks/usePlaceBySlug"
import { Spinner } from "../../src/components/ui/spinner"
import { PageWrapper } from "../components/PageWrapper"
import { Weather } from "../../src/types/api"
import { WeatherCard } from "../components/WeatherCard"
import { Header } from "../components/Header"
import { Subheading } from "../components/Subheading"
import { Heading } from "../components/Heading"
import { NoLocationFoundPage } from "./NoLocationFoundPage"
import { NO_SPECIFIC_LOCATION_FOUND, UNKNOWN } from "../consts/EmptyLocation"

export function Place() {

  const { slug } = useParams()

  if (!slug) {
    return (
      <PageWrapper>
        <div>No slug provided</div>
      </PageWrapper>
    )
  }

  // Handle special cases for no location found
  if (slug === NO_SPECIFIC_LOCATION_FOUND || slug === UNKNOWN) {
    return <NoLocationFoundPage />
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

  return (
    <PageWrapper>
      <Header />
      <div className="mt-[70px] justify-start">
      {place && (
        <div className="flex flex-col text-center text-white">
          <Subheading>{place.description}</Subheading>
          <Heading>{place.normalizedLocation}</Heading>
        </div>
      )}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-3">
        {
          place.weather.map((weather: Weather) => (
            <WeatherCard key={weather.date.toString()} weather={weather} />
          ))
        }
        </div>
      </div>
    </PageWrapper>
  )
}