import { useState, useCallback } from 'react';

export function usePdfSelectionState() {
    const [selectedCardioIndices, setSelectedCardioIndices] = useState<Set<number>>(new Set());
    const [selectedErgoIndices, setSelectedErgoIndices] = useState<Set<number>>(new Set());
    const [selectedDietDays, setSelectedDietDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
    const [selectedOptionIndex, setSelectedOptionIndex] = useState<number>(0);

    const toggleCardio = useCallback((idx: number) => {
        setSelectedCardioIndices(prev => {
            const next = new Set(prev);
            if (next.has(idx)) next.delete(idx);
            else next.add(idx);
            return next;
        });
    }, []);

    const toggleErgo = useCallback((idx: number) => {
        setSelectedErgoIndices(prev => {
            const next = new Set(prev);
            if (next.has(idx)) next.delete(idx);
            else next.add(idx);
            return next;
        });
    }, []);

    return {
        selectedCardioIndices, setSelectedCardioIndices, toggleCardio,
        selectedErgoIndices, setSelectedErgoIndices, toggleErgo,
        selectedDietDays, setSelectedDietDays,
        selectedOptionIndex, setSelectedOptionIndex
    };
}
