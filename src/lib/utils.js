import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

const BASE = import.meta.env.BASE_URL

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/** Append base URL for public assets (handles GitHub Pages subdirectory) */
export function asset(path) {
  return BASE + path.replace(/^\//, '')
}
