'use client'

import React from 'react'
import { Badge } from "@/components/store/base/badge"
import { Button } from "@/components/store/base/button"
import { Activity, Utensils, Timer, Zap, Flame, Pill, Info, Clock, Check } from 'lucide-react'
import { Box } from "@/components/store/base/box"
import { Stack } from "@/components/store/base/stack"
import { Grid } from "@/components/store/base/grid"
import { Font } from "@/components/store/base/font"
import { Icon } from "@/components/store/base/icon"
import { Separator } from "@/components/store/base/separator"
import { Surface, GlassPanel } from "@/components/store/base/surface"
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

function safeString(val: any, fallback: string = '--'): string {
    if (val === null || val === undefined) return fallback
    return String(val)
}

const DAYS_SHORT = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

function DaySelector({ 
    selectedDays, 
    onChange, 
    disabled = false,
    color = 'emerald' 
}: { 
    selectedDays: number[], 
    onChange: (days: number[]) => void,
    disabled?: boolean,
    color?: 'emerald' | 'amber'
}) {
    const toggleDay = (day: number) => {
        if (disabled) return
        const next = selectedDays.includes(day)
            ? selectedDays.filter(d => d !== day)
            : [...selectedDays, day].sort()
        onChange(next)
    }

    const activeVariant = color === 'emerald' ? 'emerald' : 'amber'

    return (
        <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT} wrap="wrap">
            {DAYS_SHORT.map((label, i) => {
                const isActive = selectedDays.includes(i)
                return (
                    <Button
                        key={i}
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation()
                            toggleDay(i)
                        }}
                        disabled={disabled}
                        variant={isActive ? activeVariant : 'outline-zinc'}
                        size="xs"
                    >
                        {label}
                    </Button>
                )
            })}
            <Button
                type="button"
                onClick={(e) => {
                    e.stopPropagation()
                    if (disabled) return
                    const allDays = [0, 1, 2, 3, 4, 5, 6]
                    const isAllSelected = selectedDays.length === 7
                    onChange(isAllSelected ? [] : allDays)
                }}
                disabled={disabled}
                variant={selectedDays.length === 7 ? activeVariant : 'outline-zinc'}
                size="xs"
            >
                Diário
            </Button>
        </Stack>
    )
}

interface Exercise {
    name: string
    sets: number
    reps: string
    rest: number
    warmup_sets?: string
    feeder_sets?: string
    notes?: string
}

interface Workout {
    name: string
    day_of_week: number
    exercises: Exercise[]
}

interface Meal {
    meal_name: string
    foods: Array<{
        name: string
        quantity: string
        calories: number
        protein: number
        carbs: number
        fat: number
    }>
}

