"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function StatusPage() {
  const [status, setStatus] = useState<{
    hume: { status: "loading" | "online" | "offline" | "error"; message?: string }
    voice: { status: "loading" | "available" | "unavailable" | "error"; message?: string }
    lastChecked: string | null
  }>({
    hume: { status: "loading" },
    voice: { status: "loading" },
    lastChecked: null,
  })

  const [isChecking, setIsChecking] = useState(false)

  const checkStatus = async () => {
    setIsChecking(true)
    setStatus((prev) => ({
      ...prev,
      hume: { status: "loading" },
      voice: { status: "loading" },
    }))

    try {
      // This would be replaced with actual API calls to check status
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate response
      const humeStatus = Math.random() > 0.2 ? "online" : "error"
      const voiceStatus = Math.random() > 0.2 ? "available" : "unavailable"

      setStatus({
        hume: {
          status: humeStatus as "online" | "offline" | "error",
          message: humeStatus === "error" ? "API rate limit exceeded" : undefined,
        },
        voice: {
          status: voiceStatus as "available" | "unavailable" | "error",
          message: voiceStatus === "unavailable" ? "Voice service temporarily unavailable" : undefined,
        },
        lastChecked: new Date().toLocaleString(),
      })
    } catch (error) {
      setStatus({
        hume: { status: "error", message: "Failed to check status" },
        voice: { status: "error", message: "Failed to check status" },
        lastChecked: new Date().toLocaleString(),
      })
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    checkStatus()
    // Check status every 5 minutes
    const interval = setInterval(checkStatus, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
      case "available":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "offline":
      case "unavailable":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-amber-500" />
      default:
        return <RefreshCw className="h-5 w-5 animate-spin" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online":
      case "available":
        return <Badge className="bg-green-500">Online</Badge>
      case "offline":
      case "unavailable":
        return <Badge className="bg-red-500">Offline</Badge>
      case "error":
        return <Badge className="bg-amber-500">Error</Badge>
      default:
        return <Badge className="bg-blue-500">Checking...</Badge>
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">System Status</h1>
        <Button onClick={checkStatus} disabled={isChecking} variant="outline" className="flex gap-2">
          {isChecking ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Refresh
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Hume AI API</CardTitle>
              {getStatusBadge(status.hume.status)}
            </div>
            <CardDescription>Connection status to Hume AI API services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {getStatusIcon(status.hume.status)}
              <span>
                {status.hume.status === "loading"
                  ? "Checking connection..."
                  : status.hume.status === "online"
                    ? "Connected and operational"
                    : status.hume.message || "Connection issue detected"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Voice Interface</CardTitle>
              {getStatusBadge(status.voice.status)}
            </div>
            <CardDescription>Status of voice recognition services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {getStatusIcon(status.voice.status)}
              <span>
                {status.voice.status === "loading"
                  ? "Checking voice services..."
                  : status.voice.status === "available"
                    ? "Voice recognition available"
                    : status.voice.message || "Voice services unavailable"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {status.lastChecked && <p className="text-sm text-gray-500 mt-6">Last checked: {status.lastChecked}</p>}

      <div className="mt-8">
        <Link href="/voice-interface">
          <Button variant="outline">Back to Voice Interface</Button>
        </Link>
      </div>
    </div>
  )
}
