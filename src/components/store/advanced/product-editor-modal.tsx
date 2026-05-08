'use client'

import React from 'react'
import { Modal } from './modal'
import { ShoppingBag } from 'lucide-react'

interface ProductEditorModalProps {
    isOpen: boolean
    onClose: () => void
    product?: Record<string, any> | null
}

export function ProductEditorModal({ isOpen, onClose, product }: ProductEditorModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={product ? "Editar Produto" : "Novo Produto"}
            subtitle="Gerencie os itens da loja RepTrail"
            icon={ShoppingBag}
            variant="blue"
        >
            <div className="text-zinc-500">Editor de Produto em breve...</div>
        </Modal>
    )
}
