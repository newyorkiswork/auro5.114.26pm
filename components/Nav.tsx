"use client"

import { useLayoutEffect, useState } from "react"
import { Button } from "./ui/button"
import { Moon, Sun, Menu, X } from "lucide-react"
import { cn } from "@/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

export const Nav = () => {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useLayoutEffect(() => {
    const el = document.documentElement

    if (el.classList.contains("dark")) {
      setIsDarkMode(true)
    } else {
      setIsDarkMode(false)
    }

    // Add scroll event listener to detect when user scrolls
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    // Add resize event listener to close mobile menu on larger screens
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("resize", handleResize)

    // Initial checks
    handleScroll()
    handleResize()

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const toggleDark = () => {
    const el = document.documentElement
    el.classList.toggle("dark")
    setIsDarkMode((prev) => !prev)
  }

  // Navigation links
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/user", label: "User" },
    { href: "/admin", label: "Admin" },
    { href: "/landing", label: "Landing" },
  ]

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        isScrolled ? "backdrop-blur-md bg-background/80 shadow-sm" : "backdrop-blur-sm bg-background/60",
        isMobileMenuOpen && "bg-background/95 backdrop-blur-lg",
      )}
    >
      {/* Main header bar */}
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo/Brand - hidden on very small screens */}
        <div className="py-3 md:py-4">
          <Link href="/" className="font-semibold text-lg md:text-xl">
            Auro
          </Link>
        </div>

        {/* Desktop Navigation - hidden on mobile */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === link.href ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side controls */}
        <div className="flex items-center space-x-2">
          {/* Theme toggle - smaller on mobile */}
          <Button onClick={toggleDark} variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10">
            {isDarkMode ? <Sun className="h-4 w-4 md:h-5 md:w-5" /> : <Moon className="h-4 w-4 md:h-5 md:w-5" />}
            <span className="sr-only">{isDarkMode ? "Light" : "Dark"} Mode</span>
          </Button>

          {/* Mobile menu button - only visible on mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-8 w-8"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu - slides down when open */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border/10">
          <nav className="flex flex-col space-y-3 p-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-2 py-1.5 text-sm font-medium rounded-md transition-colors",
                  pathname === link.href
                    ? "bg-primary/10 text-foreground"
                    : "text-muted-foreground hover:bg-primary/5 hover:text-foreground",
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
