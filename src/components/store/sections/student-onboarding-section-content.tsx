'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Box } from '@/components/store/base/box'
import { Grid } from '@/components/store/base/grid'
import { GlassPanel } from '@/components/store/base/surface'
import { Input } from '@/components/store/base/input'
import { FormSelect } from '@/components/store/base/form-select'
import { FormCheckbox } from '@/components/store/base/form-checkbox'
import { Textarea } from '@/components/store/base/textarea'
import { Button } from '@/components/store/base/button'
import { Icon } from '@/components/store/base/icon'
import { Badge } from '@/components/store/base/badge'
import { 
    Activity, 
    Target, 
    ShieldCheck, 
    Ruler, 
    Weight, 
    Code, 
    Zap, 
    Calendar,
    ChevronRight,
    LucideIcon
} from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

/**
 * StudentOnboardingSectionContent: Refactored onboarding flow for students.
 * - Zero Manual Styling: Strictly uses Design System primitives and tokens.
 * - Clean Typography: No manual letter-spacing or uppercase on descriptions.
 */
export function StudentOnboardingSectionContent() {
    return (
        <Stack gap={STORE_TOKENS.SPACING.CONTAINER} fullWidth>
            {/* STEP 1: Biometrics */}
            <OnboardingStep 
                index={1}
                title="Biometria de Elite" 
                description="Dados corporais fundamentais para o cálculo de protocolos."
                icon={Activity}
            >
                <Grid cols={{ base: 2.5, md: 2 }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Input 
                        label="Altura (cm)" 
                        placeholder="Ex: 175" 
                        type="number"
                        icon={<Ruler size={16} />}
                    />
                    <Input 
                        label="Peso Atual (kg)" 
                        placeholder="Ex: 80.5" 
                        type="number"
                        step="0.1"
                        icon={<Weight size={16} />}
                    />
                    <Input 
                        label="Gordura Estimada (%)" 
                        placeholder="Opcional" 
                        type="number"
                        step="0.1"
                        icon={<Zap size={16} />}
                    />
                    <Input 
                        label="Data de Nascimento" 
                        placeholder="DD/MM/AAAA" 
                        mask="date"
                        icon={<Calendar size={16} />}
                    />
                </Grid>
            </OnboardingStep>

            {/* STEP 2: Lifestyle & Goal */}
            <OnboardingStep 
                index={2}
                title="Perfil Metabólico" 
                description="Seu ritmo atual e onde você quer chegar."
                icon={Target}
            >
                <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <FormSelect 
                        label="Nível de Atividade"
                        placeholder="Selecione seu ritmo..."
                        options={[
                            { value: 'sedentary', label: 'Sedentário', description: 'Pouco ou nenhum exercício' },
                            { value: 'light', label: 'Leve', description: '1-3 dias por semana' },
                            { value: 'moderate', label: 'Moderado', description: '3-5 dias por semana' },
                            { value: 'active', label: 'Ativo', description: '6-7 dias por semana' },
                            { value: 'athlete', label: 'Elite', description: 'Atleta Profissional' },
                        ]}
                    />
                    <Input 
                        label="Objetivo Principal" 
                        placeholder="Ex: Hipertrofia Máxima, Definição..." 
                        icon={<Target size={16} />}
                    />
                </Stack>
            </OnboardingStep>

            {/* STEP 3: Governança & Vínculo */}
            <OnboardingStep 
                index={3}
                title="Governança & Vínculo" 
                description="Dados de segurança e conexão com seu treinador."
                icon={ShieldCheck}
            >
                <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Textarea 
                        label="Observações Médicas / Lesões"
                        placeholder="Ex: Dores no joelho, cirurgias, limitações..."
                        rows={4}
                    />

                    <FormCheckbox 
                        label="FAÇO USO DE RECURSOS ERGOGÊNICOS" 
                        description="Informação confidencial para ajuste fino de volume e intensidade pelo seu treinador."
                        color="primary"
                    />

                    <Input 
                        label="Código do Personal" 
                        placeholder="Ex: TREINADOR123" 
                        icon={<Code size={16} />}
                    />
                </Stack>
            </OnboardingStep>

            {/* Final Action (Visual Representation) */}
            <Button variant="primary" size="lg" fullWidth rounded={STORE_TOKENS.RADIUS.SYSTEM}>
                <Stack direction="row" align="center" justify="center" gap={2.5}>
                    <Font variant="sub-tiny" weight="black" uppercase tracking="widest">Finalizar Protocolo de Onboarding</Font>
                    <ChevronRight size={14} />
                </Stack>
            </Button>
        </Stack>
    )
}

/**
 * OnboardingStep Wrapper: Standardizes the visual block for each step.
 */
function OnboardingStep({ 
    index, 
    title, 
    description, 
    icon, 
    children 
}: { 
    index: number, 
    title: string, 
    description: string, 
    icon: LucideIcon, 
    children: React.ReactNode 
}) {
    return (
        <GlassPanel padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} variant="glass">
            <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Stack 
                    direction={{ base: 'col', md: 'row' }} 
                    align={{ base: 'start', md: 'center' }} 
                    justify="between" 
                    gap={STORE_TOKENS.SPACING.ELEMENT}
                >
                    <Box display={{ base: 'block', md: 'none' }}>
                        <Badge label={`ETAPA ${index}`} variant="glass" color="zinc" size="xs" />
                    </Box>

                    <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Box 
                            padding={STORE_TOKENS.PADDING.ELEMENT} 
                            bg="primary" 
                            bgOpacity={10} 
                            rounded={STORE_TOKENS.RADIUS.SYSTEM}
                            border
                            borderColor="primary"
                        >
                            <Icon icon={icon} size="sm" color="primary" />
                        </Box>
                        <Stack gap={0}>
                            <Font variant="h4" weight="black" uppercase italic color="white">
                                {title}
                            </Font>
                            <Font variant="sub-tiny" color="zinc-500" weight="bold" uppercase={false}>
                                Etapa 0{index} • {description}
                            </Font>
                        </Stack>
                    </Stack>

                    <Box display={{ base: 'none', md: 'block' }}>
                        <Badge label={`ETAPA ${index}`} variant="glass" color="zinc" size="xs" />
                    </Box>
                </Stack>
                
                {children}
            </Stack>
        </GlassPanel>
    )
}
