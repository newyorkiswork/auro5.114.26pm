"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

interface SnackbarAlertProps {
  message: string
  type?: "info" | "success" | "warning" | "error"
  duration?: number
  onClose?: () => void
}

export function SnackbarAlert({ message, type = "info", duration = 5000, onClose }: SnackbarAlertProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      if (onClose) onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  if (!isVisible) return null

  const bgColor = {
    info: "bg-blue-500",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-red-500",
  }[type]

  return (
    <div
      className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 ${bgColor} text-white px-6 py-3 rounded-2xl shadow-lg z-50 flex items-center justify-between min-w-[300px] max-w-md animate-slide-up`}
      role="alert"
    >
      <span>{message}</span>
      <button
        onClick={() => {
          setIsVisible(false)
          if (onClose) onClose()
        }}
        className="ml-4 p-1 rounded-full hover:bg-white/20 transition-colors"
        aria-label="Close alert"
      >
        <X size={16} />
      </button>
    </div>
  )
}
