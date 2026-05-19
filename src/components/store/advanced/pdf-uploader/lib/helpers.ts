import { normalizeDays } from '@/lib/utils';

export function prepareCardios(cardios: any[], isStudent: boolean) {
    const initialCardios = new Set<number>();
    const anyHasDays = cardios.some((c: any) => {
        const d = c.application_days || c.days_of_week || c.day_of_week;
        return d && (Array.isArray(d) ? d.length > 0 : true);
    });

    const updatedCardios = cardios.map((c: any, i: number) => {
        const rawDays = c.application_days || c.days_of_week || c.day_of_week;
        const hasDays = rawDays && (Array.isArray(rawDays) ? rawDays.length > 0 : true);

        if (anyHasDays) {
            if (hasDays) {
                initialCardios.add(i);
                return { ...c, application_days: normalizeDays(rawDays) };
            }
            return c;
        } else {
            if (isStudent && i === 0) {
                initialCardios.add(i);
                return { ...c, application_days: [0, 1, 2, 3, 4, 5, 6] };
            }
            return { ...c, application_days: normalizeDays(rawDays || []) };
        }
    });

    return { updatedCardios, initialCardios };
}

export function prepareErgogenics(ergogenics: any[]) {
    const updatedErgos = ergogenics.map((ergo: any) => ({
        ...ergo,
        application_days: normalizeDays(ergo.application_days)
    }));
    const initialErgos = new Set<number>(updatedErgos.map((_: any, i: number) => i));
    return { updatedErgos, initialErgos };
}
