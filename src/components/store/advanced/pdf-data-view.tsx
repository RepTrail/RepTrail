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
import { Surface } from "@/components/store/base/surface"

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
        <Stack direction={{ base: 'col', md: 'row' }} align={{ base: 'start', md: 'center' }} gap="element">
            <Stack direction="row" gap="element" wrap="wrap">
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
                            width="28px"
                            padding="none"
                        >
                            {label}
                        </Button>
                    )
                })}
            </Stack>
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
        <Surface variant="base" padding={{ base: 'element', md: 'container' }} zIndex={20} position="relative">
            <Stack gap="container">
                <Stack direction="row" align="center" gap="element">
                    <Icon icon={Timer} color="emerald" size="md" />
                    <Font variant="heading" weight="black" italic uppercase color="PRIMARY">
                        Cardios Extraídos
                    </Font>
                </Stack>
                <Separator opacity={5} />
                <Stack gap="element">
                    {cardios.map((c: any, i: number) => {
                        const isSelected = selectedCardioIndices.has(i)
                        return (
                            <Surface 
                                key={i} 
                                variant="interactive"
                                padding="element"
                                onClick={() => onToggleCardio?.(i)}
                                bg={isSelected ? 'emerald' : 'zinc'}
                                bgOpacity={isSelected ? 10 : 5}
                                border
                                borderColor={isSelected ? 'emerald' : 'zinc'}
                                borderOpacity={isSelected ? 30 : 10}
                                opacity={isSelected ? 100 : 40}
                                hoverScale={105}
                                activeScale={95}
                                group
                                transition
                            >
                                <Stack gap="element">
                                    <Stack direction="row" align="center" justify="between">
                                        <Stack direction="row" align="center" gap="element">
                                            {/* Custom checkbox */}
                                            <Box
                                                width={16}
                                                height={16}
                                                rounded="system"
                                                border
                                                borderWidth={1}
                                                borderColor={isSelected ? 'emerald' : 'zinc'}
                                                borderOpacity={isSelected ? 100 : 30}
                                                bg={isSelected ? 'emerald' : 'transparent'}
                                                display="flex"
                                                align="center"
                                                justify="center"
                                                transition
                                            >
                                                {isSelected && <Icon icon={Check} size="xs" color="black" />}
                                            </Box>
                                            <Stack gap="element">
                                                <Font variant="body-sm" weight="bold" color="PRIMARY" uppercase>
                                                    {c.type}
                                                </Font>
                                                <Stack direction="row" gap="element" align="center">
                                                    <Font variant="tiny" weight="bold" color="SECONDARY" uppercase tracking="widest">
                                                        {c.duration}
                                                    </Font>
                                                    <Font variant="tiny" color="DIM">•</Font>
                                                    <Font variant="tiny" weight="bold" color="SECONDARY" uppercase tracking="widest">
                                                        {c.intensity}
                                                    </Font>
                                                </Stack>
                                            </Stack>
                                        </Stack>
                                        {!isSelected && (
                                            <Badge label="Ignorado" variant="outline" color="zinc" size="xs" />
                                        )}
                                    </Stack>
                                    {isSelected && (
                                        <Stack direction="row" gap="none" onClick={(e) => e.stopPropagation()}>
                                            <Box width={28} shrink={0} />
                                            <Box flex1>
                                                <DaySelector 
                                                    selectedDays={c.application_days || []} 
                                                    onChange={(days) => onUpdateCardioDays?.(i, days)}
                                                    color="emerald"
                                                />
                                            </Box>
                                        </Stack>
                                    )}
                                </Stack>
                            </Surface>
                        )
                    })}
                </Stack>
            </Stack>
        </Surface>
    )
}

