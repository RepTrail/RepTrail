'use client'

import React, { useState } from 'react'
import { Surface } from '@/components/store/base/surface'
import { Stack } from '@/components/store/base/stack'
import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { Input } from '@/components/store/base/input'
import { Grid } from '@/components/store/base/grid'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface SummarySetRowProps {
    set: any
    lastSessionSet?: any
    initialWeight: string
    initialReps: string
    onUpdate: (w: string, r: string) => void
    primaryColor?: string
}

export function SummarySetRow({ 
    set, 
    lastSessionSet, 
    initialWeight, 
    initialReps, 
    onUpdate,
    primaryColor = 'orange'
}: SummarySetRowProps) {
    const [weight, setWeight] = useState(initialWeight)
    const [reps, setReps] = useState(initialReps)

    const handleChange = (type: 'weight' | 'reps', val: string) => {
        if (val.includes('-')) return
        const parsed = parseFloat(val)
        if (!isNaN(parsed) && parsed < 0) return

        if (type === 'weight') {
            setWeight(val)
            onUpdate(val, reps)
        } else {
            setReps(val)
            onUpdate(weight, val)
        }
    }

    const badgeColor = ({ WARMUP: 'orange', FEEDER: 'blue', WORKING: 'emerald' } as any)[set.type] || 'zinc'
    const labelText = set.type === 'WORKING' ? `Série ${set.setNumber}` : set.label

    return (
        <Surface 
            variant="tonal-zinc" 
            padding={STORE_TOKENS.PADDING.ELEMENT} 
            rounded={STORE_TOKENS.RADIUS.SYSTEM} 
            border="standard"
        >
            <Stack 
                direction={{ base: 'col', md: 'row' }} 
                align={{ base: 'stretch', md: 'center' }} 
                justify="between"
                gap={STORE_TOKENS.SPACING.CONTAINER}
                fullWidth
            >
                {/* Left side: Badge & Label */}
                <Stack 
                    direction="row" 
                    align="center" 
                    justify="start" 
                    gap={STORE_TOKENS.SPACING.ELEMENT} 
                    shrink={0} 
                    width={{ base: 'full', md: 200 }}
                >
                    <Box 
                        width={6} 
                        height={6} 
                        rounded={STORE_TOKENS.RADIUS.FULL} 
                        bg={badgeColor}
                        bgOpacity={20}
                        border
                        borderColor={badgeColor}
                        borderOpacity={30}
                        shrink={0}
                        style={{ borderWidth: '2px', flexShrink: 0, width: '6px', height: '6px' }}
                    />
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT} align="stretch" justify="start">
                        <Font variant="body" weight="black" uppercase italic tracking="tight">
                            {labelText}
                        </Font>
                        {lastSessionSet && (
                            <Font
                                variant="sub-tiny"
                                weight="bold"
                                uppercase
                                tracking="wider"
                                {...{
                                    color: STORE_TOKENS.COLORS.TEXT.MUTED,
                                }}>
                                Anterior: {lastSessionSet.weight}kg x {lastSessionSet.reps}
                            </Font>
                        )}
                    </Stack>
                </Stack>

                {/* Right side: Input Grid */}
                <Box flex1>
                    <Grid columns={2} gap={STORE_TOKENS.SPACING.CONTAINER} align="stretch" fullWidth>
                        <Input
                            label="Carga (kg)"
                            type="number"
                            placeholder="0"
                            value={weight}
                            onChange={e => handleChange('weight', (e.target as HTMLInputElement).value)}
                            textAlign="center"
                            weight="bold"
                            fontMono
                            min={0}
                        />
                        <Input
                            label="Reps"
                            type="number"
                            placeholder={set.expectedReps}
                            value={reps}
                            onChange={e => handleChange('reps', (e.target as HTMLInputElement).value)}
                            textAlign="center"
                            weight="bold"
                            fontMono
                            min={0}
                        />
                    </Grid>
                </Box>
            </Stack>
        </Surface>
    );
}
