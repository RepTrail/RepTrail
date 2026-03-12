'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { updateTrainerProfile } from '@/actions/profile-actions'
import { UserCircle, Sparkles, X, Plus } from 'lucide-react'

interface EditProfileDialogProps {
    profile: {
        full_name: string | null
        bio: string | null
        specialties: string[] | null
        whatsapp: string | null
        trainer_code?: string | null
    }
}

export function EditProfileDialog({ profile }: EditProfileDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        full_name: profile.full_name || '',
        bio: profile.bio || '',
        whatsapp: profile.whatsapp || '',
        trainer_code: profile.trainer_code || '',
    })
    const [specialties, setSpecialties] = useState<string[]>(profile.specialties || [])
    const [newSpecialty, setNewSpecialty] = useState('')

    const { toast } = useToast()

    const handleAddSpecialty = () => {
        if (newSpecialty && !specialties.includes(newSpecialty)) {
            setSpecialties([...specialties, newSpecialty])
            setNewSpecialty('')
        }
    }

    const handleRemoveSpecialty = (spec: string) => {
        setSpecialties(specialties.filter(s => s !== spec))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const result = await updateTrainerProfile({
                ...formData,
                specialties
            })

            if (result.success) {
                toast({
                    title: "Perfil atualizado!",
                    description: "Suas informações foram salvas com sucesso.",
                })
                setOpen(false)
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
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full bg-zinc-900 border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 hover:text-white text-zinc-100 rounded-xl h-11 transition-all duration-200 mt-4">
                    <UserCircle className="w-4 h-4 mr-2" />
                    Editar Perfil Público
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-black italic uppercase tracking-tight flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-emerald-500" />
                        Seu Perfil Profissional
                    </DialogTitle>
                    <DialogDescription className="text-zinc-500 text-xs uppercase font-bold tracking-widest">
                        Personalize como seus alunos e o mercado te veem.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Nome Completo</Label>
                            <Input
                                id="name"
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                className="bg-zinc-900/50 border-zinc-800 focus:border-emerald-500/50 rounded-xl h-12"
                                placeholder="Seu nome profissional"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="whatsapp" className="text-[10px] font-black uppercase tracking-widest text-zinc-500">WhatsApp (com DDD)</Label>
                            <Input
                                id="whatsapp"
                                value={formData.whatsapp}
                                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                className="bg-zinc-900/50 border-zinc-800 focus:border-emerald-500/50 rounded-xl h-12"
                                placeholder="55 11 99999-9999"
                            />
                        </div>

                        {!profile.trainer_code && (
                            <div className="space-y-2">
                                <Label htmlFor="trainer_code" className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Código da Equipe (Obrigatório)</Label>
                                <Input
                                    id="trainer_code"
                                    value={formData.trainer_code}
                                    onChange={(e) => setFormData({ ...formData, trainer_code: e.target.value.toUpperCase().trim() })}
                                    className="bg-zinc-900/50 border-emerald-500/30 focus:border-emerald-500 rounded-xl h-12 font-mono tracking-widest"
                                    placeholder="EX: REPTRAIL-24"
                                    required
                                />
                                <p className="text-[9px] text-zinc-600 font-bold uppercase">Este código é único e será usado pelos seus alunos para se vincularem a você.</p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="bio" className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Bio / Descritivo</Label>
                            <Textarea
                                id="bio"
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                className="bg-zinc-900/50 border-zinc-800 focus:border-emerald-500/50 rounded-xl min-h-[100px] resize-none"
                                placeholder="Conte um pouco sobre sua metodologia e experiência..."
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Especialidades</Label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {specialties.map((spec) => (
                                    <span key={spec} className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[9px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5">
                                        {spec}
                                        <button type="button" onClick={() => handleRemoveSpecialty(spec)} className="hover:text-white">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    value={newSpecialty}
                                    onChange={(e) => setNewSpecialty(e.target.value)}
                                    className="bg-zinc-900/50 border-zinc-800 focus:border-emerald-500/50 rounded-xl h-10"
                                    placeholder="Ex: Hipertrofia"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault()
                                            handleAddSpecialty()
                                        }
                                    }}
                                />
                                <Button type="button" onClick={handleAddSpecialty} size="icon" className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 shrink-0">
                                    <Plus className="w-4 h-4 text-emerald-500" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={loading} className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest h-12 rounded-xl shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)]">
                            {loading ? "Salvando..." : "Salvar Alterações"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
