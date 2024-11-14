'use client'

import { useState, useEffect } from 'react'
import WeatherCard from '@/components/WeatherCard'
import SearchBar from '@/components/SearchBar'
import { WeatherData } from '@/types'
import { motion } from 'framer-motion'
import { getWeatherBackground } from '@/utils/weatherBackgrounds'
import { WiThermometer } from "react-icons/wi"

export default function Home() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(true)

  const handleSearch = async (city: string) => {
    setLoading(true)
    setError(null)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://your-api-domain.com'
      const res = await fetch(`${apiUrl}/api/weather?city=${encodeURIComponent(city)}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to fetch weather data')
      setWeather(data)
      setIsSearchOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data')
    } finally {
      setLoading(false)
    }
  }

  const handleLocationSearch = async (lat: number, lon: number) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `/api/weather/location?lat=${lat}&lon=${lon}`
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to fetch weather data')
      setWeather(data)
      setIsSearchOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const background = weather 
    ? getWeatherBackground(
        weather.current.icon,
        weather.current.sunrise,
        weather.current.sunset
      )
    : {
        backgroundClasses: 'bg-gradient-to-b',
        gradientColors: 'from-orange-400 via-amber-300 to-yellow-400',
        weatherEffect: 'sunshine'
      }; // default sunrise background

  return (
    <main className="fixed inset-0 bg-black">
      <div className="h-full flex flex-col">
        {/* iOS-Optimized Top Bar */}
        <div className="safe-top bg-transparent px-4 z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between pt-2"
          >
            {/* Left side - Logo */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center"
            >
              {/* Animated Icon */}
              <motion.div
                initial={{ rotate: -20 }}
                animate={{ 
                  rotate: 0,
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  duration: 1,
                  repeat: Infinity,
                  repeatDelay: 5
                }}
                className="text-white/90"
              >
                <WiThermometer className="w-8 h-8" />
              </motion.div>
              
              {/* App Name with Gradient */}
              <h1 className="text-xl font-medium ml-1">
                <span className="bg-clip-text text-transparent bg-gradient-to-r 
                               from-white to-white/80">
                  Celsius
                </span>
              </h1>
            </motion.div>

            {/* Optional: Right side - You could add settings or other icons here */}
            <div className="w-8" /> {/* Spacer for balance */}
          </motion.div>
        </div>

        {/* Main Content Area - adjusted top padding */}
        <div className="flex-1 relative overflow-hidden pt-2">
          {/* Search Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: isSearchOpen ? 0 : "100%" }}
            transition={{ type: "spring", damping: 30 }}
            style={{ 
              background: 'rgba(22, 22, 23, 0.9)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)'
            }}
            className="absolute inset-x-0 top-0 h-full rounded-t-3xl overflow-hidden z-20"
          >
            <div className="px-4 pt-8 pb-4 space-y-6">
              <h2 className="text-2xl font-semibold text-white text-center">
                Search Location
              </h2>
              <SearchBar 
                onSearch={handleSearch} 
                onLocationSearch={handleLocationSearch}
              />
              {error && (
                <p className="text-red-500 text-center mt-4">{error}</p>
              )}
              {loading && (
                <div className="flex justify-center mt-4">
                  <div className="w-6 h-6 border-2 border-white/20 border-t-white/80 
                               rounded-full animate-spin" />
                </div>
              )}
            </div>
          </motion.div>

          {/* Weather Content Sheet */}
          {weather && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: isSearchOpen ? "100%" : 0 }}
              transition={{ type: "spring", damping: 30 }}
              className={`absolute inset-x-0 top-0 h-full rounded-t-3xl 
                        overflow-hidden z-10`}
            >
              {/* Background Container */}
              <div className={`absolute inset-0 weather-container
                            ${background.backgroundClasses} 
                            ${background.gradientColors}
                            ${background.weatherEffect}`} />
              
              {/* Content */}
              <div className="relative h-full">
                {/* Pull Indicator */}
                <div className="sticky top-0 pt-3 pb-2 z-10">
                  <div 
                    className="w-12 h-1 bg-white/20 rounded-full mx-auto cursor-pointer"
                    onClick={() => setIsSearchOpen(true)}
                  />
                </div>

                {/* Weather Content */}
                <div className="h-full overflow-y-auto">
                  <div className="px-4 pb-safe">
                    <WeatherCard weather={weather} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  )
} 