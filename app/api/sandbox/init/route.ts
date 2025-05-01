import { NextResponse } from 'next/server'

// NYC laundromats data
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
      { id: "w1", type: "washer", size: "40lb", status: "available", price: 4.50, estimatedTime: 35 },
      { id: "w2", type: "washer", size: "60lb", status: "available", price: 6.00, estimatedTime: 40 },
      { id: "d1", type: "dryer", size: "30lb", status: "available", price: 2.00, estimatedTime: 45 }
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
      { id: "w3", type: "washer", size: "40lb", status: "available", price: 4.50, estimatedTime: 35 },
      { id: "w4", type: "washer", size: "20lb", status: "available", price: 3.00, estimatedTime: 30 },
      { id: "d2", type: "dryer", size: "50lb", status: "available", price: 3.00, estimatedTime: 50 }
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
      { id: "w5", type: "washer", size: "40lb", status: "available", price: 4.50, estimatedTime: 35 },
      { id: "w6", type: "washer", size: "60lb", status: "available", price: 6.00, estimatedTime: 40 },
      { id: "d3", type: "dryer", size: "30lb", status: "available", price: 2.00, estimatedTime: 45 }
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
      { id: "w7", type: "washer", size: "40lb", status: "available", price: 4.50, estimatedTime: 35 },
      { id: "w8", type: "washer", size: "20lb", status: "available", price: 3.00, estimatedTime: 30 },
      { id: "d4", type: "dryer", size: "50lb", status: "available", price: 3.00, estimatedTime: 50 }
    ]
  }
]

// In-memory store for sandbox data
let laundromats = [...nycLaundromats]

export async function GET() {
  return NextResponse.json(laundromats)
}

export async function POST() {
  // Reset to initial NYC data
  laundromats = [...nycLaundromats]
  return NextResponse.json({ message: 'Initialized NYC laundromats', count: laundromats.length })
} 