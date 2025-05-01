import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      {/* Action Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-[180px] rounded-lg" />
          ))}
      </div>

      {/* Your Bookings Skeleton */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Array(2)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-[200px] rounded-lg" />
            ))}
        </div>
      </div>

      {/* Upcoming Scheduled Bookings Skeleton */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-8 w-32" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Skeleton className="h-[200px] rounded-lg" />
        </div>
      </div>

      {/* Recent Activity Skeleton */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-8 w-24" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Skeleton className="h-[180px] rounded-lg" />
        </div>
      </div>

      {/* Nearby Laundromats Skeleton */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-8 w-24" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-[300px] rounded-lg" />
            ))}
        </div>
      </div>
    </div>
  )
}
