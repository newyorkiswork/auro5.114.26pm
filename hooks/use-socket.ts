"use client"

import { useEffect, useState } from "react"
import { io, type Socket } from "socket.io-client"

// This is a mock implementation since we don't have a real Socket.io server
export function useSocket(url: string) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // In a real implementation, we would connect to a real Socket.io server
    // For now, we'll create a mock socket that emits events on a timer
    const mockSocket = io(url, {
      autoConnect: false,
      // This is just for the mock, in production we would connect to a real server
    })

    // Mock the connection event
    setTimeout(() => {
      setIsConnected(true)
      mockSocket.connected = true
      mockSocket.emit("connect")
    }, 500)

    setSocket(mockSocket)

    return () => {
      mockSocket.close()
      setIsConnected(false)
    }
  }, [url])

  return { socket, isConnected }
}

// Mock socket for machine monitoring
export function useMachineMonitor(machineId: string) {
  const [progress, setProgress] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(1800) // 30 minutes in seconds
  const [cycle, setCycle] = useState("Washing")
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(interval)
          setIsComplete(true)
          return 0
        }
        return prev - 1
      })

      setProgress((prev) => {
        const newProgress = prev + 100 / 1800 // Increase by percentage per second
        if (newProgress >= 100) {
          return 100
        }
        return newProgress
      })

      // Change cycle at certain points
      if (timeRemaining === 900) {
        // 15 minutes left
        setCycle("Rinsing")
      } else if (timeRemaining === 300) {
        // 5 minutes left
        setCycle("Spinning")
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [machineId, timeRemaining])

  return { progress, timeRemaining, cycle, isComplete }
}
