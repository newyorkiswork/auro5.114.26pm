"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useUserBookings } from "@/hooks/useBookings"
import { useRewards } from "@/hooks/useRewards"
import { RewardsCard } from "@/components/RewardsCard"
import { Calendar, Clock, MapPin, RotateCw, ArrowRight } from "lucide-react"

export default function HistoryPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming")
  const { data: bookings, isLoading } = useUserBookings("user-001") // Mock user ID
  const { data: rewards } = useRewards("user-001") // Mock user ID

  // Filter bookings by status
  const upcomingBookings =
    bookings?.filter((booking) => booking.status === "upcoming" || booking.status === "active") || []

  const pastBookings =
    bookings?.filter((booking) => booking.status === "completed" || booking.status === "cancelled") || []

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  // Navigate to booking details
  const viewBooking = (bookingId: string, status: string) => {
    if (status === "active") {
      router.push(`/user/monitor/${bookingId}`)
    } else if (status === "completed") {
      router.push(`/user/postwash/${bookingId}`)
    } else {
      router.push(`/user/confirmation/${bookingId}`)
    }
  }

  // Rebook a past booking
  const rebookBooking = (bookingId: string) => {
    const booking = pastBookings.find((b) => b.id === bookingId)
    if (booking) {
      router.push(`/user/booking/${booking.laundromatId}`)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

      {rewards && (
        <div className="mb-8">
          <RewardsCard points={rewards.points} freeDryPasses={rewards.freeDryPasses} />
        </div>
      )}

      <Tabs
        defaultValue="upcoming"
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "upcoming" | "past")}
        className="mb-8"
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="upcoming" className="text-base py-3">
            Upcoming ({upcomingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="past" className="text-base py-3">
            Past ({pastBookings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-0">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <p>Loading bookings...</p>
            </div>
          ) : upcomingBookings.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <h3 className="text-lg font-medium mb-2">No Upcoming Bookings</h3>
              <p className="text-gray-500 mb-4">You don't have any upcoming bookings.</p>
              <Button onClick={() => router.push("/user/search")}>Find a Laundromat</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingBookings.map((booking) => (
                <Card key={booking.id} className="rounded-2xl shadow-sm hover:shadow-md transition-all">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="mb-4 md:mb-0">
                        <div className="flex items-center mb-2">
                          <h3 className="text-lg font-medium mr-3">{booking.laundromatName}</h3>
                          <Badge
                            variant="outline"
                            className={
                              booking.status === "active"
                                ? "bg-green-100 text-green-800 border-green-200"
                                : "bg-blue-100 text-blue-800 border-blue-200"
                            }
                          >
                            {booking.status === "active" ? "In Progress" : "Upcoming"}
                          </Badge>
                        </div>

                        <div className="flex flex-col space-y-1 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>{formatDate(booking.timeSlot.date)}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            <span>
                              {booking.timeSlot.startTime} - {booking.timeSlot.endTime}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span>123 Main St, Anytown, CA</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2">
                        <Button onClick={() => viewBooking(booking.id, booking.status)} className="w-full md:w-auto">
                          {booking.status === "active" ? "Monitor" : "View Details"}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-0">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <p>Loading bookings...</p>
            </div>
          ) : pastBookings.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <h3 className="text-lg font-medium mb-2">No Past Bookings</h3>
              <p className="text-gray-500">You don't have any past bookings.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pastBookings.map((booking) => (
                <Card key={booking.id} className="rounded-2xl shadow-sm hover:shadow-md transition-all">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="mb-4 md:mb-0">
                        <div className="flex items-center mb-2">
                          <h3 className="text-lg font-medium mr-3">{booking.laundromatName}</h3>
                          <Badge
                            variant="outline"
                            className={
                              booking.status === "completed"
                                ? "bg-green-100 text-green-800 border-green-200"
                                : "bg-red-100 text-red-800 border-red-200"
                            }
                          >
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </Badge>
                        </div>

                        <div className="flex flex-col space-y-1 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>{formatDate(booking.timeSlot.date)}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            <span>
                              {booking.timeSlot.startTime} - {booking.timeSlot.endTime}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2">
                        <Button
                          variant="outline"
                          onClick={() => rebookBooking(booking.id)}
                          className="w-full md:w-auto"
                        >
                          <RotateCw className="mr-2 h-4 w-4" />
                          Rebook
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
