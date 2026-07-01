import { DEFAULT_CONTENT, type SiteContent } from "./content";

export const CONTENT_KEY = "prach-portfolio-content-v1";
export const AUTH_KEY = "prach-portfolio-dev-auth";

/** Dev Tool password. Override with NEXT_PUBLIC_DEV_PASSWORD at build time. */
export const DEV_PASSWORD =
  process.env.NEXT_PUBLIC_DEV_PASSWORD || "SreyaismyHEART";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function deepMerge(base: unknown, override: unknown): unknown {
  if (override === undefined || override === null) return base;
  if (Array.isArray(override)) return override; // arrays replace wholesale
  if (isPlainObject(base) && isPlainObject(override)) {
    const out: Record<string, unknown> = { ...base };
    for (const key of Object.keys(override)) {
      out[key] = deepMerge(base[key], override[key]);
    }
    return out;
  }
  return override;
}

/**
 * Deep-merge stored/partial content over the defaults so that newly added
 * fields always have a value even if the saved blob predates them.
 * Arrays are taken wholesale from the override when present.
 */
export function mergeContent(
  base: SiteContent,
  override: Partial<SiteContent> | null | undefined
): SiteContent {
  if (!override) return base;
  return deepMerge(base, override) as SiteContent;
}

export function readLocalContent(): SiteContent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONTENT_KEY);
    if (!raw) return null;
    return mergeContent(DEFAULT_CONTENT, JSON.parse(raw));
  } catch {
    return null;
  }
}

export function writeLocalContent(content: SiteContent) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CONTENT_KEY, JSON.stringify(content));
  } catch (e) {
    // Most likely quota exceeded (too many / too large data-URL images).
    console.warn("Could not persist content locally:", e);
    throw e;
  }
}

/** Try to load content the backend has stored (live for every visitor). */
export async function fetchRemoteContent(): Promise<SiteContent | null> {
  try {
    const res = await fetch(`${API_BASE}/content`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || typeof data !== "object") return null;
    return mergeContent(DEFAULT_CONTENT, data);
  } catch {
    return null;
  }
}

/** Push edited content to the backend so it goes live for everyone. */
export async function pushRemoteContent(
  content: SiteContent,
  password: string
): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/content`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Admin-Password": password,
      },
      body: JSON.stringify(content),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Read an image File, downscale it to a sane max dimension, and return a
 * compressed data-URL. Keeps localStorage small and makes uploads work with
 * no backend at all — the photo is embedded right in the content.
 */
export function fileToDataUrl(
  file: File,
  maxDim = 1100,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Could not load image"));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          const scale = maxDim / Math.max(width, height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(reader.result as string);
        ctx.drawImage(img, 0, 0, width, height);
        const isPng = file.type === "image/png";
        resolve(canvas.toDataURL(isPng ? "image/png" : "image/jpeg", quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function downloadJson(content: SiteContent, filename = "content.json") {
  const blob = new Blob([JSON.stringify(content, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
