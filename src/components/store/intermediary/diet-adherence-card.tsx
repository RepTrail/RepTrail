'use client'

import React, { useState } from 'react'
import { Box } from '@/components/store/base/box'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { Grid } from '@/components/store/base/grid'
import { Badge } from '@/components/store/base/badge'
import { Button } from '@/components/store/base/button'
import { Surface, GlassPanel } from '@/components/store/base/surface'
import { CheckIndicator } from '@/components/store/base/check-indicator'
import { ChevronDown, ChevronUp, CheckCircle2, RefreshCcw, Check, Utensils, Zap, FlaskConical } from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { EmptyState } from './empty-state'

// High-fidelity progress bar matching Image 1
function ProgressLocal({ value }: { value: number }) {
    return (
        <GlassPanel
            padding={0}
            fullWidth
            height={8}
            variant="glass"
            rounded={STORE_TOKENS.RADIUS.FULL}
            overflow="hidden"
            border="none"
        >
            <Box
                height="full"
                transition
                bg={STORE_TOKENS.COLORS.SUCCESS}
                style={{ width: `${value}%` }}
            />
        </GlassPanel>
    )
}

interface DietAdherenceCardProps {
    completedItems: number
    totalItems: number
    percentage: number
    macros: {
        calories: number
        protein: number
        carbs: number
        fat: number
        fiber: number
    }
    meals: any[]
    status?: 'active' | 'empty'
}

/**
 * DietAdherenceCard: Advanced Accordion functionality with interactive substitutions.
 * Refined typography for better legibility and system consistency.
 */
export function DietAdherenceCard({
    completedItems,
    totalItems,
    percentage,
    macros,
    meals,
    status = 'active'
}: DietAdherenceCardProps) {
    if (status === 'empty') {
        return (
            <EmptyState
                icon={Utensils}
                title="DIETA NÃO ENCONTRADA"
                description="NENHUM PROTOCOLO ALIMENTAR ATIVO NO MOMENTO."
            />
        )
    }

    return (
        <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
            {/* Adherence Header */}
            <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Stack direction="row" align="center" justify="between">
                    <Badge
                        label={`${completedItems}/${totalItems} ITENS CONCLUÍDOS`}
                        icon={CheckCircle2}
                        variant="glass"
                        color={STORE_TOKENS.COLORS.SUCCESS}
                        size="xs"
                    />
                    <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Font variant="h1" color={STORE_TOKENS.COLORS.SUCCESS}>
                            {Math.round(percentage)}
                        </Font>
                        <Font {...STORE_TOKENS.TYPOGRAPHY.LABEL} color={STORE_TOKENS.COLORS.TEXT.MUTED} scale={150}>
                            %
                        </Font>
                    </Stack>
                </Stack>
                <ProgressLocal value={percentage} />
            </Stack>

            {/* Macros Grid */}
            <GlassPanel padding={STORE_TOKENS.PADDING.ELEMENT} variant="glass" rounded={STORE_TOKENS.RADIUS.SYSTEM}>
                <Grid cols={6} gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <MacroBox label="CALORIAS" value={macros.calories} unit="KCAL" color={STORE_TOKENS.COLORS.TEXT.PRIMARY} colSpan={3} mdColSpan={2} />
                    <MacroBox label="PROTEÍNAS" value={macros.protein} unit="G" color={STORE_TOKENS.COLORS.SUCCESS} colSpan={3} mdColSpan={2} />
                    <MacroBox label="CARBOS" value={macros.carbs} unit="G" color={STORE_TOKENS.COLORS.WARNING} colSpan={3} mdColSpan={2} />
                    <MacroBox label="GORDURAS" value={macros.fat} unit="G" color={STORE_TOKENS.COLORS.ERROR} colSpan={3} mdColSpan={3} />
                    <MacroBox label="FIBRAS" value={macros.fiber} unit="G" color={STORE_TOKENS.COLORS.INFO} colSpan={6} mdColSpan={3} />
                </Grid>
            </GlassPanel>

            {/* Meals List with Accordion */}
            <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                {meals.map((meal, idx) => (
                    <MealAccordion key={idx} meal={meal} isChecked={idx === 0} />
                ))}
            </Stack>
        </Stack>
    )
}

