'use client'

import React from 'react'
import { Surface } from '@/components/store/base/surface'
import { Inline } from '@/components/store/base/layout'
import { Stack } from '@/components/store/base/stack'
import { Box } from '@/components/store/base/box'
import { Badge } from '@/components/store/base/badge'
import { Font } from '@/components/store/base/font'
import { Button } from '@/components/store/base/button'
import { Icon } from '@/components/store/base/icon'
import { AlertCircle, Send } from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface PlaceholderStudentAccessBannerProps {
    relationship: any
}

export function PlaceholderStudentAccessBanner({ relationship }: PlaceholderStudentAccessBannerProps) {
    if (!relationship.is_placeholder) return null

    const student = relationship.student || {}

    const handleSendWhatsapp = () => {
        const message = `Olá ${student?.full_name || 'Aluno'}! Seu perfil no RepTrail foi criado e seus protocolos já estão disponíveis.\n\nPara acessar, baixe o aplicativo e faça o cadastro utilizando este exato email: *${student.email}*\n\nBons treinos!`
        
        if (student.whatsapp) {
            const whatsappNumber = student.whatsapp.replace(/\D/g, '')
            window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank')
        } else {
            // Se não tem número cadastrado, abre o WhatsApp para escolher o contato manualmente
            window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')
        }
    }

    return (
        <Box position="relative" fullWidth style={{ marginBottom: '50px' }}>
            <Surface
                variant="tonal-orange"
                rounded={STORE_TOKENS.RADIUS.SYSTEM}
                padding={STORE_TOKENS.PADDING.CONTAINER}
            >
                <Stack direction={{ base: 'col', md: 'row' }} justify="between" align={{ base: 'stretch', md: 'center' }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Stack direction={{ base: 'col', md: 'row' }} gap={STORE_TOKENS.SPACING.CONTAINER} align={{ base: 'center', md: 'center' }} justify={{ base: 'center', md: 'start' }}>
                        <Badge
                            label="Aguardando Cadastro"
                            icon={AlertCircle}
                            variant="glass"
                            color="orange"
                            rounded={STORE_TOKENS.RADIUS.FULL}
                        />
                        <Box>
                            <Font
                                variant="sub-tiny"
                                weight="bold"
                                align={{ base: 'center', md: 'left' }}
                                {...{
                                    color: STORE_TOKENS.COLORS.TEXT.SECONDARY,
                                }}>
                                Para que o aluno acesse a plataforma, ele precisa baixar o app e cadastrar usando o e-mail <strong style={{ color: STORE_TOKENS.COLORS.TEXT.PRIMARY }}>{student.email}</strong>. Envie as instruções agora.
                            </Font>
                        </Box>
                    </Stack>

                    <Button 
                        id="tour-whatsapp-access"
                        variant="outline-orange" 
                        size="sm" 
                        rounded={STORE_TOKENS.RADIUS.FULL}
                        fullWidth={{ base: true, md: false }}
                        onClick={handleSendWhatsapp}
                    >
                        <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                            <Icon icon={Send} size="xs" color="orange" />
                            <Font
                                variant="label-caps"
                                {...{
                                    color: STORE_TOKENS.COLORS.TEXT.PRIMARY,
                                }}>Enviar Acesso</Font>
                        </Inline>
                    </Button>
                </Stack>
            </Surface>
        </Box>
    )
}
