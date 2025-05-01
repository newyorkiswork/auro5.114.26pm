"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"
import { Loader, Droplets, Wind } from "lucide-react"
import { cn } from "../lib/utils"

type Machine = {
  id: string
  type: "washer" | "dryer"
  size: "small" | "medium" | "large"
  status: "available" | "in-use" | "maintenance" | "reserved"
}

interface MachineSelectorProps {
  laundryId: string
  selectedMachines: string[]
  onSelectMachine: (machineId: string) => void
}

export function MachineSelector({ laundryId, selectedMachines, onSelectMachine }: MachineSelectorProps) {
  const [machines, setMachines] = useState<Machine[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // In a real app, this would fetch from an API
    const fetchMachines = async () => {
      try {
        setLoading(true)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data
        const mockMachines: Machine[] = [
          { id: "w1", type: "washer", size: "medium", status: "available" },
          { id: "w2", type: "washer", size: "large", status: "available" },
          { id: "w3", type: "washer", size: "medium", status: "in-use" },
          { id: "w4", type: "washer", size: "small", status: "available" },
          { id: "w5", type: "washer", size: "medium", status: "maintenance" },
          { id: "d1", type: "dryer", size: "medium", status: "available" },
          { id: "d2", type: "dryer", size: "large", status: "available" },
          { id: "d3", type: "dryer", size: "medium", status: "in-use" },
          { id: "d4", type: "dryer", size: "large", status: "reserved" },
        ]

        setMachines(mockMachines)
        setError(null)
      } catch (err) {
        setError("Failed to load machines. Please try again.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchMachines()
  }, [laundryId])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500 p-4 text-center">{error}</div>
  }

  const washers = machines.filter((m) => m.type === "washer")
  const dryers = machines.filter((m) => m.type === "dryer")

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-3">Washers</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {washers.map((machine) => (
            <MachineCard
              key={machine.id}
              machine={machine}
              selected={selectedMachines.includes(machine.id)}
              onSelect={() => onSelectMachine(machine.id)}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-3">Dryers</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {dryers.map((machine) => (
            <MachineCard
              key={machine.id}
              machine={machine}
              selected={selectedMachines.includes(machine.id)}
              onSelect={() => onSelectMachine(machine.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

interface MachineCardProps {
  machine: Machine
  selected: boolean
  onSelect: () => void
}

function MachineCard({ machine, selected, onSelect }: MachineCardProps) {
  const isSelectable = machine.status === "available"

  const getStatusColor = () => {
    switch (machine.status) {
      case "available":
        return "bg-green-100 border-green-200"
      case "in-use":
        return "bg-blue-100 border-blue-200"
      case "maintenance":
        return "bg-amber-100 border-amber-200"
      case "reserved":
        return "bg-purple-100 border-purple-200"
      default:
        return "bg-gray-100 border-gray-200"
    }
  }

  const getStatusBadge = () => {
    switch (machine.status) {
      case "available":
        return <Badge className="bg-green-500">Available</Badge>
      case "in-use":
        return <Badge className="bg-blue-500">In Use</Badge>
      case "maintenance":
        return <Badge className="bg-amber-500">Maintenance</Badge>
      case "reserved":
        return <Badge className="bg-purple-500">Reserved</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  return (
    <Card
      className={cn(
        "border-2 transition-all",
        getStatusColor(),
        isSelectable && "cursor-pointer hover:shadow-md",
        selected && "border-blue-500 ring-2 ring-blue-500 ring-opacity-50",
        !isSelectable && "opacity-60",
      )}
      onClick={isSelectable ? onSelect : undefined}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            {machine.type === "washer" ? (
              <Droplets className="h-5 w-5 mr-1.5 text-blue-600" />
            ) : (
              <Wind className="h-5 w-5 mr-1.5 text-amber-600" />
            )}
            <span className="font-medium">
              {machine.type === "washer" ? "Washer" : "Dryer"} #{machine.id.slice(-1)}
            </span>
          </div>
          {getStatusBadge()}
        </div>
        <div className="text-sm text-gray-600 capitalize">{machine.size} Size</div>
      </CardContent>
    </Card>
  )
}

export default MachineSelector
