"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookingScheduler } from "@/components/BookingScheduler"
import { useToast } from "../../components/ui/use-toast"

export default function BookingPage() {
  const [selectedTab, setSelectedTab] = useState("washer")
  const router = useRouter()
  const { toast } = useToast()

  const handleBooking = (machineType: string, timeSlot: string) => {
    toast({
      title: "Booking Confirmed",
      description: `Your ${machineType} has been booked for ${timeSlot}`,
    })

    // Navigate to confirmation page (this would be dynamic in a real app)
    router.push("/user/confirmation/123")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Schedule a Machine</h1>

      <Card>
        <CardHeader>
          <CardTitle>Book a Machine</CardTitle>
          <CardDescription>Select a machine type and available time slot</CardDescription>
        </CardHeader>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="washer">Washer</TabsTrigger>
              <TabsTrigger value="dryer">Dryer</TabsTrigger>
            </TabsList>
          </div>

          <CardContent className="pt-6">
            <TabsContent value="washer">
              <BookingScheduler
                machineType="washer"
                onBookingConfirmed={(timeSlot) => handleBooking("washer", timeSlot)}
              />
            </TabsContent>

            <TabsContent value="dryer">
              <BookingScheduler
                machineType="dryer"
                onBookingConfirmed={(timeSlot) => handleBooking("dryer", timeSlot)}
              />
            </TabsContent>
          </CardContent>
        </Tabs>

        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              const timeSlot = "2:00 PM - 3:00 PM" // This would be dynamic in a real app
              handleBooking(selectedTab, timeSlot)
            }}
          >
            Book Now
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
