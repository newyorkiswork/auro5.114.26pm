import { NextResponse } from 'next/server'

// In-memory store for sandbox data
let users: any[] = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "(555) 123-4567",
    address: "123 Main St, New York, NY 10001",
    notifications: {
      email: true,
      sms: true,
      push: false
    },
    createdAt: "2024-04-30T10:00:00Z"
  }
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (userId) {
    const user = users.find(u => u.id === userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    return NextResponse.json(user)
  }

  return NextResponse.json(users)
}

export async function PUT(request: Request) {
  const data = await request.json()
  const index = users.findIndex(u => u.id === data.id)
  
  if (index === -1) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }
  
  users[index] = { ...users[index], ...data }
  return NextResponse.json(users[index])
}

export async function POST(request: Request) {
  const data = await request.json()
  const newUser = {
    id: `user-${users.length + 1}`,
    createdAt: new Date().toISOString(),
    ...data
  }
  
  users.push(newUser)
  return NextResponse.json(newUser)
} 