import { CARD_HEIGHT_DESKTOP, CARD_HEIGHT_MOBILE, CARD_HEIGHT_TABLET, CARD_WIDTH_DESKTOP, CARD_WIDTH_DESKTOP_TODAY, CARD_WIDTH_MOBILE, CARD_WIDTH_TABLET } from "../consts/Card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../src/components/ui/card"
import { Weather } from "../../src/types/api"
import { getDate } from "../utils/getDate"
import { getDayOfWeek } from "../utils/getDayOfWeek"
import { getWeatherImage } from "../utils/getWeatherImage"
import { Image } from "../../src/components/ui/image"
import { getWeatherCondition } from "../utils/getWeatherCondition"

export const WeatherCard = ({ weather }: { weather: Weather }) => {

  const dayOfWeek = getDayOfWeek(weather.date)
  const isToday = dayOfWeek === 'Today'
  const cardWidth = `${isToday ? CARD_WIDTH_DESKTOP_TODAY : CARD_WIDTH_DESKTOP} ${CARD_WIDTH_TABLET} ${CARD_WIDTH_MOBILE}`
  const cardHeight = `${CARD_HEIGHT_DESKTOP} ${CARD_HEIGHT_TABLET} ${CARD_HEIGHT_MOBILE}`

  return (
    <div className={`${cardWidth} ${cardHeight}`}>
      <div className="rounded-full overflow-hidden bg-white/20 backdrop-blur-sm w-40 h-40 mb-6 mx-auto shadow-md">
        <Image src={getWeatherImage(weather.condition)} alt={`Weather condition ${weather.condition}`} />
      </div>
      <h2 className={`text-center text-2xl font-bold mb-4 text-white flex flex-row justify-between ${cardWidth}`}>
        {getWeatherCondition(weather.condition)}
        <div className="flex flex-row justify-center">
          <p className="font-body font-normal text-white/80">{weather.temperatureRange.temperatureMinimum}</p>
          <p className="font-body font-thin">/</p>
          <p className="font-body font-semibold text-white">{weather.temperatureRange.temperatureMaximum}°F</p>
        </div>
      </h2>
      <Card className={`relative text-black bg-white/60 backdrop-blur-sm rounded-lg shadow-md outline-none border-none overflow-hidden ${cardWidth} ${cardHeight}`}>
        <CardHeader className="relative text-black">
          <div className="absolute top-3 left-5 flex flex-col gap-4">
            <div className="flex flex-col items-start">
            <CardTitle className="font-medium font-body mb-1">{getDate(weather.date)}</CardTitle>
            <CardDescription className={`font-body font-normal text-black mb-2 ${isToday ? 'text-xl' : 'text-base'}`}>{dayOfWeek}</CardDescription>
            </div>
            <div className="flex flex-row items-center gap-2">
              <span className="relative bg-white/60 backdrop-blur-sm rounded-full p-2">
                <Image src="/images/weather/wind.png" alt="Wind speed" width={30} height={30} />
              </span>
              <p className="font-body font-normal text-black/80">{weather.windSpeedMph} mph</p>
            </div>
            <div className="flex flex-row items-center gap-2">
              <span className="relative bg-white/60 backdrop-blur-sm rounded-full p-2">
                <Image src="/images/weather/rain.png" alt="Percentage of rain" width={30} height={30} />
              </span>
              <p className="font-body font-normal text-black/80">{weather.rainProbabilityPercentage}%</p>
          </div>
          </div>
        </CardHeader>
        <CardContent className={`absolute bottom-4 right-2 text-black w-full z-20`}>
          <ul className="list-inside font-heading text-right">
            {weather.clothing.map((item: string) => (
              <li key={item} className="font-body text-black">{item}</li>
            ))}
          </ul>
        </CardContent>
        <span className="absolute bottom-[-100px] right-[-150px] w-[300px] h-[500px] bg-white/60 transform rotate-20 transform-origin-center z-10"></span>
      </Card> 
    </div>
  )
}