import { WEATHER_IMAGE_MAP } from "../consts/Temperature"

export const getWeatherImage = (condition: number) => {
  const imageName = WEATHER_IMAGE_MAP[condition] || "clear-sky"
  return `./images/weather/${imageName}.png`
}