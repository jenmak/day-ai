import { useParams } from "react-router"
import { usePlaceBySlug } from "../hooks/usePlaceBySlug"
import { PageWrapper } from "../components/PageWrapper"
import { ErrorPage } from "./ErrorPage"
import { useState, useEffect } from "react"
import { SearchInput } from "../components/SearchInput"
import { useCreatePlace } from "../hooks/useCreatePlace"
import { getPlaceErrorState } from "../utils/placeErrorHandler"
// import { Heading } from "../components/typography/Heading"
// import { Subheading } from "../components/typography/Subheading"
// import { getBackgroundColors } from "../utils/getBackgroundColors"
// import { TemperatureRangeCategory } from "../consts/Temperature"
import { WeatherCard } from "../components/WeatherCard"
// import { getColorVariable } from "../utils/getColorVariable"

export function Place() {
  // Hooks.
  const { slug } = useParams()
  const { data: place, isLoading, error } = usePlaceBySlug({ slug: slug || "" })
  const { createPlace } = useCreatePlace()
  
  // Get background colors based on place temperature category
  // const backgroundColors = place?.temperatureRangeCategory 
  //   ? getBackgroundColors(place.temperatureRangeCategory as keyof typeof TemperatureRangeCategory)
  //   : []
  // const textColor = backgroundColors.length > 0 ? getColorVariable(backgroundColors[4]) : 'var(--color-white)'
  const textColor = 'black'
  const backgroundColor = 'bg-white/70'
  // Local state.
  const [errorMessage, setErrorMessage] = useState<string>("")

  // Error handling with useEffect to avoid calling setState during render
  useEffect(() => {
    const errorState = getPlaceErrorState(slug, error, isLoading, place)
    setErrorMessage(errorState.errorMessage)
  }, [slug, error, isLoading, place])

  // Show loading state
  if (isLoading) {
    return <div>Loading...</div>
  }

  // Show error page if there's an error message
  if (errorMessage && !place) {
    return <ErrorPage message={errorMessage} />
  }

  return (
    <PageWrapper>
      {/* Header with search input and place info. */}
      <div className="fixed flex flex-col py-4 left-0 right-0 z-10 items-center gap-4 bg-white/30">
        <SearchInput
          onSearch={createPlace}
          backgroundColor={backgroundColor}
          textColor={textColor}
          placeholderColor={textColor}
          isLoading={isLoading} />
        {/* {place && (
          <div className={`${backgroundColors[4]} bg-opacity-30 p-6 rounded-lg text-white max-w-[350px] shadow-md flex flex-col gap-4 items-center text-white`}>
            <h2 className="text-3xl md:text-2xl font-bold text-white">7 Day Outfit Forecast</h2>
            <hr className="border-white border w-full" />
            <Subheading className="font-heading">{place.description}</Subheading>
            <Heading className="font-body">{place.normalizedPlace}</Heading>
          </div>
        )} */}
      </div>
      {/* Weather cards. */}
      <div className="weather-cards-scroll-container">
        <div className="weather-cards-container">
          {place?.weather?.map((weather) => (
            <WeatherCard key={weather.date} weather={weather} />
          ))}
          <div className="weather-cards-spacer"></div>
        </div>
      </div>

    </PageWrapper>
  )
}