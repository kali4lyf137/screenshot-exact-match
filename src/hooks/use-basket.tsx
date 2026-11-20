import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { meyo } from "@/integrations/meyo";
import type { BasketLine, MenuItem, PricingBreakdown } from "@/types/meyo";

export interface DetailedBasketLine extends BasketLine {
  item: MenuItem;
  lineTotal: number;
}

interface BasketValue {
  lines: DetailedBasketLine[];
  count: number;
  pricing: PricingBreakdown;
  /** Increments on every add — drives the basket "bump" micro-interaction. */
  addPulse: number;
  add: (itemId: string, quantity?: number, options?: { note?: string; modifiers?: Record<string, string> }) => void;
  setQuantity: (lineId: string, quantity: number) => void;
  remove: (lineId: string) => void;
  clear: () => void;
}

const BasketContext = createContext<BasketValue | null>(null);

/**
 * Local preview basket. Production Meyo already owns basket logic — replace this provider
 * with a thin wrapper around that context, keeping the same value shape for the screens.
 */
export function BasketProvider({
  items,
  storageKey,
  children,
}: {
  items: MenuItem[];
  storageKey: string;
  children: ReactNode;
}) {
  const [raw, setRaw] = useState<BasketLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [addPulse, setAddPulse] = useState(0);

  useEffect(() => {
    try {
      const saved = window.sessionStorage.getItem(storageKey);
      if (saved) setRaw(JSON.parse(saved) as BasketLine[]);
    } catch {
      /* ignore corrupt preview storage */
    }
    setHydrated(true);
  }, [storageKey]);

  useEffect(() => {
    if (hydrated) window.sessionStorage.setItem(storageKey, JSON.stringify(raw));
  }, [raw, hydrated, storageKey]);

  const add = useCallback<BasketValue["add"]>((itemId, quantity = 1, options) => {
    setRaw((prev) => {
      const sameKey = JSON.stringify(options?.modifiers ?? {});
      const match = prev.find(
        (l) => l.itemId === itemId && !l.note && !options?.note && JSON.stringify(l.modifiers ?? {}) === sameKey,
      );
      if (match) return prev.map((l) => (l === match ? { ...l, quantity: l.quantity + quantity } : l));
      const line: BasketLine = {
        lineId: `${itemId}-${Date.now().toString(36)}`,
        itemId,
        quantity,
        ...(options?.note ? { note: options.note } : {}),
        ...(options?.modifiers ? { modifiers: options.modifiers } : {}),
      };
      return [...prev, line];
    });
    setAddPulse((n) => n + 1);
  }, []);

  const setQuantity = useCallback((lineId: string, quantity: number) => {
    setRaw((prev) =>
      quantity <= 0 ? prev.filter((l) => l.lineId !== lineId) : prev.map((l) => (l.lineId === lineId ? { ...l, quantity } : l)),
    );
  }, []);

  const remove = useCallback((lineId: string) => setRaw((prev) => prev.filter((l) => l.lineId !== lineId)), []);
  const clear = useCallback(() => setRaw([]), []);

  const value = useMemo<BasketValue>(() => {
    const byId = new Map(items.map((i) => [i.id, i]));
    const lines: DetailedBasketLine[] = [];
    for (const l of raw) {
      const item = byId.get(l.itemId);
      if (item) lines.push({ ...l, item, lineTotal: item.price * l.quantity });
    }
    const pricing = meyo.pricing.price(lines.map((l) => ({ unitPrice: l.item.price, quantity: l.quantity })));
    const count = lines.reduce((n, l) => n + l.quantity, 0);
    return { lines, count, pricing, addPulse, add, setQuantity, remove, clear };
  }, [raw, items, addPulse, add, setQuantity, remove, clear]);

  return <BasketContext.Provider value={value}>{children}</BasketContext.Provider>;
}

export function useBasket(): BasketValue {
  const ctx = useContext(BasketContext);
  if (!ctx) throw new Error("useBasket must be used inside <BasketProvider>");
  return ctx;
}
