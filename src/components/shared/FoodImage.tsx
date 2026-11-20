import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/** Food photo with a refined monogram fallback for items without photography. */
export function FoodImage({
  src,
  alt,
  className,
  monogram,
  eager = false,
}: {
  src?: string | undefined;
  alt: string;
  className?: string;
  monogram: string;
  eager?: boolean;
}) {
  const ref = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  // Images can finish loading before hydration attaches onLoad.
  useEffect(() => {
    if (ref.current?.complete) setLoaded(true);
  }, [src]);

  if (!src) {
    return (
      <div role="img" aria-label={alt} className={cn("grid place-items-center bg-secondary", className)}>
        <span className="font-display text-3xl text-gold/70" aria-hidden>
          {monogram}
        </span>
      </div>
    );
  }
  return (
    <div className={cn("relative overflow-hidden bg-secondary", className)}>
      <img
        ref={ref}
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={cn(
          "absolute inset-0 size-full object-cover transition-[opacity,transform] duration-700 ease-out",
          loaded ? "opacity-100" : "opacity-0",
        )}
      />
    </div>
  );
}
