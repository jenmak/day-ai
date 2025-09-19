import { getBackgroundColors } from "../utils/getBackgroundColors"
import { usePlaceStore } from "../stores/placeStore"
import React, { useEffect, useState } from "react"

interface PageWrapperProps {
  children: React.ReactNode
}

export function PageWrapper({ children }: PageWrapperProps) {
  const { place } = usePlaceStore()

  const initialBackgroundColors = ["bg-[var(--color-gray-1)]", "bg-[var(--color-gray-2)]", "bg-[var(--color-gray-3)]", "bg-[var(--color-gray-4)]", "bg-[var(--color-gray-5)]"]
  const [backgroundColors, setBackgroundColors] = useState<string[]>(initialBackgroundColors)

  useEffect(() => {
    if (place?.temperatureRangeCategory) {
      const colors = getBackgroundColors(place.temperatureRangeCategory)
      setBackgroundColors(colors)
    }
  }, [place])

  return (
    <div className="bg-black relative h-full w-full">
    <div className="fixed top-0 left-0 right-0 bottom-0 z-0 flex flex-col md:flex-row h-full w-full animate-background-transition">
      {backgroundColors.map((color, index) => (
        <div key={`${color}-${index}`} className={`w-full h-full ${color} transition-colors duration-500`}></div>
      ))}
    </div>
    <div className="absolute top-0 left-0 right-0 bottom-0 z-1 p-4">
      {children}
      </div>
    </div>
  )
}