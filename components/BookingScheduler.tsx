"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "./ui/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from "date-fns"

interface BookingSchedulerProps {
  machineType: "washer" | "dryer"
  onBookingConfirmed: (timeSlot: string) => void
}

export function BookingScheduler({ machineType, onBookingConfirmed }: BookingSchedulerProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)
  const [timeSlots, setTimeSlots] = useState<Array<{ time: string, available: boolean }>>([])
  const { toast } = useToast()

  useEffect(() => {
    // Generate time slots for the selected date
    if (date) {
      const slots: Array<{ time: string, available: boolean }> = []
      const startHour = 8 // 8 AM
      const endHour = 20 // 8 PM

      for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
          const startTime = new Date(date)
          startTime.setHours(hour, minute, 0)
          
          const endTime = new Date(startTime)
          endTime.setMinutes(endTime.getMinutes() + 15)

          // Skip time slots in the past
          if (startTime < new Date()) continue

          slots.push({
            time: `${format(startTime, 'h:mm a')} - ${format(endTime, 'h:mm a')}`,
            available: Math.random() > 0.2 // Randomly set availability (70% available)
          })
        }
      }
      setTimeSlots(slots)
      setSelectedTimeSlot(null) // Reset selection when date changes
    }
  }, [date])

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate)
  }

  const handleTimeSlotSelect = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot)
  }

  const handleBooking = () => {
    if (!selectedTimeSlot) {
      toast({
        title: "Error",
        description: "Please select a time slot",
        variant: "destructive",
      })
      return
    }

    onBookingConfirmed(selectedTimeSlot)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <h3 className="text-lg font-medium mb-2">Select Date</h3>
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            className="rounded-md border"
            disabled={(date) => {
              // Disable past dates
              const today = new Date()
              today.setHours(0, 0, 0, 0)
              return date < today
            }}
            weekStartsOn={0}  // 0 represents Sunday
          />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-medium mb-2">Select Time Slot</h3>
          <ScrollArea className="h-[400px] rounded-md border p-4">
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map((slot, index) => (
                <Button
                  key={index}
                  variant={selectedTimeSlot === slot.time ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => handleTimeSlotSelect(slot.time)}
                  disabled={!slot.available}
                >
                  {slot.time}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="font-medium">Booking Summary</h3>
              <p className="text-sm text-muted-foreground">
                {machineType === "washer" ? "Washer" : "Dryer"} -{" "}
                {date?.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}{" "}
                {selectedTimeSlot ? `at ${selectedTimeSlot}` : ""}
              </p>
            </div>
            <Button onClick={handleBooking} disabled={!selectedTimeSlot}>
              Confirm Booking
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
