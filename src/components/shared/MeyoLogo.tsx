import { cn } from "@/lib/utils";

export function MeyoLogo({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const text = size === "lg" ? "text-4xl" : size === "sm" ? "text-xl" : "text-2xl";
  return (
    <span className={cn("inline-flex items-baseline font-display leading-none", text, className)} aria-label="Meyo">
      meyo
      <span aria-hidden className="ml-[0.08em] inline-block size-[0.22em] rounded-full bg-gold" />
    </span>
  );
}
