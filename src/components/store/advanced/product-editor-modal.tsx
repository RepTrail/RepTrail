'use client'

import React, { useState, useEffect } from 'react'
import { Modal } from './modal'
import { Stack } from '../base/stack'
import { Font } from '../base/font'
import { Input } from '../base/input'
import { Button } from '../base/button'
import { Box } from '../base/box'
import { Icon } from '../base/icon'
import { ShoppingBag, Save, Image as ImageIcon } from 'lucide-react'

interface ProductEditorModalProps {
    isOpen: boolean
    onClose: () => void
    product?: any
}

export function ProductEditorModal({ isOpen, onClose, product }: ProductEditorModalProps) {
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')

    useEffect(() => {
        if (product) {
            setName(product.name)
            setPrice(product.price)
        } else {
            setName('')
            setPrice('')
        }
    }, [product, isOpen])

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={product ? 'Editar Produto' : 'Novo Produto'}
            icon={ShoppingBag}
        >
            <Stack gap={5}>
                <Stack gap={2.5}>
                    <Font variant="sub-tiny" color="zinc-600" weight="black" uppercase>Nome do Produto</Font>
                    <Input 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        placeholder="Ex: Whey Protein Pro" 
                    />
                </Stack>

                <Stack gap={2.5}>
                    <Font variant="sub-tiny" color="zinc-600" weight="black" uppercase>Preço de Venda (R$)</Font>
                    <Input 
                        value={price} 
                        onChange={(e) => setPrice(e.target.value)} 
                        placeholder="0.00" 
                    />
                </Stack>

                <Box bg="zinc-900" border="white/5" padding={5} rounded="system" borderStyle="dashed">
                    <Stack align="center" gap={2.5} justify="center">
                        <Icon icon={ImageIcon} color="zinc-600" size="sm" />
                        <Font variant="sub-tiny" color="zinc-600" weight="bold">UPLOAD DE IMAGEM</Font>
                    </Stack>
                </Box>

                <Box borderTop="white/5" paddingTop={5}>
                    <Stack direction="row" gap={2.5}>
                        <Button variant="white" fullWidth onClick={onClose}>
                            <Icon icon={Save} size="xs" />
                            <span>SALVAR PRODUTO</span>
                        </Button>
                        <Button variant="outline" onClick={onClose}>CANCELAR</Button>
                    </Stack>
                </Box>
            </Stack>
        </Modal>
    )
}
