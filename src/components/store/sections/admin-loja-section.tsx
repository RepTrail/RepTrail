'use client'

import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { useState, useTransition } from 'react'
import { useQuery, useQueryClient, actions } from '@/lib/dal'
import { QUERY_KEYS } from '@/lib/query-keys'
import { Modal } from '@/components/store/advanced/modal'
import { Stack } from '@/components/store/base/stack'
import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { Grid } from '@/components/store/base/grid'
import { Button } from '@/components/store/base/button'
import { Input } from '@/components/store/base/input'
import { Icon } from '@/components/store/base/icon'
import { EmptyState } from '@/components/store/intermediary/empty-state'
import { ProductCard } from '@/components/store/intermediary/product-card'
import { AdminProductEditor } from '@/components/store/advanced/admin-product-editor'
import { useToast } from '@/components/store/hooks/use-toast'
import { ShoppingBag, Search, Plus, Package, XCircle } from 'lucide-react'

export function AdminLojaSection() {
    const queryClient = useQueryClient()
    const [search, setSearch] = useState('')
    const [productModalOpen, setProductModalOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<any>(null)
    const [deleteModal, setDeleteModal] = useState<{ open: boolean, id: string }>({
        open: false,
        id: ''
    })
    const [_, startTransition] = useTransition()
    const { toast } = useToast()

    const { data: products = [], isLoading } = useQuery({
        queryKey: QUERY_KEYS.store.products,
        queryFn: () => actions.getAllStoreProducts()
    })

    async function handleProductToggle(productId: string, current: boolean) {
        startTransition(async () => {
            const res = await actions.toggleProductStatus(productId, !current)
            if (res.error) toast({ variant: 'destructive', title: 'Erro', description: res.error })
            else {
                toast({ title: !current ? 'Produto ativado!' : 'Produto desativado' })
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.store.products })
            }
        })
    }

    async function handleDeleteProduct(productId: string) {
        setDeleteModal({ open: true, id: productId })
        return false
    }

    async function confirmDeleteProduct() {
        if (!deleteModal.id) return
        startTransition(async () => {
            const res = await actions.deleteStoreProduct(deleteModal.id)
            if (res.error) toast({ title: 'Erro ao deletar', description: res.error, variant: 'destructive' })
            else {
                toast({ title: 'Produto removido com sucesso!' })
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.store.products })
            }
            setDeleteModal({ open: false, id: '' })
        })
    }

    const filtered = products.filter(p => !search || p.name?.toLowerCase().includes(search.toLowerCase()))

    return (
        <>
            <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                    {/* Toolbar */}
                    <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <Box flex1>
                            <Input 
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Buscar produto..."
                                icon={<Search size={16} />}
                                rounded={STORE_TOKENS.RADIUS.FULL}
                            />
                        </Box>
                        <Button
                            onClick={() => { setEditingProduct(null); setProductModalOpen(true) }}
                            variant="white"
                            size="lg"
                            rounded={STORE_TOKENS.RADIUS.FULL}
                            text="Novo Produto"
                            iconLeft={Plus} />
                    </Stack>

                    {isLoading && <EmptyState icon={ShoppingBag} title="Carregando..." description="Buscando produtos da loja." />}

                    {!isLoading && (
                        <Grid cols={1} mdCols={2} lgCols={4} gap={STORE_TOKENS.SPACING.CONTAINER}>
                            {filtered.map(product => (
                                <ProductCard
                                    key={product.id}
                                    name={product.name}
                                    description={product?.description}
                                    price={product.official_price ? `R$ ${Number(product.official_price).toFixed(2)}` : 'Sob consulta'}
                                    category={product.category}
                                    image={product.image_url}
                                    isActive={product.is_active}
                                    onToggleActive={() => handleProductToggle(product.id, product.is_active)}
                                    onDelete={() => handleDeleteProduct(product.id)}
                                    onEdit={() => { setEditingProduct(product); setProductModalOpen(true) }}
                                />
                            ))}
                        </Grid>
                    )}

                    {!isLoading && filtered.length === 0 && (
                        <EmptyState icon={Package} title="Nenhum produto encontrado" description="Adicione um novo produto ou ajuste a busca." />
                    )}
                </Stack>
            <Modal
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ ...deleteModal, open: false })}
                title="Deletar Produto"
                subtitle="Deseja remover este item permanentemente?"
                icon={XCircle}
                variant="red"
                onConfirm={confirmDeleteProduct}
                confirmLabel="Remover"
            >
                <Font variant="body" color={STORE_TOKENS.COLORS.TEXT.SECONDARY}>
                    Esta ação removerá o produto do catálogo e não poderá ser desfeita. Vendas anteriores permanecerão no histórico.
                </Font>
            </Modal>
            <AdminProductEditor
                isOpen={productModalOpen}
                onClose={() => setProductModalOpen(false)}
                product={editingProduct}
                onImport={actions.fetchProductFromUrl}
                onSave={async (data: any) => {
                    startTransition(async () => {
                        const res = editingProduct
                            ? await actions.updateStoreProduct(editingProduct.id, data)
                            : await actions.addStoreProduct(data)
                        if ((res as any).error) toast({ variant: 'destructive', title: 'Erro', description: (res as any).error })
                        else {
                            toast({ title: editingProduct ? 'Produto atualizado!' : 'Produto adicionado!' })
                            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.store.products })
                            setProductModalOpen(false)
                        }
                    })
                }}
            />
        </>
    );
}
