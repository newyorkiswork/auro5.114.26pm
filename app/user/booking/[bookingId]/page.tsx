"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import { Calendar, Clock, MapPin, Loader2, WashingMachine, Wind } from "lucide-react"
import { api } from "@/lib/apiClient"
import { io } from "socket.io-client"

interface Machine {
  id: string
  type: "washer" | "dryer"
  size: string
  status: "available" | "in-use" | "out-of-order"
  price: number
  estimatedTime: number
  cycleEnd?: string
}

interface Booking {
  id: string
  laundromatId: string
  laundromatName: string
  laundromatAddress: string
  date: string
  timeSlot: string
  machines: Machine[]
  cycleType: string
  soilLevel: string
  accessCode?: string
  status: "upcoming" | "in-progress" | "completed" | "cancelled"
}

export default function BookingDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [booking, setBooking] = useState<Booking | null>(null)

  // Fetch booking details
  useEffect(() => {
    const fetchBooking = async () => {
      if (!params.bookingId) {
        router.replace("/user/bookings")
        return
      }

      try {
        setLoading(true)
        const data = await api.getBookingById(params.bookingId as string)
        setBooking(data)
      } catch (err) {
        console.error("Error fetching booking:", err)
        toast({
          title: "Error",
          description: "Failed to load booking details",
          variant: "destructive",
        })
        router.replace("/user/bookings")
      } finally {
        setLoading(false)
      }
    }

    fetchBooking()
  }, [params.bookingId, router])

  // Connect to WebSocket for live updates
  useEffect(() => {
    if (!booking) return

    const socket = io("/api/sandbox/ws")

    socket.on("connect", () => {
      console.log("Connected to WebSocket")
      socket.emit("subscribe", booking.machines.map(m => m.id))
    })

    socket.on("machineUpdate", (update: { machineId: string; status: string; cycleEnd?: string }) => {
      setBooking(prev => {
        if (!prev) return prev
        return {
          ...prev,
          machines: prev.machines.map(machine => {
            if (machine.id === update.machineId) {
              return {
                ...machine,
                status: update.status as Machine["status"],
                cycleEnd: update.cycleEnd,
              }
            }
            return machine
          }),
        }
      })
    })

    return () => {
      socket.disconnect()
    }
  }, [booking])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error || !booking) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-500">{error || "Booking not found"}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Booking Details</h1>
          <div className="flex items-center gap-2 mt-1 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{booking.laundromatName}</span>
          </div>
        </div>
        <Badge variant={
          booking.status === "upcoming" ? "default" :
          booking.status === "in-progress" ? "secondary" :
          booking.status === "completed" ? "success" : "destructive"
        }>
          {booking.status}
        </Badge>
      </div>

      <div className="grid gap-6">
        {/* Booking Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Location</div>
                <div>{booking.laundromatAddress}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Date & Time</div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(booking.date), "MMMM d, yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{booking.timeSlot}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Cycle Type</div>
                <div>{booking.cycleType}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Soil Level</div>
                <div>{booking.soilLevel}</div>
              </div>
            </div>

            {booking.accessCode && (
              <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                <div className="text-sm font-medium mb-1">Access Code</div>
                <div className="text-2xl font-mono">{booking.accessCode}</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Machines Card */}
        <Card>
          <CardHeader>
            <CardTitle>Machines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {booking.machines.map((machine) => (
                <div
                  key={machine.id}
                  className={`p-4 rounded-lg border ${
                    machine.status === "available"
                      ? "border-green-200 bg-green-50"
                      : machine.status === "in-use"
                      ? "border-yellow-200 bg-yellow-50"
                      : "border-red-200 bg-red-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {machine.type === "washer" ? (
                          <WashingMachine className="h-5 w-5" />
                        ) : (
                          <Wind className="h-5 w-5" />
                        )}
                        <span className="font-medium">
                          {machine.size} {machine.type}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="secondary">${machine.price}</Badge>
                        <Badge variant="secondary">{machine.estimatedTime} min</Badge>
                        <Badge
                          variant={
                            machine.status === "available"
                              ? "default"
                              : machine.status === "in-use"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {machine.status}
                        </Badge>
                      </div>
                    </div>
                    {machine.cycleEnd && (
                      <div className="text-sm">
                        Cycle ends at {format(new Date(machine.cycleEnd), "h:mm a")}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 