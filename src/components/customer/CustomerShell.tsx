import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, House, ReceiptText, Settings2, ShoppingBag } from "lucide-react";
import { useBasket } from "@/hooks/use-basket";
import { useDining } from "@/hooks/use-dining";
import { cn } from "@/lib/utils";
import { BasketBar } from "./BasketBar";

const NAV = [
  { to: "/dine", label: "Home", icon: House, exact: true },
  { to: "/dine/menu", label: "Menu", icon: BookOpen, exact: false },
  { to: "/dine/orders", label: "Orders", icon: ReceiptText, exact: false },
  { to: "/dine/basket", label: "Basket", icon: ShoppingBag, exact: false },
] as const;

export function CustomerShell({ children }: { children: React.ReactNode }) {
  const { restaurant, session } = useDining();
  const { count, addPulse } = useBasket();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hideBasketBar = pathname.startsWith("/dine/basket") || pathname.startsWith("/dine/checkout");

  return (
    <div className="min-h-screen bg-background">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-card focus:px-4 focus:py-2">
        Skip to content
      </a>
      <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
          <Link to="/dine" className="flex min-w-0 items-center gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-foreground font-display text-xl text-background">
              {restaurant.monogram}
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block truncate font-display text-xl">{restaurant.name}</span>
              <span className="block truncate text-[11px] text-muted-foreground">
                {session.tableLabel} · {session.area}
              </span>
            </span>
          </Link>

          <nav aria-label="Guest" className="hidden items-center gap-1 md:flex">
            {NAV.slice(0, 3).map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.exact }}
                className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[status=active]:bg-card data-[status=active]:text-foreground data-[status=active]:shadow-soft"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <Link
              to="/dine/settings"
              aria-label="Table & settings"
              className="grid size-10 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-card hover:text-foreground data-[status=active]:bg-card data-[status=active]:text-foreground"
            >
              <Settings2 className="size-[18px]" />
            </Link>
            <Link
              to="/dine/basket"
              className="hidden h-10 items-center gap-2 rounded-full bg-foreground pl-4 pr-3 text-sm font-semibold text-background transition-transform hover:scale-[1.02] md:inline-flex"
            >
              <ShoppingBag className="size-4" />
              Basket
              <span
                key={addPulse}
                className={cn(
                  "grid min-w-6 place-items-center rounded-full bg-gold px-1.5 text-xs text-gold-foreground tabular",
                  addPulse > 0 && "animate-in zoom-in-50 duration-300",
                )}
              >
                {count}
              </span>
            </Link>
          </div>
        </div>
      </header>

      <main id="main" className="pb-safe-nav md:pb-20">
        {children}
      </main>

      {!hideBasketBar && <BasketBar />}

      <nav
        aria-label="Guest"
        className="fixed inset-x-0 bottom-0 z-40 border-t bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
      >
        <ul className="mx-auto grid max-w-md grid-cols-4">
          {NAV.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  activeOptions={{ exact: item.exact }}
                  className="group relative flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium text-muted-foreground transition-colors data-[status=active]:text-foreground"
                >
                  <span className="relative">
                    <Icon className="size-[22px] stroke-[1.6] group-data-[status=active]:stroke-[2]" />
                    {item.to === "/dine/basket" && count > 0 && (
                      <span
                        key={addPulse}
                        className="absolute -right-2.5 -top-1.5 grid min-w-[18px] place-items-center rounded-full bg-gold px-1 text-[10px] font-bold text-gold-foreground tabular animate-in zoom-in-50 duration-300"
                      >
                        {count}
                      </span>
                    )}
                  </span>
                  {item.label}
                  <span className="absolute top-0 h-0.5 w-8 rounded-full bg-gold opacity-0 transition-opacity group-data-[status=active]:opacity-100" />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
