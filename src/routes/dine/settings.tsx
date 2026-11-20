import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useBasket } from "@/hooks/use-basket";
import { useDining } from "@/hooks/use-dining";
import { formatTime } from "@/lib/format";

export const Route = createFileRoute("/dine/settings")({
  head: () => ({
    meta: [
      { title: "Table & settings — Olea | Meyo" },
      { name: "description", content: "Restaurant details, your table session and settings." },
      { property: "og:title", content: "Table & settings — Olea | Meyo" },
      { property: "og:description", content: "Restaurant details, your table session and settings." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { restaurant, session } = useDining();
  const { clear } = useBasket();
  return (
    <div className="mx-auto max-w-2xl space-y-6 px-5 pt-8">
      <h1 className="font-display text-6xl">Table & settings</h1>
      <section className="rounded-xl border bg-card p-6 shadow-soft">
        <p className="eyebrow text-gold">Restaurant</p>
        <p className="mt-2 font-display text-3xl">{restaurant.name}</p>
        <p className="text-sm text-muted-foreground">
          {restaurant.address}, {restaurant.city} · {restaurant.phone}
        </p>
      </section>
      <section className="rounded-xl border bg-card p-6 shadow-soft">
        <p className="eyebrow text-gold">Your session</p>
        <p className="mt-2 font-semibold">
          {session.tableLabel} · {session.area}
        </p>
        <p className="text-sm text-muted-foreground">Started {formatTime(session.startedAt)}</p>
      </section>
      <Button variant="outline" size="lg" asChild>
        <Link to="/" onClick={clear}>
          Leave table
        </Link>
      </Button>
    </div>
  );
}
