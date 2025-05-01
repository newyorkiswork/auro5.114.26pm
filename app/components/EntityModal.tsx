"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { api } from "@/lib/apiClient"

interface EntityModalProps {
  type: "laundromat" | "user" | "machine" | "booking" | "promotion" | "product"
  mode: "create" | "edit"
  data?: Record<string, any>
  onSuccess?: () => void
  trigger?: React.ReactNode
}

interface Field {
  name: string
  label: string
  type: string
  options?: string[]
}

interface EntityConfig {
  title: string
  fields: Field[]
}

const entityConfigs: Record<EntityModalProps["type"], EntityConfig> = {
  laundromat: {
    title: "Laundromat",
    fields: [
      { name: "name", label: "Name", type: "text" },
      { name: "address", label: "Address", type: "text" },
      { name: "lat", label: "Latitude", type: "number" },
      { name: "lng", label: "Longitude", type: "number" },
    ],
  },
  user: {
    title: "User",
    fields: [
      { name: "name", label: "Name", type: "text" },
      { name: "email", label: "Email", type: "email" },
      { name: "phone", label: "Phone", type: "tel" },
      { name: "role", label: "Role", type: "select", options: ["user"] },
    ],
  },
  machine: {
    title: "Machine",
    fields: [
      { name: "name", label: "Name", type: "text" },
      { name: "type", label: "Type", type: "select", options: ["washer", "dryer"] },
      { name: "capacity", label: "Capacity", type: "number" },
      { name: "status", label: "Status", type: "select", options: ["available", "in_use", "maintenance"] },
    ],
  },
  booking: {
    title: "Booking",
    fields: [
      { name: "userId", label: "User ID", type: "text" },
      { name: "laundromatId", label: "Laundromat ID", type: "text" },
      { name: "timeSlot", label: "Time Slot", type: "datetime-local" },
      { name: "status", label: "Status", type: "select", options: ["pending", "confirmed", "completed", "cancelled"] },
    ],
  },
  promotion: {
    title: "Promotion",
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "description", label: "Description", type: "text" },
      { name: "discount", label: "Discount (%)", type: "number" },
      { name: "startDate", label: "Start Date", type: "datetime-local" },
      { name: "endDate", label: "End Date", type: "datetime-local" },
    ],
  },
  product: {
    title: "Product",
    fields: [
      { name: "name", label: "Name", type: "text" },
      { name: "description", label: "Description", type: "text" },
      { name: "price", label: "Price", type: "number" },
      { name: "type", label: "Type", type: "select", options: ["detergent", "softener", "bleach", "dryer_sheet"] },
    ],
  },
}

export function EntityModal({ type, mode, data, onSuccess, trigger }: EntityModalProps) {
  const [formData, setFormData] = useState<Record<string, any>>(data || {})
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const config = entityConfigs[type]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (mode === "create") {
        await api.createEntity(type, formData)
        toast({
          title: "Success",
          description: `${config.title} created successfully`,
        })
      } else {
        await api.updateEntity(type, formData)
        toast({
          title: "Success",
          description: `${config.title} updated successfully`,
        })
      }

      setIsOpen(false)
      onSuccess?.()
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${mode} ${config.title.toLowerCase()}`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant={mode === "create" ? "default" : "outline"}>
            {mode === "create" ? `Create ${config.title}` : `Edit ${config.title}`}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? `Create ${config.title}` : `Edit ${config.title}`}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? `Fill in the details to create a new ${config.title.toLowerCase()}`
              : `Update the details of this ${config.title.toLowerCase()}`}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {config.fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>{field.label}</Label>
              {field.type === "select" && field.options ? (
                <select
                  id={field.name}
                  value={formData[field.name] || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, [field.name]: e.target.value })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select {field.label}</option>
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  id={field.name}
                  type={field.type}
                  value={formData[field.name] || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, [field.name]: e.target.value })
                  }
                />
              )}
            </div>
          ))}
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Loading..." : mode === "create" ? "Create" : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 