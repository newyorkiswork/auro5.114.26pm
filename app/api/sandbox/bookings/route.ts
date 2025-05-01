import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

// In-memory store for sandbox data
let bookings: any[] = [
  {
    id: "mock-booking-1",
    userId: "user-1",
    laundromatId: "nyc-1",
    laundromatName: "Fresh & Clean Laundromat",
    laundromatAddress: "123 Main St, New York, NY",
    date: "2024-05-01",
    timeSlot: "2:00 PM - 3:00 PM",
    machines: [
      {
        id: "washer-1",
        type: "washer",
        size: "40lb",
        status: "available"
      }
    ],
    status: "upcoming",
    createdAt: "2024-04-30T10:00:00Z"
  }
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  const filteredBookings = userId
    ? bookings.filter(b => b.userId === userId)
    : bookings

  return NextResponse.json(filteredBookings)
}

export async function POST(request: Request) {
  const data = await request.json()
  
  // Create a new booking with mock data
  const newBooking = {
    id: uuidv4(),
    userId: "user-1", // Mock user ID
    laundromatId: data.laundromatId || "nyc-1",
    laundromatName: "Fresh & Clean Laundromat",
    laundromatAddress: "123 Main St, New York, NY",
    date: data.date,
    timeSlot: data.timeSlot,
    machines: data.machineIds.map((id: string) => ({
      id,
      type: id.includes('washer') ? 'washer' : 'dryer',
      size: '40lb',
      status: 'available'
    })),
    cycleType: data.cycleType || "Normal",
    soilLevel: data.soilLevel || "Normal",
    status: "upcoming",
    createdAt: new Date().toISOString(),
    accessCode: Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  bookings.push(newBooking)
  
  // Return the booking ID and access code
  return NextResponse.json({
    bookingId: newBooking.id,
    accessCode: newBooking.accessCode
  })
}

export async function PUT(request: Request) {
  const data = await request.json()
  const index = bookings.findIndex(b => b.id === data.id)
  
  if (index === -1) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }
  
  bookings[index] = { ...bookings[index], ...data }
  return NextResponse.json(bookings[index])
}

export async function DELETE(request: Request) {
  const { id } = await request.json()
  bookings = bookings.filter(b => b.id !== id)
  return NextResponse.json({ success: true })
} 