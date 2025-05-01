"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Calendar as CalendarIcon, Clock } from "lucide-react"

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  laundromatId: string
  laundromatName: string
  onBookingConfirmed: (booking: {
    date: Date
    timeSlot: string
    machineType: "washer" | "dryer"
  }) => void
}

export function BookingModal({
  isOpen,
  onClose,
  laundromatId,
  laundromatName,
  onBookingConfirmed,
}: BookingModalProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)
  const [timeSlots, setTimeSlots] = useState<Array<{ time: string, available: boolean }>>([])
  const [machineType, setMachineType] = useState<"washer" | "dryer">("washer")
  const [loading, setLoading] = useState(false)
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

  const handleBooking = async () => {
    if (!selectedTimeSlot || !date) {
      toast({
        title: "Error",
        description: "Please select a date and time slot",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onBookingConfirmed({
        date,
        timeSlot: selectedTimeSlot,
        machineType
      })
      
      toast({
        title: "Success",
        description: "Booking created successfully!",
      })
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create booking. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Book a Machine at {laundromatName}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button
                variant={machineType === "washer" ? "default" : "outline"}
                onClick={() => setMachineType("washer")}
                className="flex-1"
              >
                Washer
              </Button>
              <Button
                variant={machineType === "dryer" ? "default" : "outline"}
                onClick={() => setMachineType("dryer")}
                className="flex-1"
              >
                Dryer
              </Button>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Select Date</h3>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                disabled={(date) => {
                  const today = new Date()
                  today.setHours(0, 0, 0, 0)
                  return date < today
                }}
                weekStartsOn={0}
              />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Select Time Slot</h3>
            <ScrollArea className="h-[300px] rounded-md border p-4">
              <div className="grid grid-cols-2 gap-2">
                {timeSlots.map((slot, index) => (
                  <Button
                    key={index}
                    variant={selectedTimeSlot === slot.time ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => setSelectedTimeSlot(slot.time)}
                    disabled={!slot.available}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    {slot.time}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleBooking} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Booking...
              </>
            ) : (
              "Confirm Booking"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 