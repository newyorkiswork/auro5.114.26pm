"use client"

import { usePathname } from "next/navigation"
import AuroButton from "@/components/AuroButton"
import { useEffect, useState } from "react"

export default function AuroButtonWrapper() {
  const pathname = usePathname()
  const [deviceType, setDeviceType] = useState<"mobile" | "tablet" | "desktop">("desktop")

  // Detect device type based on screen width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setDeviceType("mobile")
      } else if (window.innerWidth < 1024) {
        setDeviceType("tablet")
      } else {
        setDeviceType("desktop")
      }
    }

    // Initial check
    handleResize()

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Don't show the button on the home page
  if (pathname === "/") {
    return null
  }

  // Adjust button position for mobile with bottom navigation
  const buttonClasses =
    deviceType === "mobile"
      ? "bottom-20" // Position above bottom navigation
      : "bottom-6"

  return <AuroButton positionClass={buttonClasses} />
}
