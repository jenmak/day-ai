import { CARD_HEIGHT_DESKTOP, CARD_HEIGHT_MOBILE, CARD_HEIGHT_TABLET, CARD_WIDTH_DESKTOP, CARD_WIDTH_MOBILE, CARD_WIDTH_TABLET } from "../consts/Card"
import { Card, CardDescription, CardHeader, CardTitle } from "../../src/components/ui/card"
import { Weather } from "../../src/types/api"
import { getDate } from "../utils/getDate"
import { getDayOfWeek } from "../utils/getDayOfWeek"

export const WeatherCard = ({ weather }: { weather: Weather }) => {

  const isToday = weather.date === new Date().toISOString().split('T')[0]

  return (
    <Card className={`${isToday && 'outline outline-white' || ''} bg-transparent text-white
      ${CARD_WIDTH_DESKTOP} ${CARD_HEIGHT_DESKTOP} ${CARD_WIDTH_TABLET} ${CARD_HEIGHT_TABLET} ${CARD_WIDTH_MOBILE} ${CARD_HEIGHT_MOBILE}`}>
      <CardHeader>
        <CardTitle className="font-body font-thin">{getDate(weather.date)}</CardTitle>
        <CardDescription>{getDayOfWeek(weather.date)}</CardDescription>
      </CardHeader>
    </Card> 
    // <div className="bg-card text-card-foreground flex flex-col gap-2 rounded-md border py-4 shadow-sm">
    //   <h1>{weather.date}</h1>
    //   <p>{weather.degreesFahrenheit}</p>
    //   <p>{weather.degreesCelsius}</p>
    //   <p>{weather.temperatureRange.temperatureMinimum}</p>
    //   <p>{weather.temperatureRange.temperatureMaximum}</p>
    // </div>

      // {/* <div className="text-white">
      //   {location.weather?.temperatureRange.temperatureMinimum}
      //   {location.weather.temperatureRange.temperatureMaximum}
      //   {location.weather?.rainProbabilityPercentage}
      //   {location.weather?.windSpeedMph}
      //   {location.weather?.clothing.join(", ")}
      // </div> */}

      // {/* <h1 className="text-title font-heading">{location.normalizedLocation}</h1>
      // <p className="font-body">{location.description}</p>
      // <p>Coordinates: {location.geocodedAddress.latitude}, {location.geocodedAddress.longitude}</p>
      // <p>Address: {location.geocodedAddress.structuredAddress.city}, {location.geocodedAddress.structuredAddress.state} {location.geocodedAddress.structuredAddress.postalCode}</p>
      // <p>Country: {location.geocodedAddress.structuredAddress.country}</p>
      // <p>Weather: {location.weather?.map((weather: Weather) => weather.condition).join(", ")}</p>
      // <p>Weather: {location.weather?.map((weather: Weather) => weather.degreesFahrenheit).join(", ")}</p>
      // <p>Weather: {location.weather?.map((weather: Weather) => weather.degreesCelsius).join(", ")}</p>
      // <p>Weather: {location.weather?.map((weather: Weather) => weather.temperatureRange.temperatureMinimum).join(", ")}</p>
      // <p>Weather: {location.weather?.map((weather: Weather) => weather.temperatureRange.temperatureMaximum).join(", ")}</p>
      // <p>Weather: {location.weather?.map((weather: Weather) => weather.rainProbabilityPercentage).join(", ")}</p>
      // <p>Weather: {location.weather?.map((weather: Weather) => weather.windSpeedMph).join(", ")}</p>
      // <p>Weather: {location.weather?.map((weather: Weather) => weather.clothing.join(", ")).join(", ")}</p>
      // </div> */}
  )
}