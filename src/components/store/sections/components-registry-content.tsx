'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { Icon } from '@/components/store/base/icon'
import { Button } from '@/components/store/base/button'
import { Grid } from '@/components/store/base/grid'
import { Box } from '@/components/store/base/box'
import { RegistrySection } from '@/components/store/advanced/registry-section'
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
        <React.Fragment>
            {/* New Main Buttons Section */}
            <RegistrySection
                id={id}
                title="Ações Principais (Call to Action)"
                icon={MousePointer2}
                subtitle="Botões de destaque para fluxos principais e conversão no ecossistema RepTrail."
            >
                <Grid cols={1} mdCols={2} gap={STORE_TOKENS.SPACING.CONTAINER}>
                    {/* System Radius Column - Solid Style */}
                    <GlassPanel padding={STORE_TOKENS.PADDING.CONTAINER}>
                        <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                            <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.DIM} weight="black" uppercase>System Radius (5px) - Solid Style</Font>
                            <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Button variant="orange" size="lg" rounded={STORE_TOKENS.RADIUS.SYSTEM} fullWidth textColor={STORE_TOKENS.COLORS.BLACK}>
                                    <Inline gap={STORE_TOKENS.SPACING.ELEMENT}>
                                        Começar Agora <Icon icon={ChevronRight} size="sm" color={STORE_TOKENS.COLORS.BLACK} />
                                    </Inline>
                                </Button>
                                <Button variant="emerald" size="lg" rounded={STORE_TOKENS.RADIUS.SYSTEM} fullWidth textColor={STORE_TOKENS.COLORS.BLACK}>
                                    <Inline gap={STORE_TOKENS.SPACING.ELEMENT}>
                                        Confirmar Matrícula <Icon icon={Check} size="sm" color={STORE_TOKENS.COLORS.BLACK} />
                                    </Inline>
                                </Button>
                                <Button variant="white" size="lg" rounded={STORE_TOKENS.RADIUS.SYSTEM} fullWidth>
                                    Explorar Plataforma
                                </Button>
                            </Stack>
                        </Stack>
                    </GlassPanel>

                    {/* Pill Style Column - Glass Style (Transparent + Border) */}
                    <GlassPanel padding={STORE_TOKENS.PADDING.CONTAINER}>
                        <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                            <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.DIM} weight="black" uppercase>Pill Style (Full Radius) - Glass Style</Font>
                            <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Button variant="outline-orange" size="lg" rounded={STORE_TOKENS.RADIUS.FULL} fullWidth>
                                    <Inline gap={STORE_TOKENS.SPACING.ELEMENT}>
                                        <Icon icon={Zap} size="sm" /> Iniciar Treino
                                    </Inline>
                                </Button>
                                <Button variant="outline-emerald" size="lg" rounded={STORE_TOKENS.RADIUS.FULL} fullWidth>
                                    <Inline gap={STORE_TOKENS.SPACING.ELEMENT}>
                                        <Icon icon={Check} size="sm" /> Finalizar Aula
                                    </Inline>
                                </Button>
                                <Button variant="zinc" size="lg" rounded={STORE_TOKENS.RADIUS.FULL} fullWidth>
                                    Configurações Avançadas
                                </Button>
                            </Stack>
                        </Stack>
                    </GlassPanel>
                </Grid>
            </RegistrySection>
            <RegistrySection
                title="Grid & Row Actions"
                icon={Dumbbell}
                subtitle="Ações de alta densidade e indicadores de estado para listagens administrativas."
            >
                <Grid cols={1} mdCols={2} gap={STORE_TOKENS.SPACING.CONTAINER}>
                    {/* Actions Column (50%) */}
                    <GlassPanel padding={STORE_TOKENS.PADDING.CONTAINER}>
                        <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                            <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.DIM} weight="black" uppercase>Inline Row Actions</Font>
                                <Cluster gap={STORE_TOKENS.SPACING.ELEMENT}>
                                    <Button variant="outline-blue" rounded={STORE_TOKENS.RADIUS.FULL} size="sm">
                                        <Inline gap={STORE_TOKENS.SPACING.ELEMENT}>
                                            <Icon icon={Eye} size="xs" color={STORE_TOKENS.COLORS.INFO} />
                                            <Font variant="auxiliary" weight="black" italic uppercase color={STORE_TOKENS.COLORS.INFO}>Inspecionar</Font>
                                        </Inline>
                                    </Button>

                                    <Button variant="outline-red" rounded={STORE_TOKENS.RADIUS.FULL} size="sm">
                                        <Inline gap={STORE_TOKENS.SPACING.ELEMENT}>
                                            <Icon icon={Trash2} size="xs" color={STORE_TOKENS.COLORS.ERROR} />
                                            <Font variant="auxiliary" weight="black" italic uppercase color={STORE_TOKENS.COLORS.ERROR}>Deletar</Font>
                                        </Inline>
                                    </Button>

                                    <Button variant="outline-emerald" rounded={STORE_TOKENS.RADIUS.FULL} size="sm">
                                        <Inline gap={STORE_TOKENS.SPACING.ELEMENT}>
                                            <Icon icon={Check} size="xs" color={STORE_TOKENS.COLORS.SUCCESS} />
                                            <Font variant="auxiliary" weight="black" italic uppercase color={STORE_TOKENS.COLORS.SUCCESS}>Finalizar</Font>
                                        </Inline>
                                    </Button>

                                    <Button variant="zinc" rounded={STORE_TOKENS.RADIUS.FULL} isIconOnly size="sm">
                                        <Icon icon={X} size="xs" />
                                    </Button>
                                </Cluster>
                            </Stack>

                            <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.DIM} weight="black" uppercase>Circular Icon Actions (Pill Style)</Font>
                                <Cluster gap={STORE_TOKENS.SPACING.ELEMENT}>
                                    {iconOnlyVariants.map((v, i) => (
                                        <Button
                                            key={i}
                                            variant={v.variant}
                                            rounded={STORE_TOKENS.RADIUS.FULL}
                                            isIconOnly
                                            size="sm"
                                        >
                                            <Icon icon={v.icon} size="xs" color={v.iconColor} />
                                        </Button>
                                    ))}
                                </Cluster>
                            </Stack>
                        </Stack>
                    </GlassPanel>

                    {/* Badge Variations Column (50%) */}
                    <GlassPanel padding={STORE_TOKENS.PADDING.CONTAINER}>
                        <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                            <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.DIM} weight="black" uppercase>Status Variations</Font>
                                <Cluster gap={STORE_TOKENS.SPACING.CONTAINER}>
                                    <Badge label="Pendente" color={STORE_TOKENS.COLORS.WARNING} variant="dot" />
                                    <Badge label="Concluído" color={STORE_TOKENS.COLORS.SUCCESS} variant="dot" />
                                    <Badge label="Erro" color={STORE_TOKENS.COLORS.ERROR} variant="dot" />
                                </Cluster>
                            </Stack>

                            <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.DIM} weight="black" uppercase>Identity Badge Variations</Font>
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
            </RegistrySection>
            <RegistrySection
                title="Trainer Dashboard Sidebar"
                icon={Shield}
                subtitle="Sidebar operacional do personal com código da equipe, atalhos do perfil público e teaser de importação."
            >
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
            </RegistrySection>
            <RegistrySection
                title="Inputs & Form Control"
                icon={Settings}
                subtitle="Componentes de captura de dados com máscaras inteligentes, validação visual e estados de foco emerald."
            >
                <Grid cols={1} mdCols={2} gap={STORE_TOKENS.SPACING.EMPTY_STATE}>
                    {/* Basic & Identity Column */}
                    <GlassPanel padding={STORE_TOKENS.PADDING.CONTAINER}>
                        <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                            <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.DIM} weight="black" uppercase>Identity & Data</Font>

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
                            <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.DIM} weight="black" uppercase>Search & Media</Font>

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
            </RegistrySection>
            <RegistrySection
                title="Selection & Choices"
                icon={Check}
                subtitle="Controles de seleção customizados: switch segmentado, dropdown e checkbox com estados visuais premium."
            >
                <Grid cols={1} mdCols={3} gap={STORE_TOKENS.SPACING.CONTAINER} align="start">
                    {/* Switch */}
                    <GlassPanel shrink={0} padding={STORE_TOKENS.PADDING.CONTAINER}>
                        <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                            <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.DIM} weight="black" uppercase>Segmented Switch</Font>
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
                                color="orange"
                            />
                        </Stack>
                    </GlassPanel>

                    {/* Select */}
                    <GlassPanel shrink={0} position="relative" padding={STORE_TOKENS.PADDING.CONTAINER}>
                        <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                            <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.DIM} weight="black" uppercase>Custom Select</Font>
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
                            <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.DIM} weight="black" uppercase>Checkboxes</Font>
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
                                    color="orange"
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
            </RegistrySection>
        </React.Fragment>
    );
}
