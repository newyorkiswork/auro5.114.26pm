"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import { Calendar, Clock, MapPin, Loader2, Plus, RefreshCcw } from "lucide-react"
import { api } from "@/lib/apiClient"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

interface Booking {
  id: string
  laundromatId: string
  laundromatName: string
  laundromatAddress: string
  date: string
  timeSlot: string
  machines: {
    id: string
    type: "washer" | "dryer"
    size: string
    status: "available" | "in-use" | "out-of-order"
  }[]
  cycleType: string
  soilLevel: string
  status: "upcoming" | "in-progress" | "completed" | "cancelled"
}

export default function BookingsPage() {
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [refreshing, setRefreshing] = useState(false)

  const fetchBookings = async (showToast = false) => {
    try {
      setRefreshing(true)
      const data = await api.listBookings("user-1")
      setBookings(data)
      if (showToast) {
        toast({
          title: "Refreshed",
          description: "Your bookings have been updated.",
        })
      }
    } catch (err) {
      console.error("Error fetching bookings:", err)
      toast({
        title: "Error",
        description: "Failed to load bookings",
        variant: "destructive",
      })
      setError("Failed to load bookings")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Initial load
  useEffect(() => {
    fetchBookings()
  }, [])

  // Refresh when coming back from booking creation
  useEffect(() => {
    if (!searchParams) return
    const justBooked = searchParams.get("booked") === "true"
    if (justBooked) {
      fetchBookings()
    }
  }, [searchParams])

  if (loading && !refreshing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error && !refreshing) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-500">{error}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">My Bookings</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => fetchBookings(true)}
            disabled={refreshing}
          >
            <RefreshCcw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <Link href="/user/search">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Booking
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {bookings.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">
                No bookings found. Create your first booking to get started!
              </div>
            </CardContent>
          </Card>
        ) : (
          bookings.map((booking) => (
            <Link key={booking.id} href={`/user/booking/${booking.id}`}>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{booking.laundromatName}</span>
                        <Badge variant={
                          booking.status === "upcoming" ? "default" :
                          booking.status === "in-progress" ? "secondary" :
                          booking.status === "completed" ? "success" : "destructive"
                        }>
                          {booking.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {booking.laundromatAddress}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(booking.date), "MMM d, yyyy")}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{booking.timeSlot}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {booking.machines.map((machine) => (
                        <Badge key={machine.id} variant="secondary">
                          {machine.size} {machine.type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  )
} 