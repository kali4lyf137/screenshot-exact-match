import type { Money, PricingBreakdown } from "@/types/meyo";

/**
 * DEMONSTRATION ONLY.
 * These rates exist so the prototype can show a pricing breakdown. They are NOT Meyo's
 * production VAT / service-charge rules — the production app must use its existing
 * calculation service (see `PricingService` in src/integrations/meyo/contracts.ts).
 */
export const PREVIEW_PRICING_RULES = {
  vatRate: 0.16,
  serviceChargeRate: 0.1,
} as const;

export interface PriceableLine {
  unitPrice: Money;
  quantity: number;
}

export function calculatePreviewPricing(
  lines: PriceableLine[],
  rules: { vatRate: number; serviceChargeRate: number } = PREVIEW_PRICING_RULES,
): PricingBreakdown {
  const subtotal = lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);
  const vat = Math.round(subtotal * rules.vatRate);
  const serviceCharge = Math.round(subtotal * rules.serviceChargeRate);
  return { subtotal, vat, serviceCharge, total: subtotal + vat + serviceCharge, isPreview: true };
}
