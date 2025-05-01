import { NextResponse } from 'next/server'

// NYC laundromats data with machine availability simulation
const nycLaundromats = [
  {
    id: "nyc-1",
    name: "Upper East Side Laundry",
    address: "1234 2nd Ave, New York, NY 10065",
    distance: 0.2,
    machineCount: { washers: 15, dryers: 18 },
    rating: 4.8,
    hours: "24/7",
    coordinates: { lat: 40.7735, lng: -73.9565 },
    amenities: ["Free WiFi", "Vending Machines", "Seating Area", "Air Conditioning"],
    machines: [
      { id: "w1", type: "washer", size: "40lb", status: "available", price: 4.50, estimatedTime: 35, cycleEnd: null },
      { id: "w2", type: "washer", size: "60lb", status: "in-use", price: 6.00, estimatedTime: 40, cycleEnd: new Date(Date.now() + 15 * 60 * 1000) },
      { id: "w3", type: "washer", size: "40lb", status: "available", price: 4.50, estimatedTime: 35, cycleEnd: null },
      { id: "w4", type: "washer", size: "20lb", status: "in-use", price: 3.00, estimatedTime: 30, cycleEnd: new Date(Date.now() + 5 * 60 * 1000) },
      { id: "d1", type: "dryer", size: "30lb", status: "available", price: 2.00, estimatedTime: 45, cycleEnd: null },
      { id: "d2", type: "dryer", size: "50lb", status: "in-use", price: 3.00, estimatedTime: 50, cycleEnd: new Date(Date.now() + 20 * 60 * 1000) }
    ]
  },
  {
    id: "nyc-2",
    name: "Murray Hill Wash & Fold",
    address: "447 3rd Ave, New York, NY 10016",
    distance: 0.5,
    machineCount: { washers: 12, dryers: 14 },
    rating: 4.6,
    hours: "6:00 AM - 11:00 PM",
    coordinates: { lat: 40.7453, lng: -73.9777 },
    amenities: ["Drop-off Service", "Dry Cleaning", "Free WiFi"],
    machines: [
      { id: "w5", type: "washer", size: "40lb", status: "available", price: 4.50, estimatedTime: 35, cycleEnd: null },
      { id: "w6", type: "washer", size: "20lb", status: "in-use", price: 3.00, estimatedTime: 30, cycleEnd: new Date(Date.now() + 10 * 60 * 1000) },
      { id: "w7", type: "washer", size: "60lb", status: "available", price: 6.00, estimatedTime: 40, cycleEnd: null },
      { id: "d3", type: "dryer", size: "50lb", status: "in-use", price: 3.00, estimatedTime: 50, cycleEnd: new Date(Date.now() + 25 * 60 * 1000) },
      { id: "d4", type: "dryer", size: "30lb", status: "available", price: 2.00, estimatedTime: 45, cycleEnd: null }
    ]
  },
  {
    id: "nyc-3",
    name: "Greenwich Village Laundromat",
    address: "123 MacDougal St, New York, NY 10012",
    distance: 1.1,
    machineCount: { washers: 10, dryers: 12 },
    rating: 4.7,
    hours: "7:00 AM - 10:00 PM",
    coordinates: { lat: 40.7298, lng: -74.0012 },
    amenities: ["Self-Service", "Free WiFi", "Vending Machines"],
    machines: [
      { id: "w8", type: "washer", size: "40lb", status: "in-use", price: 4.50, estimatedTime: 35, cycleEnd: new Date(Date.now() + 20 * 60 * 1000) },
      { id: "w9", type: "washer", size: "60lb", status: "available", price: 6.00, estimatedTime: 40, cycleEnd: null },
      { id: "w10", type: "washer", size: "20lb", status: "available", price: 3.00, estimatedTime: 30, cycleEnd: null },
      { id: "d5", type: "dryer", size: "30lb", status: "in-use", price: 2.00, estimatedTime: 45, cycleEnd: new Date(Date.now() + 15 * 60 * 1000) },
      { id: "d6", type: "dryer", size: "50lb", status: "available", price: 3.00, estimatedTime: 50, cycleEnd: null }
    ]
  },
  {
    id: "nyc-4",
    name: "Chelsea Express Laundry",
    address: "256 8th Ave, New York, NY 10011",
    distance: 0.8,
    machineCount: { washers: 20, dryers: 24 },
    rating: 4.9,
    hours: "24/7",
    coordinates: { lat: 40.7454, lng: -74.0008 },
    amenities: ["24/7 Service", "Attendant On-Site", "Free WiFi", "Air Conditioning"],
    machines: [
      { id: "w11", type: "washer", size: "40lb", status: "available", price: 4.50, estimatedTime: 35, cycleEnd: null },
      { id: "w12", type: "washer", size: "20lb", status: "in-use", price: 3.00, estimatedTime: 30, cycleEnd: new Date(Date.now() + 5 * 60 * 1000) },
      { id: "w13", type: "washer", size: "60lb", status: "available", price: 6.00, estimatedTime: 40, cycleEnd: null },
      { id: "d7", type: "dryer", size: "30lb", status: "in-use", price: 2.00, estimatedTime: 45, cycleEnd: new Date(Date.now() + 10 * 60 * 1000) },
      { id: "d8", type: "dryer", size: "50lb", status: "available", price: 3.00, estimatedTime: 50, cycleEnd: null }
    ]
  }
]

// In-memory store for sandbox data
let laundromats = [...nycLaundromats]

// Function to update machine statuses based on cycle times
function updateMachineStatuses() {
  const now = new Date()
  laundromats = laundromats.map(laundromat => ({
    ...laundromat,
    machines: laundromat.machines.map(machine => {
      if (machine.cycleEnd && machine.cycleEnd <= now) {
        return { ...machine, status: "available", cycleEnd: null }
      }
      return machine
    })
  }))
}

// Update machine statuses every minute
setInterval(updateMachineStatuses, 60 * 1000)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')

  // Update machine statuses before returning data
  updateMachineStatuses()

  if (lat && lng) {
    // Calculate distances from the given coordinates
    const userLat = parseFloat(lat)
    const userLng = parseFloat(lng)
    
    return NextResponse.json(
      laundromats.map(l => ({
        ...l,
        distance: calculateDistance(userLat, userLng, l.coordinates.lat, l.coordinates.lng)
      }))
      .sort((a, b) => a.distance - b.distance)
    )
  }

  return NextResponse.json(laundromats)
}

export async function POST(request: Request) {
  const data = await request.json()
  const newLaundromat = { id: Date.now().toString(), ...data }
  laundromats.push(newLaundromat)
  return NextResponse.json(newLaundromat)
}

export async function PUT(request: Request) {
  const data = await request.json()
  const index = laundromats.findIndex(l => l.id === data.id)
  if (index === -1) {
    return NextResponse.json({ error: 'Laundromat not found' }, { status: 404 })
  }
  laundromats[index] = { ...laundromats[index], ...data }
  return NextResponse.json(laundromats[index])
}

export async function DELETE(request: Request) {
  const { id } = await request.json()
  laundromats = laundromats.filter(l => l.id !== id)
  return NextResponse.json({ success: true })
}

// Helper function to calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371 // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  const d = R * c // Distance in km
  return Math.round(d * 0.621371 * 10) / 10 // Convert to miles and round to 1 decimal
}

function deg2rad(deg: number) {
  return deg * (Math.PI/180)
} 