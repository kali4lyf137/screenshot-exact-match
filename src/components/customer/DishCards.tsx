import { Link } from "@tanstack/react-router";
import { Check, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DietaryBadges } from "@/components/shared/DietaryBadges";
import { FoodImage } from "@/components/shared/FoodImage";
import { Price } from "@/components/shared/Price";
import { useBasket } from "@/hooks/use-basket";
import { cn } from "@/lib/utils";
import type { MenuItem } from "@/types/meyo";

function needsChoices(item: MenuItem) {
  return item.modifierGroups?.some((g) => g.required) ?? false;
}

/** Round "+" that adds straight to the basket, or opens the dish when choices are required. */
export function QuickAddButton({ item, className }: { item: MenuItem; className?: string }) {
  const { add } = useBasket();
  const [justAdded, setJustAdded] = useState(false);

  if (!item.available) return null;
  const base = cn(
    "grid size-10 place-items-center rounded-full bg-card text-foreground shadow-lift ring-1 ring-border transition-all hover:scale-105 hover:bg-foreground hover:text-background cursor-pointer",
    justAdded && "bg-teal text-teal-foreground ring-teal",
    className,
  );

  if (needsChoices(item)) {
    return (
      <Link to="/dine/menu/$itemId" params={{ itemId: item.id }} aria-label={`Choose options for ${item.name}`} className={base}>
        <Plus className="size-4" />
      </Link>
    );
  }
  return (
    <button
      type="button"
      aria-label={`Add ${item.name} to basket`}
      className={base}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        add(item.id, 1);
        setJustAdded(true);
        window.setTimeout(() => setJustAdded(false), 1200);
        toast.success(`${item.name} added`, { description: "Preview basket — nothing is sent yet." });
      }}
    >
      {justAdded ? <Check className="size-4" /> : <Plus className="size-4" />}
    </button>
  );
}

/** Large editorial card used for featured dishes. */
export function FeatureDishCard({ item, monogram, className }: { item: MenuItem; monogram: string; className?: string }) {
  return (
    <article className={cn("group relative", className)}>
      <Link
        to="/dine/menu/$itemId"
        params={{ itemId: item.id }}
        className="relative block overflow-hidden rounded-xl"
        aria-label={item.name}
      >
        <FoodImage
          src={item.image}
          alt={item.name}
          monogram={monogram}
          className="aspect-[4/5] w-full [&_img]:group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 image-scrim" aria-hidden />
        <div className="absolute inset-x-0 bottom-0 p-5 text-on-image">
          <p className="eyebrow text-on-image/70">Chef's selection</p>
          <h3 className="mt-1.5 font-display text-[1.9rem] leading-[1.02]">{item.name}</h3>
          <p className="mt-1.5 line-clamp-2 text-sm text-on-image/80">{item.description}</p>
          <Price amount={item.price} className="mt-3 inline-block text-sm font-semibold" />
        </div>
      </Link>
      <QuickAddButton item={item} className="absolute right-4 top-4" />
    </article>
  );
}

/** Compact square card for horizontal "popular" rails. */
export function CompactDishCard({ item, monogram }: { item: MenuItem; monogram: string }) {
  return (
    <article className="group relative w-44 shrink-0 snap-start sm:w-52">
      <Link to="/dine/menu/$itemId" params={{ itemId: item.id }} className="block">
        <FoodImage
          src={item.image}
          alt={item.name}
          monogram={monogram}
          className="aspect-square w-full rounded-lg [&_img]:group-hover:scale-[1.05]"
        />
        <h3 className="mt-3 line-clamp-1 font-semibold">{item.name}</h3>
        <Price amount={item.price} className="text-sm text-muted-foreground" />
      </Link>
      <QuickAddButton item={item} className="absolute right-2.5 top-2.5 size-9" />
    </article>
  );
}

/** Menu row: copy on the left, photo on the right — like a printed menu with pictures. */
export function MenuItemRow({ item, monogram }: { item: MenuItem; monogram: string }) {
  return (
    <article className={cn("group relative", !item.available && "opacity-60")}>
      <Link
        to="/dine/menu/$itemId"
        params={{ itemId: item.id }}
        className="flex gap-4 rounded-xl border border-transparent p-3 -mx-3 transition-colors hover:border-border hover:bg-card sm:gap-5"
      >
        <div className="min-w-0 flex-1 py-1">
          <div className="flex items-start gap-2">
            <h3 className="font-semibold leading-snug">{item.name}</h3>
            {item.popular && item.available && (
              <span className="mt-0.5 shrink-0 eyebrow text-[9px] text-gold">Popular</span>
            )}
          </div>
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Price amount={item.price} className="text-[15px] font-semibold" />
            {!item.available ? (
              <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
                Unavailable today
              </span>
            ) : (
              <DietaryBadges tags={item.dietary} />
            )}
          </div>
        </div>
        <FoodImage
          src={item.image}
          alt={item.name}
          monogram={monogram}
          className="size-28 shrink-0 rounded-lg sm:size-32 [&_img]:group-hover:scale-[1.05]"
        />
      </Link>
      <QuickAddButton item={item} className="absolute bottom-1 right-1 size-9" />
    </article>
  );
}
