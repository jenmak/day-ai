import { CARD_HEIGHT_DESKTOP, CARD_HEIGHT_MOBILE, CARD_HEIGHT_TABLET, CARD_WIDTH_DESKTOP, CARD_WIDTH_DESKTOP_TODAY, CARD_WIDTH_MOBILE, CARD_WIDTH_TABLET } from "../consts/Card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../src/components/ui/card"
import { Weather } from "../../src/types/api"
import { getDate } from "../utils/getDate"
import { getDayOfWeek } from "../utils/getDayOfWeek"
import { getWeatherImage } from "../utils/getWeatherImage"
import { Image } from "../../src/components/ui/image"

export const WeatherCard = ({ weather }: { weather: Weather }) => {

  const dayOfWeek = getDayOfWeek(weather.date)
  const isToday = dayOfWeek === 'Today'

  return (
    <Card className={`${isToday && 'outline outline-white outline-2' || 'outline-none'} text-white bg-white/30 backdrop-blur-sm
      ${isToday ? CARD_WIDTH_DESKTOP_TODAY : CARD_WIDTH_DESKTOP} ${CARD_HEIGHT_DESKTOP} ${CARD_WIDTH_TABLET} ${CARD_HEIGHT_TABLET} ${CARD_WIDTH_MOBILE} ${CARD_HEIGHT_MOBILE}`}>
      <CardHeader>
        <CardTitle className="font-body font-thin">{getDate(weather.date)}</CardTitle>
        <CardDescription className="font-body font-thin text-white">{dayOfWeek}</CardDescription>
        <CardContent>
          <Image src={getWeatherImage(weather.condition)} alt={`Weather condition ${weather.condition}`} />
          <div className="flex flex-row gap-2">
            <p className="font-body font-thin text-white/80">{weather.temperatureRange.temperatureMinimum}°F</p>
            <p className="font-body font-thin text-white">{weather.temperatureRange.temperatureMaximum}°F</p>
          </div>
          <div>
            <p className="font-body font-thin text-white/80">{weather.rainProbabilityPercentage}% Rain</p>
            <p className="font-body font-thin text-white/80">{weather.windSpeedMph} mph Wind</p>
          </div>
          <div>
            <p className="font-body font-thin text-white/80">{weather.clothing.join(", ")}</p>
          </div>
        </CardContent>
      </CardHeader>
    </Card> 
  )
}