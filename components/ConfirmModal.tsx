"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Toggle } from "@/components/ui/toggle"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Clock, Bell, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/apiClient"

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  laundromatName: string
  selectedDate: Date
  selectedTimeSlot: string
  selectedMachines: {
    id: string
    type: "washer" | "dryer"
  }[]
}

export function ConfirmModal({
  isOpen,
  onClose,
  laundromatName,
  selectedDate,
  selectedTimeSlot,
  selectedMachines,
}: ConfirmModalProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [cycleType, setCycleType] = useState<"Normal" | "Delicate" | "Heavy">("Normal")
  const [soilLevel, setSoilLevel] = useState<"Light" | "Normal" | "Heavy">("Normal")
  const [reminder, setReminder] = useState<"15m" | "30m" | "1h" | null>(null)

  const machineCount = selectedMachines.length
  const machineType = selectedMachines[0]?.type || "washer"

  const handleConfirm = async () => {
    try {
      setLoading(true)

      // Create the booking
      const { bookingId, accessCode } = await api.reserveMachines({
        machineIds: selectedMachines.map(m => m.id),
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        cycleType,
        soilLevel,
        laundromatId: "nyc-1" // Mock laundromat ID for sandbox
      })

      // Success! Show toast and redirect
      toast({
        title: "Booking Confirmed!",
        description: `Your booking has been confirmed. Access code: ${accessCode}`,
      })

      // Close modal and redirect to booking detail
      onClose()
      router.push('/user/bookings?booked=true')
    } catch (error) {
      console.error("Error creating booking:", error)
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Lock in {machineCount} × {machineType} on {cycleType}+{soilLevel} at {selectedTimeSlot}?
          </DialogTitle>
          <p className="text-sm text-muted-foreground">{laundromatName}</p>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Cycle Type</h4>
            <div className="flex gap-2">
              {["Normal", "Delicate", "Heavy"].map((type) => (
                <Toggle
                  key={type}
                  pressed={cycleType === type}
                  onPressedChange={() => setCycleType(type as typeof cycleType)}
                  className="flex-1"
                >
                  {type}
                </Toggle>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Soil Level</h4>
            <div className="flex gap-2">
              {["Light", "Normal", "Heavy"].map((level) => (
                <Toggle
                  key={level}
                  pressed={soilLevel === level}
                  onPressedChange={() => setSoilLevel(level as typeof soilLevel)}
                  className="flex-1"
                >
                  {level}
                </Toggle>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Reminder</h4>
            <div className="flex gap-2">
              {[
                { value: "15m", label: "15 min" },
                { value: "30m", label: "30 min" },
                { value: "1h", label: "1 hour" },
              ].map(({ value, label }) => (
                <Toggle
                  key={value}
                  pressed={reminder === value}
                  onPressedChange={() => setReminder(reminder === value ? null : value as typeof reminder)}
                  className="flex-1"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  {label}
                </Toggle>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Confirming...
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
