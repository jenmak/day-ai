import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Weather } from "../../src/types/api"

export const WeatherCard = ({ weather }: { weather: Weather }) => {

  const isToday = weather.date === new Date().toISOString().split('T')[0]

  return (
    <Card className={`${isToday && 'outline outline-white' || ''} bg-transparent`}>
      <CardHeader>
        <CardTitle>{weather.date}</CardTitle>
      </CardHeader>
    </Card>
    // <div className="bg-card text-card-foreground flex flex-col gap-2 rounded-md border py-4 shadow-sm">
    //   <h1>{weather.date}</h1>
    //   <p>{weather.degreesFahrenheit}</p>
    //   <p>{weather.degreesCelsius}</p>
    //   <p>{weather.temperatureRange.temperatureMinimum}</p>
    //   <p>{weather.temperatureRange.temperatureMaximum}</p>
    // </div>
  )
}