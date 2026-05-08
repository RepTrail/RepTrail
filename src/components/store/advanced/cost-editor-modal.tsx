'use client'

import React from 'react'
import { Modal } from './modal'
import { Activity } from 'lucide-react'

interface CostEditorModalProps {
    isOpen: boolean
    onClose: () => void
    cost?: Record<string, any> | null
}

export function CostEditorModal({ isOpen, onClose, cost }: CostEditorModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={cost ? "Editar Custo" : "Registrar Custo"}
            subtitle="Gerencie despesas e fluxo de caixa"
            icon={Activity}
            variant="red"
        >
            <div className="text-zinc-500">Editor de Custo em breve...</div>
        </Modal>
    )
}
