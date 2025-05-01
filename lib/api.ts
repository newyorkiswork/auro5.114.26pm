// Mock API endpoints for the laundromat application

import type { Laundromat, Booking, Machine, TimeSlot, VendingItem } from "@/types/user"

// Base URL for API calls
const API_BASE_URL = "/api"

// Helper function to simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Mock data
const mockLaundromats: Laundromat[] = [
  {
    id: "laund-001",
    name: "Fresh & Clean Laundromat",
    address: "123 Main St, Anytown, CA",
    distance: 0.3,
    machineCount: { washers: 12, dryers: 14 },
    rating: 4.8,
    hours: "6:00 AM - 10:00 PM",
    coordinates: { lat: 37.7749, lng: -122.4194 },
    amenities: ["Free WiFi", "Vending Machines", "Seating Area"],
  },
  {
    id: "laund-002",
    name: "Spin City Laundry",
    address: "456 Oak Ave, Anytown, CA",
    distance: 0.7,
    machineCount: { washers: 8, dryers: 10 },
    rating: 4.5,
    hours: "24 hours",
    coordinates: { lat: 37.7739, lng: -122.4312 },
    amenities: ["24/7 Access", "Vending Machines", "Attendant on Duty"],
  },
  {
    id: "laund-003",
    name: "Bubble Bath Laundry",
    address: "789 Elm St, Anytown, CA",
    distance: 1.2,
    machineCount: { washers: 15, dryers: 18 },
    rating: 4.9,
    hours: "5:00 AM - 11:00 PM",
    coordinates: { lat: 37.7833, lng: -122.4167 },
    amenities: ["Free Detergent", "Folding Service", "Free WiFi"],
  },
  {
    id: "laund-004",
    name: "Wash & Fold Express",
    address: "101 Pine Rd, Anytown, CA",
    distance: 1.5,
    machineCount: { washers: 10, dryers: 12 },
    rating: 4.3,
    hours: "6:00 AM - 9:00 PM",
    coordinates: { lat: 37.7699, lng: -122.4103 },
    amenities: ["Drop-off Service", "Dry Cleaning", "Free Parking"],
  },
  {
    id: "laund-005",
    name: "Suds & Duds",
    address: "202 Maple Dr, Anytown, CA",
    distance: 2.1,
    machineCount: { washers: 6, dryers: 8 },
    rating: 4.6,
    hours: "7:00 AM - 10:00 PM",
    coordinates: { lat: 37.7879, lng: -122.4074 },
    amenities: ["Air Conditioning", "TV", "Snack Machines"],
  },
]

const mockMachines: Record<string, Machine[]> = {
  "laund-001": [
    { id: "wash-001", type: "washer", size: "40lb", status: "available", price: 3.5, estimatedTime: 35 },
    { id: "wash-002", type: "washer", size: "40lb", status: "available", price: 3.5, estimatedTime: 35 },
    { id: "wash-003", type: "washer", size: "60lb", status: "in-use", price: 5.0, estimatedTime: 40 },
    { id: "wash-004", type: "washer", size: "20lb", status: "available", price: 2.5, estimatedTime: 30 },
    { id: "wash-005", type: "washer", size: "20lb", status: "out-of-order", price: 2.5, estimatedTime: 30 },
    { id: "wash-006", type: "washer", size: "40lb", status: "available", price: 3.5, estimatedTime: 35 },
    { id: "dry-001", type: "dryer", size: "30lb", status: "available", price: 1.5, estimatedTime: 45 },
    { id: "dry-002", type: "dryer", size: "30lb", status: "available", price: 1.5, estimatedTime: 45 },
    { id: "dry-003", type: "dryer", size: "50lb", status: "in-use", price: 2.5, estimatedTime: 50 },
    { id: "dry-004", type: "dryer", size: "30lb", status: "available", price: 1.5, estimatedTime: 45 },
  ],
  "laund-002": [
    { id: "wash-007", type: "washer", size: "40lb", status: "available", price: 3.75, estimatedTime: 35 },
    { id: "wash-008", type: "washer", size: "20lb", status: "available", price: 2.75, estimatedTime: 30 },
    { id: "dry-005", type: "dryer", size: "30lb", status: "available", price: 1.75, estimatedTime: 45 },
    { id: "dry-006", type: "dryer", size: "50lb", status: "available", price: 2.75, estimatedTime: 50 },
  ],
}

