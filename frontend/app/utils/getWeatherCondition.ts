import { WEATHER_IMAGE_MAP } from "../consts/Temperature"
import { toCapitalCase } from "./toCapitalCase"

export const getWeatherCondition = (condition: number) => {
  return toCapitalCase(WEATHER_IMAGE_MAP[condition].replace("-", " "))
}