"use client"

import { useState, useEffect, type ReactNode } from "react"
import { TopBar } from "./TopBar"
import { Sidebar } from "./Sidebar"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()

  // Check if mobile on initial render and when resizing
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setSidebarOpen(false)
      }
    }

    // Check initially
    checkIfMobile()

    // Add event listener for resize
    window.addEventListener("resize", checkIfMobile)

    // Clean up
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  // Close sidebar on mobile when navigating
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    }
  }, [pathname, isMobile])

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: isMobile ? "100%" : "280px", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`fixed md:relative z-20 h-full ${isMobile ? "w-full" : "w-[280px]"}`}
          >
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay for mobile sidebar */}
      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-10" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="relative flex flex-col flex-1 overflow-x-hidden overflow-y-auto">
        <TopBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 px-4 sm:px-6 py-8">{children}</main>
      </div>
    </div>
  )
}
