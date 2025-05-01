"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Clock } from "lucide-react"

interface BookingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  address: string
  machine: string
  machineType: string
  status: "active" | "upcoming" | "completed" | "cancelled"
  date?: string
  time?: string
  progress?: number
  timeRemaining?: string
  onViewDetails?: () => void
  onCancel?: () => void
}

export function BookingCard({
  title,
  address,
  machine,
  machineType,
  status,
  date,
  time,
  progress,
  timeRemaining,
  onViewDetails,
  onCancel,
  className,
  ...props
}: BookingCardProps) {
  const statusColors = {
    active: "bg-green-500 text-white",
    upcoming: "bg-blue-500 text-white",
    completed: "bg-gray-500 text-white",
    cancelled: "bg-red-500 text-white",
  }

  const machineIcons = {
    Washer: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-blue-500"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <circle cx="12" cy="12" r="5" />
        <path d="M12 7v10" />
        <path d="M7 12h10" />
      </svg>
    ),
    Dryer: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-orange-500"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <circle cx="12" cy="12" r="5" />
        <path d="M3 9h18" />
      </svg>
    ),
  }

  return (
    <Card className={cn("overflow-hidden border-0 shadow-sm", className)} {...props}>
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg">{title}</h3>
              <Badge className={statusColors[status]}>{status}</Badge>
            </div>
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{address}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-2">
            {machineType in machineIcons ? machineIcons[machineType as keyof typeof machineIcons] : null}
            <span className="font-medium">
              {machineType} {machine}
            </span>
          </div>
          {date && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{date}</span>
            </div>
          )}
          {time && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{time}</span>
            </div>
          )}
        </div>

        {status === "active" && progress !== undefined && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>In Progress</span>
              {timeRemaining && <span>{timeRemaining} remaining</span>}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className="bg-green-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-4">
          {status === "upcoming" && onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          {onViewDetails && (
            <Button variant="default" onClick={onViewDetails}>
              View Details
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
