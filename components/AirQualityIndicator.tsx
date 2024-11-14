import { motion } from 'framer-motion'

interface AirQualityIndicatorProps {
  index: number
  description: string
  pollutants: {
    pm25: number
    pm10: number
    o3: number
  }
}

export default function AirQualityIndicator({ index, description, pollutants }: AirQualityIndicatorProps) {
  const getAqiColor = (index: number) => {
    if (index <= 50) return 'text-green-500'
    if (index <= 100) return 'text-yellow-500'
    if (index <= 150) return 'text-orange-500'
    if (index <= 200) return 'text-red-500'
    return 'text-purple-500'
  }

  const getAqiBackground = (index: number) => {
    if (index <= 50) return 'from-green-500/20 to-green-500/10'
    if (index <= 100) return 'from-yellow-500/20 to-yellow-500/10'
    if (index <= 150) return 'from-orange-500/20 to-orange-500/10'
    if (index <= 200) return 'from-red-500/20 to-red-500/10'
    return 'from-purple-500/20 to-purple-500/10'
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main AQI Display */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className={`text-4xl font-light ${getAqiColor(index)}`}>
            {index}
          </span>
          <span className="text-white/60 text-sm mt-1">
            {description}
          </span>
        </div>
        
        {/* Legend */}
        <div className="flex gap-3">
          <div className="flex flex-col items-center gap-1">
            <span className="text-white/60 text-xs">Good</span>
            <div className="w-1 h-4 bg-green-500/50 rounded-full" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-white/60 text-xs">Moderate</span>
            <div className="w-1 h-4 bg-yellow-500/50 rounded-full" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-white/60 text-xs">Poor</span>
            <div className="w-1 h-4 bg-red-500/50 rounded-full" />
          </div>
        </div>
      </div>

      {/* Pollutants */}
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col gap-1">
          <div className="text-sm text-white/60">PM2.5</div>
          <div className="relative h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(pollutants.pm25 / 200) * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${getAqiBackground(index)}`}
            />
          </div>
          <div className="text-xs text-white/80">{pollutants.pm25} µg/m³</div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="text-sm text-white/60">PM10</div>
          <div className="relative h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(pollutants.pm10 / 200) * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${getAqiBackground(index)}`}
            />
          </div>
          <div className="text-xs text-white/80">{pollutants.pm10} µg/m³</div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="text-sm text-white/60">O₃</div>
          <div className="relative h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(pollutants.o3 / 200) * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${getAqiBackground(index)}`}
            />
          </div>
          <div className="text-xs text-white/80">{pollutants.o3} µg/m³</div>
        </div>
      </div>
    </div>
  )
} 