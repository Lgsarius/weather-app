/* eslint-disable */
import { WeatherData } from '@/types'
import { motion } from 'framer-motion'
import { getWeatherBackground } from '@/utils/weatherBackgrounds'
import { 
  getMoonPhaseName, 
  getWindDirection,
} from '@/utils/weatherUtils'
import { useState } from 'react'
import { 
  WiSunrise, 
  WiSunset, 
  WiWindDeg,
  WiThermometer,
  WiHumidity,
  WiMoonNew,
  WiMoonWaxingCrescent3,
  WiMoonFirstQuarter,
  WiMoonWaxingGibbous3,
  WiMoonFull,
  WiMoonWaningGibbous3,
  WiMoonThirdQuarter,
  WiMoonWaningCrescent3
} from "react-icons/wi"
import { IoWarning, IoHeart, IoHeartOutline, IoSunnyOutline } from "react-icons/io5"
import SunPosition from './SunPosition'
import dynamic from 'next/dynamic'
import AirQualityIndicator from './AirQualityIndicator'

const WeatherMap = dynamic(() => import('./WeatherMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] bg-white/10 rounded-xl flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
    </div>
  )
})

const getMoonPhaseIcon = (phase: number) => {
  if (phase === 0 || phase === 1) return WiMoonNew
  if (phase < 0.25) return WiMoonWaxingCrescent3
  if (phase === 0.25) return WiMoonFirstQuarter
  if (phase < 0.5) return WiMoonWaxingGibbous3
  if (phase === 0.5) return WiMoonFull
  if (phase < 0.75) return WiMoonWaningGibbous3
  if (phase === 0.75) return WiMoonThirdQuarter
  return WiMoonWaningCrescent3
}

