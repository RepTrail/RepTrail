'use client'

import { useState, useRef } from 'react'
import { Camera, Loader2, AlertCircle, X, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { uploadProgressPhotos, saveProgressPhotosMetadata } from '@/actions/student-actions'
import { useToast } from '@/hooks/use-toast'
import { createClient as createBrowserClient } from '@/lib/supabase/client'

interface ProgressPhotoUploadProps {
    studentId: string
}

import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { ENTITIES } from '@/lib/outbox-db'
import { QUERY_KEYS } from '@/lib/query-keys'

interface ProgressPhotoUploadProps {
    studentId: string
}

export function ProgressPhotoUpload({ studentId }: ProgressPhotoUploadProps) {
    const [uploading, setUploading] = useState(false)
    const [photos, setPhotos] = useState<{
        front: File | null
        back: File | null
        side_left: File | null
        side_right: File | null
    }>({
        front: null,
        back: null,
        side_left: null,
        side_right: null
    })
    const [previews, setPreviews] = useState<{
        front: string | null
        back: string | null
        side_left: string | null
        side_right: string | null
    }>({
        front: null,
        back: null,
        side_left: null,
        side_right: null
    })
    const [allowPublic, setAllowPublic] = useState(true)

    const { toast } = useToast()

    const { mutate } = useOptimisticMutation({
        actionName: 'save-progress-photos',
        entity: ENTITIES.PROGRESS_PHOTO,
        queryKey: QUERY_KEYS.student.photos(studentId),
        mutationFn: async () => {}, // Sync Engine handles binary upload
        updateFn: (oldData: any, variables: any) => {
            const list = Array.isArray(oldData) ? oldData : (oldData?.data || [])
            const optimisticId = crypto.randomUUID()
            
            // Create object URLs for local preview
            const newRecord = {
                id: optimisticId,
                student_id: studentId,
                front_url: variables.front ? URL.createObjectURL(variables.front) : null,
                back_url: variables.back ? URL.createObjectURL(variables.back) : null,
                side_left_url: variables.side_left ? URL.createObjectURL(variables.side_left) : null,
                side_right_url: variables.side_right ? URL.createObjectURL(variables.side_right) : null,
                is_private: !variables.allowPublic,
                created_at: new Date().toISOString(),
                _optimistic: true
            }
            return [newRecord, ...list]
        },
        onSuccess: () => {
            toast({
                title: 'Sucesso!',
                description: 'Suas fotos estão sendo enviadas.',
            })
            // Reset local state if successful (optimistic)
            setPhotos({ front: null, back: null, side_left: null, side_right: null })
            setPreviews({ front: null, back: null, side_left: null, side_right: null })
        },
        onError: (err: any) => {
            toast({
                title: 'Erro no envio',
                description: err.message || 'Ocorreu uma falha ao enviar as fotos.',
                variant: 'destructive'
            })
        }
    })

    const handleFileChange = (type: keyof typeof photos, file: File | null) => {
        if (!file) {
            setPhotos(prev => ({ ...prev, [type]: null }))
            setPreviews(prev => ({ ...prev, [type]: null }))
            return
        }

        setPhotos(prev => ({ ...prev, [type]: file }))
        const reader = new FileReader()
        reader.onloadend = () => {
            setPreviews(prev => ({ ...prev, [type]: reader.result as string }))
        }
        reader.readAsDataURL(file)
    }

    const handleSubmit = () => {
        if (!photos.front || !photos.back || !photos.side_left || !photos.side_right) {
            toast({
                title: 'Fotos Faltando',
                description: 'Por favor, selecione as 4 fotos para continuar.',
                variant: 'destructive'
            })
            return
        }

        mutate({
            studentId,
            ...photos,
            allowPublic
        })
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <PhotoSlot
                    label="Frente"
                    preview={previews.front}
                    onChange={(file) => handleFileChange('front', file)}
                    disabled={uploading}
                />
                <PhotoSlot
                    label="Costas"
                    preview={previews.back}
                    onChange={(file) => handleFileChange('back', file)}
                    disabled={uploading}
                />
                <PhotoSlot
                    label="Lado Esq."
                    preview={previews.side_left}
                    onChange={(file) => handleFileChange('side_left', file)}
                    disabled={uploading}
                />
                <PhotoSlot
                    label="Lado Dir."
                    preview={previews.side_right}
                    onChange={(file) => handleFileChange('side_right', file)}
                    disabled={uploading}
                />
            </div>

            <div className="flex items-center gap-3 pb-4p-4 rounded-system bg-zinc-900/40 border border-zinc-800">
                <input
                    type="checkbox"
                    id="allow-public"
                    checked={allowPublic}
                    onChange={(e) => setAllowPublic(e.target.checked)}
                    className="rounded border-zinc-600 bg-zinc-900 text-emerald-500 focus:ring-emerald-500"
                />
                <label htmlFor="allow-public" className="text-sm text-zinc-300 cursor-pointer">
                    Permitir exibição no perfil público do meu personal (Antes/Depois)
                </label>
            </div>

            <div className="bg-zinc-900/40 p-6 rounded-system border border-zinc-800 space-y-4">
                <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-widest flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Instruções para as Fotos
                </h4>
                <ul className="grid md:grid-cols-2 gap-x-8 gap-y-2 text-[10px] text-zinc-400 font-bold uppercase tracking-tight list-disc pl-4 italic">
                    <li>Use roupas de treino ou trajes de banho.</li>
                    <li>Mantenha a câmera na altura do abdômen.</li>
                    <li>Ambiente bem iluminado, de preferência com fundo liso.</li>
                    <li>Mantenha a mesma distância e postura em todas as fotos.</li>
                </ul>
            </div>

            <Button
                onClick={handleSubmit}
                disabled={uploading || !photos.front || !photos.back || !photos.side_left || !photos.side_right}
                className="w-full h-auto min-h-[4rem] py-4 bg-white text-zinc-950 hover:bg-zinc-200 rounded-system font-black uppercase italic tracking-widest shadow-xl shadow-white/5 active:scale-[0.98] transition-all disabled:opacity-50 whitespace-normal text-center text-xs md:text-sm"
            >
                {uploading ? (
                    <div className="flex items-center justify-center gap-3">
                        <Loader2 className="w-5 h-5 animate-spin shrink-0" />
                        Enviando...
                    </div>
                ) : (
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                        Enviar Novas Fotos de Progresso
                        <ChevronRight className="w-5 h-5 shrink-0" />
                    </div>
                )}
            </Button>
        </div>
    )
}

function PhotoSlot({ label, preview, onChange, disabled }: { label: string, preview: string | null, onChange: (file: File | null) => void, disabled: boolean }) {
    const inputRef = useRef<HTMLInputElement>(null)

    return (
        <div className="space-y-2 group">
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest text-center">{label}</p>
            <div
                onClick={() => !disabled && inputRef.current?.click()}
                className={`
                    aspect-[3/4] rounded-system border-2 border-dashed flex flex-col items-center justify-center p-2 relative overflow-hidden transition-all duration-300
                    ${preview ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-900'}
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
            >
                <input
                    type="file"
                    ref={inputRef}
                    onChange={(e) => onChange(e.target.files?.[0] || null)}
                    accept="image/*"
                    className="hidden"
                    disabled={disabled}
                />

                {preview ? (
                    <>
                        <img src={preview} alt={label} className="w-full h-full object-cover rounded-system" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Camera className="w-8 h-8 text-white" />
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                onChange(null)
                            }}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-system opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </>
                ) : (
                    <>
                        <Camera className="w-8 h-8 text-zinc-700 group-hover:text-zinc-500 transition-colors mb-2" />
                        <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Selecionar</span>
                    </>
                )}
            </div>
        </div>
    )
}

