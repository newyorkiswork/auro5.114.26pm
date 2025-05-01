import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { Booking } from "@/types/user"

export function useUserBookings(userId: string) {
  return useQuery({
    queryKey: ["bookings", userId],
    queryFn: () => api.bookings.getUserBookings(userId),
    enabled: !!userId,
  })
}

export function useBooking(id: string) {
  return useQuery({
    queryKey: ["booking", id],
    queryFn: () => api.bookings.getById(id),
    enabled: !!id,
  })
}

// Hook to fetch all bookings for the current user
// export function useBookings() {
//   return useQuery<Booking[], Error>({
//     queryKey: ['bookings'],
//     queryFn: () => bookingsApi.getAll(),
//   });
// }

// Hook to fetch a single booking by ID
// export function useBooking(id: string) {
//   return useQuery<Booking, Error>({
//     queryKey: ['bookings', id],
//     queryFn: () => bookingsApi.getById(id),
//     enabled: !!id,
//   });
// }

// Hook to fetch booking history for the current user
export function useBookingHistory() {
  return useQuery<Booking[], Error>({
    queryKey: ["bookings", "history"],
    queryFn: () => api.bookings.getHistory(),
  })
}

// Mock data for development
export const mockBookings: Booking[] = [
  {
    id: "1",
    userId: "user1",
    laundryId: "1",
    laundryName: "Downtown Laundromat",
    machines: [
      { id: "w1", type: "washer", size: "40lb" },
      { id: "w2", type: "washer", size: "40lb" },
    ],
    startTime: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
    endTime: new Date(Date.now() + 7200000).toISOString(), // 2 hours from now
    status: "confirmed",
    totalPrice: 12.5,
    paymentStatus: "paid",
    qrCode: "/placeholder-qr.png",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    userId: "user1",
    laundryId: "2",
    laundryName: "Uptown Wash & Fold",
    machines: [{ id: "d1", type: "dryer", size: "60lb" }],
    startTime: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    endTime: new Date(Date.now() - 82800000).toISOString(), // 1 day ago + 1 hour
    status: "completed",
    totalPrice: 6.75,
    paymentStatus: "paid",
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
  {
    id: "3",
    userId: "user1",
    laundryId: "3",
    laundryName: "Riverside Laundry",
    machines: [
      { id: "w5", type: "washer", size: "60lb" },
      { id: "d3", type: "dryer", size: "80lb" },
    ],
    startTime: new Date(Date.now() + 259200000).toISOString(), // 3 days from now
    endTime: new Date(Date.now() + 266400000).toISOString(), // 3 days + 2 hours from now
    status: "pending",
    totalPrice: 18.25,
    paymentStatus: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]
