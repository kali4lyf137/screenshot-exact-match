/**
 * PREVIEW ADAPTER — implements the Meyo contracts with fictional, in-memory data.
 * Reads return sample data. Every write rejects with NotConnectedError: nothing is
 * ever sent to a restaurant, kitchen or payment provider from this prototype.
 */
import {
  PREVIEW_TABLE_CODE,
  previewActivity,
  previewCategories,
  previewGuestOrders,
  previewHourlyOrders,
  previewMenuItems,
  previewRestaurant,
  previewRestaurantOrders,
  previewSession,
  previewStaffMember,
  previewTables,
} from "@/data/preview";
import { calculatePreviewPricing } from "@/lib/preview-pricing";
import { type MeyoServices, NotConnectedError } from "./contracts";

const clone = <T,>(value: T): T => structuredClone(value);

export const previewServices: MeyoServices = {
  mode: "preview",
  qr: {
    async resolveTableCode(code) {
      if (code.trim().toUpperCase() !== PREVIEW_TABLE_CODE) {
        throw new Error("That table code isn't recognised in preview mode.");
      }
      return clone(previewSession);
    },
    async getActiveSession() {
      return clone(previewSession);
    },
  },
  restaurants: {
    async getRestaurant(slug) {
      if (slug !== previewRestaurant.slug) throw new Error(`Unknown preview restaurant "${slug}"`);
      return clone(previewRestaurant);
    },
  },
  menu: {
    async getCategories() {
      return clone(previewCategories);
    },
    async getItems() {
      return clone(previewMenuItems);
    },
  },
  pricing: {
    price: (lines) => calculatePreviewPricing(lines),
  },
  orders: {
    async listSessionOrders() {
      return clone(previewGuestOrders);
    },
    async getOrder(orderId) {
      const all = [...previewGuestOrders, ...previewRestaurantOrders];
      return clone(all.find((o) => o.id === orderId) ?? null);
    },
    async placeOrder() {
      throw new NotConnectedError("orders.placeOrder");
    },
  },
  statusFeed: {
    // No real-time source in preview: subscribers never receive events.
    subscribe: () => () => {},
  },
  serviceRequests: {
    async callWaiter() {
      throw new NotConnectedError("serviceRequests.callWaiter");
    },
    async requestBill() {
      throw new NotConnectedError("serviceRequests.requestBill");
    },
  },
  staff: {
    async getCurrentStaff() {
      return clone(previewStaffMember);
    },
    async listOrders() {
      return clone(previewRestaurantOrders);
    },
    async updateOrderStatus() {
      throw new NotConnectedError("staff.updateOrderStatus");
    },
    async listTables() {
      return clone(previewTables);
    },
    async listActivity() {
      return clone(previewActivity);
    },
    async getHourlyOrders() {
      return clone(previewHourlyOrders);
    },
    async signOut() {
      throw new NotConnectedError("staff.signOut");
    },
  },
};
