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
import { ChevronDown, ChevronUp, CheckCircle2, RefreshCcw, Check, Utensils } from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { EmptyState } from '../intermediary/empty-state'
import { motion, AnimatePresence } from 'framer-motion'

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
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="bg-emerald-500"
                style={{ 
                    height: '100%'
                }}
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
    onToggleMeal?: (mealId: string, currentStatus: boolean) => void
    onToggleItem?: (itemId: string, currentStatus: boolean) => void
}

export function DietAdherenceCard({
    completedItems,
    totalItems,
    percentage,
    macros,
    meals,
    status = 'active',
    onToggleMeal,
    onToggleItem
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
                        label={`${completedItems}/${totalItems} ALIMENTOS CONSUMIDOS`}
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
                {meals.map((meal) => (
                    <MealAccordion 
                        key={meal.id} 
                        meal={meal} 
                        onToggleMeal={() => onToggleMeal?.(meal.id, meal.is_checked)}
                        onToggleItem={onToggleItem}
                    />
                ))}
            </Stack>
        </Stack>
    )
}

function MealAccordion({ meal, onToggleMeal, onToggleItem }: { meal: any, onToggleMeal: () => void, onToggleItem?: (id: string, s: boolean) => void }) {
    const [isOpen, setIsOpen] = useState(false)

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
                hoverBgOpacity={STORE_TOKENS.OPACITY.SUBTLE}
                transition
            >
                <Stack direction="row" align="center" justify="between">
                    <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.CONTAINER} flex1 onClick={() => setIsOpen(!isOpen)} cursor="pointer">
                        <Box onClick={(e) => {
                            e.stopPropagation();
                            onToggleMeal();
                        }}>
                            <CheckIndicator checked={meal.is_checked} />
                        </Box>
                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Font {...STORE_TOKENS.TYPOGRAPHY.HEADING} variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>
                                {meal.name.toLowerCase()}
                            </Font>
                            <Stack direction={{ base: 'col', md: 'row' }} align={{ base: 'start', md: 'center' }} gap={{ base: 2.5, md: STORE_TOKENS.SPACING.ELEMENT }}>
                                <Font {...STORE_TOKENS.TYPOGRAPHY.LABEL} color={STORE_TOKENS.COLORS.TEXT.MUTED} tracking="wide">
                                    {meal.meal_items?.length || 0} ITENS
                                </Font>
                                <Box width="px" height="px" bg={STORE_TOKENS.COLORS.BACKGROUND} opacity={STORE_TOKENS.OPACITY.INTERMEDIATE} display={{ base: 'none', md: 'block' }} />
                                <Stack direction="row" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                    <Font {...STORE_TOKENS.TYPOGRAPHY.LABEL} color={STORE_TOKENS.COLORS.SUCCESS} tracking="wide">
                                        P: {Math.round(meal.meal_items?.reduce((acc: number, i: any) => acc + (i.protein || 0), 0) || 0)}G
                                    </Font>
                                    <Font {...STORE_TOKENS.TYPOGRAPHY.LABEL} color={STORE_TOKENS.COLORS.WARNING} tracking="wide">
                                        C: {Math.round(meal.meal_items?.reduce((acc: number, i: any) => acc + (i.carbs || 0), 0) || 0)}G
                                    </Font>
                                    <Font {...STORE_TOKENS.TYPOGRAPHY.LABEL} color={STORE_TOKENS.COLORS.ERROR} tracking="wide">
                                        G: {Math.round(meal.meal_items?.reduce((acc: number, i: any) => acc + (i.fat || 0), 0) || 0)}G
                                    </Font>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Stack>
                    <Box onClick={() => setIsOpen(!isOpen)} cursor="pointer">
                        <Icon icon={isOpen ? ChevronUp : ChevronDown} size="sm" color={STORE_TOKENS.COLORS.TEXT.DIM} />
                    </Box>
                </Stack>
            </Box>

            {/* Details (Open State) */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <Box padding={STORE_TOKENS.PADDING.ELEMENT}>
                            <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                {(meal.meal_items || []).map((item: any) => (
                                    <FoodItemRow
                                        key={item.id}
                                        item={item}
                                        isChecked={item.is_checked}
                                        onToggle={() => onToggleItem?.(item.id, item.is_checked)}
                                    />
                                ))}

                                <Box padding={STORE_TOKENS.PADDING.ELEMENT}>
                                    <Button variant="emerald" fullWidth onClick={onToggleMeal}>
                                        <Stack direction="row" align="center" justify="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                            <Icon icon={Check} size="xs" color={STORE_TOKENS.COLORS.BLACK} />
                                            <Font {...STORE_TOKENS.TYPOGRAPHY.LABEL} color={STORE_TOKENS.COLORS.BLACK}>
                                                {meal.is_checked ? 'DESMARCAR REFEIÇÃO' : 'CONCLUIR REFEIÇÃO'}
                                            </Font>
                                        </Stack>
                                    </Button>
                                </Box>
                            </Stack>
                        </Box>
                    </motion.div>
                )}
            </AnimatePresence>
        </GlassPanel>
    )
}

function FoodItemRow({ item, isChecked, onToggle }: { item: any, isChecked?: boolean, onToggle: () => void }) {
    return (
        <Surface
            padding={STORE_TOKENS.PADDING.ELEMENT}
            rounded={STORE_TOKENS.RADIUS.SYSTEM}
            variant={item.is_substituted ? 'tonal-amber' : 'glass'}
            transition
            cursor="pointer"
            onClick={onToggle}
        >
            <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                <CheckIndicator size="md" checked={isChecked} />
                <Stack gap={0} flex1>
                    <Stack direction="row" align="baseline" gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Font variant="body-sm" weight="black" color={item.is_substituted ? 'amber' : 'white'} italic nowrap>
                            {item.is_substituted ? item.substituted_quantity : item.quantity}
                        </Font>
                        <Font
                            variant="body-sm"
                            color={item.is_substituted ? 'amber' : 'zinc-400'}
                            weight="semibold"
                        >
                            {item.is_substituted ? item.substituted_food_name : (item.food_name || item.name)}
                        </Font>
                    </Stack>
                    <Font {...STORE_TOKENS.TYPOGRAPHY.LABEL} color={item.is_substituted ? 'amber' : 'zinc-600'} opacity={80}>
                        P: {item.is_substituted ? item.substituted_protein : item.protein}G • 
                        C: {item.is_substituted ? item.substituted_carbs : item.carbs}G • 
                        G: {item.is_substituted ? item.substituted_fat : item.fat}G
                    </Font>
                </Stack>

                {item.is_substituted && (
                    <Box
                        padding={2.5}
                        rounded={STORE_TOKENS.RADIUS.SYSTEM}
                        bg="amber"
                        bgOpacity={100}
                    >
                        <Icon icon={RefreshCcw} size="xs" color="black" />
                    </Box>
                )}
            </Stack>
        </Surface>
    )
}

function MacroBox({ label, value, unit, color, colSpan, mdColSpan, lgColSpan }: any) {
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
