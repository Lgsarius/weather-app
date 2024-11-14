export const getUVIndexColor = (uv: number): string => {
  if (uv <= 2) return 'text-green-400'
  if (uv <= 5) return 'text-yellow-400'
  if (uv <= 7) return 'text-orange-400'
  if (uv <= 10) return 'text-red-400'
  return 'text-purple-400'
}

export const getUVWarning = (uv: number): string => {
  if (uv <= 2) return 'Low'
  if (uv <= 5) return 'Moderate'
  if (uv <= 7) return 'High'
  if (uv <= 10) return 'Very High'
  return 'Extreme'
}

export const getMoonPhaseName = (phase: number): string => {
  if (phase === 0 || phase === 1) return 'New Moon'
  if (phase < 0.25) return 'Waxing Crescent'
  if (phase === 0.25) return 'First Quarter'
  if (phase < 0.5) return 'Waxing Gibbous'
  if (phase === 0.5) return 'Full Moon'
  if (phase < 0.75) return 'Waning Gibbous'
  if (phase === 0.75) return 'Last Quarter'
  return 'Waning Crescent'
}

export const getWindDirection = (deg: number) => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
                     'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  return directions[Math.round(deg / 22.5) % 16]
}

export const getComfortLevel = (temp: number, humidity: number) => {
  // Simplified comfort calculation
  const comfortScore = (temp - 20) * 2 + (humidity - 50) / 2
  return Math.max(0, Math.min(100, 50 + comfortScore))
}

export const getComfortDescription = (temp: number, humidity: number) => {
  const score = getComfortLevel(temp, humidity)
  if (score < 30) return 'Cool'
  if (score < 45) return 'Comfortable'
  if (score < 60) return 'Warm'
  return 'Hot'
}

export const formatTime = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
} 