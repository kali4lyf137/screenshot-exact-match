/**
 * Meyo integration contracts.
 *
 * Screens and hooks depend ONLY on these interfaces. The prototype ships a preview
 * adapter (preview-adapter.ts) backed by fictional data. The production Meyo app should
 * implement these interfaces on top of its existing API services, contexts, QR table
 * access, basket/order logic, VAT/service-charge calculation and real-time order events.
 */
import type { PriceableLine } from "@/lib/preview-pricing";
import type {
  ActivityEvent,
  DiningTable,
  MenuCategory,
  MenuItem,
  Order,
  OrderStatus,
  PricingBreakdown,
  Restaurant,
  StaffMember,
  TableSession,
} from "@/types/meyo";

/** Thrown by the preview adapter for operations that require the production backend. */
export class NotConnectedError extends Error {
  readonly operation: string;
  constructor(operation: string) {
    super(`"${operation}" needs the production Meyo backend; it is not available in preview.`);
    this.name = "NotConnectedError";
    this.operation = operation;
  }
}

export function isNotConnected(error: unknown): error is NotConnectedError {
  return error instanceof NotConnectedError;
}

export type Unsubscribe = () => void;

/** QR table access — maps to Meyo's existing QR table session flow. */
export interface QrTableAccess {
  /** Resolve the payload encoded in a table QR (or a typed table code) into a session. */
  resolveTableCode(code: string): Promise<TableSession>;
  /** The guest's active table session, if any. */
  getActiveSession(): Promise<TableSession | null>;
}

export interface RestaurantService {
  getRestaurant(slug: string): Promise<Restaurant>;
}

export interface MenuService {
  getCategories(restaurantId: string): Promise<MenuCategory[]>;
  getItems(restaurantId: string): Promise<MenuItem[]>;
}

/** VAT and service charge — production must use Meyo's existing calculation. */
export interface PricingService {
  price(lines: PriceableLine[]): PricingBreakdown;
}

export interface PlaceOrderInput {
  sessionId: string;
  lines: { itemId: string; quantity: number; note?: string; modifiers?: Record<string, string> }[];
  paymentMethod: PaymentMethodId;
}

export type PaymentMethodId = "pay-at-table" | "mobile-money" | "card";

export interface GuestOrderService {
  listSessionOrders(sessionId: string): Promise<Order[]>;
  getOrder(orderId: string): Promise<Order | null>;
  placeOrder(input: PlaceOrderInput): Promise<Order>;
}

/** Real-time order status — maps to Meyo's existing real-time order functionality. */
export interface OrderStatusFeed {
  subscribe(orderId: string, onStatus: (status: OrderStatus, at: string) => void): Unsubscribe;
}

export interface TableServiceRequests {
  callWaiter(sessionId: string): Promise<void>;
  requestBill(sessionId: string): Promise<void>;
}

export interface StaffOperations {
  getCurrentStaff(): Promise<StaffMember>;
  listOrders(restaurantId: string): Promise<Order[]>;
  updateOrderStatus(orderId: string, status: OrderStatus): Promise<void>;
  listTables(restaurantId: string): Promise<DiningTable[]>;
  listActivity(restaurantId: string): Promise<ActivityEvent[]>;
  getHourlyOrders(restaurantId: string): Promise<{ hour: string; orders: number }[]>;
  signOut(): Promise<void>;
}

export interface MeyoServices {
  /** "preview" = fictional data, write operations disabled. */
  mode: "preview" | "production";
  qr: QrTableAccess;
  restaurants: RestaurantService;
  menu: MenuService;
  pricing: PricingService;
  orders: GuestOrderService;
  statusFeed: OrderStatusFeed;
  serviceRequests: TableServiceRequests;
  staff: StaffOperations;
}
