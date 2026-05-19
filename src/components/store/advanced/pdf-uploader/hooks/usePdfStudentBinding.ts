import { useState, useCallback } from 'react';
import { BindingMode, StudentMatch } from '../lib/types';

export function usePdfStudentBinding(initialStudentId?: string) {
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(initialStudentId || null);
    const [detectedStudentName, setDetectedStudentName] = useState<string | null>(null);
    const [studentMatch, setStudentMatch] = useState<StudentMatch | null>(null);
    const [bindingMode, setBindingMode] = useState<BindingMode>('skip');
    const [placeholderName, setPlaceholderName] = useState('');
    const [placeholderEmail, setPlaceholderEmail] = useState('');
    const [placeholderWhatsapp, setPlaceholderWhatsapp] = useState('');

    const resetBinding = useCallback(() => {
        setSelectedStudentId(null);
        setBindingMode('skip');
    }, []);

    return {
        selectedStudentId, setSelectedStudentId,
        detectedStudentName, setDetectedStudentName,
        studentMatch, setStudentMatch,
        bindingMode, setBindingMode,
        placeholderName, setPlaceholderName,
        placeholderEmail, setPlaceholderEmail,
        placeholderWhatsapp, setPlaceholderWhatsapp,
        resetBinding
    };
}
