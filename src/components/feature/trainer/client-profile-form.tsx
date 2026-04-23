'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MapPin } from "lucide-react"
import { updateTrainerProfile, uploadTrainerAvatar } from "@/actions/trainer-actions"
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/query-keys'
import { useToast } from "@/hooks/use-toast"
import { AvatarUploadWithCrop } from '@/components/feature/avatar-upload-with-crop'

import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { ENTITIES } from '@/lib/outbox-db'

interface ClientProfileFormProps {
    profile: any
}

export function ClientProfileForm({ profile }: ClientProfileFormProps) {
    const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '')
    const { toast } = useToast()
    const queryClient = useQueryClient()
    
    // We assume profile.id exists. If not, profile might be the actual user session id.
    const queryKey = QUERY_KEYS.trainer.profile(profile?.id || '')

    const { mutate } = useOptimisticMutation({
        actionName: 'update-trainer-profile',
        entity: ENTITIES.TRAINER_DETAIL,
        entityId: profile?.id || 'me',
        queryKey,
        mutationFn: async (variables: { formData: FormData, obj: any }) => variables, // 🔴 NO-OP: Logic moves to registry
        onMutate: (variables) => {
            const previous = queryClient.getQueryData(queryKey)
            queryClient.setQueryData(queryKey, (old: any) => ({ ...old, ...variables.obj, avatar_url: avatarUrl, _optimistic: true }))
            return { previous }
        },
        onSuccess: () => {
            toast({ title: "Perfil atualizado!", description: "Suas informações foram salvas." })
        },
        onError: (err, variables, ctx) => {
            queryClient.setQueryData(queryKey, ctx?.previous)
            toast({ variant: "destructive", title: "Erro", description: "Ocorreu uma falha ao sincronizar." })
        }
    })

    const handleSubmit = (formData: FormData) => {
        const obj = {
            full_name: formData.get('full_name') as string,
            whatsapp: formData.get('whatsapp') as string,
            instagram: formData.get('instagram') as string,
            cref: formData.get('cref') as string,
            location: formData.get('location') as string,
            specialties: (formData.get('specialties') as string)?.split(',').map(s => s.trim()),
            bio: formData.get('bio') as string
        }
        // 🚀 Instant feedback, no await
        mutate({ formData, obj })
    }

    return (
        <form action={handleSubmit} className="space-y-10">
            <div className="flex flex-col gap-10">
                {/* Avatar and Basic Info Row */}
                <div className="flex flex-col md:flex-row gap-10">
                    <div className="flex-shrink-0 flex flex-col items-center md:items-start">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block mb-4 text-center md:text-left">Foto de Perfil</Label>
                        <AvatarUploadWithCrop
                            currentImageUrl={avatarUrl}
                            userName={profile?.full_name}
                            onUploadSuccess={(url) => setAvatarUrl(url)}
                            uploadAction={uploadTrainerAvatar}
                            accentColor="emerald"
                            align="center"
                        />
                    </div>

                    <div className="flex-1 space-y-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Nome Profissional</Label>
                            <Input
                                name="full_name"
                                defaultValue={profile?.full_name || ''}
                                placeholder="Ex: Marcos Personal"
                                className="bg-zinc-900/50 border-zinc-800 focus:border-emerald-500/50 rounded-xl h-12 font-bold text-zinc-100"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Seu Código de Acesso (Fixo)</Label>
                            <Input
                                name="trainer_code"
                                defaultValue={profile?.trainer_code || ''}
                                className="bg-zinc-900/50 border-zinc-800 focus:border-emerald-500/50 rounded-xl h-12 uppercase font-mono tracking-widest text-zinc-400"
                                readOnly
                            />
                            <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-tight">O código é único e permanente.</p>
                        </div>
                    </div>
                </div>

                {/* Additional Info Grid */}
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">WhatsApp (c/ DDD)</Label>
                        <Input
                            name="whatsapp"
                            defaultValue={profile?.whatsapp || ''}
                            placeholder="55 11 99999-9999"
                            className="bg-zinc-900/50 border-zinc-800 focus:border-emerald-500/50 rounded-xl h-12 text-zinc-100"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Instagram (Opcional)</Label>
                        <Input
                            name="instagram"
                            defaultValue={profile?.instagram || ''}
                            placeholder="@seuinstagram ou seuinstagram"
                            className="bg-zinc-900/50 border-zinc-800 focus:border-emerald-500/50 rounded-xl h-12 text-zinc-100"
                        />
                        <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-tight">Seu perfil será exibido na sua landing page.</p>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">CREF (Opcional)</Label>
                        <Input
                            name="cref"
                            defaultValue={profile?.cref || ''}
                            placeholder="Ex: 123456-G/SP"
                            className="bg-zinc-900/50 border-zinc-800 focus:border-emerald-500/50 rounded-xl h-12 text-zinc-100"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Local de Atuação</Label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <Input
                                name="location"
                                defaultValue={profile?.location || ''}
                                placeholder="Ex: Curitiba / Online"
                                className="bg-zinc-900/50 border-zinc-800 focus:border-emerald-500/50 rounded-xl h-12 pl-10 text-zinc-100"
                            />
                        </div>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                        <Label className="text-[9px] font-bold uppercase tracking-tight text-zinc-600">Link Direto da Imagem (Opcional)</Label>
                        <Input
                            name="avatar_url"
                            value={avatarUrl || ''}
                            onChange={(e) => setAvatarUrl(e.target.value)}
                            placeholder="Ou cole um link de imagem aqui..."
                            className="bg-zinc-900/50 border-zinc-800 focus:border-emerald-500/50 rounded-xl h-10 text-[10px] text-zinc-400"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Especialidades (separadas por vírgula)</Label>
                <Input
                    name="specialties"
                    defaultValue={profile?.specialties?.join(', ') || ''}
                    placeholder="Ex: Hipertrofia, Emagrecimento, Funcional"
                    className="bg-zinc-900/50 border-zinc-800 focus:border-emerald-500/50 rounded-xl h-12 text-zinc-100"
                />
            </div>

            <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Sobre Você (Bio)</Label>
                <Textarea
                    name="bio"
                    defaultValue={profile?.bio || ''}
                    placeholder="Conte um pouco sobre sua metodologia e experiência..."
                    className="bg-zinc-900/50 border-zinc-800 focus:border-emerald-500/50 rounded-xl min-h-[120px] resize-none p-4 text-zinc-100"
                />
            </div>

            <Button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest h-14 rounded-2xl shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)] transition-all active:scale-95"
            >
                Salvar Alterações do Perfil
            </Button>
        </form>
    )
}
