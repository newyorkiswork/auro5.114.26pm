"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
import { format, addMinutes, isBefore, startOfDay, endOfDay } from "date-fns"
import { Calendar as CalendarIcon, Clock, MapPin, Loader2 } from "lucide-react"
import { api } from "@/lib/apiClient"
import { ConfirmModal } from "@/components/ConfirmModal"
import { cn } from "@/lib/utils"

interface Machine {
  id: string
  type: "washer" | "dryer"
  size: string
  status: "available" | "in-use" | "out-of-order"
  price: number
  estimatedTime: number
}

interface Laundromat {
  id: string
  name: string
  address: string
  machines: Machine[]
}

export default function CreateBookingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [laundromat, setLaundromat] = useState<Laundromat | null>(null)
  const [date, setDate] = useState<Date>(new Date())
  const [timeSlots, setTimeSlots] = useState<string[]>([])
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)
  const [selectedMachines, setSelectedMachines] = useState<Machine[]>([])
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [selectedMachineType, setSelectedMachineType] = useState<'washer' | 'dryer'>('washer')

  // Generate time slots in 15-minute increments
  useEffect(() => {
    const generateTimeSlots = () => {
      const slots: string[] = []
      const startHour = 6 // 6 AM
      const endHour = 22 // 10 PM
      
      const now = new Date()
      const isToday = startOfDay(date).getTime() === startOfDay(now).getTime()
      
      for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
          const slotTime = new Date(date)
          slotTime.setHours(hour, minute, 0, 0)
          
          const endTime = addMinutes(slotTime, 15)

          // Skip time slots in the past for today
          if (isToday && isBefore(slotTime, now)) continue

          slots.push(`${format(slotTime, 'h:mm a')} - ${format(endTime, 'h:mm a')}`)
        }
      }
      return slots
    }

    setTimeSlots(generateTimeSlots())
    setSelectedTimeSlot(null) // Reset selection when date changes
  }, [date])

  // Fetch laundromat details
  useEffect(() => {
    const fetchLaundromat = async () => {
      if (!searchParams) {
        setError("Invalid request")
        return
      }

      const laundromatId = searchParams.get("laundromatId")
      if (!laundromatId) {
        setError("No laundromat selected")
        return
      }

      try {
        setLoading(true)
        const data = await api.getLaundromatById(laundromatId)
        setLaundromat(data)
        // Select first available machine of each type
        const availableMachines = data.machines.filter((m: Machine) => m.status === "available")
        const washer = availableMachines.find((m: Machine) => m.type === "washer")
        const dryer = availableMachines.find((m: Machine) => m.type === "dryer")
        setSelectedMachines([washer, dryer].filter(Boolean) as Machine[])
      } catch (err) {
        console.error("Error fetching laundromat:", err)
        setError("Failed to load laundromat details")
      } finally {
        setLoading(false)
      }
    }

    fetchLaundromat()
  }, [searchParams])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error || !laundromat) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-500">{error || "Laundromat not found"}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Schedule a Booking</h1>
          <div className="flex items-center gap-2 mt-1 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{laundromat.name}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Date & Machine Selection */}
        <div className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader className="border-b bg-muted/5">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CalendarIcon className="h-5 w-5 text-primary" />
                Select Date & Machine
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-6">
                <div className="inline-flex rounded-lg p-1 bg-muted/10 mb-6">
                  <Button
                    variant={selectedMachineType === 'washer' ? 'default' : 'ghost'}
                    className="flex-1 px-8"
                    onClick={() => setSelectedMachineType('washer')}
                  >
                    Washer
                  </Button>
                  <Button
                    variant={selectedMachineType === 'dryer' ? 'default' : 'ghost'}
                    className="flex-1 px-8"
                    onClick={() => setSelectedMachineType('dryer')}
                  >
                    Dryer
                  </Button>
                </div>
              </div>
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate: Date | undefined) => newDate && setDate(newDate)}
                className="rounded-md border-0 shadow-sm bg-white p-3"
                disabled={(date: Date) => isBefore(date, startOfDay(new Date()))}
                weekStartsOn={0}
                initialFocus
                modifiers={{
                  today: new Date(),
                  disabled: (date) => isBefore(date, startOfDay(new Date()))
                }}
                modifiersStyles={{
                  today: { 
                    fontWeight: 'bold',
                    backgroundColor: 'var(--primary)',
                    color: 'white'
                  },
                  disabled: { opacity: 0.5 }
                }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Time Slots */}
        <Card className="border-0 shadow-md h-fit">
          <CardHeader className="border-b bg-muted/5">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5 text-primary" />
              Select Time
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ScrollArea className="h-[400px] pr-4">
              <div className="grid grid-cols-2 gap-3">
                {timeSlots.map((slot) => (
                  <Button
                    key={slot}
                    variant={selectedTimeSlot === slot ? "default" : "outline"}
                    className={cn(
                      "w-full py-6 text-sm font-medium transition-all",
                      selectedTimeSlot === slot ? "shadow-md" : "hover:border-primary/50",
                      "flex flex-col items-center justify-center space-y-1"
                    )}
                    onClick={() => setSelectedTimeSlot(slot)}
                  >
                    <Clock className="h-4 w-4 mb-1" />
                    {slot}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Summary Card */}
      <Card className="mt-8 border-0 shadow-md bg-white">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Booking Summary</h3>
              <p className="text-sm text-muted-foreground">
                {selectedTimeSlot ? (
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {format(date, "MMMM d, yyyy")} at {selectedTimeSlot}
                  </span>
                ) : (
                  "Select a date and time to continue"
                )}
              </p>
            </div>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="px-6"
              >
                Cancel
              </Button>
              <Button
                onClick={() => setIsConfirmModalOpen(true)}
                disabled={!selectedTimeSlot}
                className="px-8"
              >
                Continue
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {isConfirmModalOpen && (
        <ConfirmModal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          laundromatName={laundromat.name}
          selectedDate={date}
          selectedTimeSlot={selectedTimeSlot!}
          selectedMachines={selectedMachines}
        />
      )}
    </div>
  )
}



