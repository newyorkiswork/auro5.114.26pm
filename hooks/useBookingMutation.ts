"use client"

import { useState } from "react"
import { api } from "@/lib/apiClient"

type BookingData = {
  laundryId: string
  machineIds: string[]
  timeSlot: string
  cycleType?: string
  soilLevel?: string
  drynessLevel?: string
}

type BookingResponse = {
  bookingId: string
  success: boolean
}

type MutationOptions = {
  onSuccess?: (data: BookingResponse) => void
  onError?: (error: Error) => void
}

export function useBookingMutation() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const mutate = async (data: BookingData, options?: MutationOptions) => {
    setIsLoading(true)
    setError(null)

    try {
      // In a real app, this would be an API call
      // For sandbox mode, we'll use the apiClient
      const response = await api.bookings.create({
        laundromatId: data.laundryId,
        machineIds: data.machineIds,
        timeSlot: data.timeSlot,
        userId: "current-user", // This would be fetched from auth context in a real app
        cycleType: data.cycleType || "Normal",
        soilLevel: data.soilLevel,
        drynessLevel: data.drynessLevel,
      })

      setIsLoading(false)
      options?.onSuccess?.(response)
      return response
    } catch (err) {
      const error = err instanceof Error ? err : new Error("An unknown error occurred")
      setError(error)
      setIsLoading(false)
      options?.onError?.(error)
      throw error
    }
  }

  return {
    mutate,
    isLoading,
    error,
  }
}

interface ExtendBookingResponse {
  success: boolean
  message: string
  newEndTime: string
}

interface ExtendBookingData {
  bookingId: string
  additionalTime: number
}

export function useExtendBooking() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const mutate = async (
    data: ExtendBookingData,
    options?: {
      onSuccess?: (data: ExtendBookingResponse) => void
      onError?: (error: Error) => void
    },
  ) => {
    try {
      setIsLoading(true)
      setError(null)

      // In a real app, this would be an API call
      const response = await api.bookings.extend(data.bookingId, data.additionalTime)

      const mockResponse: ExtendBookingResponse = {
        success: true,
        message: "Booking extended successfully",
        newEndTime: new Date(Date.now() + data.additionalTime * 60000).toISOString(),
      }

      if (options?.onSuccess) {
        options.onSuccess(mockResponse)
      }

      return mockResponse
    } catch (err) {
      const error = err instanceof Error ? err : new Error("An unknown error occurred")
      setError(error)

      if (options?.onError) {
        options.onError(error)
      }

      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    mutate,
    isLoading,
    error,
  }
}
