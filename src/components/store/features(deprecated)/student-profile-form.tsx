'use client'

import { useState } from 'react'
import { updateStudentProfile, uploadAvatar } from '@/actions/student-actions'
import { useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/query-keys'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { ENTITIES } from '@/lib/outbox-db'
import {
    User,
    Settings,
    Calendar,
    Ruler,
    Target,
    Activity,
    FileText,
    Save,
    Phone,
    ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'
import { Checkbox } from '@/components/ui/checkbox'
import { AvatarUploadWithCrop } from './avatar-upload-with-crop'
import { StudentTrialBadge } from './student-trial-badge'
import { CancelSubscriptionButton } from '../advanced/cancel-subscription-button'
import Link from 'next/link'

interface StudentProfileFormProps {
    profile: any
    hasTrainer?: boolean
}

export function StudentProfileForm({ profile, hasTrainer = false }: StudentProfileFormProps) {
    const queryClient = useQueryClient()
    const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '')
    const [displayBirthDate, setDisplayBirthDate] = useState(() => {
        if (!profile?.details?.birth_date) return ''
        const [year, month, day] = profile.details.birth_date.split('-')
        return `${day}/${month}/${year}`
    })

    const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '')
        if (value.length > 8) value = value.slice(0, 8)

        let formatted = value
        if (value.length > 2) {
            formatted = value.slice(0, 2) + '/' + value.slice(2)
        }
        if (value.length > 4) {
            formatted = formatted.slice(0, 5) + '/' + formatted.slice(5)
        }

        setDisplayBirthDate(formatted)
    }

    const { mutate } = useOptimisticMutation({
        actionName: 'update-student-profile',
        entity: ENTITIES.STUDENT_DETAIL,
        entityId: profile?.id || 'me',
        queryKey: QUERY_KEYS.student.details(profile?.id || 'me'),
        mutationFn: async () => {}, // Single-writer: no-op
        onMutate: (variables) => {
            const previousDetails = queryClient.getQueryData(QUERY_KEYS.student.details(profile?.id))
            const previousDetail = queryClient.getQueryData(QUERY_KEYS.trainer.studentDetail(profile?.id))

            queryClient.setQueryData(QUERY_KEYS.student.details(profile?.id), (old: any) => {
                if(!old) return old
                return { ...old, ...variables.obj, _optimistic: true }
            })
            
            queryClient.setQueryData(QUERY_KEYS.trainer.studentDetail(profile?.id), (old: any) => {
                if(!old) return old
                return { ...old, ...variables.obj, _optimistic: true }
            })

            return { previousDetails, previousDetail }
        },
        onSuccess: () => {
            toast({ title: 'Perfil Atualizado', description: 'Suas informações foram salvas e estão sendo sincronizadas.' })
        },
        onError: (err, variables, ctx) => {
            queryClient.setQueryData(QUERY_KEYS.student.details(profile?.id), ctx?.previousDetails)
            queryClient.setQueryData(QUERY_KEYS.trainer.studentDetail(profile?.id), ctx?.previousDetail)
            toast({ title: 'Erro inesperado', description: 'Tente novamente.', variant: 'destructive' })
        }
    })

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formDataObj = new FormData(e.currentTarget)
        
        // Extract birth date from DD/MM/AAAA to YYYY-MM-DD
        const bDateRaw = (formDataObj.get('birth_date_display') as string)?.replace(/\D/g, '')
        let birth_date = profile?.details?.birth_date
        if (bDateRaw?.length === 8) {
            const day = bDateRaw.slice(0, 2)
            const month = bDateRaw.slice(2, 4)
            const year = bDateRaw.slice(4, 8)
            birth_date = `${year}-${month}-${day}`
        }

        const obj = {
            data: {
                full_name: formDataObj.get('full_name') as string,
                whatsapp: formDataObj.get('whatsapp') as string,
                height: parseFloat(formDataObj.get('height') as string) || 0,
                body_fat: parseFloat(formDataObj.get('body_fat') as string) || 0,
                goal: formDataObj.get('goal') as string,
                activity_level: formDataObj.get('activity_level') as string,
                observations: formDataObj.get('observations') as string,
                steroid_use: formDataObj.get('steroid_use') === 'on',
                birth_date
            },
            studentId: profile?.id
        }
        mutate({ ...obj, userId: profile?.id })
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'active': return 'Assinante'
            case 'trial': return 'Período de Teste'
            case 'expired': return 'Teste Expirado'
            case 'none': return 'Nenhum'
            default: return status || 'Não definido'
        }
    }

    return (
        <div className="space-y-10">
            {/* Trial Badge - 100% Width at the Top */}
            {!hasTrainer && profile?.auto_training_trial_end && (
                <StudentTrialBadge
                    trialEnd={profile.auto_training_trial_end}
                    status={profile.auto_training_status}
                    currentCpf={profile?.cpf_cnpj}
                    currentName={profile?.full_name}
                />
            )}

            <div className="grid gap-10 lg:grid-cols-12">
                {/* Profile Card / Avatar Area */}
                <div className="lg:col-span-4 space-y-8">
                    <Card className="bg-zinc-900/40 border-zinc-800/50 rounded-system overflow-hidden backdrop-blur-sm shadow-2xl">
                        <CardContent className="p-6 sm:p-10 text-center space-y-6">
                            <AvatarUploadWithCrop
                                currentImageUrl={avatarUrl}
                                userName={profile?.full_name}
                                onUploadSuccess={(url) => setAvatarUrl(url)}
                                uploadAction={uploadAvatar}
                                accentColor="orange"
                            />

                            <div className="space-y-1">
                                <h2 className="text-2xl font-black text-white italic uppercase">{profile?.full_name || 'Seu Nome'}</h2>
                                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                                    {profile?.email}
                                </p>
                            </div>

                            <Link href={`/aluno/${profile?.id}`} target="_blank" className="w-full">
                                <Button variant="outline" className="w-full h-10 px-8 rounded-system border-zinc-700 bg-zinc-800/50 hover:bg-zinc-700 hover:border-orange-500/40 text-zinc-300 hover:text-orange-400 font-black uppercase italic tracking-widest text-[9px] transition-all gap-2">
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    Ver Perfil Público
                                </Button>
                            </Link>

                            {!hasTrainer && profile?.auto_training_status && (
                                <div className="pt-6 border-t border-zinc-800/50">
                                    <div className="p-4 bg-zinc-950/50 rounded-system border border-zinc-800 text-center w-full">
                                        <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block mb-1">Status Auto-Treino</span>
                                        <span className={`text-xs font-black uppercase italic ${
                                            profile.auto_training_status === 'active' 
                                                ? 'text-emerald-500' 
                                                : (profile.auto_training_status === 'trial' && profile.auto_training_trial_end && new Date(profile.auto_training_trial_end) < new Date())
                                                    ? 'text-red-500'
                                                    : 'text-amber-500'
                                        }`}>
                                            {(profile.auto_training_status === 'trial' && profile.auto_training_trial_end && new Date(profile.auto_training_trial_end) < new Date())
                                                ? 'Teste Expirado'
                                                : getStatusLabel(profile.auto_training_status)}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {profile?.asaas_subscription_id && (
                                <div className="pt-2 flex justify-center">
                                    <CancelSubscriptionButton />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Edit Form */}
                <div className="lg:col-span-8 space-y-8">
                    <Card className="bg-zinc-900/40 border-zinc-800/50 rounded-system backdrop-blur-sm shadow-2xl overflow-hidden">
                        <CardHeader className="p-6 sm:p-10 border-b border-zinc-800/50">
                            <CardTitle className="text-xl font-black text-white italic uppercase tracking-tight flex items-center gap-3 pb-4">
                                <Settings className="w-5 h-5 text-orange-500" />
                                Informações Pessoais
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 sm:p-10">
                            <form onSubmit={handleSubmit} className="space-y-10">
                                <div className="grid gap-x-8 gap-y-8 md:grid-cols-2">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                            <User className="w-3.5 h-3.5" />
                                            Nome Completo
                                        </label>
                                        <Input
                                            name="full_name"
                                            defaultValue={profile?.full_name}
                                            placeholder="Ex: João Silva"
                                            className="h-14 bg-zinc-950 border-zinc-800 rounded-system focus:border-orange-500/50 font-bold italic text-white"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                            <Calendar className="w-3.5 h-3.5" />
                                            Data de Nascimento
                                        </label>
                                        <Input
                                            name="birth_date_display"
                                            id="displayBirthDate"
                                            type="text"
                                            placeholder="DD/MM/AAAA"
                                            value={displayBirthDate}
                                            onChange={handleBirthDateChange}
                                            className="h-14 bg-zinc-950 border-zinc-800 rounded-system focus:border-orange-500/50 font-bold text-white uppercase"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                            <Ruler className="w-3.5 h-3.5" />
                                            Altura (cm)
                                        </label>
                                        <Input
                                            name="height"
                                            type="number"
                                            defaultValue={profile?.details?.height}
                                            placeholder="Ex: 180"
                                            className="h-14 bg-zinc-950 border-zinc-800 rounded-system focus:border-orange-500/50 font-bold italic text-white"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                            <Activity className="w-3.5 h-3.5" />
                                            Percentual de Gordura (BF %)
                                        </label>
                                        <Input
                                            name="body_fat"
                                            type="number"
                                            step="0.1"
                                            defaultValue={profile?.details?.body_fat}
                                            placeholder="Ex: 15.5"
                                            className="h-14 bg-zinc-950 border-zinc-800 rounded-system focus:border-orange-500/50 font-bold italic text-white"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                            <Target className="w-3.5 h-3.5" />
                                            Objetivo principal
                                        </label>
                                        <Input
                                            name="goal"
                                            defaultValue={profile?.details?.goal}
                                            placeholder="Ex: Hipertrofia Máxima"
                                            className="h-14 bg-zinc-950 border-zinc-800 rounded-system focus:border-orange-500/50 font-bold italic text-white"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                            <Phone className="w-3.5 h-3.5" />
                                            WhatsApp (com DDD)
                                        </label>
                                        <Input
                                            name="whatsapp"
                                            defaultValue={profile?.whatsapp}
                                            placeholder="Ex: 55 11 99999-9999"
                                            className="h-14 bg-zinc-950 border-zinc-800 rounded-system focus:border-orange-500/50 font-bold italic text-white"
                                        />
                                    </div>

                                    <div className="md:col-span-2 space-y-3">
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                            <Activity className="w-3.5 h-3.5" />
                                            Nível de Atividade
                                        </label>
                                        <select
                                            name="activity_level"
                                            defaultValue={profile?.details?.activity_level || 'sedentary'}
                                            className="w-full h-14 px-6 bg-zinc-950 border border-zinc-800 rounded-system focus:border-orange-500/50 font-bold text-white uppercase outline-none"
                                        >
                                            <option value="sedentary">Sedentário</option>
                                            <option value="light">Levemente Ativo</option>
                                            <option value="moderate">Moderado</option>
                                            <option value="active">Muito Ativo</option>
                                            <option value="athlete">Atleta / Extremo</option>
                                        </select>
                                    </div>

                                    <div className="md:col-span-2 space-y-3">
                                        <div className="flex items-center space-x-3 p-6 bg-zinc-950 border border-zinc-800 rounded-system group-hover:border-orange-500/30 transition-all">
                                            <Checkbox
                                                id="steroid_use"
                                                name="steroid_use"
                                                defaultChecked={profile?.details?.steroid_use}
                                                className="border-zinc-700 data-[state=checked]:bg-emerald-500 data-[state=checked]:text-white h-5 w-5 rounded-system"
                                            />
                                            <div className="grid gap-1.5 leading-none">
                                                <label
                                                    htmlFor="steroid_use"
                                                    className="text-xs font-black uppercase tracking-widest text-white cursor-pointer"
                                                >
                                                    Uso de Ergogênicos / Hormônios
                                                </label>
                                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">
                                                    Esta informação é importante para que seu treinador ajuste seu protocolo corretamente.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 space-y-3">
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                            <FileText className="w-3.5 h-3.5" />
                                            Observações Médicas / Importantes
                                        </label>
                                        <button type="button" /> {/* Dummy to avoid autofocus issues */}
                                        <Textarea
                                            name="observations"
                                            defaultValue={profile?.details?.observations}
                                            placeholder="Ex: Lesão no ombro direito, asma..."
                                            className="min-h-[120px] bg-zinc-950 border-zinc-800 rounded-system focus:border-orange-500/50 font-bold italic text-white p-6"
                                        />
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-zinc-800/50 flex flex-col md:flex-row gap-6 md:items-center justify-between">
                                    <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest max-w-sm">
                                        Após salvar, algumas informações podem levar alguns segundos para atualizar em todo o sistema.
                                    </p>
                                    <Button
                                        type="submit"
                                        className="h-16 px-10 rounded-system bg-orange-500 hover:bg-orange-400 text-zinc-950 font-black uppercase italic tracking-wide shadow-xl shadow-orange-500/10 active:scale-95 transition-all group"
                                    >
                                        Salvar Alterações
                                        <Save className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

