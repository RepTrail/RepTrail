'use client'

import React, { useState, useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { submitOnboarding } from '@/lib/dal/remote'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Grid } from '@/components/store/base/grid'
import { Input } from '@/components/store/base/input'
import { FormSelect } from '@/components/store/base/form-select'
import { FormCheckbox } from '@/components/store/base/form-checkbox'
import { Textarea } from '@/components/store/base/textarea'
import { Button } from '@/components/store/base/button'
import { Box } from '@/components/store/base/box'
import { Surface } from '@/components/store/base/surface'
import { Icon } from '@/components/store/base/icon'
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
    ChevronLeft,
    Loader2
} from 'lucide-react'
import { DomainStepCard } from '../intermediary/domain-step-card'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { RegistryProvider } from './registry-context'

const initialState = {
    message: '',
    errors: {} as Record<string, string[]>
}

/**
 * StudentOnboardingForm: Orchestrates the multi-step form composition.
 * - Encapsulates all inputs, selects, and checkboxes for the onboarding flow.
 * - Handles the internal validation structure and grouping.
 * - Responsibility: Onboarding domain logic and form flow.
 */
export function StudentOnboardingForm({ defaultTrainerCode = '' }: { defaultTrainerCode?: string }) {
    const [state, formAction] = useActionState(submitOnboarding, initialState)
    const [step, setStep] = useState(1)
    
    // Step 1 States
    const [height, setHeight] = useState('')
    const [startingWeight, setStartingWeight] = useState('')
    const [estimatedBf, setEstimatedBf] = useState('')
    const [displayBirthDate, setDisplayBirthDate] = useState('')
    const [birthDate, setBirthDate] = useState('')

    // Step 2 States
    const [activityLevel, setActivityLevel] = useState('moderate')
    const [goal, setGoal] = useState('')

    // Step 3 States
    const [steroidUse, setSteroidUse] = useState(false)
    const [observations, setObservations] = useState('')
    const [imageAuth, setImageAuth] = useState('false')
    const [trainerCode, setTrainerCode] = useState(defaultTrainerCode)

    // Handle Date conversion from DD/MM/YYYY to YYYY-MM-DD
    const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setDisplayBirthDate(value)

        // The date mask returns DD/MM/YYYY. If it has 10 characters:
        if (value.length === 10) {
            const parts = value.split('/')
            if (parts.length === 3) {
                const day = parts[0]
                const month = parts[1]
                const year = parts[2]
                setBirthDate(`${year}-${month}-${day}`)
            }
        } else {
            setBirthDate('')
        }
    }

    const nextStep = () => setStep((s) => Math.min(s + 1, 3))
    const prevStep = () => setStep((s) => Math.max(s - 1, 1))

    // Validations to disable buttons
    const isStep1Valid = height && startingWeight && birthDate
    const isStep2Valid = goal && goal.trim().length >= 3

    // Inner loading submit button
    function SubmitButton() {
        const { pending } = useFormStatus()
        return (
            <Button
                type="submit"
                variant="primary"
                size="lg"
                flex1
                disabled={pending}
            >
                <Stack direction="row" align="center" justify="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                    {pending ? (
                        <>
                            <Icon icon={Loader2} animate="spin" size="sm" color={STORE_TOKENS.COLORS.BLACK} />
                            <Font variant="sub-tiny" weight="black" uppercase tracking="widest">Finalizando...</Font>
                        </>
                    ) : (
                        <>
                            <Font variant="sub-tiny" weight="black" uppercase tracking="widest">Finalizar Cadastro</Font>
                            <Icon icon={ShieldCheck} size="sm" color={STORE_TOKENS.COLORS.BLACK} />
                        </>
                    )}
                </Stack>
            </Button>
        );
    }

    return (
        <RegistryProvider defaultColor="orange">
            <form
                action={formAction}
                noValidate
                {...{
                    className: "w-full",
                }}>
                {/* Hidden inputs to guarantee they are always submitted */}
                <input type="hidden" name="height" value={height} />
                <input type="hidden" name="startingWeight" value={startingWeight} />
                <input type="hidden" name="estimatedBf" value={estimatedBf} />
                <input type="hidden" name="birthDate" value={birthDate} />
                <input type="hidden" name="goal" value={goal} />
                <input type="hidden" name="activityLevel" value={activityLevel} />
                <input type="hidden" name="imageAuth" value={imageAuth} />
                <input type="hidden" name="trainerCode" value={trainerCode} />
                <input type="hidden" name="observations" value={observations} />
                {steroidUse && <input type="hidden" name="steroidUse" value="on" />}

                <Stack gap={STORE_TOKENS.SPACING.CONTAINER} fullWidth>
                    {/* Error Messages */}
                    {state?.message && (
                        <Surface 
                            variant="tonal-red"
                            padding={STORE_TOKENS.PADDING.ELEMENT} 
                            rounded={STORE_TOKENS.RADIUS.SYSTEM} 
                            display="flex" 
                            align="center" 
                            minHeight={44}
                        >
                            <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Font
                                    variant="sub-tiny"
                                    weight="black"
                                    uppercase
                                    tracking="widest"
                                    {...{
                                        color: "error",
                                    }}>{state.message}</Font>
                                {state.errors && Object.keys(state.errors).length > 0 && (
                                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                        {Object.entries(state.errors).map(([field, msgs]) => (
                                            <Font
                                                key={field}
                                                variant="sub-tiny"
                                                {...{
                                                    color: "error",
                                                }}>
                                                <Font
                                                    variant="sub-tiny"
                                                    weight="bold"
                                                    {...{
                                                        color: "error",
                                                    }}>{field}:</Font> {msgs?.join(', ')}
                                            </Font>
                                        ))}
                                    </Stack>
                                )}
                            </Stack>
                        </Surface>
                    )}

                    {/* STEP 1: Biometrics */}
                    {step === 1 && (
                        <DomainStepCard 
                            index={1}
                            title="Biometria de Elite" 
                            description="Dados corporais fundamentais para o cálculo de protocolos."
                            icon={Activity}
                            accentColor="orange"
                        >
                            <Grid cols={{ base: 1, md: 2 }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                                <Input 
                                    id="height"
                                    label="Altura (cm)" 
                                    placeholder="Ex: 175" 
                                    type="number"
                                    value={height}
                                    onChange={(e) => setHeight(e.target.value)}
                                    icon={<Ruler size={16} />}
                                />
                                <Input 
                                    id="startingWeight"
                                    label="Peso Atual (kg)" 
                                    placeholder="Ex: 80.5" 
                                    type="number"
                                    step="0.1"
                                    value={startingWeight}
                                    onChange={(e) => setStartingWeight(e.target.value)}
                                    icon={<Weight size={16} />}
                                />
                                <Input 
                                    id="estimatedBf"
                                    label="Gordura Estimada (%)" 
                                    placeholder="Opcional" 
                                    type="number"
                                    step="0.1"
                                    value={estimatedBf}
                                    onChange={(e) => setEstimatedBf(e.target.value)}
                                    icon={<Zap size={16} />}
                                />
                                <Input 
                                    id="displayBirthDate"
                                    label="Data de Nascimento" 
                                    placeholder="DD/MM/AAAA" 
                                    mask="date"
                                    value={displayBirthDate}
                                    onChange={handleBirthDateChange}
                                    icon={<Calendar size={16} />}
                                />
                            </Grid>
                        </DomainStepCard>
                    )}

                    {/* STEP 2: Lifestyle & Goal */}
                    {step === 2 && (
                        <DomainStepCard 
                            index={2}
                            title="Perfil Metabólico" 
                            description="Seu ritmo atual e onde você quer chegar."
                            icon={Target}
                            accentColor="orange"
                        >
                            <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                                <FormSelect 
                                    label="Nível de Atividade"
                                    placeholder="Selecione seu ritmo..."
                                    value={activityLevel}
                                    onChange={setActivityLevel}
                                    options={[
                                        { value: 'sedentary', label: 'Sedentário', description: 'Pouco ou nenhum exercício' },
                                        { value: 'light', label: 'Leve', description: '1-3 dias por semana' },
                                        { value: 'moderate', label: 'Moderado', description: '3-5 dias por semana' },
                                        { value: 'active', label: 'Ativo', description: '6-7 dias por semana' },
                                        { value: 'athlete', label: 'Elite', description: 'Atleta Profissional' },
                                    ]}
                                />
                                <Input 
                                    id="goal"
                                    label="Objetivo Principal" 
                                    placeholder="Ex: Hipertrofia Máxima, Definição..." 
                                    value={goal}
                                    onChange={(e) => setGoal(e.target.value)}
                                    icon={<Target size={16} />}
                                />
                            </Stack>
                        </DomainStepCard>
                    )}

                    {/* STEP 3: Governança & Vínculo */}
                    {step === 3 && (
                        <DomainStepCard 
                            index={3}
                            title="Governança & Vínculo" 
                            description="Dados de segurança e conexão com seu treinador."
                            icon={ShieldCheck}
                            accentColor="orange"
                        >
                            <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                                <Textarea 
                                    id="observations"
                                    label="Observações Médicas / Lesões"
                                    placeholder="Ex: Dores no joelho, cirurgias, limitações..."
                                    rows={4}
                                    value={observations}
                                    onChange={(e) => setObservations(e.target.value)}
                                />

                                <FormCheckbox 
                                    name="steroidUse"
                                    label="FAÇO USO DE RECURSOS ERGOGÊNICOS" 
                                    description="Informação confidencial para ajuste fino de volume e intensidade pelo seu treinador."
                                    color={STORE_TOKENS.COLORS.BRAND}
                                    checked={steroidUse}
                                    onChange={setSteroidUse}
                                />

                                <Input 
                                    id="trainerCode"
                                    label="Código do Personal" 
                                    placeholder="Ex: TREINADOR123" 
                                    value={trainerCode}
                                    onChange={(e) => setTrainerCode(e.target.value)}
                                    icon={<Code size={16} />}
                                />
                            </Stack>
                        </DomainStepCard>
                    )}

                    {/* Actions Navigation Bar */}
                    <Stack direction={{ base: 'col', md: 'row' }} gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth>
                        {step > 1 && (
                            <Button 
                                type="button" 
                                variant="outline-primary" 
                                size="lg" 
                                onClick={prevStep}
                            >
                                <Stack direction="row" align="center" justify="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                    <Icon icon={ChevronLeft} size="sm" />
                                    <Font variant="sub-tiny" weight="black" uppercase tracking="widest">Voltar</Font>
                                </Stack>
                            </Button>
                        )}
                        
                        {step < 3 ? (
                            <Button 
                                type="button" 
                                variant="primary" 
                                size="lg" 
                                flex1
                                disabled={step === 1 ? !isStep1Valid : !isStep2Valid}
                                onClick={nextStep}
                            >
                                <Stack direction="row" align="center" justify="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                    <Font variant="sub-tiny" weight="black" uppercase tracking="widest">Próximo</Font>
                                    <Icon icon={ChevronRight} size="sm" />
                                </Stack>
                            </Button>
                        ) : (
                            <SubmitButton />
                        )}
                    </Stack>
                </Stack>
            </form>
        </RegistryProvider>
    );
}
