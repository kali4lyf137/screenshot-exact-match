import type { Money } from "@/types/meyo";

/** Preview currency. The production app should take this from restaurant settings. */
export const PREVIEW_CURRENCY = "KES";

export function formatMoney(amount: Money, currency: string = PREVIEW_CURRENCY): string {
  const rounded = Math.round(amount);
  const sign = rounded < 0 ? "-" : "";
  return `${sign}${currency} ${Math.abs(rounded).toLocaleString("en-US")}`;
}

export function formatTime(iso: string): string {
  const d = new Date(iso);
  const h = d.getUTCHours() + 3; // preview data is authored in East Africa Time (UTC+3)
  const hh = String(h % 24).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatDate(iso: string): string {
  const d = new Date(new Date(iso).getTime() + 3 * 3600_000);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()] ?? ""} ${d.getUTCFullYear()}`;
}

export function minutesBetween(fromIso: string, toIso: string): number {
  return Math.max(0, Math.round((new Date(toIso).getTime() - new Date(fromIso).getTime()) / 60000));
}
