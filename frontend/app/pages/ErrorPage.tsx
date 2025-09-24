import { Heading } from "../components/typography/Heading"
import { PageWrapper } from "../components/PageWrapper"
import { SearchInput } from "../components/SearchInput"
import { useCreatePlace } from "../hooks/useCreatePlace"

type ErrorPageProps = {
  message?: string
}

const BACKGROUND_COLOR = "white"
const TEXT_COLOR = "black"

export function ErrorPage({ message = "An error occurred. Please try again." }: ErrorPageProps) {
  const { createPlace, isLoading } = useCreatePlace()

  return (
    <PageWrapper>
      <div className="fixed flex flex-col py-4 left-0 right-0 z-10 items-center">
        <SearchInput
          onSearch={createPlace}
          placeholder="Try another location"
          backgroundColor={BACKGROUND_COLOR}
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
              <Heading className="font-body">{message}</Heading>
            </div>
          </div>
        }
      </div>
    </PageWrapper>
  )
}
