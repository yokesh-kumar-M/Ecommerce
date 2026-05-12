import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: string | number): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(num);
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateString));
}

export const MEMBERSHIP_LABELS = { B: 'Bronze', S: 'Silver', G: 'Gold' } as const;
export const PAYMENT_STATUS_LABELS = { P: 'Pending', C: 'Completed', F: 'Failed' } as const;
export const PAYMENT_STATUS_COLORS = {
  P: 'text-yellow-600 bg-yellow-50',
  C: 'text-green-600 bg-green-50',
  F: 'text-red-600 bg-red-50',
} as const;
