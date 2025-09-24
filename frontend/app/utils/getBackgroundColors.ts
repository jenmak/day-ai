import { TemperatureRangeCategory } from "../consts/Temperature"

export const getBackgroundColors = (
  temperatureRangeCategory: (typeof TemperatureRangeCategory)[keyof typeof TemperatureRangeCategory]
) => {
  switch (temperatureRangeCategory) {
    case TemperatureRangeCategory.VERY_HOT:
    case TemperatureRangeCategory.HOT:
    case TemperatureRangeCategory.WARM:
      return [
        "bg-[var(--color-hot-1)]",
        "bg-[var(--color-hot-2)]",
        "bg-[var(--color-hot-3)]",
        "bg-[var(--color-hot-4)]",
        "bg-[var(--color-hot-5)]"
      ]
    case TemperatureRangeCategory.MILD:
    case TemperatureRangeCategory.COOL:
      return [
        "bg-[var(--color-cool-1)]",
        "bg-[var(--color-cool-2)]",
        "bg-[var(--color-cool-3)]",
        "bg-[var(--color-cool-4)]",
        "bg-[var(--color-cool-5)]"
      ]
    case TemperatureRangeCategory.COLD:
    case TemperatureRangeCategory.VERY_COLD:
      return [
        "bg-[var(--color-cold-1)]",
        "bg-[var(--color-cold-2)]",
        "bg-[var(--color-cold-3)]",
        "bg-[var(--color-cold-4)]",
        "bg-[var(--color-cold-5)]"
      ]
  }
}
