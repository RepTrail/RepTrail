'use client'

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Upload, Loader2 } from "lucide-react"
import { updateTrainerProfile } from "@/actions/trainer-actions"
import { useToast } from "@/hooks/use-toast"
import { createClient } from '@/lib/supabase/client'

interface ClientProfileFormProps {
    profile: any
}

export function ClientProfileForm({ profile }: ClientProfileFormProps) {
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '')
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { toast } = useToast()
    const supabase = createClient()

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            toast({
                variant: 'destructive',
                title: 'Tipo de arquivo inválido',
                description: 'Por favor, selecione uma imagem.'
            })
            return
        }

        setUploading(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Unauthorized')

            const fileExt = file.name.split('.').pop()
            const fileName = `${user.id}/${Date.now()}.${fileExt}`

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, file)

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(fileName)

            setAvatarUrl(publicUrl)
            toast({
                title: "Foto carregada!",
                description: "Clique em salvar para confirmar as alterações.",
            })
        } catch (error: any) {
            console.error('Upload error:', error)
            toast({
                variant: "destructive",
                title: "Erro no upload",
                description: error.message || "Tente novamente mais tarde.",
            })
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = async (formData: FormData) => {
        setLoading(true)
        // Add the avatarUrl to form data just in case the input wasn't updated
        formData.set('avatar_url', avatarUrl)

        try {
            const result = await updateTrainerProfile(formData)
            if (result.success) {
                toast({
                    title: "Perfil atualizado!",
                    description: "Suas informações foram salvas com sucesso.",
                })
            } else {
                toast({
                    variant: "destructive",
                    title: "Erro ao atualizar",
                    description: result.error,
                })
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erro inesperado",
                description: "Tente novamente em instantes.",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <form action={handleSubmit} className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Foto de Perfil</Label>
                    <div className="flex gap-4 items-center">
                        <Avatar className="h-14 w-14 border-2 border-zinc-800">
                            <AvatarImage src={avatarUrl} />
                            <AvatarFallback className="bg-zinc-900 text-zinc-500 text-xs font-black uppercase">
                                {profile?.full_name?.substring(0, 2) || 'TR'}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 space-y-2">
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                    className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-300 rounded-xl h-10 px-4 text-xs font-bold gap-2"
                                >
                                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                    Upload Foto
                                </Button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleUpload}
                                    className="hidden"
                                    accept="image/*"
                                />
                            </div>
                            <Input
                                name="avatar_url"
                                value={avatarUrl}
                                onChange={(e) => setAvatarUrl(e.target.value)}
                                placeholder="Ou cole um link de imagem aqui..."
                                className="bg-zinc-900/50 border-zinc-800 focus:border-emerald-500/50 rounded-xl h-10 text-[10px] text-zinc-400"
                            />
                        </div>
                    </div>
                </div>

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
                    <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-tight">Seu perfil do Instagram será exibido na sua landing page.</p>
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
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest h-14 rounded-2xl shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)] transition-all active:scale-95"
            >
                {loading ? "Salvando..." : "Salvar Alterações do Perfil"}
            </Button>
        </form>
    )
}
