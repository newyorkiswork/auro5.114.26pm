"use client"

import { useState } from "react"
import { Bell, Search, Menu, X, Settings, LogOut, User, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "next-themes"

interface TopBarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export function TopBar({ sidebarOpen, setSidebarOpen }: TopBarProps) {
  const [notificationCount] = useState(3)
  const { theme, setTheme } = useTheme()
  const isDarkMode = theme === "dark"

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 border-b bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        <div className="hidden md:flex items-center space-x-2">
          <span className="font-semibold text-lg bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Auro Admin
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="hidden md:flex relative max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input type="search" placeholder="Search by user, booking ID, QR..." className="pl-9 w-[300px]" />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <Badge className="absolute -top-1 -right-1 px-1.5 min-w-5 h-5 flex items-center justify-center bg-red-500 text-white border-2 border-white dark:border-gray-800">
                  {notificationCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-72 overflow-y-auto">
              <div className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                <div className="font-medium text-sm">Maintenance alert</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Washer #5 reported error code E-11</div>
                <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">5 minutes ago</div>
              </div>
              <div className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                <div className="font-medium text-sm">New booking</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Alex Johnson booked Washer #2 for 3:00 PM
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">15 minutes ago</div>
              </div>
              <div className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                <div className="font-medium text-sm">Support ticket opened</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">User reported issues with payment system</div>
                <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">1 hour ago</div>
              </div>
            </div>
            <DropdownMenuSeparator />
            <div className="p-2 text-center">
              <Button variant="ghost" size="sm" className="w-full">
                View all notifications
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(isDarkMode ? "light" : "dark")}
          className="rounded-full"
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 flex items-center gap-2 pl-2 pr-1">
              <Avatar className="h-7 w-7">
                <AvatarImage src="/avatar.jpg" alt="Admin" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline font-medium text-sm">Admin</span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
