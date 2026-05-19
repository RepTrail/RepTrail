'use client'

import React, { useState } from 'react'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Box } from '@/components/store/base/box'
import { Modal } from '@/components/store/advanced/modal'
import { Callout } from '@/components/store/intermediary/callout'
import { AdminPersonalsPanel } from './admin-personals-panel'
import { AdminAffiliatesManagementPanel } from './admin-affiliates-management-panel'
import { AdminStudentsPanel } from './admin-students-panel'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { 
    Search, 
    Trash2, 
    Edit3
} from 'lucide-react'

/**
 * AdminUsersManagementPanel: Top-level advanced orchestrator for all user management subdomains.
 * - Orchestrates Personals, Affiliates, and Students panels.
 * - Manages shared modal states to avoid redundant duplication across sub-panels.
 * - Responsibility: High-level user domain coordination.
 */
export function AdminUsersManagementPanel() {
    const [modalState, setModalState] = useState<{
        type: 'edit' | 'delete' | 'inspect' | null,
        target: string | null,
        category: 'user' | 'product' | null
    }>({ type: null, target: null, category: null })

    const openModal = (type: 'edit' | 'delete' | 'inspect', target: string, category: 'user' | 'product' = 'user') => {
        setModalState({ type, target, category })
    }

    const closeModal = () => {
        setModalState({ type: null, target: null, category: null })
    }

    return (
        <Stack gap={{ base: STORE_TOKENS.SPACING.EMPTY_STATE, md: STORE_TOKENS.SPACING.SECTION }}>
            {/* Subdomain Panels */}
            <AdminPersonalsPanel 
                onDelete={(name) => openModal('delete', name)} 
                onInspect={(name) => openModal('inspect', name)} 
            />

            <AdminAffiliatesManagementPanel 
                onDelete={(name) => openModal('delete', name)} 
            />

            <AdminStudentsPanel 
                onDelete={(name) => openModal('delete', name)} 
                onInspect={(name) => openModal('inspect', name)} 
            />

            {/* SHARED MODALS REUSE */}
            <Modal
                isOpen={modalState.type === 'delete'}
                onClose={closeModal}
                title={`Excluir ${modalState.category === 'user' ? 'Usuário' : 'Produto'}`}
                subtitle={`Você está prestes a remover permanentemente: ${modalState.target}`}
                icon={Trash2}
                variant="red"
                confirmLabel="Confirmar Exclusão"
                cancelLabel="Manter Registro"
            >
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Callout variant="danger" title="Aviso">
                        Esta ação é irreversível e removerá todos os vínculos históricos associados a este registro no banco de dados do RepTrail. Os dados de auditoria (Logs) permanecerão salvos para fins legais.
                    </Callout>
                </Stack>
            </Modal>

            <Modal
                isOpen={modalState.type === 'inspect'}
                onClose={closeModal}
                title={`Inspecionar ${modalState.category === 'user' ? 'Painel' : 'Produto'}`}
                subtitle={`Acessando interface do usuário: ${modalState.target}`}
                icon={Search}
                variant="blue"
                confirmLabel="Acessar Painel"
                cancelLabel="Cancelar"
            >
                <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.SECONDARY}>
                        A ação de inspeção permite que você acesse temporariamente o painel deste usuário. Você poderá visualizar a interface exatamente como ele a vê para fins de suporte, auditoria ou configuração.
                    </Font>
                    
                    <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <Box padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} bg={STORE_TOKENS.COLORS.WHITE} bgOpacity={STORE_TOKENS.OPACITY.LOW} border borderColor={STORE_TOKENS.COLORS.DIVIDER.STANDARD}>
                            <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.MUTED} weight="black" uppercase italic>Status do Registro</Font>
                            <Font color={STORE_TOKENS.COLORS.SUCCESS} weight="bold">VERIFICADO & ATIVO</Font>
                        </Box>
                    </Stack>
                </Stack>
            </Modal>

            <Modal
                isOpen={modalState.type === 'edit'}
                onClose={closeModal}
                title={`Editar ${modalState.category === 'user' ? 'Perfil' : 'Produto'}`}
                subtitle={`Modificando informações de: ${modalState.target}`}
                icon={Edit3}
                variant="blue"
                confirmLabel="Salvar Alterações"
                cancelLabel="Descartar"
            >
                <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.SECONDARY}>
                        Interface de edição rápida. Os campos abaixo permitem atualizar as propriedades fundamentais do registro sem sair do dashboard.
                    </Font>
                    
                    <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <Box fullWidth bg={STORE_TOKENS.COLORS.WHITE} bgOpacity={STORE_TOKENS.OPACITY.LOW} border borderColor={STORE_TOKENS.COLORS.DIVIDER.STANDARD} rounded={STORE_TOKENS.RADIUS.SYSTEM} display="flex" align="center" padding={STORE_TOKENS.PADDING.CONTAINER}>
                            <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.MUTED}>Campo de Exemplo 01...</Font>
                        </Box>
                        <Box fullWidth bg={STORE_TOKENS.COLORS.WHITE} bgOpacity={STORE_TOKENS.OPACITY.LOW} border borderColor={STORE_TOKENS.COLORS.DIVIDER.STANDARD} rounded={STORE_TOKENS.RADIUS.SYSTEM} display="flex" align="center" padding={STORE_TOKENS.PADDING.CONTAINER}>
                            <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.MUTED}>Campo de Exemplo 02...</Font>
                        </Box>
                    </Stack>
                </Stack>
            </Modal>
        </Stack>
    )
}
