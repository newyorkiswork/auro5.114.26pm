"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { QRCodeDisplay } from "@/components/QRCodeDisplay"
import { useBooking } from "@/hooks/useBookings"
import { Calendar, MapPin, Clock, WashingMachine, Share2 } from "lucide-react"

export default function ConfirmationPage() {
  const params = useParams()
  const bookingId = params.id as string
  const { data: booking, isLoading } = useBooking(bookingId)
  const [calendarSync, setCalendarSync] = useState(false)

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <p>Loading booking details...</p>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col justify-center items-center h-64">
          <h2 className="text-2xl font-bold mb-4">Booking Not Found</h2>
          <p className="mb-6">We couldn't find the booking you're looking for.</p>
          <Link href="/user">
            <Button>Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  // Format time for display
  const formatTime = (timeString: string) => {
    return timeString
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
          <p className="text-gray-500">Your machines are reserved and ready for you.</p>
        </div>

        <Card className="mb-8 rounded-2xl shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">{booking.laundromatName}</h2>
                <div className="flex items-center text-gray-500 mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">123 Main St, Anytown, CA</span>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Confirmed
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{formatDate(booking.timeSlot.date)}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium">
                    {formatTime(booking.timeSlot.startTime)} - {formatTime(booking.timeSlot.endTime)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Reserved Machines</h3>
              <div className="space-y-2">
                {booking.machines.map((machine) => (
                  <div key={machine.id} className="flex items-center">
                    <WashingMachine className="h-5 w-5 text-blue-600 mr-3" />
                    <span>
                      {machine.type === "washer" ? "Washer" : "Dryer"} ({machine.size})
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between">
                <span>Total</span>
                <span className="font-semibold">${booking.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Your QR Code</h2>
            <QRCodeDisplay bookingId={bookingId} laundromatName={booking.laundromatName || "Laundromat"} />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Get Directions</h2>
            <Card className="rounded-2xl overflow-hidden">
              <div className="h-[200px] bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">Map would render here</p>
              </div>
              <CardContent className="p-4">
                <Button className="w-full">
                  <MapPin className="mr-2 h-4 w-4" />
                  Open in Maps
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="rounded-2xl shadow-md mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Add to Calendar</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch id="calendar-sync" checked={calendarSync} onCheckedChange={setCalendarSync} />
                <Label htmlFor="calendar-sync">Sync with my calendar</Label>
              </div>
              <Button variant="outline" disabled={!calendarSync}>
                <Calendar className="mr-2 h-4 w-4" />
                Add to Calendar
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/user">
            <Button variant="outline" className="w-full sm:w-auto">
              Return to Dashboard
            </Button>
          </Link>
          <Button className="w-full sm:w-auto" onClick={() => window.print()}>
            <Share2 className="mr-2 h-4 w-4" />
            Share Booking
          </Button>
        </div>
      </div>
    </div>
  )
}
