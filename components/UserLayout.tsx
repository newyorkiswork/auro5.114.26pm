"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Mic,
  User,
  Calendar,
  LogOut,
  Menu,
  ChevronRight,
  Home,
  Search,
  Gift,
  Bell,
  Settings,
  HelpCircle,
  ShoppingBag,
} from "lucide-react"
import VoiceUI from "@/components/VoiceUI"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useSandbox } from "@/contexts/SandboxContext"
import SandboxModal from "@/components/SandboxModal"

interface UserLayoutProps {
  children: React.ReactNode
}

export default function UserLayout({ children }: UserLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isVoiceUIOpen, setIsVoiceUIOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isSandboxModalOpen, setIsSandboxModalOpen] = useState(false)

  const { sandboxMode } = useSandbox()

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { name: "Home", href: "/user/dashboard", icon: Home },
    { name: "Find Laundromat", href: "/user/search", icon: Search },
    { name: "My Bookings", href: "/user/history", icon: Calendar },
    { name: "Shop", href: "/user/shop", icon: ShoppingBag },
    { name: "Rewards", href: "/user/rewards", icon: Gift },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header
        className={`sticky top-0 z-10 transition-all duration-200 ${
          scrolled ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm" : "bg-white dark:bg-gray-900"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/user/dashboard" className="flex items-center">
              <Image src="/auro-logo.svg" alt="Auro Logo" width={100} height={40} priority />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === item.href ||
                    (item.href === "/user/dashboard" && pathname === "/user") ||
                    (item.href === "/user/history" && pathname?.startsWith("/user/booking"))
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="h-5 w-5" />
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">2</Badge>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Notifications</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full" aria-label="User menu">
                    <Avatar className="h-8 w-8 transition-transform hover:scale-110">
                      <AvatarImage src="/placeholder.svg?key=0014x" alt="User" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-[300px] sm:w-[400px]">
                  <div className="py-4">
                    <div className="flex items-center gap-4 mb-6">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="/placeholder.svg?key=9t42c" alt="User" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="text-lg font-semibold">John Doe</h2>
                        <p className="text-sm text-muted-foreground">john.doe@example.com</p>
                      </div>
                    </div>

                    <nav className="space-y-1">
                      <Link
                        href="/user/profile"
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-muted"
                      >
                        <div className="flex items-center gap-3">
                          <User size={18} />
                          <span>Profile</span>
                        </div>
                        <ChevronRight size={16} />
                      </Link>
                      <Link
                        href="/user/history"
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-muted"
                      >
                        <div className="flex items-center gap-3">
                          <Calendar size={18} />
                          <span>My Bookings</span>
                        </div>
                        <ChevronRight size={16} />
                      </Link>
                      <Link
                        href="/user/settings"
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-muted"
                      >
                        <div className="flex items-center gap-3">
                          <Settings size={18} />
                          <span>Settings</span>
                        </div>
                        <ChevronRight size={16} />
                      </Link>
                      <Link
                        href="/user/help"
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-muted"
                      >
                        <div className="flex items-center gap-3">
                          <HelpCircle size={18} />
                          <span>Help & Support</span>
                        </div>
                        <ChevronRight size={16} />
                      </Link>
                      <div className="h-px bg-border my-2"></div>
                      <Link href="/" className="flex items-center justify-between p-3 rounded-lg hover:bg-muted">
                        <div className="flex items-center gap-3">
                          <LogOut size={18} />
                          <span>Sign Out</span>
                        </div>
                        <ChevronRight size={16} />
                      </Link>
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Mobile Menu Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu">
                    <Menu size={20} />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[250px]">
                  <div className="py-4">
                    <div className="mb-6">
                      <Link href="/user/dashboard" className="flex items-center">
                        <Image src="/auro-logo.svg" alt="Auro Logo" width={100} height={40} />
                      </Link>
                    </div>
                    <nav className="space-y-1">
                      {navItems.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={`flex items-center p-3 rounded-lg hover:bg-muted ${
                            pathname === item.href ||
                            (item.href === "/user/dashboard" && pathname === "/user") ||
                            (item.href === "/user/history" && pathname?.startsWith("/user/booking"))
                              ? "bg-primary/10 text-primary"
                              : "text-foreground"
                          }`}
                        >
                          <item.icon className="mr-3 h-5 w-5" />
                          {item.name}
                        </Link>
                      ))}
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">{children}</main>

      {/* Floating Voice Button */}
      <div className="fixed bottom-6 right-6 z-10">
        <Button
          onClick={() => setIsVoiceUIOpen(true)}
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105"
        >
          <Mic className="h-6 w-6" />
        </Button>
      </div>

      {/* Floating Sandbox Controls Button */}
      {sandboxMode && (
        <div className="fixed bottom-6 left-6 z-10">
          <Button
            onClick={() => setIsSandboxModalOpen(true)}
            size="icon"
            className="h-14 w-14 rounded-full shadow-lg bg-amber-500 hover:bg-amber-600 transition-all duration-300 hover:scale-105"
          >
            <Settings className="h-6 w-6" />
          </Button>
        </div>
      )}

      {/* Voice UI Side Panel */}
      <Sheet open={isVoiceUIOpen} onOpenChange={setIsVoiceUIOpen}>
        <SheetContent className="w-[350px] sm:w-[450px]">
          <VoiceUI onClose={() => setIsVoiceUIOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Sandbox Modal */}
      {sandboxMode && <SandboxModal open={isSandboxModalOpen} onOpenChange={setIsSandboxModalOpen} />}
    </div>
  )
}

// Add named export for compatibility
export { UserLayout }
