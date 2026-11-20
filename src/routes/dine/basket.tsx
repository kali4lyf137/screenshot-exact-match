import { createFileRoute, Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { PricingSummary } from "@/components/customer/PricingSummary";
import { EmptyState } from "@/components/shared/EmptyState";
import { FoodImage } from "@/components/shared/FoodImage";
import { Price } from "@/components/shared/Price";
import { QuantityStepper } from "@/components/shared/QuantityStepper";
import { Button } from "@/components/ui/button";
import { useBasket } from "@/hooks/use-basket";
import { useDining } from "@/hooks/use-dining";

export const Route = createFileRoute("/dine/basket")({
  head: () => ({
    meta: [
      { title: "Your basket — Olea | Meyo" },
      { name: "description", content: "Review the dishes in your basket before ordering." },
      { property: "og:title", content: "Your basket — Olea | Meyo" },
      { property: "og:description", content: "Review the dishes in your basket before ordering." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BasketPage,
});

function BasketPage() {
  const { restaurant } = useDining();
  const { lines, pricing, setQuantity, remove } = useBasket();

  if (lines.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="Your basket is empty"
        description="Add a few dishes from the menu and they'll appear here."
        action={
          <Button size="lg" asChild>
            <Link to="/dine/menu">Browse the menu</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-5 pt-8 lg:grid-cols-[1.4fr_1fr]">
      <section>
        <h1 className="font-display text-6xl">Basket</h1>
        <ul className="mt-6 divide-y border-y">
          {lines.map((line) => (
            <li key={line.lineId} className="flex gap-4 py-4">
              <FoodImage src={line.item.image} alt={line.item.name} monogram={restaurant.monogram} className="size-20 shrink-0 rounded-lg" />
              <div className="min-w-0 flex-1">
                <div className="flex justify-between gap-3">
                  <p className="font-semibold">{line.item.name}</p>
                  <Price amount={line.lineTotal} className="font-semibold" />
                </div>
                {line.note && <p className="text-xs text-muted-foreground">{line.note}</p>}
                <div className="mt-3 flex items-center justify-between">
                  <QuantityStepper
                    size="sm"
                    showRemove
                    label={`Quantity of ${line.item.name}`}
                    value={line.quantity}
                    onChange={(q) => (q <= 0 ? remove(line.lineId) : setQuantity(line.lineId, q))}
                  />
                  <button type="button" onClick={() => remove(line.lineId)} className="text-xs font-semibold text-muted-foreground hover:text-destructive cursor-pointer">
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <aside className="h-fit rounded-xl border bg-card p-6 shadow-soft lg:sticky lg:top-24">
        <PricingSummary pricing={pricing} />
        <Button size="xl" className="mt-6 w-full" disabled>
          Checkout — not built yet
        </Button>
      </aside>
    </div>
  );
}
