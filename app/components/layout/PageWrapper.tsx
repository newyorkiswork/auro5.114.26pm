"use client"

import { cn } from "@/lib/utils"

interface PageWrapperProps {
  children: React.ReactNode
  className?: string
  gridCols?: "1" | "2" | "3" | "4"
}

export function PageWrapper({
  children,
  className,
  gridCols = "4",
}: PageWrapperProps) {
  const gridClasses = {
    "1": "grid-cols-1",
    "2": "grid-cols-1 sm:grid-cols-2",
    "3": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    "4": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div
        className={cn(
          "grid gap-6 py-6",
          gridCols && gridClasses[gridCols],
          className
        )}
      >
        {children}
      </div>
    </div>
  )
} 