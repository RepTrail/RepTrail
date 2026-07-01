'use client'

import React, { useState } from 'react'
import { Stack } from '@/components/store/base/stack'
import { Icon } from '@/components/store/base/icon'
import { Input } from '@/components/store/base/input'
import { Button } from '@/components/store/base/button'
import { GlassPanel } from '@/components/store/base/surface'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { Plus } from 'lucide-react'

interface DietBuilderNewMealProps {
    onAdd: (name: string) => void
}

export function DietBuilderNewMeal({ onAdd }: DietBuilderNewMealProps) {
    const [newMealName, setNewMealName] = useState('')

    const handleAdd = () => {
        if (!newMealName.trim()) return
        onAdd(newMealName.trim())
        setNewMealName('')
    }

    return (
        <GlassPanel padding={STORE_TOKENS.SPACING.CONTAINER} border="dashed">
            <Stack
                direction={{ base: 'col', md: 'row' }}
                gap={STORE_TOKENS.SPACING.ELEMENT}
                align={{ base: 'stretch', md: 'center' }}
                fullWidth
            >
                <Input
                    placeholder="Ex: Café da Manhã, Almoço, Pré-Treino..."
                    value={newMealName}
                    onChange={(e) => setNewMealName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleAdd() }}
                    flex1
                />
                <Button
                    variant="outline-primary"
                    onClick={handleAdd}
                    disabled={!newMealName.trim()}
                    fullWidth={{ base: true, md: false }}
                    text="Adicionar Refeição"
                    iconLeft={Plus} />
            </Stack>
        </GlassPanel>
    );
}