const mockTimeSlots: Record<string, TimeSlot[]> = {
  "laund-001": [
    { id: "slot-001", startTime: "08:00", endTime: "08:15", available: true },
    { id: "slot-002", startTime: "08:15", endTime: "08:30", available: true },
    { id: "slot-003", startTime: "08:30", endTime: "08:45", available: false },
    { id: "slot-004", startTime: "08:45", endTime: "09:00", available: true },
    { id: "slot-005", startTime: "09:00", endTime: "09:15", available: true },
    { id: "slot-006", startTime: "09:15", endTime: "09:30", available: false },
    { id: "slot-007", startTime: "09:30", endTime: "09:45", available: true },
    { id: "slot-008", startTime: "09:45", endTime: "10:00", available: true },
    { id: "slot-009", startTime: "10:00", endTime: "10:15", available: true },
    { id: "slot-010", startTime: "10:15", endTime: "10:30", available: false },
    { id: "slot-011", startTime: "10:30", endTime: "10:45", available: true },
    { id: "slot-012", startTime: "10:45", endTime: "11:00", available: true },
  ],
}

const mockBookings: Booking[] = [
  {
    id: "book-001",
    userId: "user-001",
    laundromatId: "laund-001",
    machines: [
      { id: "wash-001", type: "washer", size: "40lb" },
      { id: "wash-002", type: "washer", size: "40lb" },
    ],
    timeSlot: { startTime: "14:00", endTime: "15:00", date: "2023-06-15" },
    status: "active",
    totalPrice: 7.0,
    createdAt: "2023-06-14T10:30:00Z",
  },
  {
    id: "book-002",
    userId: "user-001",
    laundromatId: "laund-002",
    machines: [{ id: "wash-007", type: "washer", size: "40lb" }],
    timeSlot: { startTime: "16:00", endTime: "17:00", date: "2023-06-10" },
    status: "completed",
    totalPrice: 3.75,
    createdAt: "2023-06-09T14:20:00Z",
  },
  {
    id: "book-003",
    userId: "user-001",
    laundromatId: "laund-003",
    machines: [
      { id: "wash-009", type: "washer", size: "60lb" },
      { id: "dry-007", type: "dryer", size: "50lb" },
    ],
    timeSlot: { startTime: "10:00", endTime: "11:00", date: "2023-06-05" },
    status: "completed",
    totalPrice: 7.5,
    createdAt: "2023-06-04T18:45:00Z",
  },
  {
    id: "book-004",
    userId: "user-001",
    laundromatId: "laund-001",
    machines: [{ id: "wash-004", type: "washer", size: "20lb" }],
    timeSlot: { startTime: "09:00", endTime: "10:00", date: "2023-06-20" },
    status: "upcoming",
    totalPrice: 2.5,
    createdAt: "2023-06-18T09:15:00Z",
  },
]

const mockRewards = {
  points: 350,
  freeDryPasses: 2,
  availableRewards: [
    { id: "reward-001", name: "Free Dry Cycle", pointCost: 100, description: "Redeem for one free dry cycle" },
    { id: "reward-002", name: "50% Off Wash", pointCost: 150, description: "Get 50% off your next wash" },
    { id: "reward-003", name: "Free Detergent", pointCost: 75, description: "One free detergent packet" },
    { id: "reward-004", name: "Premium Wash", pointCost: 200, description: "Upgrade to premium wash cycle" },
  ],
  history: [
    { id: "redeem-001", reward: "Free Dry Cycle", date: "2023-06-01", points: -100 },
    { id: "earn-001", action: "Completed Booking", date: "2023-06-05", points: 50 },
    { id: "earn-002", action: "Referral Bonus", date: "2023-06-10", points: 100 },
  ],
}

