'use client'

import React, { useState } from 'react'
import { Modal } from '@/components/store/advanced/modal'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { Button } from '@/components/store/base/button'
import { FormSwitch } from '@/components/store/base/form-switch'
import { Surface } from '@/components/store/base/surface'
import { Box } from '@/components/store/base/box'
import { 
    Settings, 
    Smartphone, 
    Bell, 
    Trash2, 
    Zap, 
    Clock, 
    XCircle,
    Download,
    ShieldAlert,
    CheckCircle
} from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface StudentSettingsModalProps {
    isOpen: boolean
    onClose: () => void
    autoTreinoStatus: 'available' | 'active' | 'used'
    trialDaysLeft?: number
}

export function StudentSettingsModal({
    isOpen,
    onClose,
    autoTreinoStatus,
    trialDaysLeft = 7
}: StudentSettingsModalProps) {
    const [pwaInstalled, setPwaInstalled] = useState(false)
    const [notifications, setNotifications] = useState('off')

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="CONFIGURAÇÕES DO SISTEMA"
            subtitle="Gerencie suas preferências e recursos premium."
            icon={Settings}
            variant="primary"
            confirmLabel="SALVAR PREFERÊNCIAS"
            onConfirm={onClose}
        >
            <Stack gap={STORE_TOKENS.SPACING.EMPTY_STATE}>
                
                {/* PWA Section */}
                <Surface variant="tonal-blue" padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} border="none">
                    <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <Box bg="blue" bgOpacity={20} padding={STORE_TOKENS.PADDING.ELEMENT} rounded="full">
                            <Icon icon={Smartphone} color="blue" size="md" />
                        </Box>
                        <Stack flex1 gap={0}>
                            <Font variant="body" weight="black" uppercase italic color="blue">APLICATIVO REPTRAIL</Font>
                            <Font variant="sub-tiny" weight="bold" color="blue" opacity={70}>INSTALE PARA ACESSO RÁPIDO E OFFLINE</Font>
                        </Stack>
                        <Button 
                            variant="outline-blue" 
                            size="sm" 
                            onClick={() => setPwaInstalled(true)}
                            disabled={pwaInstalled}
                        >
                            {pwaInstalled ? 'INSTALADO' : (
                                <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                    <Icon icon={Download} size="xs" />
                                    <Font variant="body-sm" weight="black" uppercase italic>INSTALAR</Font>
                                </Stack>
                            )}
                        </Button>
                    </Stack>
                </Surface>

                {/* Notifications Section */}
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Icon icon={Bell} size="xs" color={STORE_TOKENS.COLORS.TEXT.MUTED} />
                        <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.MUTED} weight="black" uppercase tracking="widest">
                            NOTIFICAÇÕES PUSH
                        </Font>
                    </Stack>
                    <FormSwitch 
                        options={[
                            { label: 'DESATIVADO', value: 'off' },
                            { label: 'ATIVADO', value: 'on' }
                        ]}
                        value={notifications}
                        onChange={setNotifications}
                        color="primary"
                    />
                </Stack>

                {/* Auto-Treino Status Section */}
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Icon icon={Zap} size="xs" color={STORE_TOKENS.COLORS.TEXT.MUTED} />
                        <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.MUTED} weight="black" uppercase tracking="widest">
                            RECURSOS AUTO-TREINO
                        </Font>
                    </Stack>

                    {autoTreinoStatus === 'available' && (
                        <Surface variant="glass" padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} border="standard">
                            <Stack direction="row" align="center" justify="between" fullWidth>
                                <Stack gap={0}>
                                    <Font variant="body-sm" weight="black" color={STORE_TOKENS.COLORS.TEXT.PRIMARY} uppercase italic>TESTE GRÁTIS DISPONÍVEL</Font>
                                    <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.MUTED}>EXPERIMENTE POR 7 DIAS SEM CUSTOS</Font>
                                </Stack>
                                <Button variant="outline-emerald" size="sm">
                                    <Font variant="body-sm" weight="black" uppercase italic>HABILITAR</Font>
                                </Button>
                            </Stack>
                        </Surface>
                    )}

                    {autoTreinoStatus === 'active' && (
                        <Surface variant="tonal-emerald" padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} border="none">
                            <Stack direction="row" align="center" justify="between" fullWidth>
                                <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                    <Icon icon={Clock} size="sm" color="emerald" />
                                    <Stack gap={0}>
                                        <Font variant="body-sm" weight="black" color="emerald" uppercase italic>TESTE EM ANDAMENTO</Font>
                                        <Font variant="sub-tiny" color="emerald" weight="bold" opacity={70}>VOCÊ TEM {trialDaysLeft} DIAS RESTANTES</Font>
                                    </Stack>
                                </Stack>
                                <Icon icon={CheckCircle} size="sm" color="emerald" />
                            </Stack>
                        </Surface>
                    )}

                    {autoTreinoStatus === 'used' && (
                        <Surface variant="glass" padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} border="none" bgOpacity={5} bg="zinc">
                            <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Icon icon={XCircle} size="sm" color={STORE_TOKENS.COLORS.TEXT.DIM} />
                                <Stack gap={0}>
                                    <Font variant="body-sm" weight="black" color={STORE_TOKENS.COLORS.TEXT.DIM} uppercase italic>TESTE INDISPONÍVEL</Font>
                                    <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.DIM}>VOCÊ JÁ UTILIZOU SEU PERÍODO DE TESTE</Font>
                                </Stack>
                            </Stack>
                        </Surface>
                    )}
                </Stack>

                {/* Danger Zone */}
                <Box height="px" bg="white" bgOpacity={5} fullWidth />
                
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Icon icon={ShieldAlert} size="xs" color="red" />
                        <Font variant="sub-tiny" color="red" weight="black" uppercase tracking="widest">
                            ZONA DE PERIGO
                        </Font>
                    </Stack>
                    <Button variant="outline-red" fullWidth>
                        <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Icon icon={Trash2} size="xs" />
                            <Font variant="body-sm" weight="black" uppercase italic>DELETAR CONTA PERMANENTEMENTE</Font>
                        </Stack>
                    </Button>
                </Stack>

            </Stack>
        </Modal>
    );
}
