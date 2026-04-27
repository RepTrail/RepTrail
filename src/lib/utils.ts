import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeDays(days: any): number[] {
    if (!days) return [0, 1, 2, 3, 4, 5, 6];
    const daysArray = Array.isArray(days) ? days : [days];
    
    const dayMap: Record<string, number> = {
        'dom': 0, 'domingo': 0, 'sun': 0, 'sunday': 0,
        'seg': 1, 'segunda': 1, 'mon': 1, 'monday': 1,
        'ter': 2, 'terça': 2, 'tue': 2, 'tuesday': 2,
        'qua': 3, 'quarta': 3, 'wed': 3, 'wednesday': 3,
        'qui': 4, 'quinta': 4, 'thu': 4, 'thursday': 4,
        'sex': 5, 'sexta': 5, 'fri': 5, 'friday': 5,
        'sab': 6, 'sábado': 6, 'sabado': 6, 'sat': 6, 'saturday': 6
    };

    const normalized = daysArray.map(d => {
        if (typeof d === 'number') {
            if (d === 7) return 0;
            if (d >= 0 && d <= 6) return d;
            return null;
        }
        if (typeof d === 'string') {
            const clean = d.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            if (dayMap[clean] !== undefined) return dayMap[clean];
            const num = parseInt(clean);
            if (!isNaN(num)) {
                if (num === 7) return 0;
                if (num >= 0 && num <= 6) return num;
            }
        }
        return null;
    }).filter(d => d !== null) as number[];

    return Array.from(new Set(normalized)).sort((a, b) => a - b);
}
