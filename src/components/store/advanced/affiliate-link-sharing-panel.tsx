'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Button } from '@/components/store/base/button'
import { Inline } from '@/components/store/base/layout'
import { Icon } from '@/components/store/base/icon'
import { Input } from '@/components/store/base/input'
import { Surface } from '@/components/store/base/surface'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { useRegistry } from '@/components/store/advanced/registry-context'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { Link as LinkIcon, Copy } from 'lucide-react'

export function AffiliateLinkSharingPanel({ id }: { id?: string }) {
    const { primaryColor } = useRegistry()

    return (
        <RegistrySection
            id={id}
            title="Marketing de Afiliados"
            icon={LinkIcon}
            subtitle="Compartilhe seu link exclusivo e ganhe comissões recorrentes sobre cada novo personal ou aluno indicado."
        >
            <Surface variant="glass" padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM}>
                <Stack gap={STORE_TOKENS.SPACING.CONTAINER} width="full">
                    <Inline justify="between" align="end" wrap gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT} flex1 width="full" minWidth={0}>
                            <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="end" fullWidth>
                                <Input
                                    label="Seu Link de Afiliado"
                                    value="https://reptrail.com.br/?ref=5w6loo6iks"
                                    readOnly
                                    icon={<Icon icon={LinkIcon} size="xs" color={primaryColor as any} />}
                                    flex1
                                    color={STORE_TOKENS.COLORS.BRAND}
                                    weight="black"
                                    fontMono
                                />

                                <Button
                                    variant="outline-primary"
                                    isIconOnly
                                    rounded={STORE_TOKENS.RADIUS.SYSTEM}
                                    height="12"
                                    width="12"
                                    shrink={0}
                                    onClick={() => {
                                        navigator.clipboard.writeText('https://reptrail.com.br/?ref=5w6loo6iks')
                                    }}
                                >
                                    <Icon icon={Copy} size="sm" />
                                </Button>
                            </Inline>

                            <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.DIM} italic>
                                Cookie persistido por 30 dias • Token oculto ao usuário • Conversões automáticas
                            </Font>
                        </Stack>

                        <Stack gap={0} align="end" display={{ base: 'none', md: 'flex' }} padding={STORE_TOKENS.PADDING.ELEMENT}>
                            <Font variant="h1" color={STORE_TOKENS.COLORS.TEXT.PRIMARY} weight="black" italic uppercase>10%</Font>
                            <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.MUTED} weight="black" uppercase italic tracking="widest">De Comissão</Font>
                        </Stack>
                    </Inline>
                </Stack>
            </Surface>
        </RegistrySection>
    )
}
