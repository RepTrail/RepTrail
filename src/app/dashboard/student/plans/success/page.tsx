import { CheckCircle, ArrowRight, Dumbbell } from 'lucide-react'
import Link from 'next/link'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { Box } from '@/components/store/base/box'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Button } from '@/components/store/base/button'
import { Icon } from '@/components/store/base/icon'
import { Surface } from '@/components/store/base/surface'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

export default async function StudentAutoTrainingSuccessPage() {
    return (
        <RegistryMain
            title="SUCESSO"
            subtitle="Confirmação de ativação do seu plano."
            icon="CheckCircle"
            showTabs={false}
        >
            <Box alignSelf="center" maxWidth="md" width="full" padding={STORE_TOKENS.PADDING.CONTAINER}>
                <Stack gap={STORE_TOKENS.SPACING.CONTAINER} align="center" textAlign="center">
                    <Box position="relative">
                        <Surface variant="glass" border="standard" padding={STORE_TOKENS.PADDING.CONTAINER} rounded="full">
                            <Icon icon={CheckCircle} size="3xl" color="emerald" />
                        </Surface>
                        <Box position="absolute" top={0} right={0} zIndex={10}>
                            <Surface variant="tonal-zinc" border="standard" padding={STORE_TOKENS.PADDING.ELEMENT} rounded="full">
                                <Icon icon={Dumbbell} size="sm" color="emerald" />
                            </Surface>
                        </Box>
                    </Box>

                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Font variant="heading" weight="black" uppercase italic>
                            Pagamento Confirmado!
                        </Font>
                        <Font variant="body" color={STORE_TOKENS.COLORS.TEXT.MUTED}>
                            Seu plano <Font color="emerald" weight="black" as="span">Auto-Training</Font> foi ativado.
                        </Font>
                    </Stack>

                    <Link href="/dashboard/student" passHref legacyBehavior>
                        <Button variant="primary" size="lg" icon={<Icon icon={ArrowRight} />}>
                            Ir para o Dashboard
                        </Button>
                    </Link>

                    <Font variant="auxiliary" color={STORE_TOKENS.COLORS.TEXT.MUTED}>
                        Se o acesso não liberar imediatamente, atualize a página em alguns segundos.
                    </Font>
                </Stack>
            </Box>
        </RegistryMain>
    )
}
