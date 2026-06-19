'use client'

import React, { useState, useEffect } from 'react'
import { Modal } from './modal'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Surface } from '@/components/store/base/surface'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { BellRing, CheckCircle2 } from 'lucide-react'

export function StudentPushModal() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Wait a little bit after load to not overlap with PWA modal too aggressively
        const timer = setTimeout(() => {
            const dismissed = localStorage.getItem('push_prompt_dismissed')
            if (dismissed === 'true') return

            if (!('Notification' in window)) return

            if (Notification.permission === 'default') {
                setIsVisible(true)
            }
        }, 3000)

        return () => clearTimeout(timer)
    }, [])

    const handleClose = () => {
        setIsVisible(false)
        localStorage.setItem('push_prompt_dismissed', 'true')
    }

    const handleEnablePush = async () => {
        if (!('Notification' in window)) {
            handleClose()
            return
        }

        try {
            const permission = await Notification.requestPermission()
            if (permission === 'granted') {
                // Here we would normally subscribe to push manager and send token to backend
                console.log('Notification permission granted.')
            }
        } catch (error) {
            console.error('Error requesting notification permission:', error)
        }

        handleClose()
    }

    return (
        <Modal
            isOpen={isVisible}
            onClose={handleClose}
            title="ATIVAR NOTIFICAÇÕES"
            subtitle="FIQUE POR DENTRO DE TUDO"
            icon={BellRing}
            variant="emerald"
            confirmLabel="ATIVAR AGORA"
            confirmIcon={CheckCircle2}
            onConfirm={handleEnablePush}
        >
            <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Font
                    variant="description"
                    {...{
                        color: STORE_TOKENS.COLORS.TEXT.SECONDARY,
                    }}>
                    Queremos avisar você quando houver atualizações na sua dieta, novos treinos atribuídos pelo seu personal, ou lembretes importantes sobre seus resultados.
                </Font>

                <Surface variant="tonal-emerald" padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} border="none">
                    <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <BellRing className="w-5 h-5 text-emerald-500 shrink-0" />
                        <Font variant="sub-tiny" weight="bold" uppercase {...{ color: "emerald" }}>
                            Permita as notificações do navegador para receber nossos avisos em tempo real.
                        </Font>
                    </Stack>
                </Surface>
            </Stack>
        </Modal>
    )
}
