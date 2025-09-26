import { PageWrapper } from "../components/PageWrapper"
import { SearchInput } from "../components/SearchInput"
import { Heading } from "../components/typography/Heading"
import { useCreatePlace } from "../hooks/useCreatePlace"
import { usePlaceStore } from "../stores/placeStore"

type ErrorPageProps = {
  message?: string
}

const BACKGROUND_COLOR = "white"
const TEXT_COLOR = "black"
const RING_COLOR = "black"
const RING_BACKGROUND_COLOR = "white"

import { ERROR_MESSAGES } from "../errors"

export function ErrorPage({ message }: ErrorPageProps) {
  const { createPlace, isLoading } = useCreatePlace()
  const { error: storeError, clearError } = usePlaceStore()

  // Use store error if available, otherwise use prop message, otherwise default
  const errorMessage = storeError || message || ERROR_MESSAGES.USER.GENERIC_ERROR

  // Clear error when user starts a new search
  const handleSearch = (searchTerm: string) => {
    clearError()
    createPlace(searchTerm)
  }

  return (
    <PageWrapper>
      <div className="fixed flex flex-col py-4 left-0 right-0 z-10 items-center">
        <SearchInput
          onSearch={handleSearch}
          placeholder="Try another location"
          backgroundColor={BACKGROUND_COLOR}
          ringColor={RING_COLOR}
          ringBackgroundColor={RING_BACKGROUND_COLOR}
          textColor={TEXT_COLOR}
          placeholderColor={TEXT_COLOR}
          isLoading={isLoading}
        />
      </div>
      <div className="flex flex-col items-center justify-center h-screen w-full">
        {/* Card*/}
        {
          <div className="card bg-white bg-opacity-30 p-6 rounded-lg text-black max-w-[350px] shadow-md flex flex-col gap-4 text-center items-center justify-center">
            <h2 className="text-2xl font-bold">Error</h2>
            <hr className="border-black border w-full" />
            <div className="flex items-center justify-center gap-2 w-full flex-col items-center justify-center">
              <Heading className="font-body">{errorMessage}</Heading>
            </div>
          </div>
        }
      </div>
    </PageWrapper>
  )
}
