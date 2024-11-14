import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

/* eslint-disable */
if (!process.env.OPENWEATHER_API_KEY) {
  throw new Error('OPENWEATHER_API_KEY is not defined in environment variables')
}

const API_KEY = process.env.OPENWEATHER_API_KEY

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get('city')

  if (!city) {
    return NextResponse.json({ error: 'City parameter is required' }, { status: 400 })
  }

  try {
    // Get coordinates first
    const geoResponse = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
    )
    const geoData = await geoResponse.json()

    if (!geoData.length) {
      return NextResponse.json(
        { error: 'City not found' },
        { status: 404 }
      )
    }

    const { lat, lon } = geoData[0]

    // Get air quality data
    const airQualityResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    )
    const airQualityData = await airQualityResponse.json()

    // Process air quality data
    const getAqiDescription = (index: number) => {
      switch (index) {
        case 1: return 'Good'
        case 2: return 'Fair'
        case 3: return 'Moderate'
        case 4: return 'Poor'
        case 5: return 'Very Poor'
        default: return 'Unknown'
      }
    }

    const airQuality = {
      index: airQualityData.list[0].main.aqi,
      description: getAqiDescription(airQualityData.list[0].main.aqi),
      pollutants: {
        pm25: Math.round(airQualityData.list[0].components.pm2_5),
        pm10: Math.round(airQualityData.list[0].components.pm10),
        o3: Math.round(airQualityData.list[0].components.o3)
      }
    }

    // Get current weather
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
    )
    
    const weatherData = await weatherResponse.json()

    if (weatherData.cod !== 200) {
      return NextResponse.json(
        { error: weatherData.message || 'City not found' },
        { status: 404 }
      )
    }

    // Get 5 day forecast (includes 3-hour intervals)
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
    )
    
    const forecastData = await forecastResponse.json()

    // Process hourly forecast (next 24 hours)
    const hourlyForecasts = forecastData.list
      .slice(0, 8) // Get next 24 hours (3-hour intervals)
      .map((item: any) => ({
        time: new Date(item.dt * 1000).toLocaleTimeString([], { 
          hour: 'numeric',
          hour12: true 
        }),
        temp: Math.round(item.main.temp),
        icon: item.weather[0].icon,
        description: item.weather[0].description
      }))

    // Process daily forecast
    const dailyForecasts = forecastData.list
      .filter((_: any, index: number) => index % 8 === 0) // One reading per day
      .slice(0, 5) // Get 5 days
      .map((item: any) => ({
        date: new Date(item.dt * 1000).toLocaleDateString([], {
          weekday: 'long'
        }),
        temp: Math.round(item.main.temp),
        tempMin: Math.round(item.main.temp_min),
        tempMax: Math.round(item.main.temp_max),
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        humidity: item.main.humidity,
        windSpeed: Math.round(item.wind.speed * 10) / 10,
      }))

    const response = {
      current: {
        city: weatherData.name,
        country: weatherData.sys.country,
        description: weatherData.weather[0].description,
        icon: weatherData.weather[0].icon,
        temperature: Math.round(weatherData.main.temp),
        feelsLike: Math.round(weatherData.main.feels_like),
        humidity: weatherData.main.humidity,
        windSpeed: Math.round(weatherData.wind.speed * 10) / 10,
        pressure: weatherData.main.pressure,
        sunrise: weatherData.sys.sunrise,
        sunset: weatherData.sys.sunset,
        tempMin: Math.round(weatherData.main.temp_min),
        tempMax: Math.round(weatherData.main.temp_max),
        visibility: Math.round(weatherData.visibility / 1000),
        cloudiness: weatherData.clouds.all,
        lat: weatherData.coord.lat,
        lon: weatherData.coord.lon,
      },
      airQuality,
      hourly: hourlyForecasts,
      forecast: dailyForecasts,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Weather API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    )
  }
} 