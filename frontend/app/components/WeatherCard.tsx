import { CARD_HEIGHT_DESKTOP, CARD_HEIGHT_MOBILE, CARD_HEIGHT_TABLET, CARD_WIDTH_DESKTOP, CARD_WIDTH_DESKTOP_TODAY, CARD_WIDTH_MOBILE, CARD_WIDTH_TABLET } from "../consts/Card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./shadcn/card"
import { Weather } from "../../src/types/api"
import { getDate } from "../utils/getDate"
import { getDayOfWeek } from "../utils/getDayOfWeek"
import { getWeatherImage } from "../utils/getWeatherImage"
import { Image } from "./shadcn/image"
import { getWeatherCondition } from "../utils/getWeatherCondition"

export const WeatherCard = ({ weather }: { weather: Weather }) => {

  const dayOfWeek = getDayOfWeek(weather.date)
  const isToday = dayOfWeek === 'Today'
  const cardWidth = `${isToday ? CARD_WIDTH_DESKTOP_TODAY : CARD_WIDTH_DESKTOP} ${CARD_WIDTH_TABLET} ${CARD_WIDTH_MOBILE}`
  const cardHeight = `${CARD_HEIGHT_DESKTOP} ${CARD_HEIGHT_TABLET} ${CARD_HEIGHT_MOBILE}`

  return (
    <div className={`${cardWidth}`}>
      <div className="relative mb-6 mx-auto w-40 h-40">
        {/* Main weather condition icon */}
        <div className="rounded-full overflow-hidden bg-white/20 backdrop-blur-sm w-40 h-40 shadow-md z-30 relative">
          <Image src={getWeatherImage(weather.condition)} alt={`Weather condition ${weather.condition}`} />
        </div>
        {/* Layered circles coming down from weather icon */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-white/15 rounded-full z-20"></div>
        <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-white/10 rounded-full z-10"></div>
      </div>
      <h2 className={`text-center text-2xl font-bold mb-4 text-white flex flex-row justify-between ${cardWidth}`}>
        <span className="truncate flex-1 text-left">{getWeatherCondition(weather.condition)}</span>
        <div className="flex flex-row justify-center flex-shrink-0 ml-4">
          <p className="font-body font-normal text-white/80">{weather.temperatureRange.temperatureMinimum}</p>
          <p className="font-body font-thin">/</p>
          <p className="font-body font-semibold text-white">{weather.temperatureRange.temperatureMaximum}°F</p>
        </div>
      </h2>
      <Card className={`relative text-black bg-white/60 backdrop-blur-sm rounded-lg shadow-md outline-none border-none overflow-hidden ${cardWidth} ${cardHeight}`}>
        <CardHeader className="relative text-black z-20">
          <div className="absolute top-3 left-5 flex flex-col gap-4">
            <div className="flex flex-col items-start">
            <CardTitle className="font-light font-body mb-1">{getDate(weather.date)}</CardTitle>
            <CardDescription className={`font-heading font-medium text-black mb-2 ${isToday ? 'text-3xl' : 'text-2xl'}`}>{dayOfWeek}</CardDescription>
            </div>
            <div className="flex flex-row items-center gap-2">
              <span className="relative bg-white/60 backdrop-blur-sm rounded-full p-2">
                <Image src="/images/weather/wind.png" alt="Wind speed" width={30} height={30} />
              </span>
              <p className="font-body font-light text-black/80">{weather.windSpeedMph} mph</p>
            </div>
            <div className="flex flex-row items-center gap-2">
              <span className="relative bg-white/60 backdrop-blur-sm rounded-full p-2">
                <Image src="/images/weather/rain.png" alt="Percentage of rain" width={30} height={30} />
              </span>
              <p className="font-body font-normal text-black/80">{weather.rainProbabilityPercentage}% rain</p>
          </div>
          </div>
        </CardHeader>
        <CardContent className={`absolute bottom-4 right-2 text-black w-full z-20`}>
          <ul className="list-inside font-heading text-right">
            {weather.clothing.map((item: string) => (
              <li key={item} className="font-heading font-light text-black">{item}</li>
            ))}
          </ul>
        </CardContent>
        <span className="absolute bottom-[-100px] right-[-225px] w-[300px] h-[500px] bg-white/60 transform rotate-20 transform-origin-center z-10"></span>
      </Card> 
    </div>
  )
}