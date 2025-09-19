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
import { useEffect } from "react"
import { CARD_LIST_WIDTH_DESKTOP, CARD_WIDTH_DESKTOP, CARD_WIDTH_DESKTOP_TODAY } from "../consts/Card"
import { getDayOfWeek } from "../utils/getDayOfWeek"

export function Place() {

  const { slug } = useParams()

  /** CONSOLIDATE ALL ERROR HANDLING */

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

  useEffect(() => {
    console.log("place", place)
  }, [place])

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

  /** CONSOLIDATE ALL ERROR HANDLING */


  return (
    <PageWrapper>
      <div className="flex flex-col gap-4">
        <Header />
        <div className="pt-[70px]">
          {place && (
            <div className="flex flex-col text-center text-white mb-8 p-4 bg-white/50 backdrop-blur-sm rounded-lg shadow-md max-w-2xl mx-auto">
              <Subheading className="text-black/90 font-heading">{place.description}</Subheading>
              <Heading className="mb-4 text-black/90">{place.normalizedPlace}</Heading>
              <h2 className="text-center text-3xl font-bold text-black/60 mb-4">7 Day Outfit Forecast</h2>
            </div>
          )}
        </div>
      </div>
        <WeatherCard weather={place.weather[0]} />
    </PageWrapper>
  )
}