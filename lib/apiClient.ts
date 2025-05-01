import { toast } from '@/components/ui/use-toast'

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>
}

interface Laundromat {
  id: string
  name: string
  address: string
  distance?: number
  rating?: number
  machines: {
    washers: number
    dryers: number
    available: {
      washers: number
      dryers: number
    }
  }
}

// Base API client functions
async function fetchData(endpoint: string, options: FetchOptions = {}) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
  // Always use sandbox mode for development
  const sandboxMode = true
  const url = sandboxMode 
    ? `${baseUrl}/api/sandbox${endpoint}`
    : `${baseUrl}/api${endpoint}`

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('API Error:', error)
    toast({
      title: 'Error',
      description: 'An error occurred while fetching data',
      variant: 'destructive',
    })
    throw error
  }
}

// Specific API functions
async function getMachines(params = {}) {
  const queryString = new URLSearchParams(params).toString()
  return fetchData(`/machines?${queryString}`)
}

async function createBooking(data: {
  locationId: string
  machineIds: string[]
  timeSlot: string
  cycleType: string
  soilLevel: string
  drynessLevel: string
}) {
  return fetchData("/bookings", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

async function reserveMachines(data: {
  machineIds: string[]
  date: Date
  timeSlot: string
  cycleType: string
  soilLevel: string
  laundromatId: string
}) {
  return fetchData("/bookings", {
    method: "POST",
    body: JSON.stringify({
      ...data,
      date: data.date.toISOString(),
    }),
  })
}

async function scheduleReminder(data: {
  bookingId: string
  remindAt: string
}) {
  return fetchData("/reminders", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

async function generateAccessCode(data: {
  bookingId: string
  machineIds: string[]
}) {
  return fetchData("/access-codes", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

async function getLaundromats(params = {}) {
  const queryString = new URLSearchParams(params).toString()
  return fetchData(`/laundromats?${queryString}`)
}

async function getLaundromatById(id: string) {
  return fetchData(`/laundromats/${id}`)
}

async function getBookings(userId: string) {
  return fetchData(`/bookings?userId=${userId}`)
}

async function getBookingById(id: string) {
  return fetchData(`/bookings/${id}`)
}

async function getUsers(params = {}) {
  const queryString = new URLSearchParams(params).toString()
  return fetchData(`/users?${queryString}`)
}

async function createUser(data: {
  name: string
  email: string
  role: string
}) {
  return fetchData("/users", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

async function createLaundromat(data: {
  name: string
  address: string
  lat: number
  lng: number
  machineTypes: { type: string; count: number }[]
}) {
  return fetchData("/laundromats", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

async function resetSandbox() {
  return fetchData("/reset", {
    method: "POST",
  })
}

async function injectEvent(eventType: string, data: any) {
  return fetchData(`/inject/${eventType}`, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

async function getUserProfile(userId: string) {
  return fetchData(`/users?userId=${userId}`)
}

async function updateUserProfile(data: {
  id: string
  name: string
  email: string
  phone: string
  address: string
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
  }
}) {
  return fetchData(`/users`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export const api = {
  // Generic entity operations
  createEntity: async (type: string, data: Record<string, any>) => {
    return fetchData(`/${type}s`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  updateEntity: async (type: string, data: Record<string, any>) => {
    return fetchData(`/${type}s/${data.id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  deleteEntity: async (type: string, id: string) => {
    return fetchData(`/${type}s/${id}`, {
      method: 'DELETE',
    })
  },

  getEntities: async (type: string, params = {}) => {
    const queryString = new URLSearchParams(params as Record<string, string>).toString()
    return fetchData(`/${type}s?${queryString}`)
  },

  // Machine operations
  getMachines: async (params: { locationId?: string }) => {
    const queryString = new URLSearchParams(params as Record<string, string>).toString()
    return fetchData(`/machines?${queryString}`)
  },

  // Booking operations
  reserveMachines,
  scheduleReminder,
  generateAccessCode,
  listBookings: getBookings,
  getBookingById,

  // Laundromat operations
  getLaundromats,
  getLaundromatById,

  // User operations
  getUsers,
  createUser,

  // Sandbox operations
  resetSandbox,
  injectEvent,

  // Location operations
  getNearbyLaundromats: async (lat: number, lng: number): Promise<Laundromat[]> => {
    return fetchData(`/laundromats/nearby?lat=${lat}&lng=${lng}`)
  },

  searchLaundromats: async (query: string, userLocation: { lat: number; lng: number } | null): Promise<Laundromat[]> => {
    const params = new URLSearchParams({ q: query })
    if (userLocation) {
      params.append('lat', userLocation.lat.toString())
      params.append('lng', userLocation.lng.toString())
    }
    return fetchData(`/laundromats/search?${params.toString()}`)
  },

  getUserProfile,
  updateUserProfile,
}
