const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const laundromats = [
  {
    name: 'Wash & Fold NYC',
    address: '123 Broadway, New York, NY 10001',
    lat: 40.7128,
    lng: -74.0060,
    machines: [
      { type: 'washer', capacity: 20, count: 5 },
      { type: 'dryer', capacity: 30, count: 5 }
    ]
  },
  {
    name: 'Clean & Press Laundry',
    address: '456 5th Avenue, New York, NY 10018',
    lat: 40.7549,
    lng: -73.9840,
    machines: [
      { type: 'washer', capacity: 25, count: 4 },
      { type: 'dryer', capacity: 35, count: 4 }
    ]
  },
  {
    name: 'Fresh & Clean Laundromat',
    address: '789 Lexington Ave, New York, NY 10022',
    lat: 40.7589,
    lng: -73.9691,
    machines: [
      { type: 'washer', capacity: 18, count: 6 },
      { type: 'dryer', capacity: 25, count: 6 }
    ]
  }
]

const users = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    phone: '+1 (555) 123-4567'
  },
  {
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    phone: '+1 (555) 987-6543'
  }
]

const promotions = [
  {
    title: 'First Wash Free',
    description: 'Get your first wash free with any dryer purchase',
    discount: 100,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Happy Hour Special',
    description: '20% off all services between 2-4pm',
    discount: 20,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Student Discount',
    description: '15% off for students with valid ID',
    discount: 15,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  }
]

async function seed() {
  try {
    // Clear existing data
    await prisma.booking.deleteMany()
    await prisma.machine.deleteMany()
    await prisma.promotion.deleteMany()
    await prisma.laundromat.deleteMany()
    await prisma.user.deleteMany()

    // Create users
    const createdUsers = await Promise.all(
      users.map(user => prisma.user.create({ data: user }))
    )

    // Create laundromats with machines
    const createdLaundromats = await Promise.all(
      laundromats.map(async (laundromat) => {
        const { machines, ...laundromatData } = laundromat
        const createdLaundromat = await prisma.laundromat.create({ data: laundromatData })
        
        // Create machines for this laundromat
        const createdMachines = await Promise.all(
          machines.flatMap(machineType => 
            Array(machineType.count).fill(null).map((_, index) => 
              prisma.machine.create({
                data: {
                  name: `${machineType.type.toUpperCase()}${index + 1}`,
                  type: machineType.type,
                  capacity: machineType.capacity,
                  laundromatId: createdLaundromat.id,
                  status: 'available'
                }
              })
            )
          )
        )

        return { ...createdLaundromat, machines: createdMachines }
      })
    )

    // Create promotions
    const createdPromotions = await Promise.all(
      promotions.map((promo, index) => 
        prisma.promotion.create({
          data: {
            ...promo,
            laundromatId: createdLaundromats[index % createdLaundromats.length].id
          }
        })
      )
    )

    // Create sample bookings
    const sampleBookings = [
      {
        userId: createdUsers[0].id,
        laundromatId: createdLaundromats[0].id,
        machines: {
          connect: [{ id: createdLaundromats[0].machines[0].id }]
        },
        timeSlot: new Date(Date.now() + 24 * 60 * 60 * 1000),
        status: 'confirmed'
      },
      {
        userId: createdUsers[0].id,
        laundromatId: createdLaundromats[1].id,
        machines: {
          connect: [{ id: createdLaundromats[1].machines[0].id }]
        },
        timeSlot: new Date(Date.now() + 48 * 60 * 60 * 1000),
        status: 'pending'
      }
    ]

    const createdBookings = await Promise.all(
      sampleBookings.map(booking => prisma.booking.create({ data: booking }))
    )

    console.log('Seed completed successfully!')
    console.log('Created:', {
      users: createdUsers.length,
      laundromats: createdLaundromats.length,
      machines: createdLaundromats.reduce((acc, curr) => acc + curr.machines.length, 0),
      promotions: createdPromotions.length,
      bookings: createdBookings.length
    })

  } catch (error) {
    console.error('Error seeding database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seed() 