'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Box } from '@/components/store/base/box'
import { Input } from '@/components/store/base/input'
import { FormSelect } from '@/components/store/base/form-select'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface OperationalCostFormProps {
    description: string
    setDescription: (val: string) => void
    amount: string
    setAmount: (val: string) => void
    type: 'fixed' | 'variable'
    setType: (val: 'fixed' | 'variable') => void
}

/**
 * OperationalCostForm: Intermediary component for the cost input structure.
 * - Standardizes the form layout for adding and editing costs.
 * - Responsibility: Reusable form micro-pattern.
 */
export function OperationalCostForm({
    description,
    setDescription,
    amount,
    setAmount,
    type,
    setType
}: OperationalCostFormProps) {
    return (
        <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
            <Input
                label="Descrição"
                placeholder="Ex: Servidor, Domínio, Marketing..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <Stack direction="row" gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Box flex1>
                    <Input
                        label="Valor (R$)"
                        type="number"
                        placeholder="0,00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </Box>
                <Box flex1>
                    <FormSelect
                        label="Tipo de Custo"
                        options={[
                            { label: 'Fixo', value: 'fixed', description: 'Gastos recorrentes mensais' },
                            { label: 'Variável', value: 'variable', description: 'Gastos esporádicos' }
                        ]}
                        value={type}
                        onChange={(val: string) => setType(val as 'fixed' | 'variable')}
                    />
                </Box>
            </Stack>
        </Stack>
    )
}
