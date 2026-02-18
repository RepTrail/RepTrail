'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { submitOnboarding } from '@/actions/onboarding-actions'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from 'react'
import {
    User,
    ChevronRight,
    ChevronLeft,
    Target,
    Activity,
    ShieldCheck,
    Dumbbell,
    Stethoscope,
    Code
} from 'lucide-react'
import { Logo } from "@/components/ui/logo"

const initialState = {
    message: '',
    errors: {}
}

function SteroidUseField() {
    const [checked, setChecked] = useState(false)
    return (
        <>
            {checked && <input type="hidden" name="steroidUse" value="on" />}
            <Checkbox
                id="steroidUse"
                checked={checked}
                onCheckedChange={(v) => setChecked(!!v)}
                className="border-zinc-800 data-[state=checked]:bg-emerald-500 data-[state=checked]:text-zinc-950"
            />
        </>
    )
}

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button
            type="submit"
            disabled={pending}
            className="w-full sm:flex-1 order-1 sm:order-2 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-black italic uppercase tracking-tight rounded-xl h-12 px-4 sm:px-8 shadow-xl shadow-emerald-500/30 group transition-all disabled:opacity-70 disabled:cursor-not-allowed min-w-0"
        >
            {pending ? (
                <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-950 border-t-transparent" />
                    Finalizando...
                </>
            ) : (
                <>
                    <ShieldCheck className="mr-2 h-5 w-5 shrink-0" /> Finalizar Cadastro
                </>
            )}
        </Button>
    )
}

