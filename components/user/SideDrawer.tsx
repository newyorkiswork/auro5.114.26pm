"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

interface SideDrawerProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  position?: "left" | "right"
}

export function SideDrawer({ isOpen, onClose, title, children, position = "right" }: SideDrawerProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 300) // Match this with the CSS transition duration

      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!isVisible && !isOpen) return null

  const positionClasses = position === "right" ? "right-0 translate-x-full" : "left-0 -translate-x-full"

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${isOpen ? "opacity-50" : "opacity-0"}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`absolute inset-y-0 max-w-md w-full bg-white shadow-xl transition-transform duration-300 ease-in-out ${positionClasses} ${
          isOpen ? "translate-x-0" : ""
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 id="drawer-title" className="text-lg font-semibold">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close drawer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto h-[calc(100%-64px)]">{children}</div>
      </div>
    </div>
  )
}
