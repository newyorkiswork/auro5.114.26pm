"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { BookingModal } from "@/components/BookingModal"
import { Calendar, Clock, MapPin, Plus, WashingMachine, Wind } from "lucide-react"

// Mock data - in a real app, this would come from an API
const mockBookings = [
  {
    id: "1",
    laundromatName: "Fresh & Clean Laundromat",
    address: "123 Main St, New York, NY",
    date: "2024-03-20",
    timeSlot: "2:00 PM - 3:00 PM",
    machineType: "washer",
    status: "upcoming",
  },
  {
    id: "2",
    laundromatName: "Spin City Laundry",
    address: "456 Oak Ave, New York, NY",
    date: "2024-03-18",
    timeSlot: "10:00 AM - 11:00 AM",
    machineType: "dryer",
    status: "completed",
  },
]

const mockLaundromats = [
  {
    id: "nyc-1",
    name: "Fresh & Clean Laundromat",
    address: "123 Main St, New York, NY",
    distance: "0.3 mi",
    rating: 4.8,
  },
  {
    id: "nyc-2",
    name: "Spin City Laundry",
    address: "456 Oak Ave, New York, NY",
    distance: "0.7 mi",
    rating: 4.5,
  },
]

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [selectedLaundromat, setSelectedLaundromat] = useState<{
    id: string
    name: string
  } | null>(null)

  const handleBookingConfirmed = (booking: {
    date: Date
    timeSlot: string
    machineType: "washer" | "dryer"
  }) => {
    // In a real app, this would create the booking in the backend
    console.log("Booking created:", booking)
    router.push("/user/bookings")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, John!</h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your laundry today.
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedLaundromat(mockLaundromats[0])
            setIsBookingModalOpen(true)
          }}
          className="w-full md:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Booking
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              Next booking in 2 hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rewards Points</CardTitle>
            <Badge variant="secondary">350 pts</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$5.00</div>
            <p className="text-xs text-muted-foreground">
              Available for your next wash
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorite Location</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Fresh & Clean</div>
            <p className="text-xs text-muted-foreground">
              0.3 mi away • 4.8 ★
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="bookings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="bookings">My Bookings</TabsTrigger>
          <TabsTrigger value="nearby">Nearby Locations</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings" className="space-y-4">
          {mockBookings.map((booking) => (
            <Card key={booking.id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{booking.laundromatName}</h3>
                      <Badge
                        variant={
                          booking.status === "upcoming"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {booking.status}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{booking.address}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{booking.date}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{booking.timeSlot}</span>
                      </div>
                      <div className="flex items-center">
                        {booking.machineType === "washer" ? (
                          <WashingMachine className="h-4 w-4 mr-1" />
                        ) : (
                          <Wind className="h-4 w-4 mr-1" />
                        )}
                        <span>{booking.machineType}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/user/booking/${booking.id}`)}
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="nearby" className="space-y-4">
          {mockLaundromats.map((laundromat) => (
            <Card key={laundromat.id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="font-semibold mb-1">{laundromat.name}</h3>
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{laundromat.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{laundromat.distance}</span>
                      <span>•</span>
                      <span>{laundromat.rating} ★</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      setSelectedLaundromat(laundromat)
                      setIsBookingModalOpen(true)
                    }}
                  >
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {selectedLaundromat && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => {
            setIsBookingModalOpen(false)
            setSelectedLaundromat(null)
          }}
          laundromatId={selectedLaundromat.id}
          laundromatName={selectedLaundromat.name}
          onBookingConfirmed={handleBookingConfirmed}
        />
      )}
    </div>
  )
}
