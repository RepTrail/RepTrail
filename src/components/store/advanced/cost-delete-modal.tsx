import React from 'react'
import { Modal } from './modal'
import { Stack } from '../base/stack'
import { Font } from '../base/font'
import { AlertTriangle } from 'lucide-react'

interface CostDeleteModalProps {
    isOpen: boolean
    onClose: () => void
    cost: Record<string, any> | null
}

export function CostDeleteModal({ isOpen, onClose, cost }: CostDeleteModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Confirmar Exclusão"
            subtitle="Esta ação não pode ser desfeita."
            icon={AlertTriangle}
            confirmLabel="SIM, EXCLUIR REGISTRO"
            cancelLabel="NÃO, MANTER"
            variant="red"
        >
            <Stack gap={5}>
                <Font variant="body" color="white">
                    Você tem certeza que deseja remover o registro de custo <Font variant="body" color="red" weight="black" italic>"{cost?.description || 'este custo'}"</Font>?
                </Font>
                <Font variant="sub-tiny" color="zinc-500">
                    Ao confirmar, este valor será subtraído do fluxo de caixa mensal e os dados históricos serão permanentemente removidos da base administrativa.
                </Font>
            </Stack>
        </Modal>
    )
}
