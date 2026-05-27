'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Grid } from '@/components/store/base/grid'
import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { Input } from '@/components/store/base/input'
import { Textarea } from '@/components/store/base/textarea'
import { Button } from '@/components/store/base/button'
import { Surface } from '@/components/store/base/surface'
import { Icon } from '@/components/store/base/icon'
import {
    User,
    MapPin,
    Save,
    Phone,
    Instagram,
    Award,
    Hash,
    Tags,
} from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { ENTITIES } from '@/lib/outbox-db'
import { QUERY_KEYS } from '@/lib/query-keys'
import { useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'

interface TrainerProfileFormProps {
    profile: any
    userId: string
}

export function TrainerProfileForm({ profile, userId }: TrainerProfileFormProps) {
    const queryClient = useQueryClient()
    const { toast } = useToast()

    const queryKey = QUERY_KEYS.trainer.profile(userId)

    const { mutate, isPending } = useOptimisticMutation({
        actionName: 'update-trainer-profile',
        entity: ENTITIES.TRAINER_DETAIL,
        entityId: profile?.id || 'me',
        queryKey,
        mutationFn: async (variables: { formData: FormData; obj: any }) => variables,
        onMutate: (variables) => {
            const previous = queryClient.getQueryData(queryKey)
            queryClient.setQueryData(queryKey, (old: any) => ({
                ...old,
                ...variables.obj,
                _optimistic: true,
            }))
            return { previous }
        },
        onSuccess: () => {
            toast({ title: 'Perfil atualizado!', description: 'Suas informações foram salvas.' })
        },
        onError: (_err, _variables, ctx) => {
            queryClient.setQueryData(queryKey, ctx?.previous)
            toast({ variant: 'destructive', title: 'Erro', description: 'Ocorreu uma falha ao sincronizar.' })
        },
    })

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const obj = {
            full_name: formData.get('full_name') as string,
            whatsapp: formData.get('whatsapp') as string,
            instagram: formData.get('instagram') as string,
            cref: formData.get('cref') as string,
            location: formData.get('location') as string,
            specialties: (formData.get('specialties') as string)?.split(',').map((s) => s.trim()).filter(Boolean),
            bio: formData.get('bio') as string,
        }
        mutate({ formData, obj })
    }

    return (
        <Surface variant="glass" padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} border="none">
            <form onSubmit={handleSubmit}>
                <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Grid mdCols={2} gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <Input
                            label="Nome Profissional"
                            icon={<User size={16} />}
                            name="full_name"
                            defaultValue={profile?.full_name || ''}
                            placeholder="Ex: Marcos Personal"
                            required
                        />
                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Input
                                label="Seu Código de Acesso (Fixo)"
                                icon={<Hash size={16} />}
                                name="trainer_code"
                                defaultValue={profile?.trainer_code || ''}
                                readOnly
                                fontMono
                            />
                            <Font
                                variant="tiny"
                                weight="bold"
                                uppercase
                                {...{
                                    color: STORE_TOKENS.COLORS.TEXT.DIM,
                                }}>
                                O código é único e permanente.
                            </Font>
                        </Stack>
                        <Input
                            label="WhatsApp (c/ DDD)"
                            icon={<Phone size={16} />}
                            name="whatsapp"
                            defaultValue={profile?.whatsapp || ''}
                            placeholder="55 11 99999-9999"
                        />
                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Input
                                label="Instagram (Opcional)"
                                icon={<Instagram size={16} />}
                                name="instagram"
                                defaultValue={profile?.instagram || ''}
                                placeholder="@seuinstagram"
                            />
                            <Font
                                variant="tiny"
                                weight="bold"
                                uppercase
                                {...{
                                    color: STORE_TOKENS.COLORS.TEXT.DIM,
                                }}>
                                Seu perfil será exibido na sua landing page.
                            </Font>
                        </Stack>
                        <Input
                            label="CREF (Opcional)"
                            icon={<Award size={16} />}
                            name="cref"
                            defaultValue={profile?.cref || ''}
                            placeholder="Ex: 123456-G/SP"
                        />
                        <Input
                            label="Local de Atuação"
                            icon={<MapPin size={16} />}
                            name="location"
                            defaultValue={profile?.location || ''}
                            placeholder="Ex: Curitiba / Online"
                        />
                        <Box mdColSpan={2}>
                            <Input
                                label="Especialidades (separadas por vírgula)"
                                icon={<Tags size={16} />}
                                name="specialties"
                                defaultValue={profile?.specialties?.join(', ') || ''}
                                placeholder="Ex: Hipertrofia, Emagrecimento, Funcional"
                            />
                        </Box>
                        <Box mdColSpan={2}>
                            <Textarea
                                label="Sobre Você (Bio)"
                                name="bio"
                                defaultValue={profile?.bio || ''}
                                placeholder="Conte um pouco sobre sua metodologia e experiência..."
                            />
                        </Box>
                    </Grid>

                    <Box height="px" bg={STORE_TOKENS.COLORS.WHITE} bgOpacity={STORE_TOKENS.OPACITY.LOW} fullWidth />

                    <Stack
                        direction={{ base: 'col', md: 'row' }}
                        align="center"
                        justify="between"
                        gap={STORE_TOKENS.SPACING.CONTAINER}
                    >
                        <Box flex1>
                            <Font
                                variant="sub-tiny"
                                weight="bold"
                                uppercase
                                tracking="tight"
                                {...{
                                    color: STORE_TOKENS.COLORS.TEXT.MUTED,
                                }}>
                                Após salvar, suas informações ficam visíveis para alunos e no convite.
                            </Font>
                        </Box>
                        <Button
                            type="submit"
                            variant="outline-emerald"
                            size="lg"
                            fullWidth={{ base: true, md: false }}
                            disabled={isPending}
                        >
                            <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Font variant="body-sm" weight="black" uppercase italic>
                                    {isPending ? 'Salvando...' : 'Salvar Alterações do Perfil'}
                                </Font>
                                <Icon icon={Save} size="xs" />
                            </Stack>
                        </Button>
                    </Stack>
                </Stack>
            </form>
        </Surface>
    );
}
