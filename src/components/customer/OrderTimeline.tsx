import { CheckCheck, ChefHat, ConciergeBell, Inbox, UtensilsCrossed, type LucideIcon } from "lucide-react";
import { formatTime } from "@/lib/format";
import { ORDER_STATUS_META } from "@/lib/order-status";
import { cn } from "@/lib/utils";
import { ORDER_STATUS_FLOW, type OrderStatus } from "@/types/meyo";

const ICONS: Record<OrderStatus, LucideIcon> = {
  received: Inbox,
  confirmed: CheckCheck,
  preparing: ChefHat,
  ready: ConciergeBell,
  completed: UtensilsCrossed,
};

export function OrderTimeline({
  status,
  history,
}: {
  status: OrderStatus;
  history: { status: OrderStatus; at: string }[];
}) {
  const currentIndex = ORDER_STATUS_FLOW.indexOf(status);
  return (
    <ol className="relative" aria-label="Order progress">
      {ORDER_STATUS_FLOW.map((step, i) => {
        const Icon = ICONS[step];
        const meta = ORDER_STATUS_META[step];
        const done = i < currentIndex;
        const current = i === currentIndex;
        const at = history.find((h) => h.status === step)?.at;
        return (
          <li key={step} className="relative flex gap-4 pb-7 last:pb-0" aria-current={current ? "step" : undefined}>
            {i < ORDER_STATUS_FLOW.length - 1 && (
              <span
                aria-hidden
                className={cn(
                  "absolute left-[21px] top-11 h-[calc(100%-2.75rem)] w-0.5 rounded-full transition-colors duration-500",
                  done ? "bg-teal" : "bg-border",
                )}
              />
            )}
            <span
              className={cn(
                "relative z-10 grid size-11 shrink-0 place-items-center rounded-full border transition-all duration-500",
                done && "border-teal bg-teal text-teal-foreground",
                current && "border-gold bg-gold text-gold-foreground shadow-lift animate-pulse-ring",
                !done && !current && "bg-card text-muted-foreground",
              )}
            >
              <Icon className="size-[18px]" />
            </span>
            <div className="min-w-0 flex-1 pt-1.5">
              <div className="flex items-baseline justify-between gap-3">
                <p className={cn("font-semibold", !done && !current && "text-muted-foreground")}>{meta.guestTitle}</p>
                {at && (done || current) && <span className="text-xs text-muted-foreground tabular">{formatTime(at)}</span>}
              </div>
              {current && <p className="mt-0.5 text-sm text-muted-foreground animate-fade">{meta.guestDescription}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
