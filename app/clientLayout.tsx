"use client"

import type React from "react"
import { Poppins } from "next/font/google"
import { Nav } from "@/components/Nav"
import { cn } from "@/utils"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import AuroButton from "@/components/AuroButton"
import { usePathname } from "next/navigation"

// Initialize Poppins font
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})

// Client component to conditionally render AuroButton
function AuroButtonWrapper() {
  const pathname = usePathname()

  // Don't show the button on the home page
  if (pathname === "/") {
    return null
  }

  return <AuroButton />
}

export default function ClientRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(poppins.variable, "flex flex-col min-h-screen bg-background font-sans antialiased")}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Nav />
          <main className="flex-1 flex flex-col">{children}</main>
          <AuroButtonWrapper />
        </ThemeProvider>
      </body>
    </html>
  )
}
