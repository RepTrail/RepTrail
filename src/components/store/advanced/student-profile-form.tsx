'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Grid } from '@/components/store/base/grid'
import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { Input } from '@/components/store/base/input'
import { Textarea } from '@/components/store/base/textarea'
import { FormSelect } from '@/components/store/base/form-select'
import { FormCheckbox } from '@/components/store/base/form-checkbox'
import { Button } from '@/components/store/base/button'
import { Surface } from '@/components/store/base/surface'
import { Icon } from '@/components/store/base/icon'
import { 
    User, 
    Calendar, 
    Ruler, 
    Activity, 
    Target, 
    Phone, 
    Save 
} from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

/**
 * StudentProfileForm: Advanced component encapsulating the profile editing interface.
 * Extracted from StudentProfileSectionContent.
 * Preserves the 2-column grid and all form element configurations.
 */
export function StudentProfileForm() {
    return (
        <Surface variant="glass" padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} border="none">
            <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                {/* Form Grid */}
                <Grid mdCols={2} gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Input 
                        label="NOME COMPLETO"
                        icon={<User size={16} />}
                        placeholder="Ex: João Silva" 
                        defaultValue="Marcos Vinicius"
                    />

                    <Input 
                        label="DATA DE NASCIMENTO"
                        icon={<Calendar size={16} />}
                        placeholder="DD/MM/AAAA" 
                        defaultValue="15/05/1995"
                    />

                    <Input 
                        label="ALTURA (CM)"
                        icon={<Ruler size={16} />}
                        type="number"
                        placeholder="Ex: 180" 
                        defaultValue="185"
                    />

                    <Input 
                        label="PERCENTUAL DE GORDURA (BF %)"
                        icon={<Activity size={16} />}
                        type="number"
                        placeholder="Ex: 15.5" 
                        defaultValue="12.5"
                    />

                    <Input 
                        label="OBJETIVO PRINCIPAL"
                        icon={<Target size={16} />}
                        placeholder="Ex: Hipertrofia Máxima" 
                        defaultValue="Performance"
                    />

                    <Input 
                        label="WHATSAPP (COM DDD)"
                        icon={<Phone size={16} />}
                        placeholder="Ex: 55 11 99999-9999" 
                        defaultValue="55 11 98888-7777"
                    />

                    <Box mdColSpan={2}>
                        <FormSelect 
                            label="NÍVEL DE ATIVIDADE"
                            options={[
                                { value: 'sedentary', label: 'Sedentário' },
                                { value: 'light', label: 'Levemente Ativo' },
                                { value: 'moderate', label: 'Moderado' },
                                { value: 'active', label: 'Muito Ativo' },
                                { value: 'athlete', label: 'Atleta / Extremo' },
                            ]}
                            value="moderate"
                        />
                    </Box>

                    <Box mdColSpan={2}>
                        <Surface variant="glass" padding={STORE_TOKENS.PADDING.CONTAINER} border="none" rounded={STORE_TOKENS.RADIUS.SYSTEM}>
                            <FormCheckbox 
                                label="USO DE ERGOGÊNICOS / HORMÔNIOS"
                                description="Esta informação é importante para que seu treinador ajuste seu protocolo corretamente."
                                checked={true}
                            />
                        </Surface>
                    </Box>

                    <Box mdColSpan={2}>
                        <Textarea 
                            label="OBSERVAÇÕES MÉDICAS / IMPORTANTES"
                            placeholder="Ex: Lesão no ombro direito, asma..." 
                            defaultValue="Nenhuma observação relevante."
                        />
                    </Box>
                </Grid>

                <Box height="px" bg="white" bgOpacity={5} fullWidth />

                {/* Footer */}
                <Stack direction={{ base: 'col', md: 'row' }} align="center" justify="between" gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Box flex1>
                        <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.MUTED} weight="bold" uppercase tracking="tight">
                            Após salvar, algumas informações podem levar alguns segundos para atualizar em todo o sistema.
                        </Font>
                    </Box>
                    <Button variant="outline-emerald" size="lg" fullWidth={{ base: true, md: false }}>
                        <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Font variant="body-sm" weight="black" uppercase italic>SALVAR ALTERAÇÕES</Font>
                            <Icon icon={Save} size="xs" />
                        </Stack>
                    </Button>
                </Stack>
            </Stack>
        </Surface>
    )
}
