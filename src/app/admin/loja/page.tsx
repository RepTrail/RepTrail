'use client'

import { useState, useTransition } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/query-keys'
import { 
    getAllStoreProducts, toggleProductStatus, deleteStoreProduct,
    addStoreProduct, updateStoreProduct, fetchProductFromUrl
} from '@/actions/admin-actions'
import { createClient } from '@/lib/supabase/client'
import { AdminPageShell } from '@/components/store/advanced/admin-page-shell'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { Modal } from '@/components/store/advanced/modal'
import { Stack } from '@/components/store/base/stack'
import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { Grid } from '@/components/store/base/grid'
import { Button } from '@/components/store/base/button'
import { Input } from '@/components/store/base/input'
import { EmptyState } from '@/components/store/intermediary/empty-state'
import { ProductCard } from '@/components/store/intermediary/product-card'
import { AdminProductEditor } from '@/components/store/sections/admin-product-editor'
import { useToast } from '@/hooks/use-toast'
import { ShoppingBag, Search, Plus, Package, XCircle } from 'lucide-react'

export default function AdminLojaPage() {
    const queryClient = useQueryClient()
    const [search, setSearch] = useState('')
    const [productModalOpen, setProductModalOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<any>(null)
    const [deleteModal, setDeleteModal] = useState<{ open: boolean, id: string }>({
        open: false,
        id: ''
    })
    const [isPending, startTransition] = useTransition()
    const { toast } = useToast()

    const { data: products = [], isLoading } = useQuery({
        queryKey: QUERY_KEYS.store.products,
        queryFn: () => getAllStoreProducts()
    })

    const { data: adminUser } = useQuery({
        queryKey: QUERY_KEYS.auth.user,
        queryFn: async () => {
            const supabase = createClient()
            const { data: { user: authUser } } = await supabase.auth.getUser()
            if (!authUser) return null
            const { data: profile } = await supabase.from('profiles').select('*').eq('id', authUser.id).single()
            return profile || authUser
        }
    })

    async function handleProductToggle(productId: string, current: boolean) {
        startTransition(async () => {
            const res = await toggleProductStatus(productId, !current)
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
            const res = await deleteStoreProduct(deleteModal.id)
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
        <AdminPageShell
            pageTitle="CATÁLOGO DA LOJA"
            subtitle="Gestão de itens da loja oficial, suplementação e equipamentos."
            icon={ShoppingBag}
            user={{
                id: adminUser?.id || 'admin',
                name: adminUser?.full_name || 'Admin RepTrail',
                email: adminUser?.email || 'admin@reptrail.com.br',
                avatar_url: adminUser?.avatar_url || null,
            }}
        >
            <RegistrySection
                title="Catálogo de Produtos"
                subtitle="Gerencie os itens disponíveis na loja, preços e estoque."
                icon={ShoppingBag}
            >
                <Stack gap={10}>
                    {/* Toolbar */}
                    <Stack direction="row" align="center" gap={5}>
                        <Box flex1>
                            <Input 
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Buscar produto..."
                                icon={<Search size={16} />}
                                rounded="full"
                            />
                        </Box>
                        <Button
                            onClick={() => { setEditingProduct(null); setProductModalOpen(true) }}
                            variant="white"
                            size="lg"
                            rounded="full"
                            shrink={0}
                        >
                            <Stack direction="row" align="center" gap={2.5}>
                                <Plus className="w-4 h-4" />
                                <Box display={{base: 'none', md: 'block'}}>Novo Produto</Box>
                            </Stack>
                        </Button>
                    </Stack>

                    {isLoading && <EmptyState icon={ShoppingBag} title="Carregando..." description="Buscando produtos da loja." />}

                    {!isLoading && (
                        <Grid cols={1} mdCols={2} lgCols={4} gap={5}>
                            {filtered.map(product => (
                                <ProductCard
                                    key={product.id}
                                    name={product.name}
                                    description={product.description}
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
            </RegistrySection>

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
                <Font variant="body" color="zinc-400">
                    Esta ação removerá o produto do catálogo e não poderá ser desfeita. Vendas anteriores permanecerão no histórico.
                </Font>
            </Modal>

            <AdminProductEditor
                isOpen={productModalOpen}
                onClose={() => setProductModalOpen(false)}
                product={editingProduct}
                onImport={fetchProductFromUrl}
                onSave={async (data: any) => {
                    startTransition(async () => {
                        const res = editingProduct
                            ? await updateStoreProduct(editingProduct.id, data)
                            : await addStoreProduct(data)
                        if ((res as any).error) toast({ variant: 'destructive', title: 'Erro', description: (res as any).error })
                        else {
                            toast({ title: editingProduct ? 'Produto atualizado!' : 'Produto adicionado!' })
                            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.store.products })
                            setProductModalOpen(false)
                        }
                    })
                }}
            />
        </AdminPageShell>
    )
}
