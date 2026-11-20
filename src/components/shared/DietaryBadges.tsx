import { Flame, Leaf, MilkOff, Nut, Sprout, WheatOff, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DietaryTag } from "@/types/meyo";

export const DIETARY_META: Record<DietaryTag, { label: string; short: string; icon: LucideIcon }> = {
  vegetarian: { label: "Vegetarian", short: "V", icon: Leaf },
  vegan: { label: "Vegan", short: "VG", icon: Sprout },
  "gluten-free": { label: "Gluten free", short: "GF", icon: WheatOff },
  "dairy-free": { label: "Dairy free", short: "DF", icon: MilkOff },
  spicy: { label: "Spicy", short: "Hot", icon: Flame },
  "contains-nuts": { label: "Contains nuts", short: "N", icon: Nut },
};

export function DietaryBadges({
  tags,
  className,
  showLabels = false,
}: {
  tags: DietaryTag[];
  className?: string;
  showLabels?: boolean;
}) {
  if (tags.length === 0) return null;
  return (
    <ul className={cn("flex flex-wrap items-center gap-1.5", className)} aria-label="Dietary information">
      {tags.map((tag) => {
        const meta = DIETARY_META[tag];
        const Icon = meta.icon;
        return (
          <li
            key={tag}
            title={meta.label}
            className={cn(
              "inline-flex items-center gap-1 rounded-full border text-muted-foreground",
              showLabels ? "px-2.5 py-1 text-xs" : "size-6 justify-center",
              tag === "spicy" && "text-destructive",
            )}
          >
            <Icon className="size-3.5" aria-hidden />
            {showLabels ? <span>{meta.label}</span> : <span className="sr-only">{meta.label}</span>}
          </li>
        );
      })}
    </ul>
  );
}
