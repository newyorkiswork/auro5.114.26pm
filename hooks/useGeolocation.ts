"use client"

import { useState, useCallback } from 'react'

interface GeolocationState {
  loading: boolean
  error: GeolocationPositionError | null
  getCurrentPosition: () => Promise<GeolocationPosition>
}

export function useGeolocation(): GeolocationState {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<GeolocationPositionError | null>(null)

  const getCurrentPosition = useCallback((): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'))
        return
      }

      setLoading(true)
      setError(null)

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLoading(false)
          resolve(position)
        },
        (error) => {
          setLoading(false)
          setError(error)
          reject(error)
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      )
    })
  }, [])

  return {
    loading,
    error,
    getCurrentPosition
  }
}
