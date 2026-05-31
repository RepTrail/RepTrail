'use client'

import React from 'react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { useQuery } from '@/lib/dal'
import { getDietDetails } from '@/lib/dal/remote'
import { Modal } from '@/components/store/advanced/modal'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Box } from '@/components/store/base/box'
import { Icon } from '@/components/store/base/icon'
import { Badge } from '@/components/store/base/badge'
import { Separator } from '@/components/store/base/separator'
import { GlassPanel } from '@/components/store/base/surface'
import { Grid } from '@/components/store/base/grid'
import { Utensils, Clock, Loader2 } from 'lucide-react'

interface DietPreviewDialogProps {
    dietId: string
    dietName: string
    isOpen: boolean
    onClose: () => void
}

export function DietPreviewDialog({ dietId, dietName, isOpen, onClose }: DietPreviewDialogProps) {
    const { data: diet, isLoading } = useQuery({
        queryKey: ['diet-preview-details', dietId],
        queryFn: () => getDietDetails(dietId),
        enabled: isOpen && !!dietId,
        staleTime: 1000 * 60 * 5
    })

    // Sum total macros for the entire diet
    const totalMacros = React.useMemo(() => {
        if (!diet?.meals) return { protein: 0, carbs: 0, fat: 0, calories: 0 }
        let p = 0, c = 0, f = 0, kcal = 0
        diet.meals.forEach((m: any) => {
            ;(m.meal_items || []).forEach((item: any) => {
                p += Number(item.protein || 0)
                c += Number(item.carbs || 0)
                f += Number(item.fat || 0)
                kcal += Number(item.calories || 0)
            })
        })
        return { protein: Math.round(p), carbs: Math.round(c), fat: Math.round(f), calories: Math.round(kcal) }
    }, [diet])

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={dietName}
            subtitle={`${diet?.meals?.length || 0} REFEIÇÕES`}
            icon={Utensils}
            variant="orange"
            hideCancel={true}
            confirmLabel="FECHAR"
            onConfirm={onClose}
        >
            {isLoading ? (
                <Box padding={STORE_TOKENS.SPACING.CONTAINER}>
                    <Stack align="center" justify="center" gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <Icon icon={Loader2} size="xl" color={STORE_TOKENS.COLORS.SUCCESS} spin />
                        <Font
                            variant="label-caps"
                            align="center"
                            {...{
                                color: "SECONDARY",
                            }}>
                            CARREGANDO DETALHES DA DIETA...
                        </Font>
                    </Stack>
                </Box>
            ) : !diet?.meals || diet.meals.length === 0 ? (
                <Box padding={STORE_TOKENS.SPACING.CONTAINER}>
                    <Stack align="center" justify="center" gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <Icon icon={Utensils} size="xl" color={STORE_TOKENS.COLORS.TEXT.MUTED} />
                        <Font
                            variant="h3"
                            align="center"
                            {...{
                                color: "PRIMARY",
                            }}>
                            NENHUMA REFEIÇÃO CADASTRADA
                        </Font>
                    </Stack>
                </Box>
            ) : (
                <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                    {/* Top total macros summary */}
                    <Box padding={STORE_TOKENS.SPACING.ELEMENT} rounded={STORE_TOKENS.RADIUS.SYSTEM} border borderColor={STORE_TOKENS.COLORS.DIVIDER.STANDARD} bg={STORE_TOKENS.COLORS.BACKGROUND} bgOpacity={STORE_TOKENS.OPACITY.SURFACE}>
                        <Stack direction="row" gap={STORE_TOKENS.SPACING.ELEMENT} wrap="wrap">
                            <Badge 
                                label={`${totalMacros.calories} KCAL`} 
                                variant="glass" 
                                color={STORE_TOKENS.COLORS.BRAND} 
                                size="xs" 
                            />
                            <Badge 
                                label={`${totalMacros.protein}G PROT`} 
                                variant="glass" 
                                color={STORE_TOKENS.COLORS.INFO} 
                                size="xs" 
                            />
                            <Badge 
                                label={`${totalMacros.carbs}G CARB`} 
                                variant="glass" 
                                color={STORE_TOKENS.COLORS.WARNING} 
                                size="xs" 
                            />
                            <Badge 
                                label={`${totalMacros.fat}G GORD`} 
                                variant="glass" 
                                color={STORE_TOKENS.COLORS.BRAND} 
                                size="xs" 
                            />
                        </Stack>
                    </Box>

                    {diet.meals.map((meal: any, mIdx: number) => {
                        // Sum meal-level macros
                        let mealP = 0, mealC = 0, mealF = 0, mealKcal = 0
                        ;(meal.meal_items || []).forEach((i: any) => {
                            mealP += Number(i.protein || 0)
                            mealC += Number(i.carbs || 0)
                            mealF += Number(i.fat || 0)
                            mealKcal += Number(i.calories || 0)
                        })

                        return (
                            <GlassPanel
                                key={meal.id}
                                padding={STORE_TOKENS.SPACING.CONTAINER}
                                rounded={STORE_TOKENS.RADIUS.SYSTEM}
                                variant="glass"
                            >
                                <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                                    {/* Meal Header */}
                                    <Stack direction="row" align="center" justify="between">
                                        <Font
                                            variant="label-caps"
                                            {...{
                                                color: "primary",
                                            }}>
                                            {mIdx + 1}. {meal.name}
                                        </Font>
                                        {meal.time_of_day && (
                                            <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                                <Icon icon={Clock} size="sm" color={STORE_TOKENS.COLORS.TEXT.MUTED} />
                                                <Font
                                                    variant="sub-tiny"
                                                    mono
                                                    {...{
                                                        color: "SECONDARY",
                                                    }}>
                                                    {meal.time_of_day}
                                                </Font>
                                            </Stack>
                                        )}
                                    </Stack>

                                    {/* Meal Items Table */}
                                    {meal.meal_items && meal.meal_items.length > 0 ? (
                                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                            {/* Header Row */}
                                            <Grid cols={12} gap={STORE_TOKENS.SPACING.ELEMENT}>
                                                <Box colSpan={4}>
                                                    <Font
                                                        variant="sub-tiny"
                                                        weight="black"
                                                        uppercase
                                                        italic
                                                        tracking="widest"
                                                        {...{
                                                            color: "MUTED",
                                                        }}>
                                                        ALIMENTO
                                                    </Font>
                                                </Box>
                                                <Box colSpan={2} textAlign="center">
                                                    <Font
                                                        variant="sub-tiny"
                                                        weight="black"
                                                        uppercase
                                                        italic
                                                        tracking="widest"
                                                        {...{
                                                            color: "MUTED",
                                                        }}>
                                                        PROT
                                                    </Font>
                                                </Box>
                                                <Box colSpan={2} textAlign="center">
                                                    <Font
                                                        variant="sub-tiny"
                                                        weight="black"
                                                        uppercase
                                                        italic
                                                        tracking="widest"
                                                        {...{
                                                            color: "MUTED",
                                                        }}>
                                                        CARB
                                                    </Font>
                                                </Box>
                                                <Box colSpan={2} textAlign="center">
                                                    <Font
                                                        variant="sub-tiny"
                                                        weight="black"
                                                        uppercase
                                                        italic
                                                        tracking="widest"
                                                        {...{
                                                            color: "MUTED",
                                                        }}>
                                                        GORD
                                                    </Font>
                                                </Box>
                                                <Box colSpan={2} textAlign="right">
                                                    <Font
                                                        variant="sub-tiny"
                                                        weight="black"
                                                        uppercase
                                                        italic
                                                        tracking="widest"
                                                        {...{
                                                            color: "MUTED",
                                                        }}>
                                                        KCAL
                                                    </Font>
                                                </Box>
                                            </Grid>

                                            <Separator opacity={STORE_TOKENS.OPACITY.SUBTLE} />

                                            {/* Meal Item Rows */}
                                            {meal.meal_items.map((item: any) => (
                                                <React.Fragment key={item.id}>
                                                    <Grid cols={12} gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                                                        <Box colSpan={4}>
                                                            <Stack gap={STORE_TOKENS.SPACING.NONE}>
                                                                <Font
                                                                    variant="auxiliary"
                                                                    truncate
                                                                    {...{
                                                                        color: "PRIMARY",
                                                                    }}>
                                                                    {item.food_name || item.name}
                                                                </Font>
                                                                <Font
                                                                    variant="sub-tiny"
                                                                    {...{
                                                                        color: "SECONDARY",
                                                                    }}>
                                                                    {item.quantity || '1 porção'}
                                                                </Font>
                                                            </Stack>
                                                        </Box>
                                                        <Box colSpan={2} textAlign="center">
                                                            <Font
                                                                variant="sub-tiny"
                                                                mono
                                                                {...{
                                                                    color: "SECONDARY",
                                                                }}>
                                                                {Math.round(item.protein || 0)}g
                                                            </Font>
                                                        </Box>
                                                        <Box colSpan={2} textAlign="center">
                                                            <Font
                                                                variant="sub-tiny"
                                                                mono
                                                                {...{
                                                                    color: "SECONDARY",
                                                                }}>
                                                                {Math.round(item.carbs || 0)}g
                                                            </Font>
                                                        </Box>
                                                        <Box colSpan={2} textAlign="center">
                                                            <Font
                                                                variant="sub-tiny"
                                                                mono
                                                                {...{
                                                                    color: "SECONDARY",
                                                                }}>
                                                                {Math.round(item.fat || 0)}g
                                                            </Font>
                                                        </Box>
                                                        <Box colSpan={2} textAlign="right">
                                                            <Font
                                                                variant="sub-tiny"
                                                                weight="bold"
                                                                mono
                                                                {...{
                                                                    color: "success",
                                                                }}>
                                                                {Math.round(item.calories || 0)}
                                                            </Font>
                                                        </Box>
                                                    </Grid>
                                                    <Separator opacity={STORE_TOKENS.OPACITY.LOW} />
                                                </React.Fragment>
                                            ))}

                                            {/* Meal Subtotal Macros Row */}
                                            <Grid cols={12} gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                                                <Box colSpan={4}>
                                                    <Font
                                                        variant="sub-tiny"
                                                        uppercase
                                                        {...{
                                                            color: "SECONDARY",
                                                        }}>
                                                        TOTAL
                                                    </Font>
                                                </Box>
                                                <Box colSpan={2} textAlign="center">
                                                    <Font
                                                        variant="sub-tiny"
                                                        weight="bold"
                                                        mono
                                                        {...{
                                                            color: "PRIMARY",
                                                        }}>
                                                        {Math.round(mealP)}g
                                                    </Font>
                                                </Box>
                                                <Box colSpan={2} textAlign="center">
                                                    <Font
                                                        variant="sub-tiny"
                                                        weight="bold"
                                                        mono
                                                        {...{
                                                            color: "PRIMARY",
                                                        }}>
                                                        {Math.round(mealC)}g
                                                    </Font>
                                                </Box>
                                                <Box colSpan={2} textAlign="center">
                                                    <Font
                                                        variant="sub-tiny"
                                                        weight="bold"
                                                        mono
                                                        {...{
                                                            color: "PRIMARY",
                                                        }}>
                                                        {Math.round(mealF)}g
                                                    </Font>
                                                </Box>
                                                <Box colSpan={2} textAlign="right">
                                                    <Font
                                                        variant="sub-tiny"
                                                        weight="black"
                                                        mono
                                                        {...{
                                                            color: "success",
                                                        }}>
                                                        {Math.round(mealKcal)}
                                                    </Font>
                                                </Box>
                                            </Grid>
                                        </Stack>
                                    ) : (
                                        <Font
                                            variant="sub-tiny"
                                            italic
                                            {...{
                                                color: "MUTED",
                                            }}>
                                            Nenhum alimento cadastrado.
                                        </Font>
                                    )}
                                </Stack>
                            </GlassPanel>
                        );
                    })}
                </Stack>
            )}
        </Modal>
    );
}