export default function WeatherCard({ weather }: { weather: WeatherData }) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [showMap, setShowMap] = useState(false)

  const background = getWeatherBackground(
    weather.current.icon,
    weather.current.sunrise,
    weather.current.sunset
  )

  const toggleFavorite = () => setIsFavorite(!isFavorite)

  const weatherDetails = [
    {
      icon: WiThermometer,
      label: "Feels Like",
      value: `${weather.current.feelsLike}°`,
    },
    {
      icon: WiHumidity,
      label: "Humidity",
      value: `${weather.current.humidity}%`,
    },
    {
      icon: WiWindDeg,
      label: "Wind",
      value: `${weather.current.windSpeed} m/s`,
      subValue: getWindDirection(weather.current.windDeg),
      rotate: weather.current.windDeg,
    },
    {
      CustomIcon: getMoonPhaseIcon(weather.current.moonPhase),
      label: "Moon Phase",
      value: getMoonPhaseName(weather.current.moonPhase),
    },
  ]

  return (
    <div className="space-y-6 pb-8">
      {/* Current Weather Card with animated background */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl"
      >
        {/* Animated Background */}
        <div className={`absolute inset-0 weather-container
                      ${background.backgroundClasses} 
                      ${background.gradientColors}
                      ${background.weatherEffect}`} 
        />

        {/* Content with glass effect */}
        <div className="relative p-6">
          {/* Favorite Button */}
          <button
            onClick={toggleFavorite}
            className="absolute top-4 right-4 z-10"
          >
            {isFavorite ? (
              <IoHeart className="w-6 h-6 text-red-500" />
            ) : (
              <IoHeartOutline className="w-6 h-6 text-white/60" />
            )}
          </button>

          {/* Location */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-white">
              {weather.current.city}
            </h2>
            <p className="text-white/70">
              {weather.current.country}
            </p>
          </div>

          {/* Temperature and Icon */}
          <div className="flex justify-center items-center mb-6">
            <span className="text-6xl font-light text-white">
              {weather.current.temperature}°
            </span>
            <img
              src={`https://openweathermap.org/img/wn/${weather.current.icon}@2x.png`}
              alt={weather.current.description}
              className="w-20 h-20"
            />
          </div>

          {/* Weather Description */}
          <p className="text-center text-white/90 capitalize">
            {weather.current.description}
          </p>
        </div>
      </motion.div>

      {/* Weather Alerts */}
      {weather.alerts && weather.alerts.map((alert, index) => (
        <motion.div 
          key={index}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/20 backdrop-blur-md rounded-3xl p-4"
        >
          <div className="flex items-center gap-2">
            <IoWarning className="w-6 h-6 text-red-500" />
            <h3 className="text-red-500 font-medium">{alert.type}</h3>
          </div>
          <p className="text-white/90 mt-2">{alert.description}</p>
        </motion.div>
      ))}

     

      {/* Weather Details Carousel */}
      <div className="overflow-x-auto">
        <div className="inline-flex gap-3 px-4">
          {weatherDetails.map((detail, index) => (
            <div 
              key={index} 
              className="flex-none w-32 bg-white/10 backdrop-blur-md rounded-3xl p-4 text-center
                transition-all duration-200 hover:bg-white/[0.15]"
            >
              {detail.CustomIcon ? (
                <detail.CustomIcon className="w-8 h-8 mx-auto text-white/60 mb-1" />
              ) : (
                <detail.icon 
                  className="w-8 h-8 mx-auto text-white/60 mb-1" 
                  style={detail.rotate ? { transform: `rotate(${detail.rotate}deg)` } : undefined}
                />
              )}
              <p className="text-white/60 text-sm mb-1">{detail.label}</p>
              <p className="text-lg text-white">
                {detail.value}
                {detail.subValue && (
                  <span className="text-sm ml-1 text-white/60">
                    {detail.subValue}
                  </span>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>

   

      {/* Hourly Forecast */}
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-4">
        <h3 className="text-base font-medium text-white/90 mb-4">HOURLY FORECAST</h3>
        <div className="flex overflow-x-auto gap-6 pb-2 scrollbar-hide">
          {weather.hourly.map((hour, index) => (
            <div 
              key={index}
              className="flex-none flex flex-col items-center gap-2"
            >
              <span className="text-white/90 text-sm">
                {index === 0 ? 'Now' : hour.time}
              </span>
              <img
                src={`https://openweathermap.org/img/wn/${hour.icon}.png`}
                alt={hour.description}
                className="w-8 h-8"
              />
              <span className="text-white font-medium">
                {hour.temp}°
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Forecast */}
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-4">
        <h3 className="text-base font-medium text-white/90 mb-4">5-DAY FORECAST</h3>
        <div className="space-y-4">
          {weather.forecast.map((day, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-white/90 text-base w-28">
                {index === 0 ? 'Today' : day.date}
              </span>
              <div className="flex items-center gap-3 flex-1">
                <img
                  src={`https://openweathermap.org/img/wn/${day.icon}.png`}
                  alt={day.description}
                  className="w-8 h-8"
                />
                <div className="flex-1 flex items-center justify-end">
                  <span className="text-white/50 text-sm mr-2">
                    {day.tempMin}°
                  </span>
                  <div className="relative w-24 h-2 bg-white/20 rounded-full">
                    <div 
                      className="absolute inset-y-0 left-0 bg-white rounded-full"
                      style={{
                        width: `${((day.temp - day.tempMin) / (day.tempMax - day.tempMin)) * 100}%`
                      }}
                    />
                  </div>
                  <span className="text-white text-sm ml-2">
                    {day.tempMax}°
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* Rain Radar */}
      {weather.current && (
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-4">
          <h3 className="text-base font-medium text-white/90 mb-4">RAIN RADAR</h3>
          <div className="h-[350px]">
            <WeatherMap 
              lat={weather.current.lat} 
              lon={weather.current.lon} 
              zoom={8} 
            />
          </div>
        </div>
      )}
   {/* Air Quality */}
   {weather.airQuality && (
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6">
          <h3 className="text-base font-medium text-white/90 mb-4">AIR QUALITY</h3>
          <AirQualityIndicator {...weather.airQuality} />
        </div>
      )}
     {/* Sun Position */}
     <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6">
     <div className="flex justify-between items-center mb-6">
       <div className="flex items-center gap-2">
         <WiSunrise className="w-8 h-8 text-yellow-400" />
         <div>
           <p className="text-white/60 text-sm">Sunrise</p>
           <p className="text-white">
             {new Date(weather.current.sunrise * 1000).toLocaleTimeString([], {
               hour: 'numeric',
               minute: '2-digit',
               hour12: true
             })}
           </p>
         </div>
       </div>
       <div className="flex items-center gap-2">
         <div className="text-right">
           <p className="text-white/60 text-sm">Sunset</p>
           <p className="text-white">
             {new Date(weather.current.sunset * 1000).toLocaleTimeString([], {
               hour: 'numeric',
               minute: '2-digit',
               hour12: true
             })}
           </p>
         </div>
         <WiSunset className="w-8 h-8 text-orange-400" />
       </div>
     </div>
     
     <div className="h-28">
       <SunPosition
         sunrise={weather.current.sunrise}
         sunset={weather.current.sunset}
         current={Date.now()}
       />
     </div>
   </div>
   </div>
  )
} 