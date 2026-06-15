'use client'

import { useCallback } from 'react'

/**
 * useMasks: System-wide input masking logic.
 * Extracted from UI components to fulfill Store Architecture Purity.
 */
export function useMasks() {
    const maskCpfCnpj = useCallback((v: string) => {
        const c = v.replace(/\D/g, '')
        if (c.length <= 11) {
            return c.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})/, '$1-$2').substring(0, 14);
        }
        return c.replace(/(\d{2})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1/$2').replace(/(\d{4})(\d{1,2})/, '$1-$2').substring(0, 18);
    }, [])

    const maskCardNumber = useCallback((v: string) => 
        v.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim().substring(0, 19)
    , [])

    const maskExpiry = useCallback((v: string) => 
        v.replace(/\D/g, '').replace(/(\d{2})/, '$1/').substring(0, 5)
    , [])

    const maskCep = useCallback((v: string) => 
        v.replace(/\D/g, '').replace(/(\d{5})/, '$1-').substring(0, 9)
    , [])

    const validateCpfCnpj = useCallback((val: string) => {
        const clean = val.replace(/\D/g, '')
        return clean.length === 11 || clean.length === 14 
    }, [])

    return {
        maskCpfCnpj,
        maskCardNumber,
        maskExpiry,
        maskCep,
        validateCpfCnpj
    }
}
