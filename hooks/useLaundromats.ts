import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"

export function useLaundromats(radius = 5, coordinates?: { lat: number; lng: number }) {
  return useQuery({
    queryKey: ["laundromats", radius, coordinates],
    queryFn: () => api.laundromats.getAll(radius, coordinates),
  })
}

export function useLaundromat(id: string) {
  return useQuery({
    queryKey: ["laundromat", id],
    queryFn: () => api.laundromats.getById(id),
    enabled: !!id,
  })
}

export function useMachines(laundromatId: string) {
  return useQuery({
    queryKey: ["machines", laundromatId],
    queryFn: () => api.machines.getByLaundromat(laundromatId),
    enabled: !!laundromatId,
  })
}

export function useTimeSlots(laundromatId: string, date: string) {
  return useQuery({
    queryKey: ["timeSlots", laundromatId, date],
    queryFn: () => api.machines.getAvailability(laundromatId, date),
    enabled: !!laundromatId && !!date,
  })
}
