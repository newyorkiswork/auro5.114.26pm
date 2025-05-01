"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface SandboxContextType {
  sandboxMode: boolean
  toggleSandboxMode: () => void
}

const SandboxContext = createContext<SandboxContextType | undefined>(undefined)

export function SandboxProvider({ children }: { children: ReactNode }) {
  const [sandboxMode, setSandboxMode] = useState(false)

  useEffect(() => {
    const savedMode = localStorage.getItem('sandboxMode')
    if (savedMode) {
      setSandboxMode(savedMode === 'true')
    }
  }, [])

  const toggleSandboxMode = () => {
    const newMode = !sandboxMode
    setSandboxMode(newMode)
    localStorage.setItem('sandboxMode', newMode.toString())
  }

  return (
    <SandboxContext.Provider value={{ sandboxMode, toggleSandboxMode }}>
      {sandboxMode && (
        <div className="bg-amber-100 text-amber-800 text-xs py-1 px-4 text-center">
          🚧 Sandbox Mode — all data is simulated until you add it.
        </div>
      )}
      {children}
    </SandboxContext.Provider>
  )
}

export function useSandbox() {
  const context = useContext(SandboxContext)
  if (context === undefined) {
    throw new Error('useSandbox must be used within a SandboxProvider')
  }
  return context
}
