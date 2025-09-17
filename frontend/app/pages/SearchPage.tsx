import { useCreateLocation } from "../hooks/useCreateLocation"
import { Label } from "../../src/components/ui/label"
import { Image } from "../../src/components/ui/image"
import logoImage from "../images/drip-drop-city-logo.png"
import { SearchInput } from "../components/SearchInput"

export function Search() {
  const { createLocation, isLoading, error } = useCreateLocation()

  const handleSearch = (searchTerm: string) => {
    createLocation(searchTerm)
  }

  return (
    <div className="flex flex-col gap-4 p-9 justify-center items-center h-full container mx-auto md:max-w-[350px]">
      <Image 
        src={logoImage} 
        alt="Drip Drop City Logo" 
        className="w-48 h-48 mx-auto object-contain"
        loading="lazy"
      />
      <h1 className="text-hero font-heading text-white text-center mb-4">Drip Drop City</h1>
      <Label className="text-white text-center font-light mb-2 leading-6">Describe your location and we'll recommend some weather appropriate outfits for the week.</Label>
      <SearchInput onSearch={handleSearch} isLoading={isLoading} />
      {/* TODO: style error message:
        {error && (
        <div className="text-red-500 text-sm text-center">
          Error: {error.message || "Failed to find location"}
        </div>
      )} */}
    </div>
  )
}