"use client"

import { useState, useEffect } from "react"
import { TopNavigation } from "./TopNavigation"
import { BottomNavigation } from "./BottomNavigation"
import { usePathname } from "next/navigation"
import { Home, Search, Calendar, Gift, User, BarChart3, Settings, Package } from "lucide-react"
import type { NavigationItem } from "@/types/navigation"

export function ResponsiveNavigation() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const pathname = usePathname()

  // Check if we're on an admin page
  const isAdminPage = pathname?.startsWith("/admin") || false
  const isUserPage = pathname?.startsWith("/user") || false

  // Define navigation items based on the current path
  const adminNavItems: NavigationItem[] = [
    { href: "/admin", label: "Dashboard", icon: Home },
    { href: "/admin/bookings", label: "Bookings", icon: Calendar },
    { href: "/admin/machines", label: "Machines", icon: Package },
    { href: "/admin/promotions", label: "Promotions", icon: Gift },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  ]

  const userNavItems: NavigationItem[] = [
    { href: "/user/dashboard", label: "Dashboard", icon: Home },
    { href: "/user/search", label: "Find Laundry", icon: Search },
    { href: "/user/booking", label: "Bookings", icon: Calendar },
    { href: "/user/rewards", label: "Rewards", icon: Gift },
  ]

  const homeNavItems: NavigationItem[] = [
    { href: "/", label: "Home", icon: Home },
    { href: "/user/dashboard", label: "User Portal", icon: User },
    { href: "/admin", label: "Admin Portal", icon: Settings },
  ]

  // Select the appropriate navigation items
  let navItems: NavigationItem[] = homeNavItems
  if (isAdminPage) {
    navItems = adminNavItems
  } else if (isUserPage) {
    navItems = userNavItems
  }

  useEffect(() => {
    // Check if dark mode is enabled
    const isDark = document.documentElement.classList.contains("dark")
    setIsDarkMode(isDark)

    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "class") {
          const isDark = document.documentElement.classList.contains("dark")
          setIsDarkMode(isDark)
        }
      })
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark")
    setIsDarkMode(!isDarkMode)
  }

  // Don't show navigation on landing page
  if (pathname === "/landing") {
    return null
  }

  return (
    <>
      <TopNavigation navItems={navItems} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      {isUserPage && <BottomNavigation navItems={userNavItems} pathname={pathname} />}
    </>
  )
}
