/**
 * Meyo domain types.
 * These mirror the shapes the production Meyo API is expected to provide. They are
 * framework-agnostic (no React/DOM types) so they can be shared with the Expo app.
 */

/** Whole currency units (e.g. KES). Production may use minor units — adapt in the adapter. */
export type Money = number;

export interface Restaurant {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  cuisine: string;
  address: string;
  city: string;
  phone: string;
  hours: { label: string; value: string }[];
  monogram: string;
  coverImage: string;
  interiorImage: string;
}

export interface TableSession {
  sessionId: string;
  restaurantId: string;
  restaurantSlug: string;
  tableId: string;
  tableLabel: string;
  area: string;
  startedAt: string; // ISO
}

export interface MenuCategory {
  id: string;
  name: string;
  description: string;
  sortOrder: number;
  visible: boolean;
}

export type DietaryTag =
  | "vegetarian"
  | "vegan"
  | "gluten-free"
  | "dairy-free"
  | "spicy"
  | "contains-nuts";

export interface ModifierOption {
  id: string;
  label: string;
}

export interface ModifierGroup {
  id: string;
  label: string;
  required: boolean;
  options: ModifierOption[];
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  longDescription?: string;
  price: Money;
  image?: string;
  available: boolean;
  popular?: boolean;
  featured?: boolean;
  dietary: DietaryTag[];
  prepMinutes?: number;
  modifierGroups?: ModifierGroup[];
}

export interface BasketLine {
  lineId: string;
  itemId: string;
  quantity: number;
  note?: string;
  modifiers?: Record<string, string>;
}

export type OrderStatus = "received" | "confirmed" | "preparing" | "ready" | "completed";

export const ORDER_STATUS_FLOW: readonly OrderStatus[] = [
  "received",
  "confirmed",
  "preparing",
  "ready",
  "completed",
] as const;

export interface OrderLine {
  itemId: string;
  name: string;
  quantity: number;
  unitPrice: Money;
  note?: string;
}

export interface PricingBreakdown {
  subtotal: Money;
  vat: Money;
  serviceCharge: Money;
  total: Money;
  /** True when produced by the prototype's demonstration rules, never production rules. */
  isPreview: boolean;
}

export interface Order {
  id: string;
  reference: string;
  tableLabel: string;
  placedAt: string; // ISO
  status: OrderStatus;
  lines: OrderLine[];
  pricing: PricingBreakdown;
  priority: "normal" | "rush";
  guestNote?: string;
  statusHistory: { status: OrderStatus; at: string }[];
}

export type TableStatus = "available" | "seated" | "ordering" | "awaiting-bill" | "reserved";

export interface DiningTable {
  id: string;
  label: string;
  area: string;
  seats: number;
  status: TableStatus;
  guests?: number;
  seatedAt?: string;
  openOrderIds: string[];
}

export type StaffRole = "owner" | "manager" | "server" | "kitchen";

export interface StaffMember {
  id: string;
  name: string;
  initials: string;
  role: StaffRole;
  email: string;
  phone: string;
  shift: string;
  since: string;
}

export interface ActivityEvent {
  id: string;
  at: string;
  kind: "order" | "kitchen" | "table" | "service";
  message: string;
}
