"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Bell, Search, ChevronDown } from "lucide-react"
import { cn } from "@/utils"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import type { NavigationItem } from "@/types/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface TopNavigationProps {
  navItems: NavigationItem[]
  isDarkMode: boolean
  toggleDarkMode: () => void
}

export function TopNavigation({ navItems, isDarkMode, toggleDarkMode }: TopNavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  // Determine which portal we're in based on the pathname
  const currentPortal = pathname?.startsWith("/admin") ? "Admin" : pathname?.startsWith("/user") ? "User" : "Home"

  // Define available portals
  const portals = [
    { name: "User", href: "/user/dashboard" },
    { name: "Admin", href: "/admin" },
    { name: "Home", href: "/" },
  ]

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300 w-full border-b",
        isScrolled ? "bg-background shadow-sm h-16 border-border/30" : "bg-background h-16 border-border/10",
      )}
    >
      <div className="container mx-auto h-full flex items-center justify-between">
        {/* Left section: Logo and Portal Selector */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center">
            <div className="relative h-10 w-10 flex items-center justify-center">
              <Image src="/auro-logo.svg" alt="Auro Logo" width={40} height={40} className="object-contain" priority />
            </div>
            <span className="font-bold text-xl text-primary ml-2 hidden sm:inline-block">AURO</span>
          </Link>

          {/* Portal Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-2 h-8 gap-1">
                {currentPortal} Portal
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[180px]">
              <DropdownMenuLabel>Switch Portal</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {portals.map((portal) => (
                <DropdownMenuItem key={portal.name} asChild>
                  <Link
                    href={portal.href}
                    className={cn(
                      "cursor-pointer",
                      portal.name === currentPortal && "bg-primary/10 text-primary font-medium",
                    )}
                  >
                    {portal.name} Portal
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Center section: Main Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-3 py-2 text-sm font-medium transition-colors rounded-md",
                pathname === item.href
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right section: Search, Notifications, Theme, Profile */}
        <div className="flex items-center space-x-1">
          {/* Search button */}
          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-primary rounded-full"></span>
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-y-auto">
                <DropdownMenuItem className="flex flex-col items-start py-2">
                  <div className="font-medium">Your laundry is ready!</div>
                  <div className="text-xs text-muted-foreground">5 minutes ago</div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start py-2">
                  <div className="font-medium">Booking confirmed</div>
                  <div className="text-xs text-muted-foreground">1 hour ago</div>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center text-primary">View all notifications</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme toggle */}
          <Button
            onClick={toggleDarkMode}
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-muted-foreground"
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full ml-1">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-avatar.png" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Rewards</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
