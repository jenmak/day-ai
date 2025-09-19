import { useParams } from "react-router"
import { usePlaceBySlug } from "../hooks/usePlaceBySlug"
// import { Spinner } from "../components/shadcn/spinner"
import { PageWrapper } from "../components/PageWrapper"
// import { WeatherCard } from "../components/WeatherCard"
// import { Subheading } from "../components/typography/Subheading"
// import { Heading } from "../components/typography/Heading"
import { ErrorPage } from "./ErrorPage"
import { NO_SPECIFIC_LOCATION_FOUND, UNKNOWN } from "../consts/EmptyLocation"
import { useState } from "react"
import { SearchInput } from "../components/SearchInput"
import { useCreatePlace } from "../hooks/useCreatePlace"

export function Place() {

  // Hooks.
  const { slug } = useParams()
  const { data: place, isLoading, error } = usePlaceBySlug({ slug: slug || "" })
  const { createPlace } = useCreatePlace()

  // Local state.
  const [errorMessage, setErrorMessage] = useState<string>("")

  // Error handling.
  if (!slug) {
    setErrorMessage("No slug provided.")
  } else if (slug === NO_SPECIFIC_LOCATION_FOUND || slug === UNKNOWN) {
    setErrorMessage("Location not found.")
  } else if (error) {
    setErrorMessage(error instanceof Error ? error.message : "Unknown error.")
  } else if (!place || !place.weather) {
    setErrorMessage("Place with weather data not found.")
  }

  if (errorMessage) {
    return <ErrorPage message={errorMessage} />
  }

  return (
    <PageWrapper>
      <div className={`flex justify-center p-4 fixed top-0 left-0 right-0 z-10`}>
        <SearchInput onSearch={createPlace} />
      </div>
        <div className="flex flex-col">
        {/* <div className="pt-[70px]">
          {place && (
            <div > */}
            {/* // <div className="flex flex-col text-center text-white mt-6 py-12 md:mb-12 mb-16 p-4 bg-white/50 backdrop-blur-sm rounded-lg shadow-md h-[400px] md:h-auto max-w-[350px] mx-auto"> */}
              {/* <Subheading className="text-black/90 font-heading">{place.description}</Subheading>
              <Heading className="mb-12 md:mb-4 text-black/90">{place.normalizedPlace}</Heading>
              <h2 className="mt-12 md:mt-0 text-center text-5xl md:text-3xl font-bold text-black/40">7 Day Outfit Forecast</h2>
            </div>
          )}
        </div> */}
      {/* </div>
      <div className={`flex flex-col md:flex-row md:pl-[calc(50%-150px)] lg:pl-[calc(50%-250px)] md:overflow-x-scroll`}>
        {place.weather.map((weather) => (
          <div className="md:mr-8 lg:mb-0 mb-16 md:flex-row lg:mr-4">
            <WeatherCard key={weather.date} weather={weather} />
          </div>
        ))}
      </div> */}
      </div>
    </PageWrapper>
  )
}