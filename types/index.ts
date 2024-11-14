export interface WeatherData {
  current: {
    city: string
    country: string
    description: string
    icon: string
    temperature: number
    feelsLike: number
    humidity: number
    windSpeed: number
    windDeg: number
    pressure: number
    sunrise: number
    sunset: number
    tempMin: number
    tempMax: number
    visibility: number
    cloudiness: number
    uvIndex: number
    precipitation: number
    moonPhase: number
    lat: number
    lon: number
  }
  airQuality: {
    index: number
    description: string
    pollutants: {
      pm25: number
      pm10: number
      o3: number
    }
  }
  alerts?: {
    type: string
    description: string
    severity: string
  }[]
  hourly: HourlyForecast[]
  forecast: ForecastData[]
}

export interface HourlyForecast {
  time: string
  temp: number
  icon: string
  description: string
}

export interface ForecastData {
  date: string
  temp: number
  tempMin: number
  tempMax: number
  description: string
  icon: string
  humidity: number
  windSpeed: number
} 