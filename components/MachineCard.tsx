"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type MachineStatus = "idle" | "running" | "paused" | "completed" | "error"
type MachineType = "washer" | "dryer"

interface MachineCardProps {
  id: string
  type: MachineType
  status: MachineStatus
  progress: number
  cycleType?: string
  soilLevel?: string
  drynessLevel?: string
  cycleTimeRemaining?: number
  onClick?: () => void
}

export function MachineCard({
  id,
  type,
  status,
  progress,
  cycleType,
  soilLevel,
  drynessLevel,
  cycleTimeRemaining,
  onClick,
}: MachineCardProps) {
  // Get animation class based on machine type and status
  const getAnimationClass = () => {
    if (status !== "running") return ""

    if (type === "washer") {
      if (cycleType === "Heavy-Duty" || soilLevel === "Heavy") return "animate-shake-slower"
      if (cycleType === "Quick") return "animate-spin"
      return "animate-spin-slow"
    } else {
      return "animate-pulse-slow"
    }
  }

  // Get status color
  const getStatusColor = () => {
    switch (status) {
      case "idle":
        return "bg-gray-100"
      case "running":
        return "bg-blue-100"
      case "paused":
        return "bg-yellow-100"
      case "completed":
        return "bg-green-100"
      case "error":
        return "bg-red-100"
      default:
        return "bg-gray-100"
    }
  }

  // Format time remaining
  const formatTimeRemaining = (seconds?: number) => {
    if (!seconds) return "N/A"
    const minutes = Math.floor(seconds / 60)
    return `${minutes}m left`
  }

  // Get status text
  const getStatusText = () => {
    switch (status) {
      case "idle":
        return "Available"
      case "running":
        return "Running"
      case "paused":
        return "Paused"
      case "completed":
        return "Completed"
      case "error":
        return "Error"
      default:
        return "Unknown"
    }
  }

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all duration-200",
        getStatusColor(),
        onClick && "cursor-pointer hover:shadow-md",
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-medium">
              {type === "washer" ? "Washer" : "Dryer"} #{id.slice(-3)}
            </h3>
            <p className="text-sm text-gray-500">{getStatusText()}</p>
          </div>
          <div className={cn("relative w-12 h-12 rounded-full flex items-center justify-center", getAnimationClass())}>
            {/* Progress ring */}
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="none" stroke="#e6e6e6" strokeWidth="2" />
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                stroke={status === "error" ? "#ef4444" : "#3b82f6"}
                strokeWidth="2"
                strokeDasharray={100}
                strokeDashoffset={100 - progress}
                strokeLinecap="round"
                transform="rotate(-90 18 18)"
              />
            </svg>
            <div className="absolute text-xs font-medium">{progress}%</div>
          </div>
        </div>

        {/* Cycle info */}
        {status === "running" && (
          <div className="space-y-2">
            <div className="flex gap-2">
              {cycleType && (
                <Badge variant="outline" className="bg-white">
                  {cycleType}
                </Badge>
              )}
              {soilLevel && (
                <Badge variant="outline" className="bg-white">
                  {soilLevel} Soil
                </Badge>
              )}
              {drynessLevel && (
                <Badge variant="outline" className="bg-white">
                  {drynessLevel} Dry
                </Badge>
              )}
            </div>
            {cycleTimeRemaining !== undefined && (
              <p className="text-sm font-medium">{formatTimeRemaining(cycleTimeRemaining)}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default MachineCard
