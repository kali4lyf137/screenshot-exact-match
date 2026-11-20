import { Link } from "@tanstack/react-router";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { Price } from "@/components/shared/Price";
import { useBasket } from "@/hooks/use-basket";

export function BasketBar() {
  const { count, pricing, addPulse } = useBasket();
  if (count === 0) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-30 px-4 md:bottom-6 md:left-auto md:right-6 md:w-96 md:px-0">
      <Link
        to="/dine/basket"
        className="pointer-events-auto flex items-center gap-3 rounded-xl bg-foreground px-4 py-3 text-background shadow-float transition-transform animate-rise hover:-translate-y-0.5"
      >
        <span key={addPulse} className="relative grid size-10 place-items-center rounded-full bg-background/10 animate-in zoom-in-75 duration-300">
          <ShoppingBag className="size-[18px]" />
          <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-gold px-1 text-[10px] font-bold text-gold-foreground tabular">
            {count}
          </span>
        </span>
        <span className="flex-1 leading-tight">
          <span className="block text-sm font-semibold">View basket</span>
          <span className="block text-xs text-background/60">
            {count} {count === 1 ? "item" : "items"} · before charges
          </span>
        </span>
        <Price amount={pricing.subtotal} className="font-semibold" />
        <ArrowRight className="size-4 text-gold" />
      </Link>
    </div>
  );
}
