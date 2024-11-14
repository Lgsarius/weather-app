'use client'

import { useState, useRef, useEffect } from 'react'
import { useDebounce } from '@/hooks/useDebounce'
import { IoSearchOutline } from 'react-icons/io5'
import { IoClose } from 'react-icons/io5'
import { IoLocationOutline } from 'react-icons/io5'
import { motion, AnimatePresence } from 'framer-motion'

interface City {
  name: string
  country: string
  full: string
}

interface SearchBarProps {
  onSearch: (city: string) => void
  onLocationSearch: (lat: number, lon: number) => void
}

// Maximum number of recent searches to store
const MAX_RECENT_SEARCHES = 5
const RECENT_SEARCHES_KEY = 'recentSearches'

export default function SearchBar({ onSearch, onLocationSearch }: SearchBarProps) {
  const [input, setInput] = useState('')
  const [suggestions, setSuggestions] = useState<City[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [locationLoading, setLocationLoading] = useState(false)
  const debouncedInput = useDebounce(input, 300)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(RECENT_SEARCHES_KEY)
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // Save recent searches to localStorage
  const addToRecentSearches = (search: string) => {
    const updated = [search, ...recentSearches.filter(s => s !== search)]
      .slice(0, MAX_RECENT_SEARCHES)
    setRecentSearches(updated)
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
  }

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedInput.length < 2) {
        setSuggestions([])
        return
      }

      setLoading(true)
      try {
        const res = await fetch(`/api/cities?search=${encodeURIComponent(debouncedInput)}`)
        const data = await res.json()
        setSuggestions(data)
      } catch (error) {
        console.error('Error fetching suggestions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSuggestions()
  }, [debouncedInput])

  const handleClear = () => {
    setInput('')
    setSuggestions([])
    inputRef.current?.focus()
  }

  const handleSuggestionClick = (suggestion: City) => {
    const searchTerm = `${suggestion.name}, ${suggestion.country}`
    setInput(searchTerm)
    addToRecentSearches(searchTerm)
    onSearch(searchTerm)
    setIsOpen(false)
  }

  const handleRecentSearchClick = (search: string) => {
    setInput(search)
    onSearch(search)
    addToRecentSearches(search)
    setIsOpen(false)
  }

  const handleLocationClick = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser')
      return
    }

    setLocationLoading(true)
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
      })

      const { latitude, longitude } = position.coords
      await onLocationSearch(latitude, longitude)
      setIsOpen(false)
    } catch (error) {
      console.error('Error getting location:', error)
      alert('Unable to get your location. Please try searching for a city instead.')
    } finally {
      setLocationLoading(false)
    }
  }

  return (
    <div className="relative w-full max-w-xl mx-auto">
      {/* Search Input Group */}
      <div className="relative flex items-center">
        <IoSearchOutline className="absolute left-4 text-white/60 w-5 h-5" />
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            setIsOpen(true)
          }}
          placeholder="Search for a city..."
          className="w-full pl-12 pr-24 py-3.5 
                   bg-white/10 backdrop-blur-xl
                   text-white placeholder-white/60
                   rounded-2xl focus:outline-none focus:ring-2 
                   focus:ring-white/25 border border-white/10"
        />
        
        {/* Right side buttons */}
        <div className="absolute right-4 flex items-center gap-2">
          {/* Location Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleLocationClick}
            disabled={locationLoading}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 
                     transition-colors disabled:opacity-50"
          >
            {locationLoading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white/80 
                           rounded-full animate-spin" />
            ) : (
              <IoLocationOutline className="w-5 h-5 text-white" />
            )}
          </motion.button>

          {/* Clear Button */}
          <AnimatePresence>
            {input && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={handleClear}
                className="p-2 rounded-full bg-white/20 
                         hover:bg-white/30 transition-colors"
              >
                <IoClose className="w-5 h-5 text-white" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="absolute right-14 top-1/2 -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-white/20 border-t-white/80 
                        rounded-full animate-spin" />
        </div>
      )}

      {/* Suggestions Panel */}
      <AnimatePresence>
        {isOpen && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 
                     bg-black/40 backdrop-blur-xl rounded-2xl 
                     border border-white/10 overflow-hidden shadow-xl"
          >
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { delay: index * 0.05 }
                }}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-3 flex items-center gap-3
                         text-left text-white/90 hover:bg-white/10 
                         transition-colors border-b border-white/10 
                         last:border-none"
              >
                <IoSearchOutline className="w-4 h-4 text-white/60" />
                <div>
                  <span className="text-white">{suggestion.name}</span>
                  <span className="ml-2 text-sm text-white/60">
                    {suggestion.country}
                  </span>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recent Searches */}
      {recentSearches.length > 0 && !isOpen && (
        <div className="mt-8 space-y-2">
          <h3 className="text-lg font-medium text-white/80 px-1">Recent Searches</h3>
          <div className="space-y-1">
            {recentSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => handleRecentSearchClick(search)}
                className="w-full px-4 py-3 flex items-center gap-3
                         text-left text-white/90 hover:bg-white/10 
                         transition-colors rounded-xl"
              >
                <IoSearchOutline className="w-4 h-4 text-white/60" />
                <span>{search}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 