'use client'

import { useState, useRef } from 'react'
import { Camera, AlertCircle, X, ChevronRight } from 'lucide-react'
import { Button } from '@/components/store/base/button'
import { FormCheckbox } from '@/components/store/base/form-checkbox'
import { Stack } from '@/components/store/base/stack'
import { Grid } from '@/components/store/base/grid'
import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { GlassPanel } from '@/components/store/base/surface'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { useToast } from '@/hooks/use-toast'
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
        <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
            <Grid cols={{ base: 2, md: 4 }} gap={STORE_TOKENS.SPACING.CONTAINER}>
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
            </Grid>

            {/* Public sharing checkbox removed per user request */}

            {/* Instructions panel removed per user request */}

            <Button
                onClick={handleSubmit}
                disabled={uploading || !photos.front || !photos.back || !photos.side_left || !photos.side_right}
                variant="outline-emerald"
                fullWidth
                loading={uploading}
                size="lg"
                gap={2.5}
                className="whitespace-normal h-auto py-4"
            >
                <Font
                    variant="sub-tiny"
                    weight="black"
                    uppercase
                    italic
                    tracking="widest"
                    align="center"
                    color="inherit"
                    className="leading-tight text-center"
                >
                    Enviar Novas Fotos de Progresso
                </Font>
                <ChevronRight className="w-5 h-5 shrink-0" />
            </Button>
        </Stack>
    )
}

function PhotoSlot({ label, preview, onChange, disabled }: { label: string, preview: string | null, onChange: (file: File | null) => void, disabled: boolean }) {
    const inputRef = useRef<HTMLInputElement>(null)

    return (
        <Box className="group" fullWidth>
            <Box
                onClick={() => !disabled && inputRef.current?.click()}
                cursor={disabled ? "not-allowed" : "pointer"}
                opacity={disabled ? 50 : 100}
                className="aspect-[3/4] hover:border-zinc-700 hover:bg-zinc-900 transition-all duration-300"
                rounded="system"
                border={true}
                borderWidth={2}
                borderColor={preview ? "emerald" : "zinc"}
                borderOpacity={preview ? 50 : 20}
                bg="zinc"
                bgOpacity={preview ? 5 : 50}
                padding={1}
                position="relative"
                overflow="hidden"
                display="flex"
                direction="col"
                align="center"
                justify="center"
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
                        <img src={preview} alt={label} className="w-full h-full object-cover rounded-[5px]" />
                        <Box
                            position="absolute"
                            pin="inset"
                            bg="black"
                            bgOpacity={40}
                            opacity={0}
                            className="group-hover:opacity-100 transition-opacity"
                            display="flex"
                            align="center"
                            justify="center"
                        >
                            <Camera className="w-8 h-8 text-white" />
                        </Box>
                        <Button
                            variant="red"
                            size="xs"
                            isIconOnly
                            onClick={(e) => {
                                e.stopPropagation()
                                onChange(null)
                            }}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="w-3.5 h-3.5" />
                        </Button>
                    </>
                ) : (
                    <Stack gap={2.5} align="center" justify="center">
                        <Camera className="w-8 h-8 text-zinc-700 group-hover:text-zinc-500 transition-colors" />
                        <Font variant="sub-tiny" weight="black" color={STORE_TOKENS.COLORS.TEXT.MUTED} uppercase italic tracking="widest">
                            {label}
                        </Font>
                    </Stack>
                )}
            </Box>
        </Box>
    )
}
