import { Minus, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function QuantityStepper({
  value,
  onChange,
  min = 0,
  max = 20,
  size = "md",
  label,
  className,
  showRemove = false,
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  label: string;
  className?: string;
  showRemove?: boolean;
}) {
  const btn = size === "lg" ? "size-12" : size === "sm" ? "size-8" : "size-10";
  const removing = showRemove && value <= 1;
  return (
    <div
      role="group"
      aria-label={label}
      className={cn("inline-flex items-center rounded-full border bg-card shadow-soft", className)}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={!showRemove && value <= min}
        className={cn(
          "grid place-items-center rounded-full text-foreground transition-colors hover:bg-secondary disabled:opacity-30 cursor-pointer",
          btn,
        )}
        aria-label={removing ? "Remove" : "Decrease quantity"}
      >
        {removing ? <Trash2 className="size-4" /> : <Minus className="size-4" />}
      </button>
      <span className={cn("min-w-8 text-center font-semibold tabular", size === "lg" && "text-lg")} aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className={cn(
          "grid place-items-center rounded-full text-foreground transition-colors hover:bg-secondary disabled:opacity-30 cursor-pointer",
          btn,
        )}
        aria-label="Increase quantity"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
