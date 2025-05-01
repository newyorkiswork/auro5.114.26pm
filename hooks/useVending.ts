import { useQuery, useMutation } from "@tanstack/react-query"
import { api } from "@/lib/api"

export function useVendingItems(laundromatId: string) {
  return useQuery({
    queryKey: ["vending", laundromatId],
    queryFn: () => api.vending.getItems(laundromatId),
    enabled: !!laundromatId,
  })
}

export function usePurchaseItem() {
  return useMutation({
    mutationFn: ({ itemId, paymentMethod }: { itemId: string; paymentMethod: string }) =>
      api.vending.purchaseItem(itemId, paymentMethod),
  })
}
