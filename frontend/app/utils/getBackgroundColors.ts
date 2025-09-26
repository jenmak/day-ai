import { TemperatureRangeCategory } from "../consts/Temperature"

export const getBackgroundColors = (
  temperatureRangeCategory: (typeof TemperatureRangeCategory)[keyof typeof TemperatureRangeCategory]
) => {
  console.log("getBackgroundColors: Getting colors for", temperatureRangeCategory)

  switch (temperatureRangeCategory) {
    case TemperatureRangeCategory.VERY_HOT:
    case TemperatureRangeCategory.HOT:
    case TemperatureRangeCategory.WARM:
      return [
        "bg-[#f3b700]", // hot-amber
        "bg-[#faa300]", // hot-orange
        "bg-[#e57c04]", // hot-fulvous
        "bg-[#ff6201]", // hot-pantone-orange
        "bg-[#f63e02]" // hot-coquelicot
      ]
    case TemperatureRangeCategory.MILD:
    case TemperatureRangeCategory.COOL:
      return [
        "bg-[#73fbd3]", // cool-aquamarine
        "bg-[#44e5e7]", // cool-cyan
        "bg-[#59d2fe]", // cool-skyblue
        "bg-[#4a8fe7]", // cool-blue
        "bg-[#5c7aff]" // cool-crayola-blue
      ]
    case TemperatureRangeCategory.COLD:
    case TemperatureRangeCategory.VERY_COLD:
      return [
        "bg-[#a682ff]", // cold-indigo
        "bg-[#715aff]", // cold-slate-blue
        "bg-[#5887ff]", // cold-cornflower-blue
        "bg-[#55c1ff]", // cold-maya-blue
        "bg-[#102e4a]" // cold-prussian-blue
      ]
    default:
      console.warn("getBackgroundColors: Unknown temperature category", temperatureRangeCategory)
      return [
        "bg-[#f8f9fa]", // gray-1
        "bg-[#dee2e6]", // gray-2
        "bg-[#adb5bd]", // gray-3
        "bg-[#495057]", // gray-4
        "bg-[#212529]" // gray-5
      ]
  }
}
