"use client"

import { useParams } from "next/navigation"
import MachineCard from "@/components/MachineCard"

export default function MonitorPage() {
  const params = useParams()
  const bookingId = params.id as string

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Machine Monitor</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MachineCard machineId="wash-001" bookingId={bookingId} />
        <MachineCard machineId="dry-001" bookingId={bookingId} />
      </div>
    </div>
  )
}
