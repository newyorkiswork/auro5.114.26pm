import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import { cn } from "@/utils"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import AuroButtonWrapper from "@/components/AuroButtonWrapper"
import { QueryProvider } from "@/components/providers/query-provider"
import { SandboxProvider } from '@/contexts/SandboxContext'

// Initialize Poppins font
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "Auro - Laundry Assistant",
  description: "A laundry assistant powered by Hume AI's Empathic Voice Interface",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      </head>
      <body className={cn(poppins.variable, "flex flex-col min-h-screen bg-background font-sans antialiased")}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <QueryProvider>
            <SandboxProvider>
              <main className="flex-1 flex flex-col">{children}</main>
              <AuroButtonWrapper />
            </SandboxProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
