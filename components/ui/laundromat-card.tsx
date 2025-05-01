import type React from "react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { MapPin } from "lucide-react"
import Link from "next/link"

interface LaundryAvailability {
  washers: {
    available: number
    total: number
  }
  dryers: {
    available: number
    total: number
  }
}

interface LaundryCardProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string
  name: string
  address: string
  image: string
  distance: string
  availability: LaundryAvailability
}

export function LaundryCard({
  id,
  name,
  address,
  image,
  distance,
  availability,
  className,
  ...props
}: LaundryCardProps) {
  return (
    <Card className={cn("overflow-hidden border-0 shadow-sm card-interactive", className)} {...props}>
      <Link href={`/user/laundromat/${id}`}>
        <div className="relative h-48 w-full">
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 text-sm font-medium px-2 py-1 rounded-full shadow-sm">
            {distance}
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1">{name}</h3>
          <div className="flex items-center text-sm text-muted-foreground mb-3">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="truncate">{address}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Washers:</span>
              <span className="font-medium text-green-600">
                {availability.washers.available}/{availability.washers.total} available
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Dryers:</span>
              <span className="font-medium text-green-600">
                {availability.dryers.available}/{availability.dryers.total} available
              </span>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  )
}
