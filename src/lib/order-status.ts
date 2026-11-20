import { ORDER_STATUS_FLOW, type OrderStatus } from "@/types/meyo";

export type StatusTone = "gold" | "teal" | "warning" | "success" | "muted";

export const ORDER_STATUS_META: Record<
  OrderStatus,
  { label: string; guestTitle: string; guestDescription: string; tone: StatusTone }
> = {
  received: {
    label: "Received",
    guestTitle: "Order received",
    guestDescription: "The restaurant has your order.",
    tone: "gold",
  },
  confirmed: {
    label: "Confirmed",
    guestTitle: "Confirmed by the team",
    guestDescription: "Your server has checked everything over.",
    tone: "teal",
  },
  preparing: {
    label: "Preparing",
    guestTitle: "In the kitchen",
    guestDescription: "Your dishes are being cooked to order.",
    tone: "warning",
  },
  ready: {
    label: "Ready",
    guestTitle: "On its way to you",
    guestDescription: "Plated and leaving the pass.",
    tone: "success",
  },
  completed: {
    label: "Completed",
    guestTitle: "Served",
    guestDescription: "Enjoy your meal.",
    tone: "muted",
  },
};

export function nextOrderStatus(status: OrderStatus): OrderStatus | null {
  const i = ORDER_STATUS_FLOW.indexOf(status);
  return ORDER_STATUS_FLOW[i + 1] ?? null;
}

export function isActiveOrder(status: OrderStatus): boolean {
  return status !== "completed";
}
