'use client'

import { useState, useEffect } from 'react'
import { X, Zap, RefreshCw, Package, Pencil, Eye, ExternalLink } from 'lucide-react'
import { Stack } from '../base/stack'
import { Grid } from '../base/grid'
import { Box } from '../base/box'
import { Font } from '../base/font'
import { Icon } from '../base/icon'
import { Button } from '../base/button'
import { Input } from '../base/input'
import { FormSelect } from '../base/form-select'
import { Modal } from '../advanced/modal'
import { useToast } from '@/hooks/use-toast'

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
            <Stack gap={5}>
                {/* Auto-Import */}
                <Box padding={5} rounded="system" border borderColor="emerald-500" bg="emerald" bgOpacity={5}>
                    <Stack gap={5}>
                        <Stack direction="row" gap={2.5} align="center">
                            <Box padding={1} rounded="system" bg="emerald" bgOpacity={20}>
                                <Icon icon={Zap} size="xs" color="emerald" />
                            </Box>
                            <Font variant="label-caps" color="emerald">Auto-Importar Dados (IA)</Font>
                        </Stack>
                        <Stack direction={{ base: 'col', md: 'row' }} gap={2.5} align="stretch">
                            <Box flex1>
                                <Input
                                    placeholder="Link do produto (Mercado Livre, etc)"
                                    value={importUrl}
                                    onChange={e => setImportUrl(e.target.value)}
                                    color="emerald"
                                />
                            </Box>
                            <Button 
                                variant="primary" 
                                fullWidth 
                                onClick={handleImport} 
                                disabled={importing || !importUrl}
                            >
                                {importing ? <Icon icon={RefreshCw} spin /> : <Font variant="label-caps">Carregar</Font>}
                            </Button>
                        </Stack>
                    </Stack>
                </Box>

                {/* Form Fields */}
                <Stack gap={5} paddingBottom={5}>
                    <Input
                        label="Link de Afiliado"
                        icon={<ExternalLink size={16} />}
                        placeholder="Seu link de afiliado"
                        value={form.link_url}
                        onChange={e => setForm(prev => ({ ...prev, link_url: e.target.value }))}
                    />

                    <Input
                        label="Nome do Produto"
                        icon={<Package size={16} />}
                        value={form.name}
                        onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                    />

                    <Input
                        label="Descrição Curta"
                        icon={<Pencil size={16} />}
                        value={form.description}
                        onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                    />

                    <Input
                        label="URL da Imagem"
                        icon={<Eye size={16} />}
                        value={form.image_url}
                        onChange={e => setForm(prev => ({ ...prev, image_url: e.target.value }))}
                    />

                    <Grid cols={1} mdCols={3} gap={5}>
                        <Input
                            label="Preço (R$)"
                            type="number"
                            value={String(form.official_price)}
                            onChange={e => setForm(prev => ({ ...prev, official_price: Number(e.target.value) }))}
                            color="emerald"
                            weight="bold"
                        />
                        <Input
                            label="Nota (0-5)"
                            type="number"
                            value={String(form.rating)}
                            onChange={e => setForm(prev => ({ ...prev, rating: Number(e.target.value) }))}
                            color="amber"
                            weight="bold"
                        />
                        <Input
                            label="Reviews"
                            type="number"
                            value={String(form.reviews_count)}
                            onChange={e => setForm(prev => ({ ...prev, reviews_count: Number(e.target.value) }))}
                        />
                    </Grid>

                    <Grid cols={1} mdCols={2} gap={5}>
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
    )
}
