import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTenantPricing, updateTenantPricing, PricingTable } from "../api/pricingApi";

export function usePricing(){
  return useQuery({
    queryKey: ['tenant-pricing'],
    queryFn: getTenantPricing,
    staleTime: 1000 * 60 * 10,
  });
}

export function useUpdatePricing(){
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn:(newPricing: PricingTable) => updateTenantPricing(newPricing),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['tenant-pricing']});
    },
  });
}
