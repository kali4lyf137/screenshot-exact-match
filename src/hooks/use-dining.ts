import { useSuspenseQuery } from "@tanstack/react-query";
import {
  categoriesQuery,
  menuItemsQuery,
  restaurantQuery,
  sessionQuery,
} from "@/integrations/meyo/queries";

/** Guest-side data for the current table session. Requires the /dine loader to have run. */
export function useDining() {
  const session = useSuspenseQuery(sessionQuery()).data;
  if (!session) throw new Error("No active table session");
  const restaurant = useSuspenseQuery(restaurantQuery(session.restaurantSlug)).data;
  const categories = useSuspenseQuery(categoriesQuery(session.restaurantId)).data;
  const items = useSuspenseQuery(menuItemsQuery(session.restaurantId)).data;
  return { session, restaurant, categories, items };
}
