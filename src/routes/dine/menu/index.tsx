import { createFileRoute } from "@tanstack/react-router";
import { Search, SearchX, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { MenuItemRow } from "@/components/customer/DishCards";
import { DIETARY_META } from "@/components/shared/DietaryBadges";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { useDining } from "@/hooks/use-dining";
import { cn } from "@/lib/utils";
import type { DietaryTag } from "@/types/meyo";

export const Route = createFileRoute("/dine/menu/")({
  validateSearch: (search: Record<string, unknown>): { category?: string } =>
    typeof search["category"] === "string" ? { category: search["category"] } : {},
  head: () => ({
    meta: [
      { title: "Menu — Olea Kitchen & Bar | Meyo" },
      { name: "description", content: "Small plates, wood-grilled mains, desserts and drinks. Order straight from your table." },
      { property: "og:title", content: "Menu — Olea Kitchen & Bar | Meyo" },
      { property: "og:description", content: "Small plates, wood-grilled mains, desserts and drinks." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MenuPage,
});

const FILTERS: DietaryTag[] = ["vegetarian", "vegan", "gluten-free", "dairy-free"];

function MenuPage() {
  const { restaurant, categories, items } = useDining();
  const { category: initialCategory } = Route.useSearch();
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<DietaryTag[]>([]);
  const visibleCategories = categories.filter((c) => c.visible).sort((a, b) => a.sortOrder - b.sortOrder);
  const [active, setActive] = useState(initialCategory ?? visibleCategories[0]?.id);
  const pillsRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(
      (i) =>
        (!q || i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q)) &&
        filters.every((f) => i.dietary.includes(f)),
    );
  }, [items, query, filters]);

  const sections = visibleCategories
    .map((c) => ({ category: c, items: filtered.filter((i) => i.categoryId === c.id) }))
    .filter((s) => s.items.length > 0);

  // Jump to the category requested from the home screen.
  useEffect(() => {
    if (initialCategory) document.getElementById(`cat-${initialCategory}`)?.scrollIntoView({ block: "start" });
  }, [initialCategory]);

  // Highlight the category currently in view.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const top = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (top) setActive(top.target.id.replace("cat-", ""));
      },
      { rootMargin: "-160px 0px -60% 0px" },
    );
    document.querySelectorAll("[data-menu-section]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections.length]);

  useEffect(() => {
    pillsRef.current?.querySelector(`[data-cat="${active}"]`)?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [active]);

  const toggleFilter = (f: DietaryTag) => setFilters((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));

  return (
    <div>
      <div className="mx-auto max-w-6xl px-5 pt-8">
        <p className="eyebrow text-gold">{restaurant.name} · {restaurant.cuisine}</p>
        <h1 className="mt-2 font-display text-6xl sm:text-7xl">The menu</h1>
      </div>

      <div className="sticky top-16 z-30 mt-6 border-b bg-background/90 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl space-y-3 px-5 py-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative flex-1">
              <span className="sr-only">Search the menu</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search dishes, ingredients…"
                className="h-11 w-full rounded-full border bg-card pl-11 pr-10 text-sm shadow-soft outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/30"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:bg-secondary cursor-pointer"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </label>
            <div className="flex gap-2 overflow-x-auto scrollbar-none" role="group" aria-label="Dietary filters">
              {FILTERS.map((f) => {
                const on = filters.includes(f);
                const Icon = DIETARY_META[f].icon;
                return (
                  <button
                    key={f}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggleFilter(f)}
                    className={cn(
                      "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold transition-colors cursor-pointer",
                      on ? "border-teal bg-teal text-teal-foreground" : "bg-card text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Icon className="size-3.5" /> {DIETARY_META[f].label}
                  </button>
                );
              })}
            </div>
          </div>

          <div ref={pillsRef} className="-mx-5 flex gap-1 overflow-x-auto px-5 scrollbar-none" role="tablist" aria-label="Menu categories">
            {sections.map(({ category }) => (
              <button
                key={category.id}
                data-cat={category.id}
                role="tab"
                aria-selected={active === category.id}
                type="button"
                onClick={() => {
                  setActive(category.id);
                  document.getElementById(`cat-${category.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className={cn(
                  "relative shrink-0 px-3 py-2 text-sm font-medium transition-colors cursor-pointer",
                  active === category.id ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {category.name}
                <span
                  className={cn(
                    "absolute inset-x-3 -bottom-[13px] h-0.5 rounded-full bg-gold transition-opacity",
                    active === category.id ? "opacity-100" : "opacity-0",
                  )}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5">
        {sections.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="Nothing matches"
            description="Try another dish or ingredient, or clear your filters."
            action={
              <Button
                variant="outline"
                onClick={() => {
                  setQuery("");
                  setFilters([]);
                }}
              >
                Clear search
              </Button>
            }
          />
        ) : (
          sections.map(({ category, items: sectionItems }) => (
            <section key={category.id} id={`cat-${category.id}`} data-menu-section className="scroll-mt-48 pt-10" aria-labelledby={`h-${category.id}`}>
              <div className="flex items-baseline justify-between border-b pb-3">
                <h2 id={`h-${category.id}`} className="font-display text-4xl">
                  {category.name}
                </h2>
                <p className="text-sm italic text-muted-foreground">{category.description}</p>
              </div>
              <div className="mt-3 grid gap-x-10 gap-y-1 md:grid-cols-2">
                {sectionItems.map((item) => (
                  <MenuItemRow key={item.id} item={item} monogram={restaurant.monogram} />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
