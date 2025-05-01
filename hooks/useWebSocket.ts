"use client"

import { useState, useEffect, useCallback } from "react"
import { io, type Socket } from "socket.io-client"
import { useSandbox } from "@/contexts/SandboxContext"

export function useWebSocket<T>(endpoint: string, event: string) {
  const [data, setData] = useState<T | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { sandboxMode } = useSandbox()

  const socketUrl = sandboxMode ? "/api/sandbox/ws" : "/api/ws"

  useEffect(() => {
    const socket: Socket = io(socketUrl, {
      path: endpoint,
      transports: ["websocket"],
    })

    socket.on("connect", () => {
      setIsConnected(true)
      setError(null)
    })

    socket.on("connect_error", (err) => {
      setError(err)
      setIsConnected(false)
    })

    socket.on(event, (newData: T) => {
      setData(newData)
    })

    return () => {
      socket.disconnect()
    }
  }, [socketUrl, endpoint, event])

  const emit = useCallback(
    (eventName: string, data: any) => {
      const socket: Socket = io(socketUrl, {
        path: endpoint,
      })
      socket.emit(eventName, data)
    },
    [socketUrl, endpoint],
  )

  return { data, isConnected, error, emit }
}
