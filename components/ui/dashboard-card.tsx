import type React from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface DashboardCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  icon?: React.ReactNode
  variant?: "blue" | "green" | "purple" | "orange" | "default"
  href?: string
  footer?: React.ReactNode
  action?: React.ReactNode
}

export function DashboardCard({
  title,
  description,
  icon,
  variant = "default",
  href,
  footer,
  action,
  className,
  children,
  ...props
}: DashboardCardProps) {
  const variantStyles = {
    blue: "card-auro-blue",
    green: "card-auro-green",
    purple: "card-auro-purple",
    orange: "card-auro-orange",
    default: "bg-card text-card-foreground",
  }

  const CardComponent = href ? Link : "div"
  const cardProps = href ? { href } : {}

  return (
    <CardComponent
      {...cardProps}
      className={cn(
        "rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md",
        variantStyles[variant],
        href && "cursor-pointer hover:-translate-y-1",
        className,
      )}
      {...props}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className={cn("font-semibold text-lg", variant === "default" ? "text-foreground" : "text-white")}>
              {title}
            </h3>
            {description && (
              <p className={cn("text-sm mt-1", variant === "default" ? "text-muted-foreground" : "text-white/80")}>
                {description}
              </p>
            )}
          </div>
          {icon && <div className="text-white">{icon}</div>}
        </div>
        <div>{children}</div>
        {action && <div className="mt-4">{action}</div>}
      </div>
      {footer && <div className="px-5 py-3 bg-black/10">{footer}</div>}
    </CardComponent>
  )
}
