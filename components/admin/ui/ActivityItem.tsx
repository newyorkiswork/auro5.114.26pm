import { cn } from "@/utils"
import type { LucideIcon } from "lucide-react"

export type ActivityType = "booking" | "error" | "ticket" | "promotion" | "payment"

interface ActivityItemProps {
  type: ActivityType
  title: string
  description: string
  time: string
  icon?: LucideIcon
}

export function ActivityItem({ type, title, description, time, icon: Icon }: ActivityItemProps) {
  const getTypeStyles = () => {
    switch (type) {
      case "booking":
        return {
          bg: "bg-blue-100 dark:bg-blue-900",
          text: "text-blue-600 dark:text-blue-400",
        }
      case "error":
        return {
          bg: "bg-red-100 dark:bg-red-900",
          text: "text-red-600 dark:text-red-400",
        }
      case "ticket":
        return {
          bg: "bg-amber-100 dark:bg-amber-900",
          text: "text-amber-600 dark:text-amber-400",
        }
      case "promotion":
        return {
          bg: "bg-green-100 dark:bg-green-900",
          text: "text-green-600 dark:text-green-400",
        }
      case "payment":
        return {
          bg: "bg-purple-100 dark:bg-purple-900",
          text: "text-purple-600 dark:text-purple-400",
        }
      default:
        return {
          bg: "bg-gray-100 dark:bg-gray-700",
          text: "text-gray-600 dark:text-gray-400",
        }
    }
  }

  const styles = getTypeStyles()

  return (
    <div className="flex items-start gap-3 py-3">
      {Icon ? (
        <div className={cn("rounded-full p-2 mt-1", styles.bg)}>
          <Icon className={cn("h-4 w-4", styles.text)} />
        </div>
      ) : (
        <div className={cn("h-2 w-2 mt-2 rounded-full", styles.bg)} />
      )}

      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">{title}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>

      <div className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">{time}</div>
    </div>
  )
}
