import type { LucideIcon } from "lucide-react"
import { cn } from "@/utils"

interface KpiCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  change?: {
    value: number
    positive: boolean
  }
  className?: string
  iconClassName?: string
}

export function KpiCard({ title, value, icon: Icon, description, change, className, iconClassName }: KpiCardProps) {
  return (
    <div className={cn("rounded-2xl border bg-white p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700", className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <div
          className={cn(
            "rounded-full p-2",
            iconClassName || "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-2">
        <p className="text-3xl font-bold">{value}</p>
        {description && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{description}</p>}
      </div>

      {change && (
        <div className="mt-3 flex items-center gap-1">
          <span
            className={cn(
              "text-xs font-medium",
              change.positive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400",
            )}
          >
            {change.value}%
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">vs last week</span>
        </div>
      )}
    </div>
  )
}
