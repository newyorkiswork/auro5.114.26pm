import { useState, useEffect } from 'react'

interface Toast {
  id: string
  title: string
  description?: string
  variant?: 'default' | 'destructive'
}

interface ToastContextType {
  toasts: Toast[]
  toast: (toast: Omit<Toast, 'id'>) => void
  dismissToast: (id: string) => void
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = (newToast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { ...newToast, id }])
  }

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        setToasts((prev) => prev.slice(1))
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [toasts])

  return { toasts, toast, dismissToast }
}

export const toast = {
  success: (title: string, description?: string) => {
    const id = Math.random().toString(36).substr(2, 9)
    const event = new CustomEvent('toast', {
      detail: { id, title, description, variant: 'default' },
    })
    window.dispatchEvent(event)
  },
  error: (title: string, description?: string) => {
    const id = Math.random().toString(36).substr(2, 9)
    const event = new CustomEvent('toast', {
      detail: { id, title, description, variant: 'destructive' },
    })
    window.dispatchEvent(event)
  },
} 