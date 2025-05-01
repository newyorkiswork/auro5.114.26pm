"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Menu, X, ChevronRight } from "lucide-react"
import { cn } from "@/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { NavigationItem } from "@/types/navigation"
import { motion, AnimatePresence } from "framer-motion"

interface SidebarNavigationProps {
  navItems: NavigationItem[]
  isDarkMode: boolean
  toggleDarkMode: () => void
}

export function SidebarNavigation({ navItems, isDarkMode, toggleDarkMode }: SidebarNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

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

  // Close sidebar when navigating
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Prevent scrolling when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  return (
    <>
      {/* Header with toggle button */}
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300 w-full",
          isScrolled ? "backdrop-blur-md bg-background/80 shadow-sm" : "backdrop-blur-sm bg-background/60",
        )}
      >
        <div className="container mx-auto px-4 flex items-center justify-between h-14">
          {/* Logo/Brand */}
          <Link href="/" className="font-semibold text-lg">
            Auro
          </Link>

          <div className="flex items-center space-x-2">
            {/* Theme toggle */}
            <Button onClick={toggleDarkMode} variant="ghost" size="icon" className="h-9 w-9">
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span className="sr-only">{isDarkMode ? "Light" : "Dark"} Mode</span>
            </Button>

            {/* Sidebar toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="fixed top-14 right-0 bottom-0 w-64 bg-background border-l border-border z-50 overflow-y-auto"
            >
              <nav className="flex flex-col p-4 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between px-4 py-3 rounded-md text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "bg-primary/10 text-foreground"
                        : "hover:bg-primary/5 text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <div className="flex items-center">
                      {item.icon && <item.icon className="mr-3 h-5 w-5" />}
                      {item.label}
                    </div>
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </Link>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
