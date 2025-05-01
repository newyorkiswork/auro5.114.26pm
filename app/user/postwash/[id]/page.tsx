"use client"

import type React from "react"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { useBooking } from "@/hooks/useBookings"
import { Package, Truck, Check, Calendar } from "lucide-react"

export default function PostWashPage() {
  const params = useParams()
  const router = useRouter()
  const bookingId = params.id as string
  const { data: booking, isLoading } = useBooking(bookingId)
  const { toast } = useToast()
  const [showFoldOptions, setShowFoldOptions] = useState(false)
  const [showCourierOptions, setShowCourierOptions] = useState(false)

  // Mock function to handle fold service request
  const handleFoldService = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Fold Service Requested",
      description: "Your fold service has been scheduled successfully.",
    })
    setShowFoldOptions(false)
    router.push("/user")
  }

  // Mock function to handle courier scheduling
  const handleCourierSchedule = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Courier Scheduled",
      description: "Your courier pickup has been scheduled successfully.",
    })
    setShowCourierOptions(false)
    router.push("/user")
  }

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
          <p>We couldn't find the booking you're looking for.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Post-Wash Options</h1>

        <Card className="mb-8 rounded-2xl shadow-md">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Your laundry is ready!</h2>
            <p className="text-gray-500 mb-6">Choose what you'd like to do with your clean laundry:</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="h-auto py-6 flex flex-col items-center justify-center"
                onClick={() => {
                  toast({
                    title: "Great!",
                    description: "We'll see you soon to pick up your laundry.",
                  })
                  router.push("/user")
                }}
              >
                <Check className="h-8 w-8 mb-2" />
                <span className="text-lg">I'll Pick Up</span>
                <span className="text-xs text-gray-500 mt-1">No additional cost</span>
              </Button>

              <Button
                variant="outline"
                className="h-auto py-6 flex flex-col items-center justify-center"
                onClick={() => setShowFoldOptions(true)}
              >
                <Package className="h-8 w-8 mb-2" />
                <span className="text-lg">Add Fold+Pack</span>
                <span className="text-xs text-gray-500 mt-1">From $5.99</span>
              </Button>

              <Button
                variant="outline"
                className="h-auto py-6 flex flex-col items-center justify-center"
                onClick={() => setShowCourierOptions(true)}
              >
                <Truck className="h-8 w-8 mb-2" />
                <span className="text-lg">Schedule Courier</span>
                <span className="text-xs text-gray-500 mt-1">From $8.99</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="bg-blue-50 rounded-2xl p-6">
          <h3 className="text-lg font-medium mb-3">Booking Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Laundromat:</span>
              <span className="font-medium">{booking.laundromatName}</span>
            </div>
            <div className="flex justify-between">
              <span>Machines:</span>
              <span className="font-medium">{booking.machines.length} machine(s)</span>
            </div>
            <div className="flex justify-between">
              <span>Total Paid:</span>
              <span className="font-medium">${booking.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Fold+Pack Options Sheet */}
        <Sheet open={showFoldOptions} onOpenChange={setShowFoldOptions}>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Fold & Pack Service</SheetTitle>
            </SheetHeader>
            <form onSubmit={handleFoldService} className="py-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fold-service">Select Service Level</Label>
                  <RadioGroup defaultValue="standard" className="mt-2">
                    <div className="flex items-center justify-between space-x-2 border p-3 rounded-md">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="standard" id="standard" />
                        <Label htmlFor="standard">Standard Fold</Label>
                      </div>
                      <span>$5.99</span>
                    </div>
                    <div className="flex items-center justify-between space-x-2 border p-3 rounded-md">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="premium" id="premium" />
                        <Label htmlFor="premium">Premium Fold + Organize</Label>
                      </div>
                      <span>$8.99</span>
                    </div>
                    <div className="flex items-center justify-between space-x-2 border p-3 rounded-md">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="deluxe" id="deluxe" />
                        <Label htmlFor="deluxe">Deluxe Fold + Vacuum Seal</Label>
                      </div>
                      <span>$12.99</span>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="special-instructions">Special Instructions</Label>
                  <Input id="special-instructions" placeholder="Any special folding preferences?" className="mt-1" />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="notify-ready" />
                  <Label htmlFor="notify-ready">Notify me when ready for pickup</Label>
                </div>
              </div>

              <SheetFooter className="mt-6">
                <Button type="submit" className="w-full">
                  Confirm Fold Service
                </Button>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>

        {/* Courier Options Sheet */}
        <Sheet open={showCourierOptions} onOpenChange={setShowCourierOptions}>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Schedule Courier Pickup</SheetTitle>
            </SheetHeader>
            <form onSubmit={handleCourierSchedule} className="py-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="delivery-address">Delivery Address</Label>
                  <Input id="delivery-address" placeholder="Enter your delivery address" className="mt-1" />
                </div>

                <div>
                  <Label>Select Delivery Time</Label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <Button type="button" variant="outline" className="justify-start">
                      <Calendar className="mr-2 h-4 w-4" />
                      Today (4-6 PM)
                    </Button>
                    <Button type="button" variant="outline" className="justify-start">
                      <Calendar className="mr-2 h-4 w-4" />
                      Today (7-9 PM)
                    </Button>
                    <Button type="button" variant="outline" className="justify-start">
                      <Calendar className="mr-2 h-4 w-4" />
                      Tomorrow (9-12 AM)
                    </Button>
                    <Button type="button" variant="outline" className="justify-start">
                      <Calendar className="mr-2 h-4 w-4" />
                      Tomorrow (1-4 PM)
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Courier Service</Label>
                  <RadioGroup defaultValue="standard" className="mt-2">
                    <div className="flex items-center justify-between space-x-2 border p-3 rounded-md">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="standard" id="standard-delivery" />
                        <Label htmlFor="standard-delivery">Standard Delivery</Label>
                      </div>
                      <span>$8.99</span>
                    </div>
                    <div className="flex items-center justify-between space-x-2 border p-3 rounded-md">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="express" id="express-delivery" />
                        <Label htmlFor="express-delivery">Express Delivery</Label>
                      </div>
                      <span>$12.99</span>
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="contact-free" />
                  <Label htmlFor="contact-free">Contact-free delivery</Label>
                </div>
              </div>

              <SheetFooter className="mt-6">
                <Button type="submit" className="w-full">
                  Schedule Courier
                </Button>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
