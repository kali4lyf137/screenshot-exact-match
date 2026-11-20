/**
 * Single switch point between the preview adapter and a production implementation.
 * To integrate: implement `MeyoServices` against the real Meyo API and export it here.
 */
import type { MeyoServices } from "./contracts";
import { previewServices } from "./preview-adapter";

export const meyo: MeyoServices = previewServices;
export const IS_PREVIEW = meyo.mode === "preview";

export * from "./contracts";
