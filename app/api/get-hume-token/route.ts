import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // In a production environment, you would fetch this from a secure backend
    // For development, we'll use the environment variable
    const accessToken = process.env.HUME_ACCESS_TOKEN

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Hume access token not configured' },
        { status: 500 }
      )
    }

    return NextResponse.json({ accessToken })
  } catch (error) {
    console.error('Error getting Hume token:', error)
    return NextResponse.json(
      { error: 'Failed to get Hume access token' },
      { status: 500 }
    )
  }
}
