"use client"

import { useEffect, useState } from "react"
import type { Socket } from "socket.io-client"

// Mock socket events for development
const mockSocketEvents = (callback: (event: string, data: any) => void) => {
  const events = [
    { event: "machine_status", data: { machineId: "wash-001", status: "running", remainingTime: 25 * 60 } },
    { event: "cycle_update", data: { machineId: "wash-001", status: "running", remainingTime: 20 * 60 } },
    { event: "cycle_update", data: { machineId: "wash-001", status: "running", remainingTime: 15 * 60 } },
    { event: "cycle_update", data: { machineId: "wash-001", status: "running", remainingTime: 10 * 60 } },
    { event: "cycle_update", data: { machineId: "wash-001", status: "running", remainingTime: 5 * 60 } },
    { event: "notification", data: { type: "alert", message: "Your wash cycle is almost complete!" } },
    { event: "cycle_update", data: { machineId: "wash-001", status: "running", remainingTime: 1 * 60 } },
    { event: "notification", data: { type: "alert", message: "Your wash cycle will complete in 1 minute!" } },
    { event: "cycle_complete", data: { machineId: "wash-001", status: "completed" } },
  ]

  let index = 0
  const interval = setInterval(() => {
    if (index < events.length) {
      const { event, data } = events[index]
      callback(event, data)
      index++
    } else {
      clearInterval(interval)
    }
  }, 5000) // Simulate events every 5 seconds for demo

  return () => clearInterval(interval)
}

export function useSocket(bookingId: string) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [connected, setConnected] = useState(false)
  const [machineStatus, setMachineStatus] = useState<{
    status: string
    remainingTime: number
  }>({
    status: "initializing",
    remainingTime: 0,
  })
  const [notifications, setNotifications] = useState<Array<{ type: string; message: string }>>([])

  useEffect(() => {
    // In a real app, we would connect to a real socket server
    // For now, we'll simulate socket events

    // Mock connection status
    setConnected(true)

    // Initial machine status
    setMachineStatus({
      status: "running",
      remainingTime: 30 * 60, // 30 minutes in seconds
    })

    // Set up mock socket events
    const cleanup = mockSocketEvents((event, data) => {
      switch (event) {
        case "machine_status":
        case "cycle_update":
          setMachineStatus({
            status: data.status,
            remainingTime: data.remainingTime,
          })
          break
        case "cycle_complete":
          setMachineStatus({
            status: "completed",
            remainingTime: 0,
          })
          setNotifications((prev) => [...prev, { type: "success", message: "Your wash cycle is complete!" }])
          break
        case "notification":
          setNotifications((prev) => [...prev, data])
          break
      }
    })

    return () => {
      cleanup()
      setConnected(false)
    }
  }, [bookingId])

  return {
    socket,
    connected,
    machineStatus,
    notifications,
    clearNotification: (index: number) => {
      setNotifications((prev) => prev.filter((_, i) => i !== index))
    },
  }
}
