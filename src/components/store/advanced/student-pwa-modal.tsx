'use client'

import React, { useState, useEffect } from 'react'
import { Modal } from './modal'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Surface } from '@/components/store/base/surface'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { Download, Share, PlusSquare, MonitorSmartphone } from 'lucide-react'

export function StudentPWAModal() {
    const [isVisible, setIsVisible] = useState(false)
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
    const [isIOS, setIsIOS] = useState(false)

    useEffect(() => {
        // Only run on the client
        const dismissed = localStorage.getItem('pwa_prompt_dismissed')
        if (dismissed === 'true') return

        const userAgent = window.navigator.userAgent.toLowerCase()
        const isIOSDevice = /iphone|ipad|ipod/.test(userAgent)
        
        // PWA is already installed check
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true

        if (isStandalone) return

        if (isIOSDevice) {
            setIsIOS(true)
            setIsVisible(true)
        }

        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault()
            setDeferredPrompt(e)
            setIsVisible(true)
        }

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

        return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }, [])

    const handleClose = () => {
        setIsVisible(false)
        localStorage.setItem('pwa_prompt_dismissed', 'true')
    }

    const handleInstall = async () => {
        if (isIOS) {
            handleClose()
            return
        }

        if (deferredPrompt) {
            deferredPrompt.prompt()
            const { outcome } = await deferredPrompt.userChoice
            if (outcome === 'accepted') {
                console.log('User accepted the install prompt')
            } else {
                console.log('User dismissed the install prompt')
            }
            setDeferredPrompt(null)
            handleClose()
        } else {
            handleClose()
        }
    }

    return (
        <Modal
            isOpen={isVisible}
            onClose={handleClose}
            title="INSTALAR APLICATIVO"
            subtitle="EXPERIÊNCIA COMPLETA REPTRAIL"
            icon={MonitorSmartphone}
            variant="emerald"
            confirmLabel={isIOS ? "ENTENDI" : "INSTALAR AGORA"}
            confirmIcon={isIOS ? undefined : Download}
            onConfirm={handleInstall}
        >
            <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Font
                    variant="description"
                    {...{
                        color: STORE_TOKENS.COLORS.TEXT.SECONDARY,
                    }}>
                    Para uma melhor experiência, acesso mais rápido aos seus treinos e recebimento de notificações, instale o RepTrail no seu dispositivo.
                </Font>

                {isIOS ? (
                    <Surface variant="tonal-emerald" padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} border="none">
                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Font variant="sub-tiny" weight="bold" uppercase {...{ color: "emerald" }}>
                                COMO INSTALAR NO IPHONE / IPAD:
                            </Font>
                            <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Share className="w-5 h-5 text-emerald-500 shrink-0" />
                                <Font variant="sub-tiny" {...{ color: "emerald" }}>
                                    1. Toque no ícone de <b>Compartilhar</b> na barra inferior do Safari.
                                </Font>
                            </Stack>
                            <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <PlusSquare className="w-5 h-5 text-emerald-500 shrink-0" />
                                <Font variant="sub-tiny" {...{ color: "emerald" }}>
                                    2. Selecione a opção <b>"Adicionar à Tela de Início"</b>.
                                </Font>
                            </Stack>
                        </Stack>
                    </Surface>
                ) : (
                    <Surface variant="tonal-emerald" padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} border="none">
                        <Font variant="sub-tiny" weight="bold" uppercase {...{ color: "emerald" }}>
                            Basta clicar no botão abaixo para adicionar o aplicativo diretamente à tela inicial do seu aparelho.
                        </Font>
                    </Surface>
                )}
            </Stack>
        </Modal>
    )
}
