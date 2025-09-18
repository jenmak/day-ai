import { useCreatePlace } from "../hooks/useCreatePlace"
import { Label } from "../../src/components/ui/label"
import { Image } from "../../src/components/ui/image"
const logoImage = "/images/drip-drop-city-logo.png"
import { SearchInput } from "../components/SearchInput"

export function Search() {
  const { createPlace, isLoading, error } = useCreatePlace()

  const handleSearch = (searchTerm: string) => {
    createPlace(searchTerm)
  }

  return (
    <div className="flex flex-col gap-4 p-9 justify-center items-center h-full container mx-auto md:max-w-[350px]">
      <Image 
        src={logoImage} 
        alt="Drip Drop City Logo" 
        className="w-48 h-48 mx-auto object-contain animate-cascade-title"
        loading="lazy"
      />
      <h1 className="text-hero font-heading text-white text-center mb-4 animate-cascade-subtitle">Drip Drop City</h1>
      <Label className="text-white text-center font-light mb-2 leading-6 animate-cascade-description">Describe your location and we'll recommend some weather appropriate outfits for the week.</Label>
      <div className="animate-cascade-input">
        <SearchInput onSearch={handleSearch} isLoading={isLoading} error={error} />
      </div>
    </div>
  )
}