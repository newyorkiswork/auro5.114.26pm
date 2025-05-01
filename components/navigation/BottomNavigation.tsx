"use client"

import Link from "next/link"
import { cn } from "@/utils"
import type { NavigationItem } from "@/types/navigation"

interface BottomNavigationProps {
  navItems: NavigationItem[]
  pathname: string | null
}

export function BottomNavigation({ navItems, pathname }: BottomNavigationProps) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border/20 h-16 px-2">
      <div className="flex items-center justify-around h-full">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full",
                isActive ? "text-primary" : "text-muted-foreground",
              )}
            >
              {Icon && (
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full mb-1",
                    isActive ? "bg-primary/10" : "bg-transparent",
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
              )}
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
