"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  CalendarDays,
  WashingMachineIcon as Washing,
  LifeBuoy,
  Tag,
  BarChart2,
  Activity,
  X,
} from "lucide-react"
import { cn } from "@/utils"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  onClose: () => void
}

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const navItems: NavItem[] = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      label: "Bookings & Walk-Ins",
      href: "/admin/bookings",
      icon: CalendarDays,
    },
    {
      label: "Machines & Floorplan",
      href: "/admin/machines",
      icon: Washing,
    },
    {
      label: "Support & Tickets",
      href: "/admin/tickets",
      icon: LifeBuoy,
    },
    {
      label: "Promotions & Loyalty",
      href: "/admin/promotions",
      icon: Tag,
    },
    {
      label: "Analytics & Reports",
      href: "/admin/analytics",
      icon: BarChart2,
    },
    {
      label: "System Status",
      href: "/admin/status",
      icon: Activity,
    },
  ]

  return (
    <div className={cn("flex flex-col h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700")}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <Link href="/admin" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center">
            <span className="font-bold text-white">A</span>
          </div>
          {!collapsed && (
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Auro Admin
            </span>
          )}
        </Link>
        <div className="flex md:hidden">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto py-6 px-3">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href))

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5",
                    isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400",
                  )}
                />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Admin User</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">admin@aurolaundry.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}
