"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Search, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Laundromat {
  id: string
  name: string
  address: string
  distance: number
  rating: number
  hours: string
  machineCount: {
    washers: number
    dryers: number
  }
  amenities: string[]
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [laundromats, setLaundromats] = useState<Laundromat[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const router = useRouter()

  // Get user's location when component mounts
  useEffect(() => {
    if (navigator.geolocation) {
      setLoading(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          setLoading(false)
        },
        (error) => {
          console.error("Error getting location:", error)
          setError("Unable to get your location. Please enter an address manually.")
          setLoading(false)
        }
      )
    } else {
      setError("Geolocation is not supported by your browser")
    }
  }, [])

  // Fetch laundromats when user location is available
  useEffect(() => {
    const fetchLaundromats = async () => {
      if (!userLocation) return

      try {
        setLoading(true)
        setError(null)
        const response = await fetch(
          `/api/sandbox/laundromats?lat=${userLocation.lat}&lng=${userLocation.lng}`
        )
        if (!response.ok) throw new Error("Failed to fetch laundromats")
        const data = await response.json()
        setLaundromats(data)
      } catch (err) {
        console.error("Error fetching laundromats:", err)
        setError("Failed to load laundromats. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchLaundromats()
  }, [userLocation])

  const filteredLaundromats = laundromats.filter((laundromat) =>
    laundromat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    laundromat.address.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold">Find a Laundromat</h1>
        <div className="relative flex-1 md:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by name or address..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : error ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-500">{error}</div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredLaundromats.map((laundromat) => (
            <Card key={laundromat.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{laundromat.name}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {laundromat.address}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Distance</span>
                    <span className="font-medium">{laundromat.distance} miles</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Rating</span>
                    <span className="font-medium">{laundromat.rating} ⭐</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Hours</span>
                    <span className="font-medium">{laundromat.hours}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Machines</span>
                    <span className="font-medium">
                      {laundromat.machineCount.washers} washers, {laundromat.machineCount.dryers} dryers
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {laundromat.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                  <Link href={`/user/booking/create?laundromatId=${laundromat.id}`} className="block">
                    <Button className="w-full">Book Now</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
