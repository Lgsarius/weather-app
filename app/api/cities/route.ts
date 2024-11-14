import { NextResponse } from 'next/server'
import cities from 'cities.json'
/* eslint-disable */
// Convert string lat/lng to numbers
const CITIES_DATA = (cities as any[]).map((city: {
  name: string;
  country: string;
  lat: string;
  lng: string;
}) => ({
  name: city.name,
  country: city.country,
  lat: parseFloat(city.lat),
  lng: parseFloat(city.lng)
}))

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('search')?.toLowerCase() || ''

  if (query.length < 2) {
    return NextResponse.json([])
  }

  const suggestions = CITIES_DATA
    .filter(city => city.name.toLowerCase().startsWith(query))
    .slice(0, 5)
    .map(city => ({
      name: city.name,
      country: city.country,
      full: `${city.name}, ${city.country}`
    }))

  return NextResponse.json(suggestions)
} 