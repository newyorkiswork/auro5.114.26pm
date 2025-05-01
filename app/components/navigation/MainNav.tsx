"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Home, 
  Search, 
  Calendar, 
  ShoppingBag, 
  Award, 
  User 
} from "lucide-react"

const mainNavItems = [
  {
    title: "Dashboard",
    href: "/user/dashboard",
    icon: Home
  },
  {
    title: "Find Laundry",
    href: "/user/search",
    icon: Search
  },
  {
    title: "Bookings",
    href: "/user/bookings",
    icon: Calendar
  },
  {
    title: "Shop",
    href: "/user/shop",
    icon: ShoppingBag
  },
  {
    title: "Rewards",
    href: "/user/rewards",
    icon: Award
  }
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex w-full justify-between items-center gap-6 md:gap-10">
          {/* Brand Logo */}
          <Link href="/" className="hidden md:block">
            <span className="text-xl font-bold">Auro</span>
          </Link>

          {/* Main Navigation */}
          <Tabs defaultValue={pathname} className="w-full max-w-3xl mx-auto">
            <TabsList className="grid w-full grid-cols-5">
              {mainNavItems.map((item) => {
                const Icon = item.icon
                return (
                  <TabsTrigger
                    key={item.href}
                    value={item.href}
                    className="data-[state=active]:font-bold"
                    asChild
                  >
                    <Link href={item.href} className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <span className="hidden md:inline-block">{item.title}</span>
                    </Link>
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </Tabs>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatar.jpg" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link href="/user/profile" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
} 