import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { LoadingSpinner } from "../components/LoadingSpinner"
import { PageWrapper } from "../components/PageWrapper"
import { SearchInput } from "../components/SearchInput"
import { Heading } from "../components/typography/Heading"
import { Subheading } from "../components/typography/Subheading"
import { WeatherCard } from "../components/WeatherCard"
import { useCreatePlace } from "../hooks/useCreatePlace"
import { usePlaceBySlug } from "../hooks/usePlaceBySlug"
import { Weather } from "../types/backend"
import { getPlaceErrorState } from "../utils/getPlaceErrorState"
import { ErrorPage } from "./ErrorPage"

const TEXT_COLOR = "black"
const BACKGROUND_COLOR = "white"
const RING_COLOR = "black"
const RING_BACKGROUND_COLOR = "white"

export function Place() {
  // Hooks.
  const { slug } = useParams()
  const { data: place, isLoading, error } = usePlaceBySlug({ slug: slug || "" })
  const { createPlace, isLoading: isCreatingPlace } = useCreatePlace()

  // Local state.
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    const errorState = getPlaceErrorState(slug, error, isLoading, place)
    setErrorMessage(errorState.errorMessage)
  }, [slug, error, isLoading, place])

  if (isLoading || isCreatingPlace) {
    return (
      <PageWrapper>
        <LoadingSpinner size="xl" className="h-screen flex items-center justify-center" />
      </PageWrapper>
    )
  }

  // Show error page if there's an error message
  if (errorMessage) {
    return <ErrorPage message={errorMessage} />
  }

  return (
    <PageWrapper>
      {/* Header with search input and place info. */}
      <div className="fixed flex flex-col py-4 left-0 right-0 z-10 items-center">
        <SearchInput
          onSearch={createPlace}
          backgroundColor={BACKGROUND_COLOR}
          textColor={TEXT_COLOR}
          placeholderColor={TEXT_COLOR}
          ringColor={RING_COLOR}
          ringBackgroundColor={RING_BACKGROUND_COLOR}
          isLoading={isLoading}
        />
      </div>
      <div className="flex flex-row justify-center mt-17 h-full">
        <div className="cards-scroll-container">
          <div className="cards-container items-end">
            {/* Header with place info. */}
            {place && (
              <div className="place-card card bg-white bg-opacity-30 p-6 rounded-lg text-black max-w-[350px] shadow-md flex flex-col gap-4 text-center items-center justify-center">
                <h2 className="text-2xl font-bold">7 Day Outfit Forecast</h2>
                <hr className="border-black border w-full" />
                <div className="flex items-center justify-center gap-2 w-full flex-col items-center justify-center">
                  <Subheading className="font-heading">{place.description}</Subheading>
                  <Heading className="font-body">{place.normalizedPlace}</Heading>
                </div>
              </div>
            )}

            {/* Weather cards. */}
            {place?.weather?.map((weather: Weather) => (
              <WeatherCard key={weather.date} weather={weather} />
            ))}
            <div className="cards-spacer"></div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
