import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Money } from "@/types/meyo";

export function Price({ amount, className }: { amount: Money; className?: string }) {
  return <span className={cn("tabular whitespace-nowrap", className)}>{formatMoney(amount)}</span>;
}
