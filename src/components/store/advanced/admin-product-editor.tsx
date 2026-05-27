'use client'

import { useState, useEffect } from 'react'
import { Zap, RefreshCw, Package, Pencil, Eye, ExternalLink, Search } from 'lucide-react'
import { Stack } from '@/components/store/base/stack'
import { Grid } from '@/components/store/base/grid'
import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { Button } from '@/components/store/base/button'
import { Input } from '@/components/store/base/input'
import { FormSelect } from '@/components/store/base/form-select'
import { Modal } from '@/components/store/advanced/modal'
import { useToast } from '@/hooks/use-toast'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface ProductEditorProps {
    isOpen: boolean
    onClose: () => void
    product: any
    onSave: (data: any) => void
    onImport: (url: string) => Promise<any>
}

export function AdminProductEditor({ isOpen, onClose, product, onSave, onImport }: ProductEditorProps) {
    const { toast } = useToast()
    const [form, setForm] = useState({ 
        name: '', 
        description: '', 
        image_url: '', 
        official_price: 0, 
        link_url: '', 
        category: 'supplement', 
        sub_category: '', 
        rating: 0, 
        reviews_count: 0 
    })
    const [importUrl, setImportUrl] = useState('')
    const [importing, setImporting] = useState(false)

    useEffect(() => {
        if (product) setForm({ ...product, sub_category: product.sub_category || '' })
        else setForm({ name: '', description: '', image_url: '', official_price: 0, link_url: '', category: 'supplement', sub_category: '', rating: 0, reviews_count: 0 })
        setImportUrl('')
    }, [product, isOpen])

    if (!isOpen) return null

    const handleImport = async () => {
        if (!importUrl) return
        setImporting(true)
        try {
            const data = await onImport(importUrl)
            if (data.error) throw new Error(data.error)
            setForm(prev => ({
                ...prev,
                name: data.title || prev.name,
                description: data.description || prev.description,
                image_url: data.image || prev.image_url,
                official_price: data.price || prev.official_price,
                link_url: prev.link_url,
                rating: data.rating || prev.rating || 0,
                reviews_count: data.reviews_count || prev.reviews_count || 0,
                category: data.category || prev.category,
                sub_category: data.sub_category || prev.sub_category
            }))
            setImportUrl('')
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Erro na importação', description: e.message })
        } finally {
            setImporting(false)
        }
    }

    const categories = [
        { label: 'Suplementos', value: 'supplement' },
        { label: 'Equipamentos', value: 'equipment' },
        { label: 'Vestuário', value: 'clothing' },
        { label: 'Outros', value: 'other' }
    ]

    const supplementSubs = [
        { label: 'Pré-treino', value: 'Pré-treino' },
        { label: 'Vitaminas', value: 'Vitaminas' },
        { label: 'Whey', value: 'Whey' },
        { label: 'Outros', value: 'Outros' }
    ]

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={product ? 'Editar Produto' : 'Novo Produto'}
            subtitle="Configure os detalhes da oferta na loja."
            icon={Package}
            confirmLabel="Salvar Produto"
            onConfirm={() => onSave(form)}
            variant="emerald"
        >
            <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                {/* Auto-Import */}
                <Box padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} border borderColor={STORE_TOKENS.COLORS.SUCCESS} borderOpacity={STORE_TOKENS.OPACITY.SHELF} bg={STORE_TOKENS.COLORS.SUCCESS} bgOpacity={STORE_TOKENS.OPACITY.LOW} style={{ borderColor: 'rgb(16 185 129 / 0.8)' }}>
                    <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <Stack direction="row" gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                            <Box padding={STORE_TOKENS.PADDING.ELEMENT} rounded={STORE_TOKENS.RADIUS.SYSTEM} bg={STORE_TOKENS.COLORS.SUCCESS} bgOpacity={STORE_TOKENS.OPACITY.MEDIUM}>
                                <Icon icon={Zap} size="xs" color={STORE_TOKENS.COLORS.SUCCESS} />
                            </Box>
                            <Font
                                variant="label-caps"
                                {...{
                                    color: STORE_TOKENS.COLORS.SUCCESS,
                                }}>Auto-Importar Dados (IA)</Font>
                        </Stack>
                        <Stack direction="row" gap={STORE_TOKENS.SPACING.ELEMENT} align="stretch">
                            <Input
                                placeholder="Link do produto (Mercado Livre, etc)"
                                value={importUrl}
                                onChange={e => setImportUrl(e.target.value)}
                                color={STORE_TOKENS.COLORS.SUCCESS}
                            />
                            <Button 
                                variant="outline-emerald" 
                                isIconOnly
                                height="12"
                                onClick={handleImport} 
                                disabled={importing || !importUrl}
                                shrink={0}
                            >
                                {importing ? <Icon icon={RefreshCw} spin size="sm" /> : <Icon icon={Search} size="sm" />}
                            </Button>
                        </Stack>
                    </Stack>
                </Box>

                {/* Form Fields */}
                <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Input
                        label="Link de Afiliado"
                        icon={<Icon icon={ExternalLink} size="xs" />}
                        placeholder="Seu link de afiliado"
                        value={form.link_url}
                        onChange={e => setForm(prev => ({ ...prev, link_url: e.target.value }))}
                    />

                    <Input
                        label="Nome do Produto"
                        icon={<Icon icon={Package} size="xs" />}
                        value={form.name}
                        onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                    />

                    <Input
                        label="Descrição Curta"
                        icon={<Icon icon={Pencil} size="xs" />}
                        value={form.description}
                        onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                    />

                    <Input
                        label="URL da Imagem"
                        icon={<Icon icon={Eye} size="xs" />}
                        value={form.image_url}
                        onChange={e => setForm(prev => ({ ...prev, image_url: e.target.value }))}
                    />

                    <Grid cols={1} mdCols={3} gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <Input
                            label="Preço (R$)"
                            type="number"
                            value={String(form.official_price)}
                            onChange={e => setForm(prev => ({ ...prev, official_price: Number(e.target.value) }))}
                            color={STORE_TOKENS.COLORS.SUCCESS}
                            weight="bold"
                        />
                        <Input
                            label="Nota (0-5)"
                            type="number"
                            value={String(form.rating)}
                            onChange={e => setForm(prev => ({ ...prev, rating: Number(e.target.value) }))}
                            color={STORE_TOKENS.COLORS.WARNING}
                            weight="bold"
                        />
                        <Input
                            label="Reviews"
                            type="number"
                            value={String(form.reviews_count)}
                            onChange={e => setForm(prev => ({ ...prev, reviews_count: Number(e.target.value) }))}
                        />
                    </Grid>

                    <Grid cols={1} mdCols={2} gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <FormSelect
                            label="Categoria"
                            options={categories}
                            value={form.category}
                            onChange={val => setForm(prev => ({ ...prev, category: val, sub_category: '' }))}
                        />
                        {form.category === 'supplement' && (
                            <FormSelect
                                label="Sub-categoria"
                                options={supplementSubs}
                                value={form.sub_category}
                                onChange={val => setForm(prev => ({ ...prev, sub_category: val }))}
                            />
                        )}
                    </Grid>
                </Stack>
            </Stack>
        </Modal>
    );
}
