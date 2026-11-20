import { PreviewNotice } from "@/components/shared/PreviewNotice";
import { Price } from "@/components/shared/Price";
import { PREVIEW_PRICING_RULES } from "@/lib/preview-pricing";
import { cn } from "@/lib/utils";
import type { PricingBreakdown } from "@/types/meyo";

export function PricingSummary({ pricing, className }: { pricing: PricingBreakdown; className?: string }) {
  const pct = (n: number) => `${Math.round(n * 100)}%`;
  return (
    <div className={cn("space-y-3 text-sm", className)}>
      <Row label="Subtotal" amount={pricing.subtotal} />
      <Row label={`VAT${pricing.isPreview ? ` (${pct(PREVIEW_PRICING_RULES.vatRate)} demo)` : ""}`} amount={pricing.vat} muted />
      <Row
        label={`Service charge${pricing.isPreview ? ` (${pct(PREVIEW_PRICING_RULES.serviceChargeRate)} demo)` : ""}`}
        amount={pricing.serviceCharge}
        muted
      />
      <div className="flex items-baseline justify-between border-t pt-4">
        <span className="font-semibold">Total</span>
        <Price amount={pricing.total} className="font-display text-3xl" />
      </div>
      {pricing.isPreview && (
        <PreviewNotice className="pt-1">
          Demonstration rates only. Meyo applies each restaurant's own VAT and service charge.
        </PreviewNotice>
      )}
    </div>
  );
}

function Row({ label, amount, muted }: { label: string; amount: number; muted?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className={cn(muted && "text-muted-foreground")}>{label}</span>
      <Price amount={amount} className={cn(muted && "text-muted-foreground")} />
    </div>
  );
}
