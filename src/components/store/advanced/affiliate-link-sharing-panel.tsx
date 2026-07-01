'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Button } from '@/components/store/base/button'
import { Inline } from '@/components/store/base/layout'
import { Icon } from '@/components/store/base/icon'
import { Input } from '@/components/store/base/input'
import { Surface } from '@/components/store/base/surface'

import { useRegistry } from '@/components/store/base/registry-context'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { Link as LinkIcon, Copy } from 'lucide-react'

export function AffiliateLinkSharingPanel({ id }: { id?: string }) {
    const { primaryColor } = useRegistry()

    return (
        <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT} fullWidth>
            <Stack direction={{ base: 'col', lg: 'row' }} justify="between" align={{ base: 'stretch', lg: 'end' }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                        <Icon icon={LinkIcon} color={STORE_TOKENS.COLORS.BRAND as any} size="lg" />
                        <Font variant="heading" weight="black" uppercase italic color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>{"Marketing de Afiliados"}</Font>
                    </Inline>
                    <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.MUTED}>{"Compartilhe seu link exclusivo e ganhe comissões recorrentes sobre cada novo personal ou aluno indicado."}</Font>
                </Stack>
            </Stack>
            <Stack gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth>
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
                                    size="lg"
                                    rounded={STORE_TOKENS.RADIUS.SYSTEM}
                                    onClick={() => {
                                        navigator.clipboard.writeText('https://reptrail.com.br/?ref=5w6loo6iks')
                                    }}
                                    iconLeft={Copy} />
                            </Inline>

                            <Font
                                variant="sub-tiny"
                                italic
                                {...{
                                    color: STORE_TOKENS.COLORS.TEXT.DIM,
                                }}>
                                Cookie persistido por 30 dias • Token oculto ao usuário • Conversões automáticas
                            </Font>
                        </Stack>

                        <Stack gap={STORE_TOKENS.SPACING.NONE} align="end" display={{ base: 'none', md: 'flex' }} padding={STORE_TOKENS.PADDING.ELEMENT}>
                            <Font
                                variant="h1"
                                weight="black"
                                italic
                                uppercase
                                {...{
                                    color: STORE_TOKENS.COLORS.TEXT.PRIMARY,
                                }}>10%</Font>
                            <Font
                                variant="sub-tiny"
                                weight="black"
                                uppercase
                                italic
                                tracking="widest"
                                {...{
                                    color: STORE_TOKENS.COLORS.TEXT.MUTED,
                                }}>De Comissão</Font>
                        </Stack>
                    </Inline>
                </Stack>
            </Surface>
          </Stack>
        </Stack>
    );
}
