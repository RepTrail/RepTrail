import { createClient } from '@/lib/supabase/server'
import { Utensils, CheckCircle } from 'lucide-react'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { Box } from '@/components/store/base/box'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Surface } from '@/components/store/base/surface'
import { Icon } from '@/components/store/base/icon'
import { Button } from '@/components/store/base/button'
import { Separator } from '@/components/store/base/separator'
import { FormCheckbox } from '@/components/store/base/form-checkbox'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

export default async function StudentDietPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // 1. Get Assigned Diet
    const { data: assignment } = await supabase
        .from('assigned_diets')
        .select('diet_id')
        .eq('student_id', user?.id)
        .eq('active', true)
        .single()

    let diet = null
    let meals = []

    if (assignment) {
        const { data: dietData } = await supabase
            .from('diets')
            .select('*')
            .eq('id', assignment.diet_id)
            .single()

        if (dietData) {
            diet = dietData
            const { data: m } = await supabase
                .from('meals')
                .select(`
                    *,
                    items:meal_items(*)
                `)
                .eq('diet_id', diet.id)
                .order('order_index', { ascending: true })
            meals = m || []
        }
    }

    // Mock data if no diet found for demo purposes
    if (!diet) {
        diet = { name: "Dieta Exemplo (Demo)" }
        meals = [
            {
                id: 'm1',
                name: 'Café da Manhã',
                time_of_day: '08:00',
                items: [
                    { id: 'i1', food_name: 'Ovos Mexidos', quantity: '3 un', approx_measure: '3 ovos grandes' },
                    { id: 'i2', food_name: 'Pão Integral', quantity: '2 fatias', approx_measure: '50g' }
                ]
            },
            {
                id: 'm2',
                name: 'Almoço',
                time_of_day: '12:00',
                items: [
                    { id: 'i3', food_name: 'Frango Grelhado', quantity: '150g', approx_measure: '1 filé grande (palma da mão)' },
                    { id: 'i4', food_name: 'Arroz Branco', quantity: '100g', approx_measure: '4 colheres de sopa cheias' },
                    { id: 'i5', food_name: 'Feijão', quantity: '1 concha', approx_measure: '140g' }
                ]
            }
        ]
    }

    // Calculate Progress (Mocked for now)
    const progress = 33 // 1/3 meals checked

    return (
        <RegistryMain
            title="MINHA DIETA"
            subtitle={diet?.name || 'Dieta do Aluno'}
            icon="Utensils"
            showTabs={false}
        >
            <Box fullWidth padding={STORE_TOKENS.PADDING.CONTAINER}>
                <Stack gap={STORE_TOKENS.SPACING.CONTAINER} fullWidth>

                    {/* Daily Progress Tracker Section */}
                    <Surface
                        variant="glass"
                        padding={STORE_TOKENS.PADDING.CONTAINER}
                        rounded={STORE_TOKENS.RADIUS.SYSTEM}
                    >
                        <Stack direction={{ base: 'row', md: 'col' }} align="center" justify="between" gap={STORE_TOKENS.SPACING.CONTAINER} fullWidth>
                            <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Font variant="heading" weight="black" uppercase italic>
                                    Progresso Diário
                                </Font>
                                <Font variant="description">
                                    Acompanhe a ingestão das refeições prescritas pelo seu treinador.
                                </Font>
                            </Stack>
                            <Stack align="end" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.SUCCESS} weight="black" uppercase tracking="widest">
                                    {progress}% Concluído
                                </Font>
                                <Box 
                                    {...{ width: 128, height: 8 }} 
                                    bg={STORE_TOKENS.COLORS.BACKGROUND} 
                                    bgOpacity={STORE_TOKENS.OPACITY.SHELF} 
                                    rounded={STORE_TOKENS.RADIUS.FULL} 
                                    overflow="hidden"
                                >
                                    <Box bg={STORE_TOKENS.COLORS.SUCCESS} fullHeight rounded={STORE_TOKENS.RADIUS.FULL} style={{ width: `${progress}%` }} />
                                </Box>
                            </Stack>
                        </Stack>
                    </Surface>

                    {/* Meals List */}
                    <Stack gap={STORE_TOKENS.SPACING.CONTAINER} fullWidth>
                        {meals.map((meal: any) => (
                            <Surface
                                key={meal.id}
                                variant="tonal-zinc"
                                padding={STORE_TOKENS.PADDING.CONTAINER}
                                rounded={STORE_TOKENS.RADIUS.SYSTEM}
                            >
                                <Stack gap={STORE_TOKENS.SPACING.CONTAINER} fullWidth>

                                    {/* Meal Header */}
                                    <Stack direction="row" align="center" justify="between" fullWidth>
                                        <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                            <Icon icon={Utensils} color={STORE_TOKENS.COLORS.BRAND} size="md" />
                                            <Font variant="heading" weight="black" uppercase italic>
                                                {meal.name}
                                            </Font>
                                        </Stack>
                                        {meal.time_of_day && (
                                            <Surface variant="glass" padding={STORE_TOKENS.PADDING.ELEMENT} rounded={STORE_TOKENS.RADIUS.SYSTEM}>
                                                <Font variant="auxiliary" color={STORE_TOKENS.COLORS.BRAND} weight="black" tracking="widest">
                                                    {meal.time_of_day.slice(0, 5)}
                                                </Font>
                                            </Surface>
                                        )}
                                    </Stack>

                                    <Separator />

                                    {/* Meal Items */}
                                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth>
                                        {meal.items?.map((item: any) => (
                                            <Surface
                                                key={item.id}
                                                variant="glass"
                                                padding={STORE_TOKENS.PADDING.ELEMENT}
                                                rounded={STORE_TOKENS.RADIUS.SYSTEM}
                                            >
                                                <Stack direction={{ base: 'row', md: 'col' }} align={{ base: 'center', md: 'start' }} justify="between" gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth>
                                                    <FormCheckbox
                                                        label={item.food_name}
                                                        color={STORE_TOKENS.COLORS.SUCCESS}
                                                    />
                                                    <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                                        <Font variant="body" color={STORE_TOKENS.COLORS.TEXT.SECONDARY}>
                                                            {item.quantity}
                                                        </Font>
                                                        {item.approx_measure && (
                                                            <Surface variant="glass" padding={STORE_TOKENS.PADDING.NONE} rounded={STORE_TOKENS.RADIUS.SYSTEM}>
                                                                <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.BRAND} weight="black" uppercase tracking="wider">
                                                                    Medida: {item.approx_measure}
                                                                </Font>
                                                            </Surface>
                                                        )}
                                                    </Stack>
                                                </Stack>
                                            </Surface>
                                        ))}
                                    </Stack>

                                    <Separator />

                                    {/* Action Trigger */}
                                    <Stack justify="end" direction="row" fullWidth>
                                        <Button variant="outline-emerald" size="sm" shine>
                                            <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                                <Icon icon={CheckCircle} size="xs" />
                                                <Font variant="sub-tiny" weight="black" uppercase tracking="wider">
                                                    Marcar Refeição Completa
                                                </Font>
                                            </Stack>
                                        </Button>
                                    </Stack>

                                </Stack>
                            </Surface>
                        ))}
                    </Stack>

                </Stack>
            </Box>
        </RegistryMain>
    )
}
