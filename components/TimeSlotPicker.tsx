"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "./ui/button"
import { Loader, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "../lib/utils"

interface TimeSlotPickerProps {
  selectedTimeSlot: string | null
  onSelectTimeSlot: (timeSlot: string) => void
}

export function TimeSlotPicker({ selectedTimeSlot, onSelectTimeSlot }: TimeSlotPickerProps) {
  const [timeSlots, setTimeSlots] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // In a real app, this would fetch from an API
    const fetchTimeSlots = async () => {
      try {
        setLoading(true)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Generate time slots for today and tomorrow
        const slots: string[] = []
        const now = new Date()
        const currentHour = now.getHours()

        // Today's remaining slots
        for (let i = currentHour + 1; i <= 22; i++) {
          slots.push(`Today, ${i}:00 - ${i + 1}:00`)
        }

        // Tomorrow's slots
        for (let i = 8; i <= 22; i++) {
          slots.push(`Tomorrow, ${i}:00 - ${i + 1}:00`)
        }

        setTimeSlots(slots)
        setError(null)

        // Auto-select first slot if none selected
        if (!selectedTimeSlot && slots.length > 0) {
          onSelectTimeSlot(slots[0])
        }
      } catch (err) {
        setError("Failed to load time slots. Please try again.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchTimeSlots()
  }, [selectedTimeSlot, onSelectTimeSlot])

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" })
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-20">
        <Loader className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500 p-4 text-center">{error}</div>
  }

  return (
    <div className="relative">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
        <Button variant="outline" size="icon" onClick={scrollLeft} className="rounded-full shadow-sm">
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto py-4 px-8 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {timeSlots.map((slot) => (
          <div key={slot} className="snap-start px-1 min-w-max">
            <Button
              variant={selectedTimeSlot === slot ? "default" : "outline"}
              className={cn(
                "whitespace-nowrap",
                selectedTimeSlot === slot && "bg-blue-600 hover:bg-blue-700 text-white",
              )}
              onClick={() => onSelectTimeSlot(slot)}
            >
              {slot}
            </Button>
          </div>
        ))}
      </div>

      <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
        <Button variant="outline" size="icon" onClick={scrollRight} className="rounded-full shadow-sm">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

export default TimeSlotPicker
