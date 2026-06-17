import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format date
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Format rating
export function formatRating(rating: number): string {
  return rating.toFixed(1)
}

// Truncate text
export function truncateText(text: string, length: number = 100): string {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

// Generate random ID (for temporary use)
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}