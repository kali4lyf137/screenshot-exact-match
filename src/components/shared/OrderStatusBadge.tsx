import { Badge } from "@/components/ui/badge";
import { ORDER_STATUS_META, type StatusTone } from "@/lib/order-status";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types/meyo";

const TONE_VARIANT: Record<StatusTone, "gold" | "teal" | "warning" | "success" | "muted"> = {
  gold: "gold",
  teal: "teal",
  warning: "warning",
  success: "success",
  muted: "muted",
};

const TONE_DOT: Record<StatusTone, string> = {
  gold: "bg-gold",
  teal: "bg-teal",
  warning: "bg-warning",
  success: "bg-success",
  muted: "bg-muted-foreground",
};

export function OrderStatusBadge({ status, className, live = false }: { status: OrderStatus; className?: string; live?: boolean }) {
  const meta = ORDER_STATUS_META[status];
  return (
    <Badge variant={TONE_VARIANT[meta.tone]} className={className}>
      <span
        aria-hidden
        className={cn("size-1.5 rounded-full", TONE_DOT[meta.tone], live && status !== "completed" && "animate-pulse")}
      />
      {meta.label}
    </Badge>
  );
}

export { TONE_DOT };
