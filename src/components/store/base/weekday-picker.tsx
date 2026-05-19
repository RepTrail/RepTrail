'use client'

import React, { useState } from 'react'
import { Stack } from './stack'
import { Grid } from './grid'
import { Font } from './font'
import { Box } from './box'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { cn } from '@/lib/utils'

interface WeekdayPickerProps {
    label?: string
    selectedDays: number[] // 0-6
    onChange: (days: number[]) => void
    multiple?: boolean
}

export function WeekdayPicker({ 
    label, 
    selectedDays, 
    onChange,
    multiple = true 
}: WeekdayPickerProps) {
    const days = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

    const toggleDay = (index: number) => {
        if (multiple) {
            if (selectedDays.includes(index)) {
                onChange(selectedDays.filter(d => d !== index))
            } else {
                onChange([...selectedDays, index])
            }
        } else {
            onChange([index])
        }
    }

    return (
        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
            {label && (
                <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Font variant="auxiliary" color={STORE_TOKENS.COLORS.TEXT.MUTED} weight="black" uppercase tracking="widest">
                        {label}
                    </Font>
                </Stack>
            )}
            
            <Box 
                padding={STORE_TOKENS.PADDING.ELEMENT} 
                rounded={STORE_TOKENS.RADIUS.SYSTEM} 
                bg="black" 
                bgOpacity={STORE_TOKENS.OPACITY.SUBTLE}
                border
                borderColor={STORE_TOKENS.COLORS.DIVIDER.SUBTLE}
            >
                <Grid cols={{ base: 4, md: 7 }} gap={STORE_TOKENS.SPACING.ELEMENT}>
                    {days.map((day, i) => {
                        const isSelected = selectedDays.includes(i)
                        return (
                            <Box
                                key={i}
                                height={40}
                                display="flex"
                                align="center"
                                justify="center"
                                rounded={STORE_TOKENS.RADIUS.SYSTEM}
                                cursor="pointer"
                                bg={isSelected ? 'primary' : 'transparent'}
                                transition
                                onClick={() => toggleDay(i)}
                                fullWidth
                            >
                                <Font 
                                    variant="tiny" 
                                    color={isSelected ? STORE_TOKENS.COLORS.BLACK : STORE_TOKENS.COLORS.TEXT.DIM} 
                                    weight="black"
                                >
                                    {day}
                                </Font>
                            </Box>
                        )
                    })}
                </Grid>
            </Box>
        </Stack>
    )
}
