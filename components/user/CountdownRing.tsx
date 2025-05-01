"use client"

import { useEffect, useState } from "react"

interface CountdownRingProps {
  progress: number
  timeRemaining: number
  cycle: string
  size?: number
  strokeWidth?: number
  className?: string
}

export function CountdownRing({
  progress,
  timeRemaining,
  cycle,
  size = 200,
  strokeWidth = 12,
  className = "",
}: CountdownRingProps) {
  const [dashOffset, setDashOffset] = useState(0)

  // Calculate time in minutes and seconds
  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60

  // Calculate circle properties
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI

  useEffect(() => {
    const offset = circumference - (progress / 100) * circumference
    setDashOffset(offset)
  }, [progress, circumference])

  // Determine color based on progress
  const getColor = () => {
    if (progress < 33) return "stroke-blue-500"
    if (progress < 66) return "stroke-yellow-500"
    return "stroke-green-500"
  }

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e6e6e6" strokeWidth={strokeWidth} />

        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          className={`transition-all duration-500 ease-in-out ${getColor()}`}
        />
      </svg>

      {/* Time display */}
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-bold">
          {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
        </span>
        <span className="text-sm text-gray-500 mt-1">{cycle}</span>
      </div>
    </div>
  )
}
