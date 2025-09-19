import { PageWrapper } from "../components/PageWrapper"
// import { Heading } from "../components/typography/Heading"
// import { Subheading } from "../components/typography/Subheading"
// import { Button } from "../components/shadcn/button"
// import { useNavigate } from "react-router"
// import { Search, MapPin, HelpCircle } from "lucide-react"


type ErrorPageProps = {
  message?: string
}

export function ErrorPage({ message }: ErrorPageProps) {


  return (
    <PageWrapper>
      <div>{message}</div>
      {/* <Header /> */}
      {/* <div className="mt-[70px] flex flex-col items-center justify-center min-h-[calc(100vh-70px)] px-4">
        <div className="text-center text-white max-w-2xl"> */}
          {/* Icon */}
          {/* <div className="mb-8">
            <div className="mx-auto w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center">
              <MapPin className="w-12 h-12 text-gray-400" />
            </div>
          </div> */}

          {/* Main heading */}
          {/* <Heading className="mb-4">
            Location Not Found
          </Heading> */}

          {/* Subheading */}
          {/* <Subheading className="mb-8 text-gray-300">
            We couldn't identify a specific location from your description. 
            Try being more specific or use a different description.
          </Subheading> */}

          {/* Help text */}
          {/* <div className="mb-8 p-6 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Tips for better results:
                </h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• Include city and state/country (e.g., "Paris, France")</li>
                  <li>• Use well-known landmarks or nicknames</li>
                  <li>• Try alternative spellings or common names</li>
                  <li>• Be more specific about the location</li>
                </ul>
              </div>
            </div>
          </div> */}

          {/* Action button */}
          {/* <Button 
            // onClick={handleTryAgain}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
          >
            <Search className="w-5 h-5 mr-2" />
            Try Another Search
          </Button> */}
        {/* </div> */}
      {/* </div> */}
    </PageWrapper>
  )
}
