import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createStudentWorkout } from '@/actions/student-content-actions'
import { Button } from '@/components/store/base/button'
import { Input } from '@/components/store/base/input'
import { Textarea } from '@/components/store/base/textarea'
import { Card, CardContent, CardHeader } from '@/components/store/base/surface'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { Box } from '@/components/store/base/box'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

export default async function CreateStudentWorkoutPage() {
    const headerList = await headers()
    const userId = headerList.get('x-user-id')
    if (!userId) redirect('/auth/login')

    const supabase = await createClient()

    // Verify auto-training is active
    const { data: profile } = await supabase
        .from('profiles')
        .select('auto_training_status')
        .eq('id', userId)
        .single()

    const isAutoTrainingActive = profile?.auto_training_status === 'active' || profile?.auto_training_status === 'trial'
    if (!isAutoTrainingActive) redirect('/dashboard/student/workouts')

    return (
        <RegistryMain
            title="Criar Treino"
            subtitle="Crie um novo treino personalizado para o seu plano Auto-Training."
            icon="Dumbbell"
            showTabs={false}
            backPath="/dashboard/student/workouts"
        >
            <Box maxWidth="lg" alignSelf="center" width="full">
                <Card variant="base">
                    <CardHeader>
                        <Font variant="heading" weight="bold">Novo Treino</Font>
                    </CardHeader>
                    <CardContent>
                        <form action={createStudentWorkout}>
                            <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                                <Input
                                    label="Nome do Treino"
                                    name="name"
                                    placeholder="Ex: Treino A - Peito e Tríceps"
                                    required
                                />

                                <Textarea
                                    label="Descrição (opcional)"
                                    name="description"
                                    placeholder="Breve descrição do treino..."
                                    rows={3}
                                />

                                <Button type="submit" variant="primary" fullWidth>
                                    Criar Treino
                                </Button>
                            </Stack>
                        </form>
                    </CardContent>
                </Card>
            </Box>
        </RegistryMain>
    )
}
