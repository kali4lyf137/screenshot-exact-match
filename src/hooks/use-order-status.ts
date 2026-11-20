import { useEffect, useState } from "react";
import { meyo } from "@/integrations/meyo";
import type { OrderStatus } from "@/types/meyo";

/**
 * Live order status. Subscribes to `meyo.statusFeed` — in production this is Meyo's
 * existing real-time order channel; in preview the feed never emits, so the screen
 * exposes `setPreviewStatus` for clearly-labelled preview controls.
 */
export function useOrderStatus(orderId: string, initial: OrderStatus) {
  const [status, setStatus] = useState<OrderStatus>(initial);

  useEffect(() => setStatus(initial), [orderId, initial]);
  useEffect(() => meyo.statusFeed.subscribe(orderId, (next) => setStatus(next)), [orderId]);

  return { status, setPreviewStatus: setStatus };
}
