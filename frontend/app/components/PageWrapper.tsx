import { getBackgroundColors } from "../utils/getBackgroundColors"
import { usePlaceStore } from "../stores/placeStore"
import React, { useEffect, useState } from "react"

interface PageWrapperProps {
  children: React.ReactNode
}

export function PageWrapper({ children }: PageWrapperProps) {

  const { place } = usePlaceStore()
  const [backgroundColors, setBackgroundColors] = useState<string[]>([])

  useEffect(() => {
    if (place?.temperatureRangeCategory) {
      const colors = getBackgroundColors(place.temperatureRangeCategory)
      setBackgroundColors(colors)
    }
  }, [place])

  return (
    <div className="bg-black relative h-full w-full">
    <div className="fixed top-0 left-0 right-0 bottom-0 z-0 flex flex-col md:flex-row h-full w-full">
      {backgroundColors.map((color) => (
        <div key={color} className={`w-full h-full ${color}`}></div>
      ))}
    </div>
    <div className="absolute top-0 left-0 right-0 bottom-0 z-1 flex flex-col gap-4 p-4 justify-start items-center">
      {children}
      </div>
    </div>
  )
}