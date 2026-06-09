'use client'
import { Icon } from '@/components/store/base/icon'
import { Inline } from '@/components/store/base/layout'

import React, { useState } from 'react'
import { Grid } from '@/components/store/base/grid'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Box } from '@/components/store/base/box'
import { ProductCard } from '@/components/store/intermediary/product-card'
import { EmptyState } from '@/components/store/intermediary/empty-state'

import { Modal } from '@/components/store/advanced/modal'
import { Callout } from '@/components/store/intermediary/callout'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { 
    Package, 
    Trash2, 
    Edit3
} from 'lucide-react'

export function AdminProductsCatalogPanel() {
    const [modalState, setModalState] = useState<{
        type: 'edit' | 'delete' | 'inspect' | null,
        target: string | null,
        category: 'user' | 'product' | null
    }>({ type: null, target: null, category: null })

    const openModal = (type: 'edit' | 'delete' | 'inspect', target: string, category: 'user' | 'product') => {
        setModalState({ type, target, category })
    }

    const closeModal = () => {
        setModalState({ type: null, target: null, category: null })
    }

    return (
        <Stack gap={{ base: STORE_TOKENS.SPACING.EMPTY_STATE, md: STORE_TOKENS.SPACING.SECTION }}>
            <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT} fullWidth>
            <Stack direction={{ base: 'col', lg: 'row' }} justify="between" align={{ base: 'stretch', lg: 'end' }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                        <Icon icon={Package} color={STORE_TOKENS.COLORS.BRAND as any} size="lg" />
                        <Font variant="heading" weight="black" uppercase italic color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>{"Catálogo de Produtos"}</Font>
                    </Inline>
                    <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.MUTED}>{"Gestão de itens da loja oficial, suplementação e equipamentos."}</Font>
                </Stack>
            </Stack>
            <Stack gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth>
                <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Grid cols={1} mdCols={2} lgCols={4} gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <ProductCard 
                            name="Whey Protein Isolado"
                            price="R$ 189,90"
                            category="SUPLEMENTOS"
                            onDelete={() => openModal('delete', 'Whey Protein Isolado', 'product')}
                            onEdit={() => openModal('edit', 'Whey Protein Isolado', 'product')}
                        />
                        <ProductCard 
                            name="Creatina Monohidratada"
                            price="R$ 95,00"
                            category="SUPLEMENTOS"
                            onDelete={() => openModal('delete', 'Creatina Monohidratada', 'product')}
                            onEdit={() => openModal('edit', 'Creatina Monohidratada', 'product')}
                        />
                        <ProductCard 
                            name="Cinto de Agachamento"
                            price="R$ 120,00"
                            category="EQUIPAMENTOS"
                            onDelete={() => openModal('delete', 'Cinto de Agachamento', 'product')}
                            onEdit={() => openModal('edit', 'Cinto de Agachamento', 'product')}
                        />
                        <ProductCard 
                            name="Camiseta RepTrail Oversized"
                            price="R$ 89,00"
                            category="VESTUÁRIO"
                            onDelete={() => openModal('delete', 'Camiseta RepTrail Oversized', 'product')}
                            onEdit={() => openModal('edit', 'Camiseta RepTrail Oversized', 'product')}
                        />
                    </Grid>

                    <EmptyState 
                        icon={Package}
                        title="Fim do Catálogo"
                        description="Você visualizou todos os produtos ativos na loja no momento."
                    />
                </Stack>
              </Stack>
        </Stack>
            {/* MODALS REUSE */}
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
                    <Font
                        variant="description"
                        {...{
                            color: STORE_TOKENS.COLORS.TEXT.SECONDARY,
                        }}>
                        Interface de edição rápida. Os campos abaixo permitem atualizar as propriedades fundamentais do registro sem sair do dashboard.
                    </Font>
                    
                    <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <Box fullWidth bg={STORE_TOKENS.COLORS.WHITE} bgOpacity={STORE_TOKENS.OPACITY.LOW} border borderColor={STORE_TOKENS.COLORS.DIVIDER.STANDARD} rounded={STORE_TOKENS.RADIUS.SYSTEM} display="flex" align="center" padding={STORE_TOKENS.PADDING.CONTAINER}>
                            <Font
                                variant="sub-tiny"
                                {...{
                                    color: STORE_TOKENS.COLORS.TEXT.MUTED,
                                }}>Campo de Exemplo 01...</Font>
                        </Box>
                        <Box fullWidth bg={STORE_TOKENS.COLORS.WHITE} bgOpacity={STORE_TOKENS.OPACITY.LOW} border borderColor={STORE_TOKENS.COLORS.DIVIDER.STANDARD} rounded={STORE_TOKENS.RADIUS.SYSTEM} display="flex" align="center" padding={STORE_TOKENS.PADDING.CONTAINER}>
                            <Font
                                variant="sub-tiny"
                                {...{
                                    color: STORE_TOKENS.COLORS.TEXT.MUTED,
                                }}>Campo de Exemplo 02...</Font>
                        </Box>
                    </Stack>
                </Stack>
            </Modal>
        </Stack>
    );
}
