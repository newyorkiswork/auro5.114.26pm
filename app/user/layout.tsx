import type React from "react"
import { MainNav } from "../components/navigation/MainNav"
import SandboxModal from "../components/SandboxModal"

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      <SandboxModal />
    </div>
  )
}
