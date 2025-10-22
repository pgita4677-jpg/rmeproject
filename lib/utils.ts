// file: lib/utils.ts
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function untuk menggabungkan beberapa className Tailwind CSS.
 * Contoh:
 * cn("bg-red-500", kondisi && "text-white")
 */
export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs))
}
