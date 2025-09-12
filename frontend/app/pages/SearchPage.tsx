import { Input } from "@/components/ui/input"
import { useCreateLocation } from "../hooks/useCreateLocation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"

export function Search() {
  const [search, setSearch] = useState("")

  const { createLocation, isLoading, error } = useCreateLocation({
    onSuccess: (location) => {
      console.log("Location decoded and saved:", location)
    },
    onError: (error) => {
      console.error("Failed to decode location:", error)
    }
  })

  const handleSearch = () => {
    if (search.trim()) {
      createLocation(search.trim())
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  // Phase II:
  // useLocations({
  //   onSuccess: (data) => {
  //     console.log("Locations fetched successfully", data)
  //     setLocations(data)
  //   },
  //   onError: (error) => {
  //     console.error("Error fetching locations", error)
  //   }
  // })

  return (
    <div className="flex flex-col gap-4 p-4 justify-center items-center">
      <div className="flex flex-row gap-2 w-full min-w-[300px]">
         <Input
           placeholder="ie. Gotham City"
           value={search}
           onChange={(e) => setSearch(e.target.value)}
           onKeyPress={handleKeyPress}
         />
         <Button onClick={handleSearch} disabled={isLoading || !search.trim()}>
           <ChevronRight className="h-4 w-4" />
           <span className="sr-only">Search</span>
         </Button>
      </div>
      
      {error && (
        <div className="text-red-500 text-sm text-center">
          Error: {error.message || "Failed to decode location"}
        </div>
      )}
      
      {isLoading && (
        <div className="text-gray-500 text-sm text-center flex flex-row gap-2 items-center">
          <Spinner />
          Decoding location...
        </div>
      )}
       {/* {
        locations.map((location) => (
          <div key={location.locationId}>
            <Link to={`/${location.normalizedLocation}`}>
              {location.normalizedLocation}
            </Link>
          </div>
        ))
       } */}
    </div>
  )
}