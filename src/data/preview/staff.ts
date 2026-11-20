// PREVIEW DATA — fictional staff member and activity for the design prototype.
import type { ActivityEvent, StaffMember } from "@/types/meyo";
import { previewMinutesAgo } from "./clock";

export const previewStaffMember: StaffMember = {
  id: "stf_amani",
  name: "Amani Wanjiru",
  initials: "AW",
  role: "manager",
  email: "amani@olea.example",
  phone: "+254 700 000 001",
  shift: "Evening · 16:00 – 00:00",
  since: "2024-03-01T00:00:00.000Z",
};

export const previewActivity: ActivityEvent[] = [
  { id: "act_1", at: previewMinutesAgo(1), kind: "order", message: "New order OL-2431 from Table 3" },
  { id: "act_2", at: previewMinutesAgo(3), kind: "order", message: "New order OL-2430 from Bar 2" },
  { id: "act_3", at: previewMinutesAgo(4), kind: "service", message: "Table 2 requested the bill" },
  { id: "act_4", at: previewMinutesAgo(5), kind: "kitchen", message: "OL-2429 confirmed and marked rush" },
  { id: "act_5", at: previewMinutesAgo(8), kind: "table", message: "Table 8 seated · 7 guests" },
  { id: "act_6", at: previewMinutesAgo(11), kind: "kitchen", message: "OL-2415 ready for pass" },
  { id: "act_7", at: previewMinutesAgo(14), kind: "service", message: "Table 9 called a waiter" },
];

/** Hourly order counts for the dashboard chart. */
export const previewHourlyOrders: { hour: string; orders: number }[] = [
  { hour: "12", orders: 6 },
  { hour: "13", orders: 14 },
  { hour: "14", orders: 11 },
  { hour: "15", orders: 5 },
  { hour: "16", orders: 4 },
  { hour: "17", orders: 8 },
  { hour: "18", orders: 15 },
  { hour: "19", orders: 21 },
];
