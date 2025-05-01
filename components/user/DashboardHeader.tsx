"use client"

import { useState } from "react"
import Link from "next/link"
import { cn } from "@/utils"
import { usePathname } from "next/navigation"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DashboardTab {
  label: string
  href: string
}

export function DashboardHeader() {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState("")

  const tabs: DashboardTab[] = [
    { label: "Dashboard", href: "/user/dashboard" },
    { label: "Find Laundry", href: "/user/search" },
    { label: "My Bookings", href: "/user/booking" },
    { label: "Shop", href: "/user/shop" },
    { label: "Rewards", href: "/user/rewards" },
  ]

  return (
    <div className="w-full bg-background border-b border-border/10 pb-1">
      {/* Main tabs */}
      <div className="flex items-center justify-between px-4 py-2">
        <nav className="flex space-x-6">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary relative py-2",
                pathname === tab.href ? "text-primary border-b-2 border-primary" : "text-muted-foreground",
              )}
            >
              {tab.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
