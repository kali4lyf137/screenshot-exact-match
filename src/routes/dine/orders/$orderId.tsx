import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { OrderTimeline } from "@/components/customer/OrderTimeline";
import { PricingSummary } from "@/components/customer/PricingSummary";
import { PreviewNotice } from "@/components/shared/PreviewNotice";
import { useOrderStatus } from "@/hooks/use-order-status";
import { orderQuery } from "@/integrations/meyo/queries";
import { ORDER_STATUS_META } from "@/lib/order-status";
import { cn } from "@/lib/utils";
import { ORDER_STATUS_FLOW, type Order } from "@/types/meyo";

export const Route = createFileRoute("/dine/orders/$orderId")({
  loader: ({ context: { queryClient }, params }) => queryClient.ensureQueryData(orderQuery(params.orderId)),
  head: () => ({
    meta: [
      { title: "Order tracking — Olea | Meyo" },
      { name: "description", content: "Follow your order from the kitchen to your table." },
      { property: "og:title", content: "Order tracking — Olea | Meyo" },
      { property: "og:description", content: "Follow your order from the kitchen to your table." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TrackingPage,
});

function TrackingPage() {
  const { orderId } = Route.useParams();
  const order = useSuspenseQuery(orderQuery(orderId)).data;
  if (!order) throw notFound();
  return <Tracking order={order} />;
}

function Tracking({ order }: { order: Order }) {
  const { status, setPreviewStatus } = useOrderStatus(order.id, order.status);
  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-5 pt-8 md:grid-cols-2">
      <section>
        <p className="eyebrow text-gold">Order {order.reference}</p>
        <h1 className="mt-2 font-display text-5xl">{ORDER_STATUS_META[status].guestTitle}</h1>
        <div className="mt-8">
          <OrderTimeline status={status} history={order.statusHistory} />
        </div>
        <div className="mt-8 rounded-lg border border-dashed p-4">
          <PreviewNotice>Preview controls — in the live app, status arrives from the restaurant.</PreviewNotice>
          <div className="mt-3 flex flex-wrap gap-2">
            {ORDER_STATUS_FLOW.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setPreviewStatus(s)}
                className={cn("rounded-full border px-3 py-1 text-xs font-semibold cursor-pointer", s === status ? "border-teal bg-teal text-teal-foreground" : "bg-card")}
              >
                {ORDER_STATUS_META[s].label}
              </button>
            ))}
          </div>
        </div>
      </section>
      <aside className="h-fit rounded-xl border bg-card p-6 shadow-soft">
        <ul className="mb-5 space-y-2 border-b pb-5 text-sm">
          {order.lines.map((l) => (
            <li key={l.itemId}>
              {l.quantity}× {l.name}
            </li>
          ))}
        </ul>
        <PricingSummary pricing={order.pricing} />
      </aside>
    </div>
  );
}
