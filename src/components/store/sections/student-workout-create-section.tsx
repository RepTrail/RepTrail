import { actions } from '@/lib/dal/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/store/base/button'
import { Input } from '@/components/store/base/input'
import { Textarea } from '@/components/store/base/textarea'
import { Card, CardContent, CardHeader } from '@/components/store/base/surface'
import { Box } from '@/components/store/base/box'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

export function StudentWorkoutCreateSection() {
    return (
        <Box maxWidth="lg" alignSelf="center" width="full">
            <Card variant="base">
                <CardHeader>
                    <Font variant="heading" weight="bold">Novo Treino</Font>
                </CardHeader>
                <CardContent>
                    <form action={async (formData) => {
                        "use server";
                        const res = await actions.createStudentWorkout(formData);
                        if (res?.redirectUrl) {
                            redirect(res.redirectUrl);
                        }
                    }}>
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
    )
}
