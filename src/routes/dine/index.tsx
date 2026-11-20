import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Clock, MapPin, ReceiptText } from "lucide-react";
import { CompactDishCard, FeatureDishCard } from "@/components/customer/DishCards";
import { ServiceActions } from "@/components/customer/ServiceActions";
import { FoodImage } from "@/components/shared/FoodImage";
import { OrderStatusBadge } from "@/components/shared/OrderStatusBadge";
import { Button } from "@/components/ui/button";
import { useDining } from "@/hooks/use-dining";
import { sessionOrdersQuery, sessionQuery } from "@/integrations/meyo/queries";
import { isActiveOrder } from "@/lib/order-status";

export const Route = createFileRoute("/dine/")({
  loader: async ({ context: { queryClient } }) => {
    const session = await queryClient.ensureQueryData(sessionQuery());
    if (session) await queryClient.ensureQueryData(sessionOrdersQuery(session.sessionId));
  },
  head: () => ({
    meta: [
      { title: "Olea Kitchen & Bar — Your table | Meyo" },
      { name: "description", content: "Welcome to Olea. Browse featured dishes, order from your table and call your server." },
      { property: "og:title", content: "Olea Kitchen & Bar — Your table | Meyo" },
      { property: "og:description", content: "Browse featured dishes, order from your table and call your server." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RestaurantHome,
});

function RestaurantHome() {
  const { restaurant, session, categories, items } = useDining();
  const orders = useSuspenseQuery(sessionOrdersQuery(session.sessionId)).data;
  const activeOrder = orders.find((o) => isActiveOrder(o.status));
  const featured = items.filter((i) => i.featured && i.available && i.image).slice(0, 3);
  const popular = items.filter((i) => i.popular && i.available);
  const today = restaurant.hours[0];

  return (
    <div className="mx-auto max-w-6xl px-5">
      {/* Hero */}
      <section className="relative -mx-5 sm:mx-0 sm:mt-6">
        <div className="relative overflow-hidden sm:rounded-2xl">
          <img
            src={restaurant.coverImage}
            alt={`Dishes at ${restaurant.name}`}
            className="aspect-[4/5] w-full object-cover sm:aspect-[16/8]"
          />
          <div className="absolute inset-0 image-scrim" aria-hidden />
          <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-on-image/15 px-3 py-1.5 text-xs font-semibold text-on-image backdrop-blur-md">
            <span className="size-1.5 rounded-full bg-gold" />
            {session.tableLabel} · {session.area}
          </div>
          <div className="absolute inset-x-0 bottom-0 p-6 text-on-image sm:p-10">
            <p className="eyebrow text-on-image/75 animate-rise">{restaurant.cuisine}</p>
            <h1 className="mt-3 font-display text-7xl leading-[0.9] sm:text-8xl animate-rise [animation-delay:60ms]">
              {restaurant.name}
              <span className="ml-3 align-middle font-display text-3xl italic text-on-image/70 sm:text-4xl">
                {restaurant.tagline}
              </span>
            </h1>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-on-image/85 animate-rise [animation-delay:120ms]">
              {restaurant.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-3 animate-rise [animation-delay:180ms]">
              <Button size="xl" variant="gold" asChild>
                <Link to="/dine/menu">
                  Browse the menu <ArrowRight />
                </Link>
              </Button>
              <Button size="xl" variant="on-image" asChild>
                <Link to="/dine/orders">
                  <ReceiptText /> My orders
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Info + service */}
      <section className="mt-6 grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border bg-card px-5 py-4 text-sm shadow-soft">
          <span className="flex items-center gap-2">
            <Clock className="size-4 text-gold" />
            <span className="text-muted-foreground">{today?.label}</span> {today?.value}
          </span>
          <span className="flex items-center gap-2">
            <MapPin className="size-4 text-gold" />
            {restaurant.address}, {restaurant.city}
          </span>
        </div>
        <ServiceActions sessionId={session.sessionId} />
      </section>

      {activeOrder && (
        <Link
          to="/dine/orders/$orderId"
          params={{ orderId: activeOrder.id }}
          className="group mt-4 flex items-center gap-4 rounded-xl border border-teal/25 bg-teal-soft px-5 py-4 transition-colors hover:border-teal/50"
        >
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-teal opacity-60" />
            <span className="relative inline-flex size-2.5 rounded-full bg-teal" />
          </span>
          <span className="flex-1 text-sm">
            <span className="font-semibold">Order {activeOrder.reference}</span>
            <span className="text-muted-foreground"> · {activeOrder.lines.length} dishes</span>
          </span>
          <OrderStatusBadge status={activeOrder.status} />
          <ArrowUpRight className="size-4 text-teal transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      )}

      {/* Featured */}
      <section className="mt-14" aria-labelledby="featured-heading">
        <SectionTitle id="featured-heading" eyebrow="Tonight" title="From the kitchen" />
        <div className="-mx-5 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 scrollbar-none md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
          {featured.map((item) => (
            <FeatureDishCard key={item.id} item={item} monogram={restaurant.monogram} className="w-[78%] shrink-0 snap-start md:w-auto" />
          ))}
        </div>
      </section>

      {/* Popular */}
      <section className="mt-14" aria-labelledby="popular-heading">
        <SectionTitle
          id="popular-heading"
          eyebrow="Guests love"
          title="Most ordered"
          action={
            <Link to="/dine/menu" className="text-sm font-semibold text-teal hover:underline">
              See all
            </Link>
          }
        />
        <div className="-mx-5 mt-6 flex snap-x gap-4 overflow-x-auto px-5 pb-2 scrollbar-none">
          {popular.map((item) => (
            <CompactDishCard key={item.id} item={item} monogram={restaurant.monogram} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mt-14" aria-labelledby="categories-heading">
        <SectionTitle id="categories-heading" eyebrow="The menu" title="Explore by course" />
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {categories
            .filter((c) => c.visible)
            .map((cat) => {
              const catItems = items.filter((i) => i.categoryId === cat.id);
              const cover = catItems.find((i) => i.image)?.image;
              return (
                <li key={cat.id}>
                  <Link
                    to="/dine/menu"
                    search={{ category: cat.id }}
                    className="group block overflow-hidden rounded-xl border bg-card shadow-soft transition-shadow hover:shadow-lift"
                  >
                    <FoodImage
                      src={cover}
                      alt=""
                      monogram={restaurant.monogram}
                      className="aspect-[5/3] w-full [&_img]:group-hover:scale-[1.05]"
                    />
                    <div className="flex items-center justify-between px-4 py-3">
                      <div>
                        <p className="font-semibold">{cat.name}</p>
                        <p className="text-xs text-muted-foreground">{catItems.length} dishes</p>
                      </div>
                      <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </Link>
                </li>
              );
            })}
        </ul>
      </section>

      {/* About */}
      <section className="mt-16 grid overflow-hidden rounded-2xl border bg-card shadow-soft md:grid-cols-2">
        <img src={restaurant.interiorImage} alt={`Inside ${restaurant.name}`} className="aspect-[16/10] size-full object-cover md:aspect-auto" loading="lazy" />
        <div className="p-7 sm:p-10">
          <p className="eyebrow text-gold">About the house</p>
          <h2 className="mt-3 font-display text-4xl">Slow plates, long tables.</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{restaurant.description}</p>
          <dl className="mt-6 divide-y border-y text-sm">
            {restaurant.hours.map((h) => (
              <div key={h.label} className="flex justify-between py-2.5">
                <dt className="text-muted-foreground">{h.label}</dt>
                <dd className="tabular">{h.value}</dd>
              </div>
            ))}
          </dl>
          <Button className="mt-7" size="lg" asChild>
            <Link to="/dine/menu">
              Browse full menu <ArrowRight />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

function SectionTitle({ id, eyebrow, title, action }: { id: string; eyebrow: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <p className="eyebrow text-gold">{eyebrow}</p>
        <h2 id={id} className="mt-1.5 font-display text-4xl sm:text-[2.75rem]">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}
