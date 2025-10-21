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
import { usePlaceStore } from "../stores/placeStore"
import { Weather } from "../types/backend"
import { getBackgroundColors } from "../utils/getBackgroundColors"
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
  const { isLoading: isCreatingPlace, currentPlace } = usePlaceStore()
  const { createPlace } = useCreatePlace()

  // Local state.
  const [errorMessage, setErrorMessage] = useState<string>("")
  const initialSwatchColors = [
    "bg-[var(--color-gray-1)]",
    "bg-[var(--color-gray-2)]",
    "bg-[var(--color-gray-3)]",
    "bg-[var(--color-gray-4)]",
    "bg-[var(--color-gray-5)]"
  ]
  const [swatchColors, setSwatchColors] = useState<string[]>(initialSwatchColors)

  useEffect(() => {
    const errorState = getPlaceErrorState(slug, error, isLoading, place)
    setErrorMessage(errorState.errorMessage)
  }, [slug, error, isLoading, place])

  // Update swatch colors based on place temperature
  useEffect(() => {
    if (place?.temperatureRangeCategory) {
      const colors = getBackgroundColors(place.temperatureRangeCategory)
      setSwatchColors(colors)
    }
  }, [place?.temperatureRangeCategory])

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
              <div className="place-card card bg-white bg-opacity-30 p-6 rounded-lg text-black max-w-[350px] flex flex-col gap-4 text-center items-center justify-center">
                <h2 className="text-2xl font-bold">7 Day Outfit Forecast</h2>
                <hr className="border-black border w-full" />
                <div className="flex items-center justify-center gap-2 w-full flex-col items-center justify-center">
                  <Subheading className="font-heading">{place.description}</Subheading>
                  <Heading className="font-body">{place.normalizedPlace}</Heading>
                </div>
                <div className="flex flex-row gap-2">
                  {swatchColors.map((color) => (
                    <div
                      key={`${color}`}
                      className={`background-color w-2 h-2 w-full h-full ${color}`}
                    ></div>
                  ))}
                </div>
                <div className="flex flex-row gap-2 w-30 h-4">
                  {swatchColors.map((color) => (
                    <div key={`${color}`} className={`background-color w-4 h-4 ${color}`}></div>
                  ))}
                </div>
              </div>
            )}

            {/* Weather cards. */}
            {place?.weather?.map((weather: Weather) => (
              <WeatherCard
                key={weather.date}
                weather={weather}
                iconBackgroundColor={swatchColors[2]}
                accentColor={swatchColors[3]}
              />
            ))}
            <div className="cards-spacer"></div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
