"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, AlertCircle } from "lucide-react"
import { useGeolocation } from "@/hooks/useGeolocation"

interface LocationPromptProps {
  onLocationSet: (coords: { latitude: number; longitude: number }) => void
}

export function LocationPrompt({ onLocationSet }: LocationPromptProps) {
  const { coords, error, loading } = useGeolocation()
  const [address, setAddress] = useState("")
  const [isAddressLoading, setIsAddressLoading] = useState(false)
  const [addressError, setAddressError] = useState<string | null>(null)

  // Use geolocation if available
  if (coords) {
    onLocationSet(coords)
    return null
  }

  // Handle manual address entry
  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!address.trim()) return

    setIsAddressLoading(true)
    setAddressError(null)

    try {
      const response = await fetch(`/api/geocode?address=${encodeURIComponent(address)}`)
      const data = await response.json()

      if (data.error) {
        setAddressError(data.error)
      } else if (data.coords) {
        onLocationSet(data.coords)
      } else {
        setAddressError("Could not find coordinates for this address")
      }
    } catch (err) {
      setAddressError("Error geocoding address")
      console.error(err)
    } finally {
      setIsAddressLoading(false)
    }
  }

  // Use NYC as default
  const useDefaultLocation = () => {
    onLocationSet({ latitude: 40.7128, longitude: -74.006 })
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Set Your Location
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-amber-50 p-3 rounded-md flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-amber-800 text-sm">{error}</p>
                  <p className="text-amber-700 text-xs mt-1">
                    Please enter your address manually or use the default location.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleAddressSubmit} className="space-y-3">
              <div>
                <Input
                  type="text"
                  placeholder="Enter your address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full"
                />
                {addressError && <p className="text-red-500 text-xs mt-1">{addressError}</p>}
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={isAddressLoading} className="flex-1">
                  {isAddressLoading ? "Searching..." : "Search"}
                </Button>
                <Button type="button" variant="outline" onClick={useDefaultLocation} className="flex-1">
                  Use Default (NYC)
                </Button>
              </div>
            </form>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default LocationPrompt
