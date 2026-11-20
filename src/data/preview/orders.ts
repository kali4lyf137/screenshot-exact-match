// PREVIEW DATA — fictional orders for the design prototype. Not real orders.
import { calculatePreviewPricing } from "@/lib/preview-pricing";
import type { Order, OrderLine, OrderStatus } from "@/types/meyo";
import { ORDER_STATUS_FLOW } from "@/types/meyo";
import { previewMinutesAgo } from "./clock";
import { previewMenuItems } from "./menu";

function line(itemId: string, quantity: number, note?: string): OrderLine {
  const item = previewMenuItems.find((i) => i.id === itemId);
  if (!item) throw new Error(`Unknown preview item ${itemId}`);
  return { itemId, name: item.name, quantity, unitPrice: item.price, ...(note ? { note } : {}) };
}

function order(
  n: number,
  table: string,
  minutesAgo: number,
  status: OrderStatus,
  lines: OrderLine[],
  extra: Partial<Pick<Order, "priority" | "guestNote">> = {},
): Order {
  const reached = ORDER_STATUS_FLOW.slice(0, ORDER_STATUS_FLOW.indexOf(status) + 1);
  const step = Math.max(1, Math.floor(minutesAgo / Math.max(1, reached.length)));
  return {
    id: `ord_${n}`,
    reference: `OL-${n}`,
    tableLabel: table,
    placedAt: previewMinutesAgo(minutesAgo),
    status,
    lines,
    pricing: calculatePreviewPricing(lines),
    priority: extra.priority ?? "normal",
    ...(extra.guestNote ? { guestNote: extra.guestNote } : {}),
    statusHistory: reached.map((s, i) => ({ status: s, at: previewMinutesAgo(minutesAgo - i * step) })),
  };
}

/** Orders belonging to the preview guest session (Table 12). */
export const previewGuestOrders: Order[] = [
  order(2418, "Table 12", 22, "preparing", [line("itm_mezze", 1), line("itm_lamb", 1), line("itm_spritz", 2)]),
  order(2409, "Table 12", 31, "completed", [line("itm_lemonade", 2), line("itm_flatbread", 1)]),
  order(2387, "Table 12", 60 * 24 * 9, "completed", [line("itm_seabass", 1), line("itm_fattoush", 1), line("itm_pannacotta", 2)]),
];

/** Restaurant-wide orders shown in the staff app. */
export const previewRestaurantOrders: Order[] = [
  order(2431, "Table 3", 1, "received", [line("itm_burrata", 1), line("itm_octopus", 1), line("itm_spritz", 2)], {
    guestNote: "One guest has a shellfish allergy.",
  }),
  order(2430, "Bar 2", 3, "received", [line("itm_coffee", 2), line("itm_tart", 1)]),
  order(2429, "Table 8", 5, "confirmed", [line("itm_mezze", 1), line("itm_chicken", 2)], { priority: "rush" }),
  order(2427, "Table 15", 9, "preparing", [line("itm_seabass", 1), line("itm_risotto", 1), line("itm_fattoush", 1)]),
  order(2424, "Table 6", 13, "preparing", [line("itm_lamb", 1), line("itm_flatbread", 2)]),
  order(2421, "Table 1", 19, "preparing", [line("itm_octopus", 2), line("itm_halloumi", 1)], { priority: "rush" }),
  ...previewGuestOrders.slice(0, 1),
  order(2415, "Table 4", 26, "ready", [line("itm_pannacotta", 2), line("itm_coffee", 2)]),
  order(2412, "Bar 1", 28, "ready", [line("itm_spritz", 3)]),
  order(2405, "Table 9", 48, "completed", [line("itm_mezze", 1), line("itm_seabass", 2), line("itm_lemonade", 3)]),
  order(2401, "Table 2", 64, "completed", [line("itm_risotto", 2), line("itm_tart", 2)]),
];
