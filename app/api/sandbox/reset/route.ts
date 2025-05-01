import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

// In-memory stores for sandbox data
let laundromats: any[] = []
let users: any[] = []
let bookings: any[] = []
let machines: any[] = []
let reminders: any[] = []
let accessCodes: any[] = []

export async function POST() {
  try {
    // Run the seed script
    const { stdout, stderr } = await execAsync('node scripts/seedSandbox.js')
    
    if (stderr) {
      console.error('Error seeding data:', stderr)
      return NextResponse.json({ error: 'Failed to seed data' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      message: 'Sandbox data reset successfully',
      output: stdout
    })
  } catch (error) {
    console.error('Error resetting sandbox data:', error)
    return NextResponse.json({ error: 'Failed to reset sandbox data' }, { status: 500 })
  }
} 