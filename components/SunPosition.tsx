import { motion } from 'framer-motion'

interface SunPositionProps {
  sunrise: number
  sunset: number
  current: number
}

export default function SunPosition({ sunrise, sunset, current }: SunPositionProps) {
  const sunriseTime = sunrise * 1000
  const sunsetTime = sunset * 1000
  const currentTime = current

  const dayLength = sunsetTime - sunriseTime
  const progress = Math.max(0, Math.min(1, (currentTime - sunriseTime) / dayLength))

  // Calculate position on the arc
  const getPointOnArc = (progress: number) => {
    const angle = Math.PI * progress
    const x = 50 - Math.cos(angle) * 40
    const y = 45 - Math.sin(angle) * 40
    return { x, y }
  }

  const sunPosition = getPointOnArc(progress)

  return (
    <div className="w-full h-full">
      <svg
        viewBox="0 0 100 50"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="sunArcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.15" />
          </linearGradient>
          
          <filter id="sunGlow">
            <feGaussianBlur stdDeviation="1" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Main arc */}
        <path
          d="M 10 45 A 40 40 0 0 1 90 45"
          fill="none"
          stroke="url(#sunArcGradient)"
          strokeWidth="1.5"
        />

        {/* Progress arc */}
        <path
          d={`M 10 45 A 40 40 0 0 1 ${sunPosition.x} ${sunPosition.y}`}
          fill="none"
          stroke="#fbbf24"
          strokeWidth="1"
          strokeDasharray="2 3"
          opacity="0.4"
        />

        {/* Sun glow */}
        <motion.circle
          cx={sunPosition.x}
          cy={sunPosition.y}
          r="3"
          className="fill-yellow-400/30"
          filter="url(#sunGlow)"
          initial={false}
          animate={{ 
            cx: sunPosition.x,
            cy: sunPosition.y
          }}
          transition={{ duration: 0.5 }}
        />

        {/* Sun */}
        <motion.circle
          cx={sunPosition.x}
          cy={sunPosition.y}
          r="1.5"
          className="fill-yellow-400"
          initial={false}
          animate={{ 
            cx: sunPosition.x,
            cy: sunPosition.y
          }}
          transition={{ duration: 0.5 }}
        />
      </svg>
    </div>
  )
} 