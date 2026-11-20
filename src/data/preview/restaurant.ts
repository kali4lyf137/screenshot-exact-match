// PREVIEW DATA — fictional restaurant for the design prototype.
import cover from "@/assets/hero-table.jpg";
import interior from "@/assets/restaurant-interior.jpg";
import type { Restaurant, TableSession } from "@/types/meyo";
import { previewMinutesAgo } from "./clock";

export const previewRestaurant: Restaurant = {
  id: "rst_olea",
  slug: "olea",
  name: "Olea",
  tagline: "Kitchen & Bar",
  description:
    "Fire, citrus and olive oil. A Mediterranean kitchen built around the wood grill, with plates made for sharing slowly.",
  cuisine: "Mediterranean · Wood-fired",
  address: "14 Riverside Drive",
  city: "Nairobi",
  phone: "+254 700 000 000",
  hours: [
    { label: "Mon – Thu", value: "12:00 – 23:00" },
    { label: "Fri – Sat", value: "12:00 – 00:30" },
    { label: "Sunday", value: "11:00 – 22:00" },
  ],
  monogram: "O",
  coverImage: cover,
  interiorImage: interior,
};

/** The QR payload the preview adapter accepts. */
export const PREVIEW_TABLE_CODE = "OLEA-T12";

export const previewSession: TableSession = {
  sessionId: "ses_preview_12",
  restaurantId: previewRestaurant.id,
  restaurantSlug: previewRestaurant.slug,
  tableId: "tbl_12",
  tableLabel: "Table 12",
  area: "Terrace",
  startedAt: previewMinutesAgo(34),
};