export function OnboardingForm() {
    const [state, formAction] = useActionState(submitOnboarding, initialState)
    const [step, setStep] = useState(1)
    const [activityLevel, setActivityLevel] = useState('moderate')
    const [imageAuth, setImageAuth] = useState('false')
    const [height, setHeight] = useState('')
    const [startingWeight, setStartingWeight] = useState('')
    const [birthDate, setBirthDate] = useState('')
    const [goal, setGoal] = useState('')

    // Simple multi-step logic
    const nextStep = () => setStep(s => s + 1)
    const prevStep = () => setStep(s => s - 1)

    const StepProgress = ({ current }: { current: number }) => (
        <div className="flex gap-2 mb-8">
            {[1, 2, 3].map((s) => (
                <div
                    key={s}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${s <= current ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-zinc-800'
                        }`}
                />
            ))}
        </div>
    )

    return (
        <Card className="bg-zinc-900 border-zinc-800 shadow-2xl rounded-3xl overflow-hidden border-t-zinc-700/50">
            <CardHeader className="text-center space-y-4 pb-2">
                <div className="flex justify-center mb-2">
                    <Logo size="md" />
                </div>
                <CardTitle className="text-3xl font-black text-white italic uppercase tracking-tight">
                    Monte seu Perfil
                </CardTitle>
                <CardDescription className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">
                    Personalize sua experiência no RepTrail
                </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-8 overflow-x-hidden">
                <StepProgress current={step} />

                <form action={formAction} method="POST" noValidate className="space-y-8">
                    {/* Hidden inputs no topo do form (sempre enviados - inputs em divs ocultas podem ser excluídos) */}
                    <input type="hidden" name="height" value={height} />
                    <input type="hidden" name="startingWeight" value={startingWeight} />
                    <input type="hidden" name="birthDate" value={birthDate} />
                    <input type="hidden" name="goal" value={goal} />
                    <input type="hidden" name="activityLevel" value={activityLevel} />
                    <input type="hidden" name="imageAuth" value={imageAuth} />
                    {state?.message && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-widest rounded-xl text-center space-y-2">
                            <div>{state.message}</div>
                            {state.errors && Object.keys(state.errors).length > 0 && (
                                <div className="space-y-1 text-[10px] normal-case">
                                    {Object.entries(state.errors).map(([field, msgs]) => (
                                        <div key={field}><strong>{field}:</strong> {msgs?.join(', ')}</div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* STEP 1: Biometrics */}
                    <div className={step === 1 ? 'block space-y-6' : 'hidden'}>
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-2">
                                <Activity className="w-4 h-4 text-emerald-500" />
                                <h3 className="text-xs font-black text-white uppercase tracking-widest">Medidas Corporais</h3>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label htmlFor="height" className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Altura (cm)</Label>
                                    <Input
                                        id="height"
                                        type="number"
                                        placeholder="175"
                                        value={height}
                                        onChange={(e) => setHeight(e.target.value)}
                                        className="bg-zinc-950 border-zinc-800 text-white rounded-xl h-14 font-bold focus:ring-emerald-500/20"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label htmlFor="startingWeight" className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Peso Atual (kg)</Label>
                                    <Input
                                        id="startingWeight"
                                        type="number"
                                        step="0.1"
                                        placeholder="70.5"
                                        value={startingWeight}
                                        onChange={(e) => setStartingWeight(e.target.value)}
                                        className="bg-zinc-950 border-zinc-800 text-white rounded-xl h-14 font-bold focus:ring-emerald-500/20"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <Label htmlFor="birthDate" className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Data de Nascimento</Label>
                                <Input
                                    id="birthDate"
                                    type="date"
                                    value={birthDate}
                                    onChange={(e) => setBirthDate(e.target.value)}
                                    className="bg-zinc-950 border-zinc-800 text-white rounded-xl h-14 font-bold focus:ring-emerald-500/20"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end pt-4">
                            <Button
                                type="button"
                                onClick={nextStep}
                                disabled={!height || !startingWeight || !birthDate}
                                className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-black italic uppercase tracking-tight rounded-xl h-12 px-8 shadow-lg shadow-emerald-500/20 group transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Próximo <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </div>

                    {/* STEP 2: Activity & Goal */}
                    <div className={step === 2 ? 'block space-y-6' : 'hidden'}>
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-2">
                                <Target className="w-4 h-4 text-emerald-500" />
                                <h3 className="text-xs font-black text-white uppercase tracking-widest">Nível de Atividade</h3>
                            </div>

                            <RadioGroup value={activityLevel} onValueChange={setActivityLevel} className="grid gap-3">
                                {[
                                    { id: 'sedentary', label: 'Sedentário', sub: 'Pouco ou nenhum exercício' },
                                    { id: 'light', label: 'Leve', sub: '1-3 dias por semana' },
                                    { id: 'moderate', label: 'Moderado', sub: '3-5 dias por semana' },
                                    { id: 'active', label: 'Ativo', sub: '6-7 dias por semana' }
                                ].map((level) => (
                                    <Label
                                        key={level.id}
                                        htmlFor={level.id}
                                        className="flex items-center justify-between p-4 rounded-2xl bg-zinc-950 border border-zinc-800 cursor-pointer hover:border-zinc-700 transition-all group"
                                    >
                                        <div className="flex flex-col gap-1">
                                            <span className="text-sm font-bold text-white uppercase tracking-tight italic">{level.label}</span>
                                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{level.sub}</span>
                                        </div>
                                        <RadioGroupItem value={level.id} id={level.id} className="border-zinc-800 text-emerald-500" />
                                    </Label>
                                ))}
                            </RadioGroup>

                            <div className="space-y-3 pt-4 border-t border-zinc-800">
                                <Label htmlFor="goal" className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Objetivo Principal</Label>
                                <Input
                                    id="goal"
                                    placeholder="Ex: Hipertrofia, Emagrecimento..."
                                    value={goal}
                                    onChange={(e) => setGoal(e.target.value)}
                                    className="bg-zinc-950 border-zinc-800 text-white rounded-xl h-14 font-bold focus:ring-emerald-500/20"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col-reverse sm:flex-row sm:justify-between pt-4 gap-3 sm:gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={prevStep}
                                className="w-full sm:w-auto order-2 sm:order-1 border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white rounded-xl h-12 px-6 sm:px-8 font-bold uppercase tracking-widest text-[10px]"
                            >
                                <ChevronLeft className="mr-2 h-4 w-4 shrink-0" /> Voltar
                            </Button>
                            <Button
                                type="button"
                                onClick={nextStep}
                                disabled={!goal || goal.trim().length < 3}
                                className="w-full sm:flex-1 order-1 sm:order-2 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-black italic uppercase tracking-tight rounded-xl h-12 px-4 sm:px-8 shadow-lg shadow-emerald-500/20 group transition-all min-w-0 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Próximo <ChevronRight className="ml-2 h-4 w-4 shrink-0 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </div>

                    {/* STEP 3: Sensitive & Trainer */}
                    <div className={step === 3 ? 'block space-y-6' : 'hidden'}>
                        <div className="space-y-6">
                            <div className="p-5 rounded-2xl bg-zinc-950 border border-emerald-500/20 space-y-4">
                                <div className="flex items-center gap-3">
                                    <SteroidUseField />
                                    <div className="space-y-1">
                                        <Label htmlFor="steroidUse" className="text-xs font-black text-white italic uppercase tracking-tight cursor-pointer">Uso de recursos ergogênicos?</Label>
                                        <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest leading-relaxed">Informação confidencial para ajuste de volume.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="observations" className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                                    <div className="flex items-center gap-2">
                                        <Stethoscope className="w-3 h-3" />
                                        Observações Médicas / Lesões
                                    </div>
                                </Label>
                                <Textarea
                                    id="observations"
                                    name="observations"
                                    placeholder="Tenho dores no joelho, cirurgia no ombro..."
                                    className="bg-zinc-950 border-zinc-800 text-white rounded-2xl min-h-[100px] p-4 font-bold focus:ring-emerald-500/20"
                                />
                            </div>

                            <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-4">
                                <Label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <ShieldCheck className="w-3 h-3" />
                                    Autorização de Uso de Imagem
                                </Label>
                                <p className="text-[11px] text-zinc-400 font-medium leading-relaxed">
                                    Você autoriza o personal a divulgar suas imagens para fins profissionais (antes/depois, redes sociais, site, etc.)?
                                </p>
                                <RadioGroup value={imageAuth} onValueChange={setImageAuth} className="grid grid-cols-2 gap-3">
                                    <Label
                                        htmlFor="auth-yes"
                                        className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800 cursor-pointer hover:border-emerald-500/30 transition-all group"
                                    >
                                        <span className="text-[10px] font-bold text-zinc-300 uppercase">Sim, autorizo</span>
                                        <RadioGroupItem value="true" id="auth-yes" className="border-zinc-800 text-emerald-500" />
                                    </Label>
                                    <Label
                                        htmlFor="auth-no"
                                        className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800 cursor-pointer hover:border-red-500/30 transition-all group"
                                    >
                                        <span className="text-[10px] font-bold text-zinc-300 uppercase">Não autorizo</span>
                                        <RadioGroupItem value="false" id="auth-no" className="border-zinc-800 text-red-500" />
                                    </Label>
                                </RadioGroup>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-zinc-800">
                                <div className="space-y-3">
                                    <Label htmlFor="trainerCode" className="text-[10px] font-black text-emerald-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <Code className="w-3 h-3" />
                                        Código do Personal (Opcional)
                                    </Label>
                                    <Input
                                        id="trainerCode"
                                        name="trainerCode"
                                        placeholder="Ex: TREINADOR123"
                                        className="bg-zinc-950 border-zinc-800 text-white rounded-xl h-14 font-bold focus:ring-emerald-500/20"
                                    />
                                    <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest text-center px-4">Insira o código se você já tem um personal vinculado.</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col-reverse sm:flex-row sm:justify-between pt-4 gap-3 sm:gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={prevStep}
                                className="w-full sm:w-auto order-2 sm:order-1 border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white rounded-xl h-12 px-6 sm:px-8 font-bold uppercase tracking-widest text-[10px]"
                            >
                                <ChevronLeft className="mr-2 h-4 w-4 shrink-0" /> Voltar
                            </Button>
                            <SubmitButton />
                        </div>
                    </div>

                </form>
            </CardContent>
        </Card>
    )
}
