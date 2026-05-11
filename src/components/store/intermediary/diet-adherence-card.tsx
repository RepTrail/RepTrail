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
import { ChevronDown, ChevronUp, CheckCircle2, RefreshCcw, Check } from 'lucide-react'

// High-fidelity progress bar matching Image 1
function ProgressLocal({ value }: { value: number }) {
    return (
        <GlassPanel
            padding={0}
            fullWidth
            height="anatomy-line"
            variant="glass"
            rounded="full"
            overflow="hidden"
            border="none"
        >
            <Box
                height="full"
                transition
                bg="emerald"
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
    meals
}: DietAdherenceCardProps) {
    return (
        <Stack gap={5}>
            {/* Adherence Header */}
            <Stack gap={5}>
                <Stack direction="row" align="center" justify="between">
                    <Badge
                        label={`${completedItems}/${totalItems} ITENS CONCLUÍDOS`}
                        icon={CheckCircle2}
                        variant="glass"
                        color="emerald"
                        size="xs"
                    />
                    <Stack direction="row" align="center" gap={1}>
                        <Font variant="h1" color="emerald">
                            {Math.round(percentage)}
                        </Font>
                        <Font variant="sub-tiny" color="zinc-500" weight="black" uppercase italic scale={150}>
                            %
                        </Font>
                    </Stack>
                </Stack>
                <ProgressLocal value={percentage} />
            </Stack>

            {/* Macros Grid */}
            <GlassPanel padding={2.5} variant="glass" rounded="system">
                <Grid cols={6} gap={2.5}>
                    <MacroBox label="CALORIAS" value={macros.calories} unit="KCAL" color="white" className="col-span-3 md:col-span-2" />
                    <MacroBox label="PROTEÍNAS" value={macros.protein} unit="G" color="emerald" className="col-span-3 md:col-span-2" />
                    <MacroBox label="CARBOS" value={macros.carbs} unit="G" color="amber" className="col-span-3 md:col-span-2" />
                    <MacroBox label="GORDURAS" value={macros.fat} unit="G" color="red" className="col-span-3 md:col-span-3" />
                    <MacroBox label="FIBRAS" value={macros.fiber} unit="G" color="blue" className="col-span-3 md:col-span-3" />
                </Grid>
            </GlassPanel>

            {/* Meals List with Accordion */}
            <Stack gap={2.5}>
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
            rounded="system"
            variant="glass"
            transition
            overflow="hidden"
        >
            {/* Header (Closed State) */}
            <Box
                padding={5}
                cursor="pointer"
                onClick={() => setIsOpen(!isOpen)}
                hoverBgOpacity={10}
                transition
            >
                <Stack direction="row" align="center" justify="between">
                    <Stack direction="row" align="center" gap={5}>
                        <CheckIndicator checked={isChecked} />
                        <Stack gap={1}>
                            <Font variant="body" color="white" weight="black" uppercase italic tracking="widest">
                                {meal.name.toLowerCase()}
                            </Font>
                            <Stack direction="row" align="center" gap={2.5}>
                                <Font variant="sub-tiny" color="zinc-500" weight="black" uppercase>
                                    {meal.itemsCount} ITENS
                                </Font>
                                <Box width="px" height="px" bg="zinc" opacity={30} />
                                <Stack direction="row" gap={2.5}>
                                    <Font variant="tiny" color="emerald" weight="black">P: 45G</Font>
                                    <Font variant="tiny" color="amber" weight="black">C: 60G</Font>
                                    <Font variant="tiny" color="red" weight="black">G: 12G</Font>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Stack>
                    <Icon icon={isOpen ? ChevronUp : ChevronDown} size="sm" color="zinc-600" />
                </Stack>
            </Box>

            {/* Details (Open State) */}
            {isOpen && (
                <Box padding={5} paddingTop={0}>
                    <Stack gap={2.5}>
                        {itemsData.map((item, i) => (
                            <FoodItemRow
                                key={i}
                                item={item}
                                isChecked={isChecked && i < 2}
                            />
                        ))}

                        <Box paddingTop={2.5}>
                            <Button variant="emerald" fullWidth>
                                <Stack direction="row" align="center" justify="center" gap={2.5}>
                                    <Icon icon={Check} size="xs" color="black" />
                                    <Font variant="sub-tiny" weight="black" uppercase color="black">MARCAR TODOS</Font>
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
            padding={2.5}
            rounded="system"
            variant={isSubstituted ? 'tonal-amber' : 'glass'}
            transition
            cursor="pointer"
        >
            <Stack direction="row" align="center" gap={5}>
                <CheckIndicator size="sm" checked={isChecked} />
                <Stack gap={0} flex1>
                    <Stack direction="row" align="baseline" gap={2.5}>
                        <Font variant="body-sm" color="white" weight="black" uppercase italic>{displayItem.qty}</Font>
                        {/* Refined Food Name: No uppercase, no tracking widest */}
                        <Font
                            variant="body-sm"
                            color={isSubstituted ? 'amber' : 'zinc-400'}
                            weight="semibold"
                        >
                            {displayItem.name}
                        </Font>
                    </Stack>
                    <Font variant="sub-tiny" color={isSubstituted ? 'amber' : 'zinc-600'} weight="black" tracking="widest" opacity={80}>
                        {displayItem.macros}
                    </Font>
                </Stack>

                {item.hasSubstitution && (
                    <Box
                        padding={1}
                        rounded="system"
                        bg="amber"
                        bgOpacity={isSubstituted ? 100 : 10}
                        style={{ border: '1px solid amber' }}
                        cursor="pointer"
                        hoverScale={105}
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

function MacroBox({ label, value, unit, color, className }: any) {
    return (
        <GlassPanel
            padding={5}
            rounded="system"
            variant="glass"
            display="flex"
            direction="col"
            align="center"
            justify="center"
            className={className}
        >
            <Font variant="sub-tiny" color="zinc-500" weight="black" uppercase opacity={60}>
                {label}
            </Font>
            <Stack direction="row" align="center" gap={1}>
                <Font variant="h3" color={color}>
                    {Math.round(value)}
                </Font>
                <Font variant="sub-tiny" color="zinc-600" weight="black" uppercase>{unit}</Font>
            </Stack>
        </GlassPanel>
    )
}
