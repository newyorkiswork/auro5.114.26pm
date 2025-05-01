// Mock data for bookings
export const bookings = [
  {
    id: "1",
    locationName: "Downtown Laundromat",
    address: "123 Main St, Anytown, USA",
    date: "2025-05-01T18:00:00",
    machines: [
      { id: "w1", type: "Washer", size: "40lb", number: 3 },
      { id: "w2", type: "Washer", size: "40lb", number: 4 },
    ],
    status: "Upcoming",
    price: 12.5,
  },
  {
    id: "2",
    locationName: "Sunshine Laundry",
    address: "456 Oak Ave, Somewhere, USA",
    date: "2025-04-28T14:30:00",
    machines: [{ id: "d1", type: "Dryer", size: "30lb", number: 7 }],
    status: "Completed",
    price: 8.75,
  },
  {
    id: "3",
    locationName: "Quick Clean Center",
    address: "789 Pine Rd, Nowhere, USA",
    date: "2025-04-25T10:15:00",
    machines: [
      { id: "w3", type: "Washer", size: "60lb", number: 1 },
      { id: "d2", type: "Dryer", size: "50lb", number: 2 },
    ],
    status: "Completed",
    price: 18.25,
  },
  {
    id: "4",
    locationName: "Downtown Laundromat",
    address: "123 Main St, Anytown, USA",
    date: "2025-04-20T16:45:00",
    machines: [{ id: "w4", type: "Washer", size: "20lb", number: 5 }],
    status: "Completed",
    price: 6.5,
  },
  {
    id: "5",
    locationName: "Sunshine Laundry",
    address: "456 Oak Ave, Somewhere, USA",
    date: "2025-04-15T09:00:00",
    machines: [
      { id: "w5", type: "Washer", size: "40lb", number: 2 },
      { id: "d3", type: "Dryer", size: "30lb", number: 8 },
    ],
    status: "Completed",
    price: 14.0,
  },
]

// Mock data for rewards
export const rewards = {
  points: 450,
  freeDryPasses: 2,
  tier: "Silver",
  nextTier: "Gold",
  pointsToNextTier: 50,
  history: [
    { id: "1", date: "2025-04-28", points: 25, reason: "Booking completed" },
    { id: "2", date: "2025-04-25", points: 50, reason: "Referral bonus" },
    { id: "3", date: "2025-04-20", points: 25, reason: "Booking completed" },
    { id: "4", date: "2025-04-15", points: 25, reason: "Booking completed" },
    { id: "5", date: "2025-04-10", points: 100, reason: "Monthly loyalty bonus" },
  ],
}

// Mock data for laundry partners
export const laundryPartners = [
  { id: "1", name: "FoldPro Services", price: 10.99, rating: 4.8, estimatedTime: "2 hours" },
  { id: "2", name: "Quick Fold", price: 8.99, rating: 4.5, estimatedTime: "3 hours" },
  { id: "3", name: "Premium Laundry Care", price: 12.99, rating: 4.9, estimatedTime: "1.5 hours" },
]

// Mock data for courier services
export const courierServices = [
  { id: "1", name: "SpeedyDelivery", price: 5.99, rating: 4.7, estimatedTime: "30 minutes" },
  { id: "2", name: "LaundryGo", price: 4.99, rating: 4.4, estimatedTime: "45 minutes" },
  { id: "3", name: "Express Courier", price: 6.99, rating: 4.8, estimatedTime: "20 minutes" },
]

// Mock API functions
export async function fetchBookingHistory() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))
  return bookings
}

export async function fetchBookingById(id: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return bookings.find((booking) => booking.id === id) || null
}

export async function fetchRewards() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 600))
  return rewards
}

export async function fetchLaundryPartners() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400))
  return laundryPartners
}

export async function fetchCourierServices() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400))
  return courierServices
}

export async function rebookBooking(bookingId: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 700))
  return { success: true, newBookingId: "6" }
}

export async function extendDryTime(machineId: string, minutes: number) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return { success: true, newEndTime: new Date(Date.now() + minutes * 60 * 1000).toISOString() }
}

export async function orderSupplies(machineId: string, supplies: string[]) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 600))
  return { success: true, orderId: "123456" }
}

export async function scheduleService(serviceType: string, serviceId: string, bookingId: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))
  return { success: true, serviceId: "789", confirmationCode: "SVC12345" }
}
