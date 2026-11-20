import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { IS_PREVIEW, meyo } from "@/integrations/meyo";
import { nextOrderStatus } from "@/lib/order-status";
import type { Order, OrderStatus } from "@/types/meyo";

interface OrderBoardValue {
  orders: Order[];
  setStatus: (orderId: string, status: OrderStatus) => void;
  advance: (orderId: string) => void;
}

const OrderBoardContext = createContext<OrderBoardValue | null>(null);

/**
 * Staff order board state. In preview, status changes stay local to this browser tab.
 * In production, `setStatus` should call `meyo.staff.updateOrderStatus` and reconcile
 * with the real-time order feed.
 */
export function OrderBoardProvider({ initialOrders, children }: { initialOrders: Order[]; children: ReactNode }) {
  const [orders, setOrders] = useState(initialOrders);

  const setStatus = useCallback((orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status, statusHistory: [...o.statusHistory, { status, at: new Date().toISOString() }] } : o,
      ),
    );
    if (!IS_PREVIEW) void meyo.staff.updateOrderStatus(orderId, status);
  }, []);

  const advance = useCallback(
    (orderId: string) => {
      const current = orders.find((o) => o.id === orderId);
      const next = current ? nextOrderStatus(current.status) : null;
      if (next) setStatus(orderId, next);
    },
    [orders, setStatus],
  );

  const value = useMemo(() => ({ orders, setStatus, advance }), [orders, setStatus, advance]);
  return <OrderBoardContext.Provider value={value}>{children}</OrderBoardContext.Provider>;
}

export function useOrderBoard(): OrderBoardValue {
  const ctx = useContext(OrderBoardContext);
  if (!ctx) throw new Error("useOrderBoard must be used inside <OrderBoardProvider>");
  return ctx;
}
