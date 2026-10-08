import { api } from "@/lib/api";
import { flushSync } from "react-dom";

export interface PricingTable{
  PORTA_POTTY: number;
  DUMPSTER: number;
}

export async function getTenantPricing(): Promise<PricingTable> {
  const {data} = await api.get('/tenants/pricing');
  return data;
}

export async function updateTenantPricing(pricing: PricingTable): Promise<PricingTable>{
  const {data} = await api.put('/tenant/pricing', pricing);
  return data;
}