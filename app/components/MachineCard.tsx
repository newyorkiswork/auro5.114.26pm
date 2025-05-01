"use client"

import { useEffect, useState } from "react"
import { useSocket } from "@/hooks/useSocket"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface MachineStatus {
  id: string
  cycleType: string
  soilLevel: number
  drynessLevel: number
  progress: number
  timeRemaining: number
  status: "idle" | "running" | "completed" | "error"
}

interface MachineCardProps {
  machineId: string
  bookingId: string
}

const MachineCard: React.FC<MachineCardProps> = ({ machineId, bookingId }) => {
  const [status, setStatus] = useState<MachineStatus | null>(null)
  const { socket, machineStatus } = useSocket(bookingId)

  useEffect(() => {
    if (!socket) return

    const handleStatusUpdate = (data: MachineStatus) => {
      if (data.id === machineId) {
        setStatus(data)
      }
    }

    socket.on("machineStatus", handleStatusUpdate)
    return () => {
      socket.off("machineStatus", handleStatusUpdate)
    }
  }, [socket, machineId])

  if (!status) return null

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Machine {machineId}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Cycle Type</p>
            <p className="font-medium">{status.cycleType}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Soil Level</p>
            <Progress value={status.soilLevel} className="h-2" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Dryness Level</p>
            <Progress value={status.drynessLevel} className="h-2" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Progress</p>
            <Progress value={status.progress} className="h-2" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Time Remaining</p>
            <p className="font-medium">{status.timeRemaining} minutes</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <p className="font-medium capitalize">{status.status}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default MachineCard 