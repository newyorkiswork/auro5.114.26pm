// User-related types for the laundromat application

// Laundromat type
export interface Laundromat {
  id: string
  name: string
  address: string
  distance: number
  machineCount: {
    washers: number
    dryers: number
  }
  rating: number
  hours: string
  coordinates: {
    lat: number
    lng: number
  }
  amenities: string[]
}

// Machine type
export interface Machine {
  id: string
  type: "washer" | "dryer"
  size: string
  status: "available" | "in-use" | "out-of-order" | "reserved"
  price: number
  estimatedTime: number
}

// Time slot type
export interface TimeSlot {
  id: string
  startTime: string
  endTime: string
  available: boolean
  date?: string
}

// Booking type
export interface Booking {
  id: string
  userId: string
  laundromatId: string
  machines: Array<{
    id: string
    type: "washer" | "dryer"
    size: string
  }>
  timeSlot: {
    startTime: string
    endTime: string
    date: string
  }
  status: "upcoming" | "active" | "completed" | "cancelled"
  totalPrice: number
  createdAt: string
}

// Reward type
export interface Reward {
  id: string
  name: string
  pointCost: number
  description: string
}

// Vending item type
export interface VendingItem {
  id: string
  name: string
  price: number
  available: boolean
}

// User profile type
export interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  preferences?: {
    notifications: boolean
    reminders: boolean
  }
}
