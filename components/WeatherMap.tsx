'use client'
/* eslint-disable */
import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { format } from 'date-fns'
import { PlayIcon, PauseIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'

interface WeatherMapProps {
  lat: number
  lon: number
  zoom: number
}

interface ExtendedWMSParams extends L.WMSParams {
  time?: string;
}

export default function WeatherMap({ lat, lon, zoom }: WeatherMapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const rainLayerRef = useRef<L.TileLayer.WMS | null>(null)
  const cloudLayerRef = useRef<L.TileLayer.WMS | null>(null)
  const [currentTime, setCurrentTime] = useState<Date>(new Date())
  const [timeRange, setTimeRange] = useState<Date[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const playIntervalRef = useRef<NodeJS.Timeout>()

  // Generate time range (last 2 hours with 5-minute intervals)
  useEffect(() => {
    const range: Date[] = []
    const end = new Date()
    end.setMinutes(Math.floor(end.getMinutes() / 5) * 5, 0, 0)
    
    for (let i = 0; i < 24; i++) {
      const time = new Date(end)
      time.setMinutes(time.getMinutes() - (i * 5))
      range.unshift(time)
    }
    setTimeRange(range)
    setCurrentTime(range[range.length - 1])
  }, [])

  // Handle animation
  useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          const currentIndex = timeRange.findIndex(t => t.getTime() === prev.getTime())
          if (currentIndex === timeRange.length - 1) {
            setIsPlaying(false)
            return prev
          }
          return timeRange[currentIndex + 1]
        })
      }, 500)
    } else {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current)
      }
    }

    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current)
      }
    }
  }, [isPlaying, timeRange])

  // Update radar layer when time changes
  useEffect(() => {
    if (currentTime) {
      const timeParam = format(currentTime, "yyyy-MM-dd'T'HH:mm:ss'Z'")
      if (rainLayerRef.current) {
        rainLayerRef.current.setParams({ time: timeParam } as any)
      }
      if (cloudLayerRef.current) {
        cloudLayerRef.current.setParams({ time: timeParam } as any)
      }
    }
  }, [currentTime])

  // Initialize map
  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current || mapRef.current) return

    mapRef.current = L.map(mapContainerRef.current, {
      center: [lat, lon],
      zoom: zoom,
      zoomControl: false,
    })

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '©OpenStreetMap, ©CartoDB',
      maxZoom: 19,
    }).addTo(mapRef.current)

    rainLayerRef.current = L.tileLayer.wms(
      'https://maps.dwd.de/geoserver/dwd/wms', {
        layers: 'dwd:RX-Produkt',
        format: 'image/png',
        transparent: true,
        opacity: 0.6,
        attribution: '© DWD',
        time: format(currentTime, "yyyy-MM-dd'T'HH:mm:ss'Z'")
      } as ExtendedWMSParams
    ).addTo(mapRef.current)

    cloudLayerRef.current = L.tileLayer.wms(
      'https://maps.dwd.de/geoserver/dwd/wms', {
        layers: 'dwd:WN-Produkt',
        format: 'image/png',
        transparent: true,
        opacity: 0.4,
        attribution: '© DWD',
        time: format(currentTime, "yyyy-MM-dd'T'HH:mm:ss'Z'")
      } as ExtendedWMSParams
    ).addTo(mapRef.current)

    L.control.zoom({
      position: 'topright'
    }).addTo(mapRef.current)

    const locationIcon = L.divIcon({
      className: 'location-marker',
      html: `<div class="w-3 h-3 bg-white rounded-full ring-2 ring-white/30 animate-pulse"></div>`,
      iconSize: [12, 12],
      iconAnchor: [6, 6]
    })

    L.marker([lat, lon], { icon: locationIcon }).addTo(mapRef.current)

    return () => {
      if (mapRef.current) {
        if (rainLayerRef.current) rainLayerRef.current.remove()
        if (cloudLayerRef.current) cloudLayerRef.current.remove()
        mapRef.current.remove()
        mapRef.current = null
        rainLayerRef.current = null
        cloudLayerRef.current = null
      }
    }
  }, [lat, lon, zoom])

  return (
    <div className="flex flex-col h-full">
      <div 
        ref={mapContainerRef} 
        className="w-full flex-1 rounded-xl overflow-hidden"
      />
      
      {/* Controls Panel */}
      <div className="mt-4 px-6 py-4 bg-black/40 backdrop-blur-md rounded-2xl border border-white/[0.08]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`
                p-2.5 rounded-lg transition-all duration-200
                ${isPlaying 
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                  : 'bg-white/10 text-white hover:bg-white/20'
                }
              `}
            >
              {isPlaying ? (
                <PauseIcon className="w-4 h-4" />
              ) : (
                <PlayIcon className="w-4 h-4" />
              )}
            </button>
            <div className="flex flex-col">
              <span className="text-white/90 text-sm font-medium">
                {format(currentTime, 'EEEE')}
              </span>
              <span className="text-white/50 text-xs">
                {format(currentTime, 'dd MMM, HH:mm')}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                const currentIndex = timeRange.findIndex(t => t.getTime() === currentTime.getTime())
                if (currentIndex > 0) {
                  setCurrentTime(timeRange[currentIndex - 1])
                }
              }}
              className="p-1.5 rounded-lg text-white/50 hover:text-white/90 hover:bg-white/10 transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white/50"
              disabled={timeRange.findIndex(t => t.getTime() === currentTime.getTime()) === 0}
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <button 
              onClick={() => {
                const currentIndex = timeRange.findIndex(t => t.getTime() === currentTime.getTime())
                if (currentIndex < timeRange.length - 1) {
                  setCurrentTime(timeRange[currentIndex + 1])
                }
              }}
              className="p-1.5 rounded-lg text-white/50 hover:text-white/90 hover:bg-white/10 transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white/50"
              disabled={timeRange.findIndex(t => t.getTime() === currentTime.getTime()) === timeRange.length - 1}
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Custom Time Slider */}
        <div className="relative mt-2 mb-4">
          <input
            type="range"
            min={0}
            max={timeRange.length - 1}
            value={timeRange.findIndex(t => t.getTime() === currentTime.getTime())}
            onChange={(e) => {
              setCurrentTime(timeRange[parseInt(e.target.value)])
            }}
            className="w-full h-1.5 bg-white/[0.08] rounded-full appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-4
              [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-white
              [&::-webkit-slider-thumb]:border-2
              [&::-webkit-slider-thumb]:border-white/[0.08]
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:transition-all
              [&::-webkit-slider-thumb]:duration-150
              [&::-webkit-slider-thumb]:hover:bg-gray-100
              [&::-moz-range-thumb]:appearance-none
              [&::-moz-range-thumb]:w-4
              [&::-moz-range-thumb]:h-4
              [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:bg-white
              [&::-moz-range-thumb]:border-2
              [&::-moz-range-thumb]:border-white/[0.08]
              [&::-moz-range-thumb]:cursor-pointer
              [&::-moz-range-thumb]:transition-all
              [&::-moz-range-thumb]:duration-150
              [&::-moz-range-thumb]:hover:bg-gray-100"
          />
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 text-xs text-white/50">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-white/50 rounded-[2px]" />
            <span>Rain Radar</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-white/30 rounded-[2px]" />
            <span>Clouds</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-white rounded-full ring-2 ring-white/30" />
            <span>Location</span>
          </div>
        </div>
      </div>
    </div>
  )
} 