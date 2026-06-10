'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { actions } from '@/lib/dal'
import { PlanWithFeatures } from '@/types'
import { Box } from '@/components/store/base/box'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Input } from '@/components/store/base/input'
import { FormSelect } from '@/components/store/base/form-select'
import { FormCheckbox } from '@/components/store/base/form-checkbox'
import { Surface } from '@/components/store/base/surface'
import { Separator } from '@/components/store/base/separator'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { Grid } from '@/components/store/base/grid'

type PlanFormProps = {
    initialData?: PlanWithFeatures
    onSuccess?: () => void
}

export function PlanForm({ initialData, onSuccess }: PlanFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Identity
    const [name, setName] = useState(initialData?.name || '')
    const [slug, setSlug] = useState(initialData?.slug || '')
    const [description, setDescription] = useState(initialData?.description || '')
    const [billingType, setBillingType] = useState(initialData?.billing_type || 'monthly')
    const [basePrice, setBasePrice] = useState(initialData ? (initialData.base_price_cents / 100).toString() : '0')
    const [sortOrder, setSortOrder] = useState(initialData?.sort_order?.toString() || '0')
    const [isActive, setIsActive] = useState(initialData ? initialData.is_active : true)
    const [isPublic, setIsPublic] = useState(initialData?.is_public ?? true)

    // Limits
    const [studentLimit, setStudentLimit] = useState<string>(initialData?.plan_features_dynamic?.student_limit?.toString() ?? '')
    const [studentLimitUnlimited, setStudentLimitUnlimited] = useState(initialData ? initialData.plan_features_dynamic?.student_limit === null : false)

    const [freeStudentsLimit, setFreeStudentsLimit] = useState<string>(initialData?.plan_features_dynamic?.free_students_limit?.toString() ?? '')
    const [pricePerStudent, setPricePerStudent] = useState<string>(initialData?.plan_features_dynamic?.price_per_student_cents ? (initialData.plan_features_dynamic.price_per_student_cents / 100).toString() : '')

    const [photoUpdatesLimit, setPhotoUpdatesLimit] = useState<string>(initialData?.plan_features_dynamic?.photo_updates_limit?.toString() ?? '')
    const [photoUpdatesUnlimited, setPhotoUpdatesUnlimited] = useState(initialData ? initialData.plan_features_dynamic?.photo_updates_limit === null : false)
    const [prestigePoints, setPrestigePoints] = useState<string>(initialData?.plan_features_dynamic?.prestige_points?.toString() ?? '0')

    const [pdfImportLimit, setPdfImportLimit] = useState<string>(initialData?.plan_features_dynamic?.pdf_import_limit?.toString() ?? '')
    const [pdfImportLimitUnlimited, setPdfImportLimitUnlimited] = useState(initialData ? initialData.plan_features_dynamic?.pdf_import_limit === null : true)

    // Features
    const [hasWorkouts, setHasWorkouts] = useState(initialData?.plan_features_dynamic?.has_workouts ?? true)
    const [hasDiets, setHasDiets] = useState(initialData?.plan_features_dynamic?.has_diets ?? true)
    const [hasCardio, setHasCardio] = useState(initialData?.plan_features_dynamic?.has_cardio ?? true)
    const [hasErgogenics, setHasErgogenics] = useState(initialData?.plan_features_dynamic?.has_ergogenics ?? false)
    const [hasImportPdfAi, setHasImportPdfAi] = useState(initialData?.plan_features_dynamic?.has_import_pdf_ai ?? false)

    // Card Theme & Icon
    const rawTheme = initialData?.card_theme || 'default'
    const [cardTheme, setCardTheme] = useState<string>(rawTheme.split(':')[0] || 'default')
    const [cardIcon, setCardIcon] = useState<string>(rawTheme.split(':')[1] || 'Dumbbell')
    const [badgeText, setBadgeText] = useState<string>(rawTheme.split(':')[2] || '')

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value
        setName(newName)
        if (!initialData) {
            setSlug(newName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const payload = {
            name,
            slug,
            description,
            billing_type: billingType,
            base_price_cents: Math.round(Number(basePrice) * 100),
            sort_order: Number(sortOrder),
            is_active: isActive,
            is_public: isPublic,
            card_theme: `${cardTheme}:${cardIcon}:${badgeText}`,
            features: {
                student_limit: studentLimitUnlimited ? null : (studentLimit === '' ? null : Number(studentLimit)),
                free_students_limit: billingType === 'on_demand' && freeStudentsLimit !== '' ? Number(freeStudentsLimit) : null,
                price_per_student_cents: billingType === 'on_demand' && pricePerStudent !== '' ? Math.round(Number(pricePerStudent) * 100) : null,
                photo_updates_limit: photoUpdatesUnlimited ? null : (photoUpdatesLimit === '' ? null : Number(photoUpdatesLimit)),
                pdf_import_limit: pdfImportLimitUnlimited ? null : (pdfImportLimit === '' ? null : Number(pdfImportLimit)),
                prestige_points: prestigePoints === '' ? 0 : Number(prestigePoints),
                has_workouts: hasWorkouts,
                has_diets: hasDiets,
                has_cardio: hasCardio,
                has_ergogenics: hasErgogenics,
                has_import_pdf_ai: hasImportPdfAi,
                has_public_profile: true,
                has_public_feed: false,
                has_store: false,
                has_ranking: true,
                has_elite_badge: false
            }
        }

        try {
            if (initialData) {
                const res = await actions.updatePlan(initialData.id, payload)
                if (!res.success) throw new Error(res.error || 'Erro ao atualizar plano')
            } else {
                const res = await actions.createPlan(payload)
                if (!res.success) throw new Error(res.error || 'Erro ao criar plano')
            }
            if (onSuccess) {
                onSuccess()
            } else {
                router.push('/admin/plans')
            }
            router.refresh()
        } catch (err: any) {
            setError(err.message)
            setLoading(false)
        }
    }

    return (
        <Box as="form" id="plan-form" onSubmit={handleSubmit}>
            <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>

                {error && (
                    <Surface variant="tonal-red" padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} border="standard">
                        <Font variant="body-sm" color="red">{error}</Font>
                    </Surface>
                )}

                {/* SEÇÃO 1: Identidade */}
                <Surface variant="glass" padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} border="standard">
                    <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Font variant="h4" weight="bold">1. Identidade</Font>
                            <Separator />
                        </Stack>

                        <Grid cols={{ base: 1, md: 2 }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                            <Input label="Nome" value={name} onChange={handleNameChange} required />
                            <Input label="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} required />
                        </Grid>

                        <Input label="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} />

                        <Grid cols={{ base: 1, md: 2 }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                            <FormSelect
                                label="Tipo de Cobrança"
                                value={billingType}
                                onChange={(val) => setBillingType(val as 'monthly' | 'annual' | 'on_demand')}
                                options={[
                                    { label: 'Mensal', value: 'monthly' },
                                    { label: 'Anual', value: 'annual' },
                                    { label: 'On-Demand', value: 'on_demand' }
                                ]}
                            />

                            <Input label="Preço Base (R$)" type="number" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} required />
                            <Input label="Ordem de Exibição" type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} required />
                        </Grid>

                        <Box padding={STORE_TOKENS.PADDING.ELEMENT}>
                            <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <FormCheckbox label="Status Ativo (Permite assinaturas)" checked={isActive} onChange={setIsActive} />
                                <FormCheckbox label="Público (Aparece na tela de Planos)" checked={isPublic} onChange={setIsPublic} />
                            </Stack>
                        </Box>
                    </Stack>
                </Surface>

                {/* SEÇÃO 2: Limites Numéricos */}
                <Surface variant="glass" padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} border="standard">
                    <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Font variant="h4" weight="bold">2. Limites Numéricos</Font>
                            <Separator />
                        </Stack>

                        <Grid cols={{ base: 1, md: 2 }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                            <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Input
                                    label="Máximo de Alunos"
                                    type="number"
                                    value={studentLimitUnlimited ? '' : studentLimit}
                                    onChange={(e) => setStudentLimit(e.target.value)}
                                    disabled={studentLimitUnlimited}
                                />
                                <FormCheckbox label="Ilimitado" checked={studentLimitUnlimited} onChange={setStudentLimitUnlimited} />
                            </Stack>

                            <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Input
                                    label="Limite de Fotos por Aluno (Mês)"
                                    type="number"
                                    value={photoUpdatesUnlimited ? '' : photoUpdatesLimit}
                                    onChange={(e) => setPhotoUpdatesLimit(e.target.value)}
                                    disabled={photoUpdatesUnlimited}
                                />
                                <FormCheckbox label="Ilimitado" checked={photoUpdatesUnlimited} onChange={setPhotoUpdatesUnlimited} />
                            </Stack>

                            <Input label="Pontos de Prestígio" type="number" value={prestigePoints} onChange={(e) => setPrestigePoints(e.target.value)} />
                        </Grid>

                        {billingType === 'on_demand' && (
                            <Grid cols={{ base: 1, md: 2 }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                                <Input label="Alunos Gratuitos (On-Demand)" type="number" value={freeStudentsLimit} onChange={(e) => setFreeStudentsLimit(e.target.value)} />
                                <Input label="Preço por Aluno Excedente (R$)" type="number" value={pricePerStudent} onChange={(e) => setPricePerStudent(e.target.value)} />
                            </Grid>
                        )}
                    </Stack>
                </Surface>

                {/* SEÇÃO 3: Recursos */}
                <Surface variant="glass" padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} border="standard">
                    <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Font variant="h4" weight="bold">3. Recursos</Font>
                            <Separator />
                        </Stack>

                        <Grid cols={{ base: 1, md: 2 }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                            <FormCheckbox label="Treinos" checked={hasWorkouts} onChange={setHasWorkouts} />
                            <FormCheckbox label="Dietas" checked={hasDiets} onChange={setHasDiets} />
                            <FormCheckbox label="Cardio" checked={hasCardio} onChange={setHasCardio} />

                            <FormCheckbox label="Ergogênicos" checked={hasErgogenics} onChange={setHasErgogenics} />
                            <FormCheckbox label="Importação de PDF (IA)" checked={hasImportPdfAi} onChange={setHasImportPdfAi} />
                            
                            {hasImportPdfAi && (
                                <Box padding={STORE_TOKENS.PADDING.ELEMENT} border borderColor={STORE_TOKENS.COLORS.DIVIDER.SUBTLE}>
                                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                        <FormCheckbox label="Sem limite de importação" checked={pdfImportLimitUnlimited} onChange={setPdfImportLimitUnlimited} />
                                        {!pdfImportLimitUnlimited && (
                                            <Input
                                                label="Limite de PDFs por Mês"
                                                type="number"
                                                value={pdfImportLimit}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPdfImportLimit(e.target.value)}
                                                placeholder="Ex: 5"
                                            />
                                        )}
                                    </Stack>
                                </Box>
                            )}


                        </Grid>
                    </Stack>
                </Surface>

                {/* SEÇÃO 4: Visual do Card */}
                <Surface variant="glass" padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} border="standard">
                    <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Font variant="h4" weight="bold">4. Visual do Card</Font>
                            <Separator />
                        </Stack>

                        <Grid cols={{ base: 1, md: 2 }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                            <FormSelect
                                label="Tema do Card (Cor)"
                                value={cardTheme}
                                onChange={setCardTheme}
                                options={[
                                    { value: 'default', label: 'Padrão (Glass Panel)' },
                                    { value: 'highlighted', label: 'Destaque (Cores da Marca)' },
                                    { value: 'premium', label: 'Premium (Dourado/Ouro)' },
                                    { value: 'blue', label: 'Azul (Especial)' },
                                    { value: 'emerald', label: 'Esmeralda (Sucesso)' },
                                    { value: 'orange', label: 'Laranja (Energia)' },
                                    { value: 'red', label: 'Vermelho (Alerta)' },
                                ]}
                            />
                            <Input
                                label="Texto de Destaque (Badge)"
                                value={badgeText}
                                onChange={(e) => setBadgeText(e.target.value)}
                                placeholder="Ex: MAIS POPULAR, ELITE"
                            />
                            
                            <FormSelect
                                label="Ícone de Fundo"
                                value={cardIcon}
                                onChange={setCardIcon}
                                options={[
                                    { value: 'Dumbbell', label: 'Halter (Força/Treino)' },
                                    { value: 'Rocket', label: 'Foguete (Performance)' },
                                    { value: 'Crown', label: 'Coroa (Premium/Elite)' },
                                    { value: 'Star', label: 'Estrela (Destaque)' },
                                    { value: 'Zap', label: 'Raio (Energia/Cardio)' },
                                    { value: 'Flame', label: 'Fogo (Intensidade)' },
                                    { value: 'Target', label: 'Alvo (Objetivo)' },
                                    { value: 'Trophy', label: 'Troféu (Conquista)' },
                                    { value: 'HeartPulse', label: 'Coração (Saúde)' },
                                    { value: 'Medal', label: 'Medalha (Ranking)' },
                                ]}
                            />
                        </Grid>
                    </Stack>
                </Surface>
            </Stack>
        </Box>
    )
}
