'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { Icon } from '@/components/store/base/icon'
import { Button } from '@/components/store/base/button'
import { Grid } from '@/components/store/base/grid'
import { Box } from '@/components/store/base/box'
import { Badge } from '@/components/store/base/badge'
import { Inline, Cluster } from '@/components/store/base/layout'
import { GlassPanel } from '@/components/store/base/surface'
import {
    Eye, Trash2, Check, X, Dumbbell, Tag, Shield, Zap,
    Activity, Info, Settings, Bell, Plus, MousePointer2, ChevronRight,
    Search, Calendar, Phone, User, Lock, Mail
} from 'lucide-react'
import { Input } from '@/components/store/base/input'
import { Textarea } from '@/components/store/base/textarea'
import { FileUpload } from '@/components/store/base/file-upload'
import { FormSwitch } from '@/components/store/base/form-switch'
import { FormSelect } from '@/components/store/base/form-select'
import { FormCheckbox } from '@/components/store/base/form-checkbox'
import { TrainerDashboardSidebarPanel } from '@/components/store/advanced/trainer-dashboard-sidebar-panel'

export function ComponentsRegistryContent({ id }: { id?: string }) {
    const colors = [
        { label: 'Aluno', color: 'orange', icon: Zap },
        { label: 'Personal', color: 'emerald', icon: Activity },
        { label: 'Afiliado', color: 'amber', icon: Tag },
        { label: 'Admin', color: 'red', icon: Shield },
        { label: 'System', color: 'blue', icon: Info },
        { label: 'Default', color: 'zinc', icon: Tag },
    ] as const

    const iconOnlyVariants = [
        { variant: 'zinc' as const, icon: Settings, iconColor: 'zinc-400' as const },
        { variant: 'outline-orange' as const, icon: Zap, iconColor: 'orange' as const },
        { variant: 'outline-emerald' as const, icon: Check, iconColor: 'emerald' as const },
        { variant: 'outline-blue' as const, icon: Info, iconColor: 'blue' as const },
        { variant: 'outline-red' as const, icon: Trash2, iconColor: 'red' as const },
        { variant: 'outline-amber' as const, icon: Bell, iconColor: 'amber' as const },
        { variant: 'outline-orange' as const, icon: Plus, iconColor: 'orange' as const },
        { variant: 'outline-blue' as const, icon: Eye, iconColor: 'blue' as const },
    ]

    return (
        <Stack gap={STORE_TOKENS.SPACING.SECTION} id={id}>
            {/* New Main Buttons Section */}
            <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT}>
                <Stack direction={{ base: 'col', lg: 'row' }} justify="between" align={{ base: 'stretch', lg: 'end' }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                            <Icon icon={MousePointer2} color={STORE_TOKENS.COLORS.BRAND as any} size="lg" />
                            <Font variant="heading" weight="black" uppercase italic color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>Ações Principais (Call to Action)</Font>
                        </Inline>
                        <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.MUTED}>Botões de destaque para fluxos principais e conversão no ecossistema RepTrail.</Font>
                    </Stack>
                </Stack>
                <Grid cols={1} mdCols={2} gap={STORE_TOKENS.SPACING.CONTAINER}>
                    {/* System Radius Column - Solid Style */}
                    <GlassPanel padding={STORE_TOKENS.PADDING.CONTAINER}>
                        <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                            <Font
                                variant="sub-tiny"
                                weight="black"
                                uppercase
                                {...{
                                    color: STORE_TOKENS.COLORS.TEXT.DIM,
                                }}>System Radius (5px) - Solid Style</Font>
                            <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Button
                                    variant="orange"
                                    size="lg"
                                    rounded={STORE_TOKENS.RADIUS.SYSTEM}
                                    fullWidth
                                    text="Começar Agora"
                                    iconRight={ChevronRight} />
                                <Button
                                    variant="emerald"
                                    size="lg"
                                    rounded={STORE_TOKENS.RADIUS.SYSTEM}
                                    fullWidth
                                    text="Confirmar Matrícula"
                                    iconRight={Check} />
                                <Button
                                    variant="white"
                                    size="lg"
                                    rounded={STORE_TOKENS.RADIUS.SYSTEM}
                                    fullWidth
                                    text="Explorar Plataforma" />
                            </Stack>
                        </Stack>
                    </GlassPanel>

                    {/* Pill Style Column - Glass Style (Transparent + Border) */}
                    <GlassPanel padding={STORE_TOKENS.PADDING.CONTAINER}>
                        <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                            <Font
                                variant="sub-tiny"
                                weight="black"
                                uppercase
                                {...{
                                    color: STORE_TOKENS.COLORS.TEXT.DIM,
                                }}>Pill Style (Full Radius) - Glass Style</Font>
                            <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Button
                                    variant="outline-orange"
                                    size="lg"
                                    rounded={STORE_TOKENS.RADIUS.FULL}
                                    fullWidth
                                    text="Iniciar Treino"
                                    iconLeft={Zap} />
                                <Button
                                    variant="outline-emerald"
                                    size="lg"
                                    rounded={STORE_TOKENS.RADIUS.FULL}
                                    fullWidth
                                    text="Finalizar Aula"
                                    iconLeft={Check} />
                                <Button
                                    variant="zinc"
                                    size="lg"
                                    rounded={STORE_TOKENS.RADIUS.FULL}
                                    fullWidth
                                    text="Configurações Avançadas" />
                            </Stack>
                        </Stack>
                    </GlassPanel>
                </Grid>
            </Stack>
            <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT}>
                <Stack direction={{ base: 'col', lg: 'row' }} justify="between" align={{ base: 'stretch', lg: 'end' }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                            <Icon icon={Dumbbell} color={STORE_TOKENS.COLORS.BRAND as any} size="lg" />
                            <Font variant="heading" weight="black" uppercase italic color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>Grid & Row Actions</Font>
                        </Inline>
                        <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.MUTED}>Ações de alta densidade e indicadores de estado para listagens administrativas.</Font>
                    </Stack>
                </Stack>
                <Grid cols={1} mdCols={2} gap={STORE_TOKENS.SPACING.CONTAINER}>
                    {/* Actions Column (50%) */}
                    <GlassPanel padding={STORE_TOKENS.PADDING.CONTAINER}>
                        <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                            <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Font
                                    variant="sub-tiny"
                                    weight="black"
                                    uppercase
                                    {...{
                                        color: STORE_TOKENS.COLORS.TEXT.DIM,
                                    }}>Inline Row Actions</Font>
                                <Cluster gap={STORE_TOKENS.SPACING.ELEMENT}>
                                    <Button
                                        variant="outline-blue"
                                        rounded={STORE_TOKENS.RADIUS.FULL}
                                        size="sm"
                                        text="Inspecionar"
                                        iconLeft={Eye} />

                                    <Button
                                        variant="outline-red"
                                        rounded={STORE_TOKENS.RADIUS.FULL}
                                        size="sm"
                                        text="Deletar"
                                        iconLeft={Trash2} />

                                    <Button
                                        variant="outline-emerald"
                                        rounded={STORE_TOKENS.RADIUS.FULL}
                                        size="sm"
                                        text="Finalizar"
                                        iconLeft={Check} />

                                    <Button
                                        variant="zinc"
                                        rounded={STORE_TOKENS.RADIUS.FULL}
                                        isIconOnly
                                        size="sm"
                                        iconLeft={X} />
                                </Cluster>
                            </Stack>

                            <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Font
                                    variant="sub-tiny"
                                    weight="black"
                                    uppercase
                                    {...{
                                        color: STORE_TOKENS.COLORS.TEXT.DIM,
                                    }}>Circular Icon Actions (Pill Style)</Font>
                                <Cluster gap={STORE_TOKENS.SPACING.ELEMENT}>
                                    {iconOnlyVariants.map((v, i) => (
                                        <Button
                                            key={i}
                                            variant={v.variant}
                                            rounded={STORE_TOKENS.RADIUS.FULL}
                                            isIconOnly
                                            size="sm"
                                            iconLeft={v.icon} />
                                    ))}
                                </Cluster>
                            </Stack>
                        </Stack>
                    </GlassPanel>

                    {/* Badge Variations Column (50%) */}
                    <GlassPanel padding={STORE_TOKENS.PADDING.CONTAINER}>
                        <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                            <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Font
                                    variant="sub-tiny"
                                    weight="black"
                                    uppercase
                                    {...{
                                        color: STORE_TOKENS.COLORS.TEXT.DIM,
                                    }}>Status Variations</Font>
                                <Cluster gap={STORE_TOKENS.SPACING.CONTAINER}>
                                    <Badge label="Pendente" color={STORE_TOKENS.COLORS.WARNING} variant="dot" />
                                    <Badge label="Concluído" color={STORE_TOKENS.COLORS.SUCCESS} variant="dot" />
                                    <Badge label="Erro" color={STORE_TOKENS.COLORS.ERROR} variant="dot" />
                                </Cluster>
                            </Stack>

                            <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Font
                                    variant="sub-tiny"
                                    weight="black"
                                    uppercase
                                    {...{
                                        color: STORE_TOKENS.COLORS.TEXT.DIM,
                                    }}>Identity Badge Variations</Font>
                                <Cluster gap={STORE_TOKENS.SPACING.ELEMENT}>
                                    {colors.map((v) => (
                                        <Badge
                                            key={v.label}
                                            label={v.label}
                                            color={v.color as any}
                                            icon={v.icon}
                                            variant="solid"
                                        />
                                    ))}
                                </Cluster>
                            </Stack>
                        </Stack>
                    </GlassPanel>
                </Grid>
            </Stack>
            <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT}>
                <Stack direction={{ base: 'col', lg: 'row' }} justify="between" align={{ base: 'stretch', lg: 'end' }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                            <Icon icon={Shield} color={STORE_TOKENS.COLORS.BRAND as any} size="lg" />
                            <Font variant="heading" weight="black" uppercase italic color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>Trainer Dashboard Sidebar</Font>
                        </Inline>
                        <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.MUTED}>Sidebar operacional do personal com código da equipe, atalhos do perfil público e teaser de importação.</Font>
                    </Stack>
                </Stack>
                <Grid cols={{ base: 1, lg: 2 }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <TrainerDashboardSidebarPanel
                        trainerCode="2EBCED"
                        editProfileHref="/dashboard/trainer/profile"
                        publicProfileHref="/personal/2EBCED"
                        showImportTeaser
                        importHref="/dashboard/trainer/import-pdf"
                    />

                    <TrainerDashboardSidebarPanel
                        trainerCode={null}
                        editProfileHref="/dashboard/trainer/profile"
                        showImportTeaser={false}
                    />
                </Grid>
            </Stack>
            <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT}>
                <Stack direction={{ base: 'col', lg: 'row' }} justify="between" align={{ base: 'stretch', lg: 'end' }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                            <Icon icon={Settings} color={STORE_TOKENS.COLORS.BRAND as any} size="lg" />
                            <Font variant="heading" weight="black" uppercase italic color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>Inputs & Form Control</Font>
                        </Inline>
                        <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.MUTED}>Componentes de captura de dados com máscaras inteligentes, validação visual e estados de foco emerald.</Font>
                    </Stack>
                </Stack>
                <Grid cols={1} mdCols={2} gap={STORE_TOKENS.SPACING.EMPTY_STATE}>
                    {/* Basic & Identity Column */}
                    <GlassPanel padding={STORE_TOKENS.PADDING.CONTAINER}>
                        <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                            <Font
                                variant="sub-tiny"
                                weight="black"
                                uppercase
                                {...{
                                    color: STORE_TOKENS.COLORS.TEXT.DIM,
                                }}>Identity & Data</Font>

                            <Grid cols={1} mdCols={2} gap={STORE_TOKENS.SPACING.CONTAINER}>
                                <Input label="Nome Completo" placeholder="Ex: Marcos Silva" icon={<Icon icon={User} size="xs" />} />
                                <Input label="CPF" placeholder="000.000.000-00" mask="cpf" icon={<Icon icon={Tag} size="xs" />} />
                            </Grid>

                            <Input label="Email" placeholder="contato@reptrail.com" type="email" icon={<Icon icon={Mail} size="xs" />} />

                            <Grid cols={1} mdCols={2} gap={STORE_TOKENS.SPACING.CONTAINER}>
                                <Input label="Telefone" placeholder="(00) 00000-0000" mask="phone" icon={<Icon icon={Phone} size="xs" />} />
                                <Input label="Data de Nasc." placeholder="DD/MM/AAAA" mask="date" icon={<Icon icon={Calendar} size="xs" />} />
                            </Grid>

                            <Input label="Senha" type="password" placeholder="••••••••" icon={<Icon icon={Lock} size="xs" />} />
                        </Stack>
                    </GlassPanel>

                    {/* Search & Media Column */}
                    <GlassPanel padding={STORE_TOKENS.PADDING.CONTAINER}>
                        <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                            <Font
                                variant="sub-tiny"
                                weight="black"
                                uppercase
                                {...{
                                    color: STORE_TOKENS.COLORS.TEXT.DIM,
                                }}>Search & Media</Font>

                            <Input
                                label="Busca Global"
                                placeholder="Procurar alunos, treinos ou registros..."
                                icon={<Icon icon={Search} size="xs" />}
                                rounded={STORE_TOKENS.RADIUS.FULL}
                            />

                            <Grid cols={1} mdCols={2} gap={STORE_TOKENS.SPACING.CONTAINER} align="start">
                                <FileUpload label="Foto de Perfil" variant="profile" />
                                <FileUpload label="Documento/Logo" variant="generic" />
                            </Grid>

                            <Input label="Number Input" placeholder="0.00" type="number" mask="number" />

                            <Textarea
                                label="Comentários Adicionais"
                                placeholder="Descreva observações médicas ou necessidades específicas..."
                            />
                        </Stack>
                    </GlassPanel>
                </Grid>
            </Stack>
            <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT}>
                <Stack direction={{ base: 'col', lg: 'row' }} justify="between" align={{ base: 'stretch', lg: 'end' }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                            <Icon icon={Check} color={STORE_TOKENS.COLORS.BRAND as any} size="lg" />
                            <Font variant="heading" weight="black" uppercase italic color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>Selection & Choices</Font>
                        </Inline>
                        <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.MUTED}>Controles de seleção customizados: switch segmentado, dropdown e checkbox com estados visuais premium.</Font>
                    </Stack>
                </Stack>
                <Grid cols={1} mdCols={3} gap={STORE_TOKENS.SPACING.CONTAINER} align="start">
                    {/* Switch */}
                    <GlassPanel shrink={0} padding={STORE_TOKENS.PADDING.CONTAINER}>
                        <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                            <Font
                                variant="sub-tiny"
                                weight="black"
                                uppercase
                                {...{
                                    color: STORE_TOKENS.COLORS.TEXT.DIM,
                                }}>Segmented Switch</Font>
                            <FormSwitch
                                label="Plano de Treino"
                                options={[
                                    { label: 'Básico', value: 'basic' },
                                    { label: 'Avançado', value: 'advanced' },
                                    { label: 'Elite', value: 'elite' },
                                ]}
                                color={STORE_TOKENS.COLORS.SUCCESS}
                            />
                            <FormSwitch
                                label="Período"
                                options={[
                                    { label: 'Semana', value: 'week' },
                                    { label: 'Mês', value: 'month' },
                                    { label: 'Ano', value: 'year' },
                                ]}
                                color={STORE_TOKENS.COLORS.BRAND}
                            />
                        </Stack>
                    </GlassPanel>

                    {/* Select */}
                    <GlassPanel shrink={0} position="relative" padding={STORE_TOKENS.PADDING.CONTAINER}>
                        <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                            <Font
                                variant="sub-tiny"
                                weight="black"
                                uppercase
                                {...{
                                    color: STORE_TOKENS.COLORS.TEXT.DIM,
                                }}>Custom Select</Font>
                            <Box as="div">
                                <FormSelect
                                    label="Nível do Aluno"
                                    placeholder="Selecionar nível..."
                                    options={[
                                        { label: 'Iniciante', value: 'beginner', description: 'Menos de 6 meses de treino' },
                                        { label: 'Intermediário', value: 'intermediate', description: '6 meses a 2 anos' },
                                        { label: 'Avançado', value: 'advanced', description: 'Mais de 2 anos' },
                                        { label: 'Elite', value: 'elite', description: 'Atleta competitivo' },
                                    ]}
                                />
                            </Box>
                        </Stack>
                    </GlassPanel>

                    {/* Checkbox */}
                    <GlassPanel shrink={0} padding={STORE_TOKENS.PADDING.CONTAINER}>
                        <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                            <Font
                                variant="sub-tiny"
                                weight="black"
                                uppercase
                                {...{
                                    color: STORE_TOKENS.COLORS.TEXT.DIM,
                                }}>Checkboxes</Font>
                            <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                                <FormCheckbox
                                    label="Receber notificações"
                                    description="Avisos de treinos e atualizações do sistema."
                                    color={STORE_TOKENS.COLORS.SUCCESS}
                                    checked
                                />
                                <FormCheckbox
                                    label="Modo competição"
                                    description="Habilita ranking e comparativos entre alunos."
                                    color={STORE_TOKENS.COLORS.BRAND}
                                    checked
                                />
                                <FormCheckbox
                                    label="Aceito os termos"
                                    description="Li e concordo com os termos de uso da plataforma."
                                    color={STORE_TOKENS.COLORS.INFO}
                                />
                            </Stack>
                        </Stack>
                    </GlassPanel>
                </Grid>
            </Stack>
        </Stack>
    );
}
