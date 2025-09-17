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
        <div className="flex flex-col text-center text-white mb-4 lg:fixed lg:top-[70px] lg:left-0 lg:right-0 lg:z-10  lg:py-4">
          <Subheading className="text-white/90 font-heading">{place.description}</Subheading>
          <Heading className="mb-4 text-white/90">{place.normalizedPlace}</Heading>
          <h3 className="text-white text-center text-2xl font-bold text-white/60 mb-4">7 Day Outfit Forecast</h3>
        </div>
      )}
      <div className="flex flex-col md:items-start md:gap-6 gap-12 lg:overflow-x-auto lg:flex-row lg:justify-center lg:snap-x lg:snap-mandatory lg:gap-8 lg:px-4 lg:mt-[200px]">
        {
          place.weather.map((weather: Weather) => (
            <div key={weather.date.toString()} className="snap-center lg:flex-shrink-0">
              <WeatherCard weather={weather} />
            </div>
          ))
        }
        </div>
      </div>
    </PageWrapper>
  )
}