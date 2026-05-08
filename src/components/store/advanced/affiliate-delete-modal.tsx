'use client'

import React from 'react'
import { Modal } from './modal'
import { HeartHandshake } from 'lucide-react'

interface AffiliateDeleteModalProps {
    isOpen: boolean
    onClose: () => void
    affiliate: Record<string, any> | null
}

export function AffiliateDeleteModal({ isOpen, onClose, affiliate }: AffiliateDeleteModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Remover Afiliado"
            subtitle={`Tem certeza que deseja remover ${affiliate?.name || 'este afiliado'}?`}
            icon={HeartHandshake}
            variant="red"
            confirmLabel="Confirmar Remoção"
            cancelLabel="Manter Registro"
        >
            <div className="text-zinc-500">Esta ação é irreversível e removerá todos os vínculos de comissão.</div>
        </Modal>
    )
}
