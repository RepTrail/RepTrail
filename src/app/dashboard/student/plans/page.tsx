import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { CreditCard, Search, Check, Zap, ArrowRight, ShieldCheck, Trophy, Target } from 'lucide-react'
import { Button } from '@/components/store/base/button'
import Link from 'next/link'
import { CancelSubscriptionButton } from '@/components/store/advanced/cancel-subscription-button'
import { StudentPaymentButtons } from '@/components/store/advanced/student-payment-buttons'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { Box } from '@/components/store/base/box'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Grid } from '@/components/store/base/grid'
import { Surface } from '@/components/store/base/surface'
import { Icon } from '@/components/store/base/icon'
import { Separator } from '@/components/store/base/separator'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

export const dynamic = 'force-dynamic'

export default async function StudentPlansPage() {
    const headerList = await headers()
    const userId = headerList.get('x-user-id')
    if (!userId) redirect('/auth/login')

    const supabase = await createClient()

    const { data: profile } = await supabase
        .from('profiles')
        .select('auto_training_status, auto_training_trial_end, asaas_subscription_id')
        .eq('id', userId)
        .single()

    const now = new Date()
    let isActive = false;
    let isTrial = false;
    let isExpired = false;

    if (profile?.auto_training_status === 'active') {
        isActive = true;
    } else if (profile?.auto_training_status === 'trial' && profile.auto_training_trial_end) {
        if (now <= new Date(profile.auto_training_trial_end)) {
            isTrial = true;
            isActive = true;
        } else {
            isExpired = true;
        }
    } else if (profile?.auto_training_status === 'expired' || profile?.auto_training_status === 'disabled') {
        isExpired = true;
    }

    return (
        <RegistryMain
            title={isActive ? 'MEU PLANO' : 'PLANOS'}
            subtitle={isActive ? 'Treinamento de elite ativado. Continue sua evolução rumo ao topo.' : 'Escolha sua jornada e acesse ferramentas profissionais de treinamento.'}
            icon="CreditCard"
            showTabs={false}
        >
            <Box fullWidth padding={STORE_TOKENS.PADDING.CONTAINER}>
                <Stack gap={STORE_TOKENS.SPACING.SECTION} fullWidth>
                    {/* Grid containing the two main options */}
                    <Grid cols={1} mdCols={2} gap={STORE_TOKENS.SPACING.CONTAINER}>

                        {/* AUTO TRAINING PLAN - THE PREMIUM CARD */}
                        <Surface
                            variant={isActive ? "glass" : "tonal-zinc"}
                            border={isActive ? "emerald" : "standard"}
                            padding={STORE_TOKENS.PADDING.CONTAINER}
                            rounded={STORE_TOKENS.RADIUS.SYSTEM}
                        >
                            <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                                <Stack direction="row" align="center" justify="between">
                                    <Surface variant="glass" padding={STORE_TOKENS.PADDING.ELEMENT} rounded={STORE_TOKENS.RADIUS.SYSTEM} border="standard">
                                        <Icon icon={Zap} color={isActive ? STORE_TOKENS.COLORS.SUCCESS : STORE_TOKENS.COLORS.TEXT.SECONDARY} size="lg" />
                                    </Surface>
                                    <Box>
                                        {isActive ? (
                                            <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.SUCCESS} weight="black" uppercase tracking="widest">
                                                Plano Ativo
                                            </Font>
                                        ) : (
                                            <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.MUTED} weight="black" uppercase tracking="widest">
                                                Alta Performance
                                            </Font>
                                        )}
                                    </Box>
                                </Stack>

                                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                    <Font variant="heading" weight="black" uppercase italic>
                                        Auto Treino
                                    </Font>
                                    <Stack direction="row" align="baseline" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                        <Font variant="heading" weight="black" color={STORE_TOKENS.COLORS.WHITE}>
                                            R$ 10,90
                                        </Font>
                                        <Font variant="auxiliary" color={STORE_TOKENS.COLORS.TEXT.MUTED} uppercase tracking="widest">
                                            / mensal
                                        </Font>
                                    </Stack>
                                </Stack>

                                <Separator />

                                <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                                    <Font variant="auxiliary" color={STORE_TOKENS.COLORS.TEXT.MUTED} weight="black" uppercase tracking="widest">
                                        O que você ganha:
                                    </Font>
                                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                        {[
                                            'Importação IA de PDFs (Treino/Dieta)',
                                            'Player de Treino Profissional',
                                            'Gestão de Cardio & Ergogênicos',
                                            'Métricas de Performance Avançadas',
                                            'Personalização de Rotinas Solitárias'
                                        ].map((item, i) => (
                                            <Stack key={i} direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                                <Surface variant="tonal-zinc" padding={STORE_TOKENS.PADDING.NONE} rounded={STORE_TOKENS.RADIUS.FULL}>
                                                    <Icon icon={Check} color={STORE_TOKENS.COLORS.SUCCESS} size="xs" />
                                                </Surface>
                                                <Font variant="body" color={STORE_TOKENS.COLORS.TEXT.MUTED}>
                                                    {item}
                                                </Font>
                                            </Stack>
                                        ))}
                                    </Stack>
                                </Stack>

                                <Box>
                                    {isActive ? (
                                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                                            <Surface variant="glass" padding={STORE_TOKENS.PADDING.ELEMENT} rounded={STORE_TOKENS.RADIUS.SYSTEM} fullWidth textAlign="center">
                                                <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.SUCCESS} weight="black" uppercase tracking="widest">
                                                    Gestão de Cobrança
                                                </Font>
                                                <Font variant="auxiliary" color={STORE_TOKENS.COLORS.TEXT.MUTED} uppercase tracking="widest">
                                                    Status: Ativo via Asaas
                                                </Font>
                                            </Surface>
                                            <CancelSubscriptionButton />
                                        </Stack>
                                    ) : (
                                        <StudentPaymentButtons />
                                    )}
                                </Box>
                            </Stack>
                        </Surface>

                        {/* SEEK TRAINER OPTION - THE SECONDARY CARD */}
                        <Surface
                            variant="tonal-zinc"
                            border="standard"
                            padding={STORE_TOKENS.PADDING.CONTAINER}
                            rounded={STORE_TOKENS.RADIUS.SYSTEM}
                        >
                            <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                                <Stack direction="row" align="center" justify="between">
                                    <Surface variant="glass" padding={STORE_TOKENS.PADDING.ELEMENT} rounded={STORE_TOKENS.RADIUS.SYSTEM} border="standard">
                                        <Icon icon={Search} color={STORE_TOKENS.COLORS.BRAND} size="lg" />
                                    </Surface>
                                    <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.BRAND} weight="black" uppercase tracking="widest">
                                        Consultoria Especializada
                                    </Font>
                                </Stack>

                                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                    <Font variant="heading" weight="black" uppercase italic>
                                        Com Personal
                                    </Font>
                                    <Stack direction="row" align="baseline" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                        <Font variant="heading" weight="black" color={STORE_TOKENS.COLORS.WHITE}>
                                            Gratuito
                                        </Font>
                                        <Font variant="auxiliary" color={STORE_TOKENS.COLORS.TEXT.MUTED} uppercase tracking="widest">
                                            Acesso ao App
                                        </Font>
                                    </Stack>
                                </Stack>

                                <Separator />

                                <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                                    <Font variant="auxiliary" color={STORE_TOKENS.COLORS.TEXT.MUTED} weight="black" uppercase tracking="widest">
                                        Como funciona:
                                    </Font>
                                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                        {[
                                            'Acesso Gratuito à Plataforma',
                                            'Busca por Treinadores de Elite',
                                            'Receba Treinos & Dietas Direto do App',
                                            'Chat & Suporte Individual (Opcional)',
                                            'Gestão Profissional do seu Personal'
                                        ].map((item, i) => (
                                            <Stack key={i} direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                                <Surface variant="tonal-zinc" padding={STORE_TOKENS.PADDING.NONE} rounded={STORE_TOKENS.RADIUS.FULL}>
                                                    <Icon icon={Trophy} color={STORE_TOKENS.COLORS.BRAND} size="xs" />
                                                </Surface>
                                                <Font variant="body" color={STORE_TOKENS.COLORS.TEXT.MUTED}>
                                                    {item}
                                                </Font>
                                            </Stack>
                                        ))}
                                    </Stack>
                                </Stack>

                                <Link href="/buscar-personal" passHref legacyBehavior>
                                    <Button variant="outline" size="lg" fullWidth icon={<Icon icon={ArrowRight} />}>
                                        Buscar Personal
                                    </Button>
                                </Link>
                            </Stack>
                        </Surface>
                    </Grid>

                    {/* Footer Trust Section */}
                    <Separator />
                    <Grid cols={1} mdCols={3} gap={STORE_TOKENS.SPACING.CONTAINER}>

                        {/* Trust Item 1 */}
                        <Surface variant="glass" padding={STORE_TOKENS.PADDING.ELEMENT} rounded={STORE_TOKENS.RADIUS.SYSTEM} border="standard">
                            <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Surface variant="tonal-zinc" padding={STORE_TOKENS.PADDING.ELEMENT} rounded={STORE_TOKENS.RADIUS.SYSTEM}>
                                    <Icon icon={ShieldCheck} color={STORE_TOKENS.COLORS.SUCCESS} />
                                </Surface>
                                <Stack gap={STORE_TOKENS.SPACING.NONE}>
                                    <Font variant="sub-tiny" weight="black" color={STORE_TOKENS.COLORS.WHITE} uppercase tracking="widest">
                                        Pagamento Seguro
                                    </Font>
                                    <Font variant="auxiliary" color={STORE_TOKENS.COLORS.TEXT.MUTED} uppercase tracking="widest">
                                        Criptografia Ponta a Ponta
                                    </Font>
                                </Stack>
                            </Stack>
                        </Surface>

                        {/* Trust Item 2 */}
                        <Surface variant="glass" padding={STORE_TOKENS.PADDING.ELEMENT} rounded={STORE_TOKENS.RADIUS.SYSTEM} border="standard">
                            <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Surface variant="tonal-zinc" padding={STORE_TOKENS.PADDING.ELEMENT} rounded={STORE_TOKENS.RADIUS.SYSTEM}>
                                    <Icon icon={CreditCard} color={STORE_TOKENS.COLORS.BRAND} />
                                </Surface>
                                <Stack gap={STORE_TOKENS.SPACING.NONE}>
                                    <Font variant="sub-tiny" weight="black" color={STORE_TOKENS.COLORS.WHITE} uppercase tracking="widest">
                                        Sem Fidelidade
                                    </Font>
                                    <Font variant="auxiliary" color={STORE_TOKENS.COLORS.TEXT.MUTED} uppercase tracking="widest">
                                        Cancele quando quiser
                                    </Font>
                                </Stack>
                            </Stack>
                        </Surface>

                        {/* Trust Item 3 */}
                        <Surface variant="glass" padding={STORE_TOKENS.PADDING.ELEMENT} rounded={STORE_TOKENS.RADIUS.SYSTEM} border="standard">
                            <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Surface variant="tonal-zinc" padding={STORE_TOKENS.PADDING.ELEMENT} rounded={STORE_TOKENS.RADIUS.SYSTEM}>
                                    <Icon icon={Target} color={STORE_TOKENS.COLORS.WARNING} />
                                </Surface>
                                <Stack gap={STORE_TOKENS.SPACING.NONE}>
                                    <Font variant="sub-tiny" weight="black" color={STORE_TOKENS.COLORS.WHITE} uppercase tracking="widest">
                                        Zero Taxas extras
                                    </Font>
                                    <Font variant="auxiliary" color={STORE_TOKENS.COLORS.TEXT.MUTED} uppercase tracking="widest">
                                        Valor fixo garantido
                                    </Font>
                                </Stack>
                            </Stack>
                        </Surface>

                    </Grid>
                </Stack>
            </Box>
        </RegistryMain>
    );
}