function ExtraCardios({
    cardios,
    selectedCardioIndices,
    onToggleCardio,
    onUpdateCardioDays
}: {
    cardios: any[],
    selectedCardioIndices: Set<number>,
    onToggleCardio?: (index: number) => void,
    onUpdateCardioDays?: (index: number, days: number[]) => void
}) {
    return (
        <RegistrySection
            title="Cardios Extraídos"
            subtitle="Revise e selecione os cardios extraídos do PDF."
            icon={Timer}
        >
            <GlassPanel padding={{ base: STORE_TOKENS.SPACING.ELEMENT, md: STORE_TOKENS.SPACING.CONTAINER }}>
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    {cardios.map((c: any, i: number) => {
                        const isSelected = selectedCardioIndices.has(i)
                        return (
                            <Surface 
                                key={i} 
                                variant={isSelected ? 'tonal-emerald' : 'glass'}
                                padding={STORE_TOKENS.PADDING.ELEMENT}
                                onClick={() => onToggleCardio?.(i)}
                                opacity={isSelected ? STORE_TOKENS.OPACITY.FULL : STORE_TOKENS.OPACITY.SIDEBAR}
                                group
                                transition
                            >
                                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                    <Stack direction="row" align="center" justify="between">
                                        <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                            {/* Custom checkbox */}
                                            <Box
                                                width={16}
                                                height={16}
                                                rounded={STORE_TOKENS.RADIUS.SYSTEM}
                                                border
                                                borderWidth={1}
                                                borderColor={isSelected ? STORE_TOKENS.COLORS.SUCCESS : STORE_TOKENS.COLORS.BACKGROUND}
                                                borderOpacity={isSelected ? STORE_TOKENS.OPACITY.FULL : STORE_TOKENS.OPACITY.HIGH}
                                                bg={isSelected ? STORE_TOKENS.COLORS.SUCCESS : STORE_TOKENS.COLORS.TRANSPARENT}
                                                display="flex"
                                                align="center"
                                                justify="center"
                                                transition
                                                shrink={0}
                                            >
                                                {isSelected && <Icon icon={Check} size="xs" color={STORE_TOKENS.COLORS.BLACK} />}
                                            </Box>
                                            <Font
                                                variant="body-sm"
                                                weight="bold"
                                                uppercase
                                                {...{
                                                    color: "PRIMARY",
                                                }}>
                                                {c.type}
                                            </Font>
                                        </Stack>
                                        {!isSelected && (
                                            <Badge label="Ignorado" variant="outline" color={STORE_TOKENS.COLORS.BACKGROUND} size="xs" />
                                        )}
                                    </Stack>
                                    <Stack direction="row" gap={STORE_TOKENS.SPACING.NONE}>
                                        <Box width={28} shrink={0} />
                                        <Stack direction="row" gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                                            <Font
                                                variant="tiny"
                                                weight="bold"
                                                uppercase
                                                tracking="widest"
                                                {...{
                                                    color: "SECONDARY",
                                                }}>
                                                {c.duration}
                                            </Font>
                                            <Font
                                                variant="tiny"
                                                {...{
                                                    color: "DIM",
                                                }}>•</Font>
                                            <Font
                                                variant="tiny"
                                                weight="bold"
                                                uppercase
                                                tracking="widest"
                                                {...{
                                                    color: "SECONDARY",
                                                }}>
                                                {c.intensity}
                                            </Font>
                                        </Stack>
                                    </Stack>
                                    {isSelected && (
                                        <Stack direction="row" gap={STORE_TOKENS.SPACING.NONE} onClick={(e) => e.stopPropagation()}>
                                            <Box width={28} shrink={0} />
                                            <Box flex1>
                                                <DaySelector
                                                    selectedDays={c.application_days || []}
                                                    onChange={(days) => onUpdateCardioDays?.(i, days)}
                                                    {...{
                                                        color: "emerald",
                                                    }} />
                                            </Box>
                                        </Stack>
                                    )}
                                </Stack>
                            </Surface>
                        );
                    })}
                </Stack>
            </GlassPanel>
        </RegistrySection>
    );
}

function ExtraErgogenics({
    ergogenics,
    selectedErgoIndices,
    onToggleErgo,
    onUpdateErgoDays,
    onUpdateErgoUnit
}: {
    ergogenics: any[],
    selectedErgoIndices: Set<number>,
    onToggleErgo?: (index: number) => void,
    onUpdateErgoDays?: (index: number, days: number[]) => void,
    onUpdateErgoUnit?: (index: number, unit: string) => void
}) {
    return (
        <RegistrySection
            title="Protocolo Extraído"
            subtitle="Revise e selecione as substâncias extraídas do PDF."
            icon={Pill}
        >
            <GlassPanel padding={{ base: STORE_TOKENS.PADDING.ELEMENT, md: STORE_TOKENS.PADDING.CONTAINER }}>
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    {ergogenics.map((ergo: any, i: number) => {
                        const isSelected = selectedErgoIndices.has(i)
                        const unit = ergo.unit || 'mg'
                        return (
                            <Surface 
                                key={i} 
                                variant={isSelected ? 'tonal-amber' : 'glass'}
                                padding={STORE_TOKENS.PADDING.ELEMENT}
                                onClick={() => onToggleErgo?.(i)}
                                opacity={isSelected ? STORE_TOKENS.OPACITY.FULL : STORE_TOKENS.OPACITY.SIDEBAR}
                                group
                                transition
                            >
                                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                    <Stack direction="row" align="center" justify="between">
                                        <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                            {/* Custom checkbox */}
                                            <Box
                                                width={16}
                                                height={16}
                                                rounded={STORE_TOKENS.RADIUS.SYSTEM}
                                                border
                                                borderWidth={1}
                                                borderColor={isSelected ? STORE_TOKENS.COLORS.WARNING : STORE_TOKENS.COLORS.BACKGROUND}
                                                borderOpacity={isSelected ? STORE_TOKENS.OPACITY.FULL : STORE_TOKENS.OPACITY.HIGH}
                                                bg={isSelected ? STORE_TOKENS.COLORS.WARNING : STORE_TOKENS.COLORS.TRANSPARENT}
                                                display="flex"
                                                align="center"
                                                justify="center"
                                                transition
                                                shrink={0}
                                            >
                                                {isSelected && <Icon icon={Check} size="xs" color={STORE_TOKENS.COLORS.BLACK} />}
                                            </Box>
                                            <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                                <Font
                                                    variant="body-sm"
                                                    weight="bold"
                                                    uppercase
                                                    {...{
                                                        color: "PRIMARY",
                                                    }}>
                                                    {safeString(ergo.name)}
                                                </Font>
                                            </Stack>
                                        </Stack>
                                        {!isSelected && (
                                            <Badge label="Ignorado" variant="outline" color={STORE_TOKENS.COLORS.BACKGROUND} size="xs" />
                                        )}
                                    </Stack>
                                    {isSelected && (
                                        <Stack direction="row" gap={STORE_TOKENS.SPACING.NONE} onClick={(e) => e.stopPropagation()}>
                                            <Box width={28} shrink={0} />
                                            <Stack gap={STORE_TOKENS.SPACING.ELEMENT} flex1>
                                                <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                                    <Font
                                                        variant="body-sm"
                                                        weight="bold"
                                                        uppercase
                                                        tracking="widest"
                                                        {...{
                                                            color: "warning",
                                                        }}>
                                                        {safeString(ergo.dosage)}
                                                    </Font>
                                                </Stack>
                                                <DaySelector
                                                    selectedDays={ergo.application_days || []}
                                                    onChange={(days) => onUpdateErgoDays?.(i, days)}
                                                    {...{
                                                        color: "amber",
                                                    }} />
                                            </Stack>
                                        </Stack>
                                    )}
                                </Stack>
                            </Surface>
                        );
                    })}
                </Stack>
            </GlassPanel>
        </RegistrySection>
    );
}

