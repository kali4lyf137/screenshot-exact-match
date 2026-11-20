import { queryOptions } from "@tanstack/react-query";
import { meyo } from "./index";

export const PREVIEW_RESTAURANT_SLUG = "olea";

export const sessionQuery = () =>
  queryOptions({ queryKey: ["meyo", "session"], queryFn: () => meyo.qr.getActiveSession() });

export const restaurantQuery = (slug: string) =>
  queryOptions({ queryKey: ["meyo", "restaurant", slug], queryFn: () => meyo.restaurants.getRestaurant(slug) });

export const categoriesQuery = (restaurantId: string) =>
  queryOptions({ queryKey: ["meyo", "categories", restaurantId], queryFn: () => meyo.menu.getCategories(restaurantId) });

export const menuItemsQuery = (restaurantId: string) =>
  queryOptions({ queryKey: ["meyo", "items", restaurantId], queryFn: () => meyo.menu.getItems(restaurantId) });

export const sessionOrdersQuery = (sessionId: string) =>
  queryOptions({ queryKey: ["meyo", "session-orders", sessionId], queryFn: () => meyo.orders.listSessionOrders(sessionId) });

export const orderQuery = (orderId: string) =>
  queryOptions({ queryKey: ["meyo", "order", orderId], queryFn: () => meyo.orders.getOrder(orderId) });

export const staffMemberQuery = () =>
  queryOptions({ queryKey: ["meyo", "staff", "me"], queryFn: () => meyo.staff.getCurrentStaff() });

export const staffOrdersQuery = (restaurantId: string) =>
  queryOptions({ queryKey: ["meyo", "staff", "orders", restaurantId], queryFn: () => meyo.staff.listOrders(restaurantId) });

export const tablesQuery = (restaurantId: string) =>
  queryOptions({ queryKey: ["meyo", "staff", "tables", restaurantId], queryFn: () => meyo.staff.listTables(restaurantId) });

export const activityQuery = (restaurantId: string) =>
  queryOptions({ queryKey: ["meyo", "staff", "activity", restaurantId], queryFn: () => meyo.staff.listActivity(restaurantId) });

export const hourlyOrdersQuery = (restaurantId: string) =>
  queryOptions({ queryKey: ["meyo", "staff", "hourly", restaurantId], queryFn: () => meyo.staff.getHourlyOrders(restaurantId) });
