import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeDays(days: any): number[] {
    if (!days) return [0, 1, 2, 3, 4, 5, 6];
    const daysArray = Array.isArray(days) ? days : [days];
    const normalized = daysArray.map(d => {
        const val = parseInt(String(d));
        if (val === 7) return 0;
        if (val >= 0 && val <= 6) return val;
        return null;
    }).filter(d => d !== null) as number[];

    return Array.from(new Set(normalized)).sort((a, b) => a - b);
}
