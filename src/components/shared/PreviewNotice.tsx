import { FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

/** Marks preview-only data or behaviour. Always visible wherever a demo stands in for production. */
export function PreviewNotice({
  children,
  className,
  variant = "inline",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "inline" | "banner";
}) {
  if (variant === "banner") {
    return (
      <div
        role="note"
        className={cn(
          "flex items-start gap-3 rounded-lg border border-dashed border-gold/50 bg-gold-soft px-4 py-3 text-sm text-foreground",
          className,
        )}
      >
        <FlaskConical className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
        <div className="leading-relaxed">{children}</div>
      </div>
    );
  }
  return (
    <p role="note" className={cn("inline-flex items-center gap-1.5 text-xs text-muted-foreground", className)}>
      <FlaskConical className="size-3.5 text-gold" aria-hidden />
      <span>{children}</span>
    </p>
  );
}

export function PreviewTag({ className, label = "Preview" }: { className?: string; label?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-dashed border-gold/60 px-2 py-0.5 eyebrow text-[10px] text-gold",
        className,
      )}
    >
      <FlaskConical className="size-3" aria-hidden />
      {label}
    </span>
  );
}
