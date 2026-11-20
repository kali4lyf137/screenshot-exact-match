import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DietaryBadges } from "@/components/shared/DietaryBadges";
import { FoodImage } from "@/components/shared/FoodImage";
import { Price } from "@/components/shared/Price";
import { QuantityStepper } from "@/components/shared/QuantityStepper";
import { Button } from "@/components/ui/button";
import { useBasket } from "@/hooks/use-basket";
import { useDining } from "@/hooks/use-dining";

export const Route = createFileRoute("/dine/menu/$itemId")({
  head: () => ({
    meta: [
      { title: "Dish details — Olea | Meyo" },
      { name: "description", content: "See what's in this dish and add it to your basket." },
      { property: "og:title", content: "Dish details — Olea | Meyo" },
      { property: "og:description", content: "See what's in this dish and add it to your basket." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ItemPage,
});

function ItemPage() {
  const { itemId } = Route.useParams();
  const { items, restaurant } = useDining();
  const { add } = useBasket();
  const [qty, setQty] = useState(1);
  const item = items.find((i) => i.id === itemId);
  if (!item) throw notFound();

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-5 pt-6 md:grid-cols-2">
      <div>
        <Link to="/dine/menu" className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Menu
        </Link>
        <FoodImage src={item.image} alt={item.name} monogram={restaurant.monogram} eager className="aspect-square w-full rounded-2xl" />
      </div>
      <div className="md:pt-12">
        <h1 className="font-display text-5xl">{item.name}</h1>
        <Price amount={item.price} className="mt-3 block text-xl font-semibold" />
        <p className="mt-4 leading-relaxed text-muted-foreground">{item.longDescription ?? item.description}</p>
        <DietaryBadges tags={item.dietary} showLabels className="mt-5" />
        {item.available ? (
          <div className="mt-8 flex items-center gap-4">
            <QuantityStepper size="lg" min={1} label="Quantity" value={qty} onChange={setQty} />
            <Button
              size="xl"
              className="flex-1"
              onClick={() => {
                add(item.id, qty);
                toast.success(`${item.name} added`, { description: "Preview basket — nothing is sent yet." });
              }}
            >
              Add · <Price amount={item.price * qty} />
            </Button>
          </div>
        ) : (
          <p className="mt-8 rounded-lg bg-secondary px-4 py-3 text-sm text-muted-foreground">Unavailable today.</p>
        )}
      </div>
    </div>
  );
}