function MealAccordion({ meal, isChecked }: { meal: any, isChecked?: boolean }) {
    const [isOpen, setIsOpen] = useState(false)

    // Initial mock data
    const itemsData = [
        { qty: '200g', name: 'Arroz', macros: 'P: 5 C: 55 G: 1 F: 0' },
        { qty: '150g', name: 'Feijão', macros: 'P: 10 C: 25 G: 1 F: 0' },
        {
            qty: '200g',
            name: 'Franco Grelhado',
            macros: 'P: 60 C: 0 G: 8 F: 0',
            hasSubstitution: true,
            sub: { qty: '100g', name: 'Patinho Moído', macros: 'P: 25 C: 0 G: 5 F: 0' }
        },
        { qty: 'À vontade', name: 'Salada (Tomate, Pepino)', macros: 'P: 1 C: 5 G: 0 F: 0' }
    ]

    return (
        <GlassPanel
            padding={0}
            rounded={STORE_TOKENS.RADIUS.SYSTEM}
            variant="glass"
            transition
            overflow="hidden"
        >
            {/* Header (Closed State) */}
            <Box
                padding={STORE_TOKENS.PADDING.ELEMENT}
                cursor="pointer"
                onClick={() => setIsOpen(!isOpen)}
                hoverBgOpacity={STORE_TOKENS.OPACITY.SUBTLE}
                transition
            >
                <Stack direction="row" align="center" justify="between">
                    <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <CheckIndicator checked={isChecked} />
                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Font {...STORE_TOKENS.TYPOGRAPHY.HEADING} variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>
                                {meal.name.toLowerCase()}
                            </Font>
                            <Stack direction={{ base: 'col', md: 'row' }} align={{ base: 'start', md: 'center' }} gap={{ base: 2.5, md: STORE_TOKENS.SPACING.ELEMENT }}>
                                <Font {...STORE_TOKENS.TYPOGRAPHY.LABEL} color={STORE_TOKENS.COLORS.TEXT.MUTED} tracking="wide">
                                    {meal.itemsCount} ITENS
                                </Font>
                                <Box width="px" height="px" bg={STORE_TOKENS.COLORS.BACKGROUND} opacity={STORE_TOKENS.OPACITY.INTERMEDIATE} display={{ base: 'none', md: 'block' }} />
                                <Stack direction="row" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                    <Font {...STORE_TOKENS.TYPOGRAPHY.LABEL} color={STORE_TOKENS.COLORS.SUCCESS} tracking="wide">P: 45G</Font>
                                    <Font {...STORE_TOKENS.TYPOGRAPHY.LABEL} color={STORE_TOKENS.COLORS.WARNING} tracking="wide">C: 60G</Font>
                                    <Font {...STORE_TOKENS.TYPOGRAPHY.LABEL} color={STORE_TOKENS.COLORS.ERROR} tracking="wide">G: 12G</Font>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Stack>
                    <Icon icon={isOpen ? ChevronUp : ChevronDown} size="sm" color={STORE_TOKENS.COLORS.TEXT.DIM} />
                </Stack>
            </Box>

            {/* Details (Open State) */}
            {isOpen && (
                <Box padding={STORE_TOKENS.PADDING.ELEMENT}>
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                        {itemsData.map((item, i) => (
                            <FoodItemRow
                                key={i}
                                item={item}
                                isChecked={isChecked && i < 2}
                            />
                        ))}

                        <Box padding={STORE_TOKENS.PADDING.ELEMENT}>
                            <Button variant="emerald" fullWidth>
                                <Stack direction="row" align="center" justify="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                    <Icon icon={Check} size="xs" color={STORE_TOKENS.COLORS.BLACK} />
                                    <Font {...STORE_TOKENS.TYPOGRAPHY.LABEL} color={STORE_TOKENS.COLORS.BLACK}>MARCAR TODOS</Font>
                                </Stack>
                            </Button>
                        </Box>
                    </Stack>
                </Box>
            )}
        </GlassPanel>
    )
}

function FoodItemRow({ item, isChecked }: { item: any, isChecked?: boolean }) {
    const [isSubstituted, setIsSubstituted] = useState(false)

    const displayItem = isSubstituted && item.sub ? item.sub : item

    return (
        <Surface
            padding={STORE_TOKENS.PADDING.ELEMENT}
            rounded={STORE_TOKENS.RADIUS.SYSTEM}
            variant={isSubstituted ? 'tonal-amber' : 'glass'}
            transition
            cursor="pointer"
        >
            <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.CONTAINER}>
                <CheckIndicator size="sm" checked={isChecked} />
                <Stack gap={0} flex1>
                    <Stack direction="row" align="baseline" gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Font variant="body-sm" weight="black" color={isSubstituted ? 'amber' : 'white'} italic nowrap>
                            {displayItem.qty}
                        </Font>
                        <Font
                            variant="body-sm"
                            color={isSubstituted ? 'amber' : 'zinc-400'}
                            weight="semibold"
                        >
                            {displayItem.name}
                        </Font>
                    </Stack>
                    <Font {...STORE_TOKENS.TYPOGRAPHY.LABEL} color={isSubstituted ? 'amber' : 'zinc-600'} opacity={80}>
                        {displayItem.macros}
                    </Font>
                </Stack>

                {item.hasSubstitution && (
                    <Box
                        padding={2.5}
                        rounded={STORE_TOKENS.RADIUS.SYSTEM}
                        bg={isSubstituted ? 'amber' : 'white'}
                        bgOpacity={isSubstituted ? 100 : 5}
                        transition
                        onClick={() => {
                            setIsSubstituted(!isSubstituted)
                        }}
                    >
                        <Icon icon={RefreshCcw} size="xs" color={isSubstituted ? 'black' : 'amber'} />
                    </Box>
                )}
            </Stack>
        </Surface>
    )
}

function MacroBox({ label, value, unit, color, className, colSpan, mdColSpan, lgColSpan }: any) {
    return (
        <GlassPanel
            padding={STORE_TOKENS.PADDING.CONTAINER}
            rounded={STORE_TOKENS.RADIUS.SYSTEM}
            variant="glass"
            display="flex"
            direction="col"
            align="center"
            justify="center"
            colSpan={colSpan}
            mdColSpan={mdColSpan}
            lgColSpan={lgColSpan}
        >
            <Font {...STORE_TOKENS.TYPOGRAPHY.LABEL} color={STORE_TOKENS.COLORS.TEXT.MUTED} opacity={STORE_TOKENS.OPACITY.OVERLAY}>
                {label}
            </Font>
            <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                <Font variant="h3" color={color}>
                    {Math.round(value)}
                </Font>
                <Font {...STORE_TOKENS.TYPOGRAPHY.LABEL} color={STORE_TOKENS.COLORS.TEXT.DIM}>{unit}</Font>
            </Stack>
        </GlassPanel>
    )
}
