import { SearchInput } from "../components/SearchInput"
import { Image } from "../components/shadcn/image"
import { Label } from "../components/shadcn/label"
import { useCreatePlace } from "../hooks/useCreatePlace"
const logoImage = "/images/drip-drop-city-logo.png"

export function Search() {
  const RING_BACKGROUND_COLOR = "black"
  const TEXT_COLOR = "white"
  const BACKGROUND_COLOR = "black"
  const PLACEHOLDER_COLOR = "white"

  const { createPlace, isLoading, error } = useCreatePlace()

  const handleSearch = (searchTerm: string) => {
    createPlace(searchTerm)
  }

  return (
    <div className="bg-[var(--color-black)] min-h-screen w-full">
      <div className="flex flex-col h-screen gap-4 p-9 justify-center items-center h-full container mx-auto md:max-w-[400px]">
        <Image
          src={logoImage}
          alt="Drip Drop City Logo"
          className="w-48 h-48 mx-auto object-contain animate-cascade-logo"
          loading="eager"
        />
        <h1 className="text-hero font-heading text-white text-center mb-4 animate-cascade-title">
          Drip Drop City
        </h1>
        <Label
          className="text-white text-center font-light mb-2 leading-6
          animate-cascade-description font-body"
        >
          {/* eslint-disable-next-line max-len */}
          Enter your location or it's description and we&apos;ll recommend some weather appropriate outfits for the
          week.
        </Label>
        <div className="animate-cascade-input">
          <SearchInput
            className="w-[275px]"
            ringBackgroundColor={RING_BACKGROUND_COLOR}
            backgroundColor={BACKGROUND_COLOR}
            textColor={TEXT_COLOR}
            placeholderColor={PLACEHOLDER_COLOR}
            placeholder="ie. NYC, 11385 or Gotham City"
            onSearch={handleSearch}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
    </div>
  )
}
