// PREVIEW DATA — fictional floor plan for the design prototype.
import type { DiningTable } from "@/types/meyo";
import { previewMinutesAgo } from "./clock";

export const previewTables: DiningTable[] = [
  { id: "tbl_1", label: "T1", area: "Dining room", seats: 4, status: "seated", guests: 3, seatedAt: previewMinutesAgo(42), openOrderIds: ["ord_2421"] },
  { id: "tbl_2", label: "T2", area: "Dining room", seats: 2, status: "awaiting-bill", guests: 2, seatedAt: previewMinutesAgo(78), openOrderIds: [] },
  { id: "tbl_3", label: "T3", area: "Dining room", seats: 4, status: "ordering", guests: 4, seatedAt: previewMinutesAgo(12), openOrderIds: ["ord_2431"] },
  { id: "tbl_4", label: "T4", area: "Dining room", seats: 2, status: "seated", guests: 2, seatedAt: previewMinutesAgo(55), openOrderIds: ["ord_2415"] },
  { id: "tbl_5", label: "T5", area: "Dining room", seats: 6, status: "reserved", openOrderIds: [] },
  { id: "tbl_6", label: "T6", area: "Dining room", seats: 4, status: "seated", guests: 2, seatedAt: previewMinutesAgo(30), openOrderIds: ["ord_2424"] },
  { id: "tbl_7", label: "T7", area: "Dining room", seats: 2, status: "available", openOrderIds: [] },
  { id: "tbl_8", label: "T8", area: "Dining room", seats: 8, status: "seated", guests: 7, seatedAt: previewMinutesAgo(18), openOrderIds: ["ord_2429"] },
  { id: "tbl_9", label: "T9", area: "Terrace", seats: 4, status: "awaiting-bill", guests: 4, seatedAt: previewMinutesAgo(92), openOrderIds: [] },
  { id: "tbl_10", label: "T10", area: "Terrace", seats: 2, status: "available", openOrderIds: [] },
  { id: "tbl_11", label: "T11", area: "Terrace", seats: 4, status: "available", openOrderIds: [] },
  { id: "tbl_12", label: "T12", area: "Terrace", seats: 4, status: "seated", guests: 2, seatedAt: previewMinutesAgo(34), openOrderIds: ["ord_2418"] },
  { id: "tbl_14", label: "T14", area: "Terrace", seats: 6, status: "reserved", openOrderIds: [] },
  { id: "tbl_15", label: "T15", area: "Terrace", seats: 4, status: "seated", guests: 3, seatedAt: previewMinutesAgo(25), openOrderIds: ["ord_2427"] },
  { id: "tbl_b1", label: "B1", area: "Bar", seats: 2, status: "seated", guests: 2, seatedAt: previewMinutesAgo(40), openOrderIds: ["ord_2412"] },
  { id: "tbl_b2", label: "B2", area: "Bar", seats: 2, status: "ordering", guests: 1, seatedAt: previewMinutesAgo(6), openOrderIds: ["ord_2430"] },
  { id: "tbl_b3", label: "B3", area: "Bar", seats: 2, status: "available", openOrderIds: [] },
  { id: "tbl_b4", label: "B4", area: "Bar", seats: 2, status: "available", openOrderIds: [] },
];