export function PdfDataView({ 
    type, 
    data,
    selectedCardioIndices = new Set(),
    selectedErgoIndices = new Set(),
    onToggleCardio,
    onToggleErgo,
    onUpdateCardioDays,
    onUpdateErgoDays,
    onUpdateErgoUnit,
    onUpdateDietDays
}: { 
    type: 'workout' | 'diet', 
    data: any,
    selectedCardioIndices?: Set<number>,
    selectedErgoIndices?: Set<number>,
    onToggleCardio?: (index: number) => void,
    onToggleErgo?: (index: number) => void,
    onUpdateCardioDays?: (index: number, days: number[]) => void,
    onUpdateErgoDays?: (index: number, days: number[]) => void,
    onUpdateErgoUnit?: (index: number, unit: string) => void,
    onUpdateDietDays?: (days: number[]) => void
}) {
    if (type === 'workout') {
        const workouts = data.workouts || []
        const cardios = data.cardios || []
        const ergogenics = data.ergogenics || []

        // Force HMR rebuild to apply container gap layout changes
        return (
            <Stack gap={STORE_TOKENS.SPACING.SECTION} animateIn="slide-up">
                {/* Workouts */}
                {workouts.length > 0 && (
                    <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                        {workouts.map((workout: Workout, idx: number) => (
                            <Surface key={idx} variant="glass" padding={STORE_TOKENS.PADDING.NONE} zIndex={STORE_TOKENS.Z_INDEX.OVERLAY} position="relative">
                        <Box 
                            padding={STORE_TOKENS.PADDING.ELEMENT} 
                            bg={STORE_TOKENS.COLORS.WHITE} 
                            bgOpacity={STORE_TOKENS.OPACITY.LOW} 
                            display="flex" 
                            direction={{ base: 'col', md: 'row' }} 
                            align={{ base: 'start', md: 'center' }} 
                            justify="between" 
                            gap={STORE_TOKENS.SPACING.ELEMENT}
                        >
                            <Stack direction="row" gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                                <Icon icon={Activity} color={STORE_TOKENS.COLORS.SUCCESS} size="sm" />
                                <Font
                                    variant="body"
                                    weight="black"
                                    uppercase
                                    {...{
                                        color: "PRIMARY",
                                    }}>
                                    {safeString(workout.name) || `TREINO ${idx + 1}`}
                                </Font>
                            </Stack>
                            <Stack direction="row" gap={STORE_TOKENS.SPACING.NONE} wrap="wrap">
                                <Badge 
                                    label={`${workout.exercises?.length || 0} EXERCÍCIOS`} 
                                    variant="glass" 
                                    color={STORE_TOKENS.COLORS.INFO} 
                                    size="xs" 
                                />
                                {(() => {
                                    const totalWarmup = workout.exercises?.filter(ex => ex.warmup_sets).length || 0
                                    const totalFeeder = workout.exercises?.filter(ex => ex.feeder_sets).length || 0
                                    if (totalWarmup === 0 && totalFeeder === 0) return null
                                    return (
                                        <Badge 
                                            label={[
                                                totalWarmup > 0 && `${totalWarmup} WARMUP`,
                                                totalFeeder > 0 && `${totalFeeder} FEEDER`
                                            ].filter(Boolean).join(" • ")} 
                                            variant="glass" 
                                            color={STORE_TOKENS.COLORS.WARNING} 
                                            size="xs" 
                                        />
                                    );
                                })()}
                            </Stack>
                        </Box>
                        <Separator opacity={STORE_TOKENS.OPACITY.LOW} />
                        <Stack gap={STORE_TOKENS.SPACING.NONE} divide>
                            {workout.exercises?.map((ex: Exercise, exIdx: number) => {
                                const isConjugado = safeString(ex.name).toLowerCase().includes('+') ||
                                    safeString(ex.name).toLowerCase().includes('conjugado') ||
                                    safeString(ex.notes).toLowerCase().includes('bi-set') ||
                                    safeString(ex.notes).toLowerCase().includes('biset') ||
                                    safeString(ex.notes).toLowerCase().includes('conjugado')

                                return (
                                    <Box 
                                        key={exIdx} 
                                        padding={{ base: STORE_TOKENS.PADDING.ELEMENT }} 
                                        hoverBg={STORE_TOKENS.COLORS.BACKGROUND} 
                                        hoverBgOpacity={STORE_TOKENS.OPACITY.LOW} 
                                        transition
                                        group
                                    >
                                        <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                                            <Stack direction={{ base: 'col', lg: 'row' }} justify="between" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                                <Stack gap={STORE_TOKENS.SPACING.ELEMENT} flex1>
                                                    <Stack direction={{ base: 'col', md: 'row' }} justify="between" align={{ base: 'start', md: 'center' }} gap={STORE_TOKENS.SPACING.ELEMENT}>
                                                        <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT} wrap="wrap">
                                                            <Font
                                                                variant="body"
                                                                weight="bold"
                                                                transition
                                                                {...{
                                                                    color: "PRIMARY",
                                                                }}>
                                                                {safeString(ex.name)}
                                                            </Font>
                                                            {isConjugado && (
                                                                <Badge 
                                                                    label="CONJUGADO" 
                                                                    icon={Zap} 
                                                                    variant="glass" 
                                                                    color={STORE_TOKENS.COLORS.INFO} 
                                                                    size="xs" 
                                                                />
                                                            )}
                                                        </Stack>
                                                        {ex.notes && 
                                                         safeString(ex.notes).toLowerCase().trim() !== 'conjugado' && 
                                                         safeString(ex.notes).toLowerCase().trim() !== 'bi-set' && 
                                                         safeString(ex.notes).toLowerCase().trim() !== 'biset' && (
                                                            <Box 
                                                                padding={STORE_TOKENS.PADDING.NONE} 
                                                                bg={STORE_TOKENS.COLORS.BACKGROUND} 
                                                                bgOpacity={STORE_TOKENS.OPACITY.LOW} 
                                                                border 
                                                                borderColor={STORE_TOKENS.COLORS.BACKGROUND} 
                                                                borderOpacity={STORE_TOKENS.OPACITY.SUBTLE} 
                                                                rounded={STORE_TOKENS.RADIUS.SYSTEM}
                                                                display="flex"
                                                                align="center"
                                                                gap={STORE_TOKENS.SPACING.ELEMENT}
                                                            >
                                                                <Icon icon={Info} size="xs" color={STORE_TOKENS.COLORS.TEXT.MUTED} />
                                                                <Font
                                                                    variant="tiny"
                                                                    italic
                                                                    {...{
                                                                        color: "SECONDARY",
                                                                    }}>
                                                                    {safeString(ex.notes)}
                                                                </Font>
                                                            </Box>
                                                        )}
                                                    </Stack>

                                                    {/* Detailed Sets Breakdown */}
                                                    <Grid cols={{ base: 1, md: 3 }} gap={STORE_TOKENS.SPACING.ELEMENT}>
                                                        {/* Warmup Sets */}
                                                        {ex.warmup_sets && (
                                                            <Box 
                                                                bg={STORE_TOKENS.COLORS.BRAND} 
                                                                bgOpacity={STORE_TOKENS.OPACITY.LOW} 
                                                                border 
                                                                borderColor={STORE_TOKENS.COLORS.BRAND} 
                                                                borderOpacity={STORE_TOKENS.OPACITY.SUBTLE} 
                                                                padding={STORE_TOKENS.PADDING.ELEMENT} 
                                                                rounded={STORE_TOKENS.RADIUS.SYSTEM}
                                                                display="flex"
                                                                direction="col"
                                                                gap={STORE_TOKENS.SPACING.ELEMENT}
                                                            >
                                                                <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                                                    <Icon icon={Flame} size="xs" color={STORE_TOKENS.COLORS.BRAND} />
                                                                    <Font
                                                                        variant="tiny"
                                                                        weight="black"
                                                                        uppercase
                                                                        tracking="widest"
                                                                        {...{
                                                                            color: "orange",
                                                                        }}>
                                                                        AQUECIMENTO
                                                                    </Font>
                                                                </Stack>
                                                                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                                                    <Font
                                                                        variant="body-sm"
                                                                        weight="bold"
                                                                        italic
                                                                        {...{
                                                                            color: "PRIMARY",
                                                                        }}>
                                                                        {safeString(ex.warmup_sets).includes('x')
                                                                            ? `${safeString(ex.warmup_sets).split('x')[0]} SÉRIES`
                                                                            : 'SÉRIES PROG.'}
                                                                    </Font>
                                                                    <Stack direction="row" gap={STORE_TOKENS.SPACING.ELEMENT} wrap="wrap">
                                                                        <Badge 
                                                                            label={safeString(ex.warmup_sets).includes('x')
                                                                                ? `${safeString(ex.warmup_sets).split('x')[1]} REPS`
                                                                                : safeString(ex.warmup_sets)} 
                                                                            variant="glass" 
                                                                            color={STORE_TOKENS.COLORS.BRAND} 
                                                                            size="xs" 
                                                                        />
                                                                        {ex.rest ? (
                                                                            <Badge 
                                                                                label={`DESCANSO: ${safeString(ex.rest)}S`} 
                                                                                variant="glass" 
                                                                                color={STORE_TOKENS.COLORS.BRAND} 
                                                                                size="xs" 
                                                                            />
                                                                        ) : null}
                                                                    </Stack>
                                                                </Stack>
                                                            </Box>
                                                        )}

                                                        {/* Feeder Sets */}
                                                        {ex.feeder_sets && (
                                                            <Box 
                                                                bg={STORE_TOKENS.COLORS.INFO} 
                                                                bgOpacity={STORE_TOKENS.OPACITY.LOW} 
                                                                border 
                                                                borderColor={STORE_TOKENS.COLORS.INFO} 
                                                                borderOpacity={STORE_TOKENS.OPACITY.SUBTLE} 
                                                                padding={STORE_TOKENS.PADDING.ELEMENT} 
                                                                rounded={STORE_TOKENS.RADIUS.SYSTEM}
                                                                display="flex"
                                                                direction="col"
                                                                gap={STORE_TOKENS.SPACING.ELEMENT}
                                                            >
                                                                <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                                                    <Icon icon={Timer} size="xs" color={STORE_TOKENS.COLORS.INFO} />
                                                                    <Font
                                                                        variant="tiny"
                                                                        weight="black"
                                                                        uppercase
                                                                        tracking="widest"
                                                                        {...{
                                                                            color: "blue",
                                                                        }}>
                                                                        FEEDER
                                                                    </Font>
                                                                </Stack>
                                                                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                                                    <Font
                                                                        variant="body-sm"
                                                                        weight="bold"
                                                                        italic
                                                                        {...{
                                                                            color: "PRIMARY",
                                                                        }}>
                                                                        {safeString(ex.feeder_sets).includes('x')
                                                                            ? `${safeString(ex.feeder_sets).split('x')[0]} SÉRIES`
                                                                            : 'SÉRIE ÚNICA'}
                                                                    </Font>
                                                                    <Stack direction="row" gap={STORE_TOKENS.SPACING.ELEMENT} wrap="wrap">
                                                                        <Badge 
                                                                            label={safeString(ex.feeder_sets).includes('x')
                                                                                ? `${safeString(ex.feeder_sets).split('x')[1]} REPS`
                                                                                : safeString(ex.feeder_sets)} 
                                                                            variant="glass" 
                                                                            color={STORE_TOKENS.COLORS.INFO} 
                                                                            size="xs" 
                                                                        />
                                                                        {ex.rest ? (
                                                                            <Badge 
                                                                                label={`DESCANSO: ${safeString(ex.rest)}S`} 
                                                                                variant="glass" 
                                                                                color={STORE_TOKENS.COLORS.INFO} 
                                                                                size="xs" 
                                                                            />
                                                                        ) : null}
                                                                    </Stack>
                                                                </Stack>
                                                            </Box>
                                                        )}

                                                        {/* Working Sets */}
                                                        <Box 
                                                            bg={STORE_TOKENS.COLORS.SUCCESS} 
                                                            bgOpacity={STORE_TOKENS.OPACITY.LOW} 
                                                            border 
                                                            borderColor={STORE_TOKENS.COLORS.SUCCESS} 
                                                            borderOpacity={STORE_TOKENS.OPACITY.MEDIUM} 
                                                            padding={STORE_TOKENS.PADDING.ELEMENT} 
                                                            rounded={STORE_TOKENS.RADIUS.SYSTEM}
                                                            display="flex"
                                                            direction="col"
                                                            gap={STORE_TOKENS.SPACING.ELEMENT}
                                                        >
                                                            <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                                                <Icon icon={Activity} size="xs" color={STORE_TOKENS.COLORS.SUCCESS} />
                                                                <Font
                                                                    variant="tiny"
                                                                    weight="black"
                                                                    uppercase
                                                                    tracking="widest"
                                                                    {...{
                                                                        color: "emerald",
                                                                    }}>
                                                                    TRABALHO
                                                                </Font>
                                                            </Stack>
                                                            <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                                                <Font
                                                                    variant="body-sm"
                                                                    weight="bold"
                                                                    italic
                                                                    {...{
                                                                        color: "PRIMARY",
                                                                    }}>
                                                                    {safeString(ex.sets, 'sets')} SÉRIES
                                                                </Font>
                                                                <Stack direction="row" gap={STORE_TOKENS.SPACING.ELEMENT} wrap="wrap">
                                                                    <Badge 
                                                                        label={`${safeString(ex.reps, 'reps')} REPS`} 
                                                                        variant="glass" 
                                                                        color={STORE_TOKENS.COLORS.SUCCESS} 
                                                                        size="xs" 
                                                                    />
                                                                    {ex.rest ? (
                                                                        <Badge 
                                                                            label={`DESCANSO: ${safeString(ex.rest)}S`} 
                                                                            variant="glass" 
                                                                            color={STORE_TOKENS.COLORS.SUCCESS} 
                                                                            size="xs" 
                                                                        />
                                                                    ) : null}
                                                                </Stack>
                                                            </Stack>
                                                        </Box>
                                                    </Grid>
                                                </Stack>
                                            </Stack>
                                        </Stack>
                                    </Box>
                                );
                            })}
                        </Stack>
                    </Surface>
                ))}
                    </Stack>
                )}
                {/* Cardios & Ergogenics */}
                {(cardios.length > 0 || ergogenics.length > 0) && (
                    <Grid cols={{ base: 1, lg: (cardios.length > 0 && ergogenics.length > 0) ? 2 : 1 }} gap={STORE_TOKENS.SPACING.SECTION}>
                        {cardios.length > 0 && (
                            <ExtraCardios 
                                cardios={cardios}
                                selectedCardioIndices={selectedCardioIndices}
                                onToggleCardio={onToggleCardio}
                                onUpdateCardioDays={onUpdateCardioDays}
                            />
                        )}
                        {ergogenics.length > 0 && (
                            <ExtraErgogenics 
                                ergogenics={ergogenics}
                                selectedErgoIndices={selectedErgoIndices}
                                onToggleErgo={onToggleErgo}
                                onUpdateErgoDays={onUpdateErgoDays}
                                onUpdateErgoUnit={onUpdateErgoUnit}
                            />
                        )}
                    </Grid>
                )}
            </Stack>
        );
    }

    // DIET VIEW
    const diets = data.diets || data.meals || []
    const cardios = data.cardios || []
    const ergogenics = data.ergogenics || []
    const selectedDietDays = data.days_of_week || [0, 1, 2, 3, 4, 5, 6]

    return (
        <Stack gap={STORE_TOKENS.SPACING.SECTION} animateIn="slide-up">
            <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                {/* Diet Day Selection */}
                <Box 
                    bg={STORE_TOKENS.COLORS.SUCCESS} 
                    bgOpacity={STORE_TOKENS.OPACITY.LOW} 
                    border 
                    borderColor={STORE_TOKENS.COLORS.SUCCESS} 
                    borderOpacity={STORE_TOKENS.OPACITY.SUBTLE} 
                    padding={{ base: STORE_TOKENS.PADDING.ELEMENT, md: STORE_TOKENS.PADDING.CONTAINER }} 
                    rounded={STORE_TOKENS.RADIUS.SYSTEM} 
                    display="flex" 
                    direction={{ base: 'col', md: 'row' }} 
                    align={{ base: 'start', md: 'center' }} 
                    justify="between" 
                    gap={{ base: STORE_TOKENS.SPACING.ELEMENT, md: STORE_TOKENS.SPACING.CONTAINER }}
                    zIndex={STORE_TOKENS.Z_INDEX.OVERLAY}
                    position="relative"
                >
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Icon icon={Utensils} color={STORE_TOKENS.COLORS.SUCCESS} size="xs" />
                            <Font
                                variant="body-sm"
                                weight="black"
                                uppercase
                                tracking="widest"
                                {...{
                                    color: "emerald",
                                }}>
                                Frequência da Dieta
                            </Font>
                        </Stack>
                        <Font
                            variant="sub-tiny"
                            weight="bold"
                            uppercase
                            tracking="wide"
                            {...{
                                color: "SECONDARY",
                            }}>
                            Selecione os dias em que esta dieta deve ser seguida.
                        </Font>
                    </Stack>
                    <DaySelector
                        selectedDays={selectedDietDays}
                        onChange={(days) => onUpdateDietDays?.(days)}
                        {...{
                            color: "emerald",
                        }} />
                </Box>

                {diets.map((meal: any, idx: number) => {
                    const mealData = meal.meals ? meal.meals : [meal]

                    return mealData.map((m: Meal, mIdx: number) => {
                    const totalKcal = m.foods?.reduce((acc, f) => acc + (f.calories || 0), 0) || 0
                    const totalProt = m.foods?.reduce((acc, f) => acc + (f.protein || 0), 0) || 0
                    const totalCarbs = m.foods?.reduce((acc, f) => acc + (f.carbs || 0), 0) || 0
                    const totalFat = m.foods?.reduce((acc, f) => acc + (f.fat || 0), 0) || 0

                    return (
                        <Surface key={`${idx}-${mIdx}`} variant="glass" padding={STORE_TOKENS.PADDING.NONE} zIndex={STORE_TOKENS.Z_INDEX.OVERLAY} position="relative">
                            <Box 
                                padding={STORE_TOKENS.PADDING.ELEMENT} 
                                bg={STORE_TOKENS.COLORS.WHITE} 
                                bgOpacity={STORE_TOKENS.OPACITY.LOW} 
                                display="flex" 
                                direction={{ base: 'col', md: 'row' }} 
                                align={{ base: 'start', md: 'center' }} 
                                justify="between" 
                                gap={STORE_TOKENS.SPACING.ELEMENT}
                            >
                                <Stack direction="row" gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                                    <Icon icon={Utensils} color={STORE_TOKENS.COLORS.SUCCESS} size="sm" />
                                    <Font
                                        variant="body"
                                        weight="black"
                                        uppercase
                                        {...{
                                            color: "PRIMARY",
                                        }}>
                                        {safeString(m.meal_name) || `REFEIÇÃO ${mIdx + 1}`}
                                    </Font>
                                </Stack>
                                <Box 
                                    bg={STORE_TOKENS.COLORS.SUCCESS} 
                                    bgOpacity={STORE_TOKENS.OPACITY.LOW} 
                                    border 
                                    borderColor={STORE_TOKENS.COLORS.SUCCESS} 
                                    borderOpacity={STORE_TOKENS.OPACITY.SUBTLE} 
                                    padding={STORE_TOKENS.PADDING.ELEMENT} 
                                    rounded={STORE_TOKENS.RADIUS.SYSTEM}
                                    display="flex"
                                    align="center"
                                    gap={STORE_TOKENS.SPACING.ELEMENT}
                                    wrap="wrap"
                                    width="auto"
                                >
                                    <Font
                                        variant="tiny"
                                        weight="black"
                                        uppercase
                                        tracking="widest"
                                        {...{
                                            color: "emerald",
                                        }}>
                                        {Math.round(totalKcal)} KCAL
                                    </Font>
                                    <Font
                                        variant="tiny"
                                        {...{
                                            color: "DIM",
                                        }}>•</Font>
                                    <Font
                                        variant="tiny"
                                        weight="black"
                                        uppercase
                                        tracking="widest"
                                        {...{
                                            color: "emerald",
                                        }}>
                                        {Math.round(totalProt)}G P
                                    </Font>
                                    <Font
                                        variant="tiny"
                                        {...{
                                            color: "DIM",
                                        }}>•</Font>
                                    <Font
                                        variant="tiny"
                                        weight="black"
                                        uppercase
                                        tracking="widest"
                                        {...{
                                            color: "emerald",
                                        }}>
                                        {Math.round(totalCarbs)}G C
                                    </Font>
                                    <Font
                                        variant="tiny"
                                        {...{
                                            color: "DIM",
                                        }}>•</Font>
                                    <Font
                                        variant="tiny"
                                        weight="black"
                                        uppercase
                                        tracking="widest"
                                        {...{
                                            color: "emerald",
                                        }}>
                                        {Math.round(totalFat)}G F
                                    </Font>
                                </Box>
                            </Box>
                            <Separator opacity={STORE_TOKENS.OPACITY.LOW} />
                            <Box padding={STORE_TOKENS.PADDING.ELEMENT}>
                                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                    {m.foods?.length > 0 ? (
                                        m.foods.map((food, fIdx) => (
                                            <GlassPanel 
                                                key={fIdx} 
                                                padding={STORE_TOKENS.PADDING.ELEMENT}
                                                hoverBorder="emerald"
                                                group
                                                transition
                                            >
                                                <Box display="flex" direction={{ base: 'col', md: 'row' }} align={{ base: 'stretch', md: 'center' }} justify="between" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT} flex1>
                                                        <Font
                                                            variant="body-sm"
                                                            weight="bold"
                                                            uppercase
                                                            lineClamp={1}
                                                            transition
                                                            {...{
                                                                color: "PRIMARY",
                                                            }}>
                                                            {safeString(food.name)}
                                                        </Font>
                                                        <Font
                                                            variant="tiny"
                                                            weight="bold"
                                                            uppercase
                                                            tracking="widest"
                                                            {...{
                                                                color: "SECONDARY",
                                                            }}>
                                                            {safeString(food.quantity)}
                                                        </Font>
                                                    </Stack>
                                                    <Stack direction="row" gap={{ base: STORE_TOKENS.SPACING.ELEMENT, md: STORE_TOKENS.SPACING.CONTAINER }} align="center" justify="between">
                                                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT} align="center" justify="center" minWidth={35}>
                                                            <Font
                                                                variant="tiny"
                                                                weight="black"
                                                                uppercase
                                                                tracking="widest"
                                                                {...{
                                                                    color: "PRIMARY",
                                                                }}>
                                                                {Math.round(food.protein || 0)}G
                                                            </Font>
                                                            <Font
                                                                variant="tiny"
                                                                weight="bold"
                                                                {...{
                                                                    color: "DIM",
                                                                }}>
                                                                PROT
                                                            </Font>
                                                        </Stack>
                                                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT} align="center" justify="center" minWidth={35}>
                                                            <Font
                                                                variant="tiny"
                                                                weight="black"
                                                                uppercase
                                                                tracking="widest"
                                                                {...{
                                                                    color: "PRIMARY",
                                                                }}>
                                                                {Math.round(food.carbs || 0)}G
                                                            </Font>
                                                            <Font
                                                                variant="tiny"
                                                                weight="bold"
                                                                {...{
                                                                    color: "DIM",
                                                                }}>
                                                                CARB
                                                            </Font>
                                                        </Stack>
                                                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT} align="center" justify="center" minWidth={35}>
                                                            <Font
                                                                variant="tiny"
                                                                weight="black"
                                                                uppercase
                                                                tracking="widest"
                                                                {...{
                                                                    color: "PRIMARY",
                                                                }}>
                                                                {Math.round(food.fat || 0)}G
                                                            </Font>
                                                            <Font
                                                                variant="tiny"
                                                                weight="bold"
                                                                {...{
                                                                    color: "DIM",
                                                                }}>
                                                                FAT
                                                            </Font>
                                                        </Stack>
                                                    </Stack>
                                                </Box>
                                            </GlassPanel>
                                        ))
                                    ) : (
                                        <Box 
                                            padding={{ base: STORE_TOKENS.PADDING.ELEMENT, md: STORE_TOKENS.PADDING.CONTAINER }} 
                                            display="flex" 
                                            align="center" 
                                            justify="center" 
                                            border 
                                            borderWidth={1} 
                                            borderColor={STORE_TOKENS.COLORS.BACKGROUND} 
                                            borderOpacity={STORE_TOKENS.OPACITY.SUBTLE} 
                                            rounded={STORE_TOKENS.RADIUS.SYSTEM}
                                        >
                                            <Font
                                                variant="tiny"
                                                weight="black"
                                                uppercase
                                                tracking="widest"
                                                {...{
                                                    color: "DIM",
                                                }}>
                                                Nenhum alimento detectado nesta refeição
                                            </Font>
                                        </Box>
                                    )}
                                </Stack>
                            </Box>
                        </Surface>
                    );
                });
            })}
            </Stack>
            {/* Extras Section for Diets */}
            {(cardios.length > 0 || ergogenics.length > 0) && (
                <Grid cols={{ base: 1, lg: (cardios.length > 0 && ergogenics.length > 0) ? 2 : 1 }} gap={STORE_TOKENS.SPACING.SECTION}>
                    {cardios.length > 0 && (
                        <ExtraCardios 
                            cardios={cardios}
                            selectedCardioIndices={selectedCardioIndices}
                            onToggleCardio={onToggleCardio}
                            onUpdateCardioDays={onUpdateCardioDays}
                        />
                    )}
                    {ergogenics.length > 0 && (
                        <ExtraErgogenics 
                            ergogenics={ergogenics}
                            selectedErgoIndices={selectedErgoIndices}
                            onToggleErgo={onToggleErgo}
                            onUpdateErgoDays={onUpdateErgoDays}
                            onUpdateErgoUnit={onUpdateErgoUnit}
                        />
                    )}
                </Grid>
            )}
        </Stack>
    );
}