const mockVendingItems: VendingItem[] = [
  { id: "item-001", name: "Detergent", price: 1.5, available: true },
  { id: "item-002", name: "Fabric Softener", price: 1.25, available: true },
  { id: "item-003", name: "Dryer Sheets", price: 1.0, available: true },
  { id: "item-004", name: "Bleach", price: 2.0, available: false },
  { id: "item-005", name: "Stain Remover", price: 2.5, available: true },
]

// API functions
export const api = {
  // Laundromat endpoints
  laundromats: {
    getAll: async (radius = 5, coordinates?: { lat: number; lng: number }) => {
      await delay(800)
      // Filter by radius if coordinates are provided
      if (coordinates) {
        return mockLaundromats.filter((l) => l.distance <= radius)
      }
      return mockLaundromats
    },
    getById: async (id: string) => {
      await delay(500)
      return mockLaundromats.find((l) => l.id === id)
    },
  },

  // Machine endpoints
  machines: {
    getByLaundromat: async (laundromatId: string) => {
      await delay(600)
      return mockMachines[laundromatId] || []
    },
    getAvailability: async (laundromatId: string, date: string) => {
      await delay(700)
      return mockTimeSlots[laundromatId] || []
    },
  },

  // Booking endpoints
  bookings: {
    create: async (bookingData: Omit<Booking, "id" | "createdAt" | "status">) => {
      await delay(1000)
      const newBooking: Booking = {
        ...bookingData,
        id: `book-${Math.floor(Math.random() * 1000)}`,
        status: "upcoming",
        createdAt: new Date().toISOString(),
      }
      return newBooking
    },
    getById: async (id: string) => {
      await delay(500)
      return mockBookings.find((b) => b.id === id)
    },
    getUserBookings: async (userId: string) => {
      await delay(800)
      return mockBookings.filter((b) => b.userId === userId)
    },
    cancel: async (id: string) => {
      await delay(700)
      const booking = mockBookings.find((b) => b.id === id)
      if (booking) {
        booking.status = "cancelled"
      }
      return booking
    },
    extend: async (id: string, additionalTime: number) => {
      await delay(600)
      const booking = mockBookings.find((b) => b.id === id)
      return booking
    },
  },

  // Rewards endpoints
  rewards: {
    getUserRewards: async (userId: string) => {
      await delay(500)
      return mockRewards
    },
    redeemReward: async (userId: string, rewardId: string) => {
      await delay(800)
      const reward = mockRewards.availableRewards.find((r) => r.id === rewardId)
      if (reward && mockRewards.points >= reward.pointCost) {
        mockRewards.points -= reward.pointCost
        if (reward.name === "Free Dry Cycle") {
          mockRewards.freeDryPasses += 1
        }
        return { success: true, message: `Successfully redeemed ${reward.name}` }
      }
      return { success: false, message: "Not enough points or reward not found" }
    },
  },

  // Vending endpoints
  vending: {
    getItems: async (laundromatId: string) => {
      await delay(400)
      return mockVendingItems
    },
    purchaseItem: async (itemId: string, paymentMethod: string) => {
      await delay(900)
      const item = mockVendingItems.find((i) => i.id === itemId)
      if (item && item.available) {
        return { success: true, message: `Successfully purchased ${item.name}` }
      }
      return { success: false, message: "Item not available" }
    },
  },

  // Post-wash services
  postWash: {
    requestFoldService: async (bookingId: string, details: any) => {
      await delay(800)
      return { success: true, message: "Fold service requested successfully", serviceId: "fold-001" }
    },
    scheduleCourier: async (bookingId: string, details: any) => {
      await delay(1000)
      return { success: true, message: "Courier scheduled successfully", trackingId: "track-001" }
    },
  },
}
