import { WeatherService } from "../services/weatherService"
import { Weather } from "../types"

// Test the weather service with New York City coordinates
export async function testWeatherService() {
  console.log("=== Weather Service Test ===\n")

  try {
    // Test coordinates for New York City
    const latitude = 40.7128
    const longitude = -74.006

    console.log(`Testing weather service for coordinates: ${latitude}, ${longitude}`)
    console.log("Fetching 7-day forecast...\n")

    const forecast = await WeatherService.get7DayForecast({
      latitude,
      longitude
    })

    console.log(`✅ Successfully fetched ${forecast.length} days of weather data:\n`)

    forecast.forEach((weather: Weather, index: number) => {
      const date = new Date(weather.date)
      const dayName = date.toLocaleDateString("en-US", { weekday: "long" })
      const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" })

      console.log(`${index === 0 ? "Today" : dayName} (${dateStr}):`)
      console.log(`  Temperature: ${weather.degreesFahrenheit}°F`)
      console.log(
        `  Range: ${weather.temperatureRange.temperatureMinimum}°F - ${weather.temperatureRange.temperatureMaximum}°F`
      )
      console.log(`  Condition: ${weather.condition}`)
      console.log(`  Rain Probability: ${weather.rainProbabilityPercentage}%`)
      console.log(`  Wind Speed: ${weather.windSpeedMph} mph`)
      console.log("")
    })

    // Test current day weather
    console.log("Testing current day weather...")
    const todayWeather = await WeatherService.getCurrentDayWeather(latitude, longitude)
    console.log(
      `✅ Today's weather: ${todayWeather.degreesFahrenheit}°F, ${todayWeather.condition}`
    )
  } catch (error) {
    console.error("❌ Weather service test failed:", error)
  }
}

// Test with different coordinates
export async function testWeatherServiceMultipleLocations() {
  console.log("=== Weather Service Multiple Locations Test ===\n")

  const testLocations = [
    { name: "New York City", lat: 40.7128, lon: -74.006 },
    { name: "Los Angeles", lat: 34.0522, lon: -118.2437 },
    { name: "London", lat: 51.5074, lon: -0.1278 },
    { name: "Tokyo", lat: 35.6762, lon: 139.6503 }
  ]

  for (const location of testLocations) {
    try {
      console.log(`Testing ${location.name} (${location.lat}, ${location.lon})...`)
      const weather = await WeatherService.getCurrentDayWeather(location.lat, location.lon)
      console.log(`✅ ${location.name}: ${weather.degreesFahrenheit}°F, ${weather.condition}`)
    } catch (error) {
      console.error(
        `❌ ${location.name}: ${error instanceof Error ? error.message : "Unknown error"}`
      )
    }
  }
}

// Uncomment to run the tests
// testWeatherService()
// testWeatherServiceMultipleLocations()
