import { NextResponse } from 'next/server'

// In-memory store for sandbox data
let machines: any[] = []

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const locationId = searchParams.get('locationId')

  const filteredMachines = locationId
    ? machines.filter(m => m.locationId === locationId)
    : machines

  return NextResponse.json(filteredMachines)
}

export async function POST(request: Request) {
  const data = await request.json()
  const newMachine = { id: Date.now().toString(), ...data }
  machines.push(newMachine)
  return NextResponse.json(newMachine)
}

export async function PUT(request: Request) {
  const data = await request.json()
  const index = machines.findIndex(m => m.id === data.id)
  if (index === -1) {
    return NextResponse.json({ error: 'Machine not found' }, { status: 404 })
  }
  machines[index] = { ...machines[index], ...data }
  return NextResponse.json(machines[index])
}

export async function DELETE(request: Request) {
  const { id } = await request.json()
  machines = machines.filter(m => m.id !== id)
  return NextResponse.json({ success: true })
} 