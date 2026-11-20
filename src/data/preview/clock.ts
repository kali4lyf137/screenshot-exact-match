/** Fixed "now" for preview data so elapsed times render identically on server and client. */
export const PREVIEW_NOW = "2026-11-20T16:30:00.000Z"; // 19:30 East Africa Time

export function previewMinutesAgo(minutes: number): string {
  return new Date(new Date(PREVIEW_NOW).getTime() - minutes * 60000).toISOString();
}
