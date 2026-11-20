import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { OrderStatusBadge } from "@/components/shared/OrderStatusBadge";
import { Price } from "@/components/shared/Price";
import { useDining } from "@/hooks/use-dining";
import { sessionOrdersQuery, sessionQuery } from "@/integrations/meyo/queries";
import { formatDate, formatTime } from "@/lib/format";

export const Route = createFileRoute("/dine/orders/")({
  loader: async ({ context: { queryClient } }) => {
    const session = await queryClient.ensureQueryData(sessionQuery());
    if (session) await queryClient.ensureQueryData(sessionOrdersQuery(session.sessionId));
  },
  head: () => ({
    meta: [
      { title: "My orders — Olea | Meyo" },
      { name: "description", content: "Your orders at this table and their status." },
      { property: "og:title", content: "My orders — Olea | Meyo" },
      { property: "og:description", content: "Your orders at this table and their status." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OrdersPage,
});

function OrdersPage() {
  const { session } = useDining();
  const orders = useSuspenseQuery(sessionOrdersQuery(session.sessionId)).data;
  return (
    <div className="mx-auto max-w-3xl px-5 pt-8">
      <h1 className="font-display text-6xl">My orders</h1>
      <ul className="mt-6 space-y-3">
        {orders.map((o) => (
          <li key={o.id}>
            <Link to="/dine/orders/$orderId" params={{ orderId: o.id }} className="block rounded-xl border bg-card p-5 shadow-soft hover:shadow-lift">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold">{o.reference}</p>
                <OrderStatusBadge status={o.status} live />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatDate(o.placedAt)} · {formatTime(o.placedAt)}
              </p>
              <p className="mt-3 text-sm text-muted-foreground">{o.lines.map((l) => `${l.quantity}× ${l.name}`).join(", ")}</p>
              <Price amount={o.pricing.total} className="mt-3 block font-semibold" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
