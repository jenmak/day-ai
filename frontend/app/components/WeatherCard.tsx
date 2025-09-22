import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./shadcn/card"
import { Weather } from "../../src/types/api"
import { getDate } from "../utils/getDate"
import { getDayOfWeek } from "../utils/getDayOfWeek"
import { getWeatherImage } from "../utils/getWeatherImage"
import { Image } from "./shadcn/image"
import { getWeatherCondition } from "../utils/getWeatherCondition"

export const WeatherCard = ({ weather }: { weather: Weather }) => {

  const dayOfWeek = getDayOfWeek(weather.date)

  return (
    <div className="weather">
      {/* Main weather condition icon */}
      <div className="relative mb-6 mx-auto w-20 h-20 md:w-40 md:h-40">
        <div className="rounded-full overflow-hidden bg-white/20 backdrop-blur-sm w-20 h-20 md:w-40 md:h-40 shadow-md z-30 relative">
          <Image src={getWeatherImage(weather.condition)} alt={`Weather condition ${weather.condition}`} />
        </div>
      </div>
      {/* Weather condition and temperature */}
      <h2 className={`text-center text-lg md:text-2xl font-bold mb-4 text-white flex flex-row justify-between weather`}>
        <span className="truncate flex-1 text-left">{getWeatherCondition(weather.condition)}</span>
        <div className="flex flex-row justify-center flex-shrink-0 ml-4">
          <p className="font-body font-normal text-white/80">{weather.temperatureRange.temperatureMinimum}</p>
          <p className="font-body font-thin">/</p>
          <p className="font-body font-semibold text-white">{weather.temperatureRange.temperatureMaximum}°F</p>
        </div>
      </h2>
      {/* Weather card */}
      <Card className={`relative text-black bg-white/60 backdrop-blur-sm rounded-lg shadow-md outline-none border-none overflow-hidden weather-card`}>
        <CardHeader className="relative text-black z-20">
          <div className="absolute top-0 left-3 md:top-3 md:left-5 flex flex-col gap-4">
            <div className="flex flex-col items-start">
            <CardTitle className="font-light font-sm md:font-body mb-1">{getDate(weather.date)}</CardTitle>
            <CardDescription className={`font-heading font-medium text-black mb-2 text-xl md:text-2xl`}>{dayOfWeek}</CardDescription>
            </div>
            <div className="flex flex-row items-center gap-2">
              <span className="relative bg-white/60 backdrop-blur-sm rounded-full p-2">
                <Image src="/images/weather/wind.png" alt="Wind speed" className="w-5 h-5 md:w-9 md:h-9" />
              </span>
              <p className="font-body font-light text-black/80 text-sm md:text-base">{weather.windSpeedMph} mph</p>
            </div>
            <div className="flex flex-row items-center gap-2">
              <span className="relative bg-white/60 backdrop-blur-sm rounded-full p-2">
                <Image src="/images/weather/rain.png" alt="Percentage of rain" className="w-5 h-5 md:w-9 md:h-9" />
              </span>
              <p className="font-body font-light text-black/80 text-sm md:text-base">{weather.rainProbabilityPercentage}% rain</p>
          </div>
          </div>
        </CardHeader>
        <CardContent className={`absolute bottom-4 right-0 text-black w-full z-20`}>
          <ul className="list-inside text-right">
            {weather.clothing.map((item: string) => (
              <li key={item} className="font-heading font-light text-black">{item}</li>
            ))}
          </ul>
        </CardContent>
        <span className="absolute bottom-[-100px] right-[-190px] md:right-[-180px] w-[300px] h-[500px] bg-white/60 transform rotate-20 transform-origin-center z-10"></span>
      </Card> 
    </div>
  )
}