function ExtraErgogenics({
    ergogenics,
    selectedErgoIndices,
    onToggleErgo,
    onUpdateErgoDays
}: {
    ergogenics: any[],
    selectedErgoIndices: Set<number>,
    onToggleErgo?: (index: number) => void,
    onUpdateErgoDays?: (index: number, days: number[]) => void
}) {
    return (
        <Surface variant="base" padding={{ base: 'element', md: 'container' }} zIndex={20} position="relative">
            <Stack gap="container">
                <Stack direction="row" align="center" gap="element">
                    <Icon icon={Pill} color="amber" size="md" />
                    <Font variant="heading" weight="black" italic uppercase color="PRIMARY">
                        Protocolo Extraído
                    </Font>
                </Stack>
                <Separator opacity={5} />
                <Stack gap="element">
                    {ergogenics.map((ergo: any, i: number) => {
                        const isSelected = selectedErgoIndices.has(i)
                        return (
                            <Surface 
                                key={i} 
                                variant="interactive"
                                padding="element"
                                onClick={() => onToggleErgo?.(i)}
                                bg={isSelected ? 'amber' as const : 'zinc' as const}
                                bgOpacity={isSelected ? 10 as const : 5 as const}
                                border
                                borderColor={isSelected ? 'amber' : 'zinc'}
                                borderOpacity={isSelected ? 30 : 10}
                                opacity={isSelected ? 100 : 40}
                                hoverScale={105}
                                activeScale={95}
                                group
                                transition
                            >
                                <Stack gap="element">
                                    <Stack direction="row" align="center" justify="between">
                                        <Stack direction="row" align="center" gap="element">
                                            {/* Custom checkbox */}
                                            <Box
                                                width={16}
                                                height={16}
                                                rounded="system"
                                                border
                                                borderWidth={1}
                                                borderColor={isSelected ? 'amber' : 'zinc'}
                                                borderOpacity={isSelected ? 100 : 30}
                                                bg={isSelected ? 'amber' : 'transparent'}
                                                display="flex"
                                                align="center"
                                                justify="center"
                                                transition
                                            >
                                                {isSelected && <Icon icon={Check} size="xs" color="black" />}
                                            </Box>
                                            <Stack gap="element">
                                                <Font variant="body-sm" weight="bold" color="PRIMARY" uppercase>
                                                    {safeString(ergo.name)}
                                                </Font>
                                                <Font variant="tiny" weight="bold" color="warning" uppercase tracking="widest">
                                                    {safeString(ergo.dosage)}
                                                </Font>
                                            </Stack>
                                        </Stack>
                                        {!isSelected && (
                                            <Badge label="Ignorado" variant="outline" color="zinc" size="xs" />
                                        )}
                                    </Stack>
                                    {isSelected && (
                                        <Stack direction="row" gap="none" onClick={(e) => e.stopPropagation()}>
                                            <Box width={28} shrink={0} />
                                            <Box flex1>
                                                <DaySelector 
                                                    selectedDays={ergo.application_days || []} 
                                                    onChange={(days) => onUpdateErgoDays?.(i, days)}
                                                    color="amber"
                                                />
                                            </Box>
                                        </Stack>
                                    )}
                                </Stack>
                            </Surface>
                        )
                    })}
                </Stack>
            </Stack>
        </Surface>
    )
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
    onUpdateDietDays?: (days: number[]) => void
}) {
    if (type === 'workout') {
        const workouts = data.workouts || []
        const cardios = data.cardios || []
        const ergogenics = data.ergogenics || []

        return (
            <Stack gap="container" animateIn="slide-up">
                {/* Workouts */}
                {workouts.map((workout: Workout, idx: number) => (
                    <Surface key={idx} variant="glass" padding="none" zIndex={20} position="relative">
                        <Box 
                            padding="element" 
                            bg="white" 
                            bgOpacity={5} 
                            display="flex" 
                            direction={{ base: 'col', md: 'row' }} 
                            align={{ base: 'start', md: 'center' }} 
                            justify="between" 
                            gap="element"
                        >
                            <Stack direction="row" gap="element" align="center">
                                <Icon icon={Activity} color="emerald" size="sm" />
                                <Font variant="body" weight="black" uppercase color="PRIMARY">
                                    {safeString(workout.name) || `TREINO ${idx + 1}`}
                                </Font>
                            </Stack>
                            <Stack direction="row" gap="tiny" wrap="wrap">
                                <Badge 
                                    label={`${workout.exercises?.length || 0} EXERCÍCIOS`} 
                                    variant="glass" 
                                    color="blue" 
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
                                            color="amber" 
                                            size="xs" 
                                        />
                                    )
                                })()}
                            </Stack>
                        </Box>
                        <Separator opacity={5} />
                        <Stack gap="none" divide>
                            {workout.exercises?.map((ex: Exercise, exIdx: number) => {
                                const isConjugado = safeString(ex.name).toLowerCase().includes('+') ||
                                    safeString(ex.name).toLowerCase().includes('conjugado') ||
                                    safeString(ex.notes).toLowerCase().includes('bi-set') ||
                                    safeString(ex.notes).toLowerCase().includes('biset') ||
                                    safeString(ex.notes).toLowerCase().includes('conjugado')

                                return (
                                    <Box 
                                        key={exIdx} 
                                        padding={{ base: 'element' }} 
                                        hoverBg="zinc" 
                                        hoverBgOpacity={5} 
                                        transition
                                        group
                                    >
                                        <Stack gap="container">
                                            <Stack direction={{ base: 'col', lg: 'row' }} justify="between" gap="element">
                                                <Stack gap="element" flex1>
                                                    <Stack direction={{ base: 'col', md: 'row' }} justify="between" align={{ base: 'start', md: 'center' }} gap="element">
                                                        <Stack direction="row" align="center" gap="element" wrap="wrap">
                                                            <Font variant="body" weight="bold" color="PRIMARY" transition>
                                                                {safeString(ex.name)}
                                                            </Font>
                                                            {isConjugado && (
                                                                <Badge 
                                                                    label="CONJUGADO" 
                                                                    icon={Zap} 
                                                                    variant="glass" 
                                                                    color="blue" 
                                                                    size="xs" 
                                                                />
                                                            )}
                                                        </Stack>
                                                        {ex.notes && 
                                                         safeString(ex.notes).toLowerCase().trim() !== 'conjugado' && 
                                                         safeString(ex.notes).toLowerCase().trim() !== 'bi-set' && 
                                                         safeString(ex.notes).toLowerCase().trim() !== 'biset' && (
                                                            <Box 
                                                                padding="tiny" 
                                                                bg="zinc" 
                                                                bgOpacity={5} 
                                                                border 
                                                                borderColor="zinc" 
                                                                borderOpacity={10} 
                                                                rounded="system"
                                                                display="flex"
                                                                align="center"
                                                                gap="element"
                                                            >
                                                                <Icon icon={Info} size="xs" color="zinc-500" />
                                                                <Font variant="tiny" italic color="SECONDARY">
                                                                    {safeString(ex.notes)}
                                                                </Font>
                                                            </Box>
                                                        )}
                                                    </Stack>

                                                    {/* Detailed Sets Breakdown */}
                                                    <Grid cols={{ base: 1, md: 3 }} gap="element">
                                                        {/* Warmup Sets */}
                                                        {ex.warmup_sets && (
                                                            <Box 
                                                                bg="orange" 
                                                                bgOpacity={5} 
                                                                border 
                                                                borderColor="orange" 
                                                                borderOpacity={10} 
                                                                padding="element" 
                                                                rounded="system"
                                                                display="flex"
                                                                direction="col"
                                                                gap="element"
                                                            >
                                                                <Stack direction="row" align="center" gap="element">
                                                                    <Icon icon={Flame} size="xs" color="orange" />
                                                                    <Font variant="tiny" weight="black" color="orange" uppercase tracking="widest">
                                                                        AQUECIMENTO
                                                                    </Font>
                                                                </Stack>
                                                                <Stack gap="element">
                                                                    <Font variant="body-sm" weight="bold" color="PRIMARY" italic>
                                                                        {safeString(ex.warmup_sets).includes('x')
                                                                            ? `${safeString(ex.warmup_sets).split('x')[0]} SÉRIES`
                                                                            : 'SÉRIES PROG.'}
                                                                    </Font>
                                                                    <Stack direction="row" gap="element" wrap="wrap">
                                                                        <Badge 
                                                                            label={safeString(ex.warmup_sets).includes('x')
                                                                                ? `${safeString(ex.warmup_sets).split('x')[1]} REPS`
                                                                                : safeString(ex.warmup_sets)} 
                                                                            variant="glass" 
                                                                            color="orange" 
                                                                            size="xs" 
                                                                        />
                                                                        {ex.rest ? (
                                                                            <Badge 
                                                                                label={`DESCANSO: ${safeString(ex.rest)}S`} 
                                                                                variant="glass" 
                                                                                color="orange" 
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
                                                                bg="blue" 
                                                                bgOpacity={5} 
                                                                border 
                                                                borderColor="blue" 
                                                                borderOpacity={10} 
                                                                padding="element" 
                                                                rounded="system"
                                                                display="flex"
                                                                direction="col"
                                                                gap="element"
                                                            >
                                                                <Stack direction="row" align="center" gap="element">
                                                                    <Icon icon={Timer} size="xs" color="blue" />
                                                                    <Font variant="tiny" weight="black" color="blue" uppercase tracking="widest">
                                                                        FEEDER
                                                                    </Font>
                                                                </Stack>
                                                                <Stack gap="element">
                                                                    <Font variant="body-sm" weight="bold" color="PRIMARY" italic>
                                                                        {safeString(ex.feeder_sets).includes('x')
                                                                            ? `${safeString(ex.feeder_sets).split('x')[0]} SÉRIES`
                                                                            : 'SÉRIE ÚNICA'}
                                                                    </Font>
                                                                    <Stack direction="row" gap="element" wrap="wrap">
                                                                        <Badge 
                                                                            label={safeString(ex.feeder_sets).includes('x')
                                                                                ? `${safeString(ex.feeder_sets).split('x')[1]} REPS`
                                                                                : safeString(ex.feeder_sets)} 
                                                                            variant="glass" 
                                                                            color="blue" 
                                                                            size="xs" 
                                                                        />
                                                                        {ex.rest ? (
                                                                            <Badge 
                                                                                label={`DESCANSO: ${safeString(ex.rest)}S`} 
                                                                                variant="glass" 
                                                                                color="blue" 
                                                                                size="xs" 
                                                                            />
                                                                        ) : null}
                                                                    </Stack>
                                                                </Stack>
                                                            </Box>
                                                        )}

                                                        {/* Working Sets */}
                                                        <Box 
                                                            bg="emerald" 
                                                            bgOpacity={5} 
                                                            border 
                                                            borderColor="emerald" 
                                                            borderOpacity={20} 
                                                            padding="element" 
                                                            rounded="system"
                                                            display="flex"
                                                            direction="col"
                                                            gap="element"
                                                        >
                                                            <Stack direction="row" align="center" gap="element">
                                                                <Icon icon={Activity} size="xs" color="emerald" />
                                                                <Font variant="tiny" weight="black" color="emerald" uppercase tracking="widest">
                                                                    TRABALHO
                                                                </Font>
                                                            </Stack>
                                                            <Stack gap="element">
                                                                <Font variant="body-sm" weight="bold" color="PRIMARY" italic>
                                                                    {safeString(ex.sets, 'sets')} SÉRIES
                                                                </Font>
                                                                <Stack direction="row" gap="element" wrap="wrap">
                                                                    <Badge 
                                                                        label={`${safeString(ex.reps, 'reps')} REPS`} 
                                                                        variant="glass" 
                                                                        color="emerald" 
                                                                        size="xs" 
                                                                    />
                                                                    {ex.rest ? (
                                                                        <Badge 
                                                                            label={`DESCANSO: ${safeString(ex.rest)}S`} 
                                                                            variant="glass" 
                                                                            color="emerald" 
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
                                )
                            })}
                        </Stack>
                    </Surface>
                ))}

                {/* Cardios & Ergogenics */}
                {(cardios.length > 0 || ergogenics.length > 0) && (
                    <Grid cols={{ base: 1, lg: (cardios.length > 0 && ergogenics.length > 0) ? 2 : 1 }} gap="container">
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
                            />
                        )}
                    </Grid>
                )}
            </Stack>
        )
    }

    // DIET VIEW
    const diets = data.diets || data.meals || []
    const cardios = data.cardios || []
    const ergogenics = data.ergogenics || []
    const selectedDietDays = data.days_of_week || [0, 1, 2, 3, 4, 5, 6]

    return (
        <Stack gap="container" animateIn="slide-up">
            {/* Diet Day Selection */}
            <Box 
                bg="emerald" 
                bgOpacity={5} 
                border 
                borderColor="emerald" 
                borderOpacity={10} 
                padding={{ base: 'element', md: 'container' }} 
                rounded="system" 
                display="flex" 
                direction={{ base: 'col', md: 'row' }} 
                align={{ base: 'start', md: 'center' }} 
                justify="between" 
                gap={{ base: 'element', md: 'container' }}
                zIndex={20}
                position="relative"
            >
                <Stack gap="element">
                    <Stack direction="row" align="center" gap="element">
                        <Icon icon={Utensils} color="emerald" size="xs" />
                        <Font variant="tiny" weight="black" color="emerald" uppercase tracking="widest">
                            Frequência da Dieta
                        </Font>
                    </Stack>
                    <Font variant="sub-tiny" color="SECONDARY" weight="bold" uppercase tracking="wide">
                        Selecione os dias em que esta dieta deve ser seguida.
                    </Font>
                </Stack>
                <DaySelector 
                    selectedDays={selectedDietDays} 
                    onChange={(days) => onUpdateDietDays?.(days)}
                    color="emerald"
                />
            </Box>

            {diets.map((meal: any, idx: number) => {
                const mealData = meal.meals ? meal.meals : [meal]

                return mealData.map((m: Meal, mIdx: number) => {
                    const totalKcal = m.foods?.reduce((acc, f) => acc + (f.calories || 0), 0) || 0
                    const totalProt = m.foods?.reduce((acc, f) => acc + (f.protein || 0), 0) || 0
                    const totalCarbs = m.foods?.reduce((acc, f) => acc + (f.carbs || 0), 0) || 0
                    const totalFat = m.foods?.reduce((acc, f) => acc + (f.fat || 0), 0) || 0

                    return (
                        <Surface key={`${idx}-${mIdx}`} variant="glass" padding="none" zIndex={20} position="relative">
                            <Box 
                                padding="element" 
                                bg="white" 
                                bgOpacity={5} 
                                display="flex" 
                                direction={{ base: 'col', md: 'row' }} 
                                align={{ base: 'start', md: 'center' }} 
                                justify="between" 
                                gap="element"
                            >
                                <Stack direction="row" gap="element" align="center">
                                    <Icon icon={Utensils} color="emerald" size="sm" />
                                    <Font variant="body" weight="black" uppercase color="PRIMARY">
                                        {safeString(m.meal_name) || `REFEIÇÃO ${mIdx + 1}`}
                                    </Font>
                                </Stack>
                                <Box 
                                    bg="emerald" 
                                    bgOpacity={5} 
                                    border 
                                    borderColor="emerald" 
                                    borderOpacity={10} 
                                    padding="element" 
                                    rounded="system"
                                    display="flex"
                                    align="center"
                                    gap="element"
                                    wrap="wrap"
                                    width="auto"
                                >
                                    <Font variant="tiny" weight="black" color="emerald" uppercase tracking="widest">
                                        {Math.round(totalKcal)} KCAL
                                    </Font>
                                    <Font variant="tiny" color="DIM">•</Font>
                                    <Font variant="tiny" weight="black" color="emerald" uppercase tracking="widest">
                                        {Math.round(totalProt)}G P
                                    </Font>
                                    <Font variant="tiny" color="DIM">•</Font>
                                    <Font variant="tiny" weight="black" color="emerald" uppercase tracking="widest">
                                        {Math.round(totalCarbs)}G C
                                    </Font>
                                    <Font variant="tiny" color="DIM">•</Font>
                                    <Font variant="tiny" weight="black" color="emerald" uppercase tracking="widest">
                                        {Math.round(totalFat)}G F
                                    </Font>
                                </Box>
                            </Box>
                            <Separator opacity={5} />
                            <Box padding="element">
                                <Stack gap="element">
                                    {m.foods?.length > 0 ? (
                                        m.foods.map((food, fIdx) => (
                                            <Surface 
                                                key={fIdx} 
                                                variant="interactive"
                                                padding="element"
                                                bg="zinc"
                                                bgOpacity={5}
                                                border
                                                borderColor="zinc"
                                                borderOpacity={10}
                                                hoverBorder="emerald"
                                                group
                                                transition
                                            >
                                                <Box display="flex" direction={{ base: 'col', md: 'row' }} align={{ base: 'stretch', md: 'center' }} justify="between" gap="element">
                                                    <Stack gap="element" flex1>
                                                        <Font variant="body-sm" weight="bold" color="PRIMARY" uppercase lineClamp={1} transition>
                                                            {safeString(food.name)}
                                                        </Font>
                                                        <Font variant="tiny" weight="bold" color="SECONDARY" uppercase tracking="widest">
                                                            {safeString(food.quantity)}
                                                        </Font>
                                                    </Stack>
                                                    <Stack direction="row" gap={{ base: 'element', md: 'container' }} align="center" justify="between">
                                                        <Stack gap="element" align="center" justify="center" minWidth={35}>
                                                            <Font variant="tiny" weight="black" color="PRIMARY" uppercase tracking="widest">
                                                                {Math.round(food.protein || 0)}G
                                                            </Font>
                                                            <Font variant="tiny" weight="bold" color="DIM">
                                                                PROT
                                                            </Font>
                                                        </Stack>
                                                        <Stack gap="element" align="center" justify="center" minWidth={35}>
                                                            <Font variant="tiny" weight="black" color="PRIMARY" uppercase tracking="widest">
                                                                {Math.round(food.carbs || 0)}G
                                                            </Font>
                                                            <Font variant="tiny" weight="bold" color="DIM">
                                                                CARB
                                                            </Font>
                                                        </Stack>
                                                        <Stack gap="element" align="center" justify="center" minWidth={35}>
                                                            <Font variant="tiny" weight="black" color="PRIMARY" uppercase tracking="widest">
                                                                {Math.round(food.fat || 0)}G
                                                            </Font>
                                                            <Font variant="tiny" weight="bold" color="DIM">
                                                                FAT
                                                            </Font>
                                                        </Stack>
                                                    </Stack>
                                                </Box>
                                            </Surface>
                                        ))
                                    ) : (
                                        <Box 
                                            padding={{ base: 'element', md: 'container' }} 
                                            display="flex" 
                                            align="center" 
                                            justify="center" 
                                            border 
                                            borderWidth={1} 
                                            borderColor="zinc" 
                                            borderOpacity={10} 
                                            rounded="system"
                                        >
                                            <Font variant="tiny" weight="black" color="DIM" uppercase tracking="widest">
                                                Nenhum alimento detectado nesta refeição
                                            </Font>
                                        </Box>
                                    )}
                                </Stack>
                            </Box>
                        </Surface>
                    )
                })
            })}

            {/* Extras Section for Diets */}
            {(cardios.length > 0 || ergogenics.length > 0) && (
                <Grid cols={{ base: 1, lg: (cardios.length > 0 && ergogenics.length > 0) ? 2 : 1 }} gap="container">
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
                        />
                    )}
                </Grid>
            )}
        </Stack>
    )
}
