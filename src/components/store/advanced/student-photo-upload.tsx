'use client'

import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { Button } from '@/components/store/base/button'
import { Stack } from '@/components/store/base/stack'
import { Grid } from '@/components/store/base/grid'
import { Font } from '@/components/store/base/font'
import { FileUpload } from '@/components/store/base/file-upload'
import { Icon } from '@/components/store/base/icon'
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
                <FileUpload
                    label="Frente"
                    currentImageUrl={previews.front ?? undefined}
                    onFileSelect={(file) => handleFileChange('front', file)}
                    isUploading={uploading}
                />
                <FileUpload
                    label="Costas"
                    currentImageUrl={previews.back ?? undefined}
                    onFileSelect={(file) => handleFileChange('back', file)}
                    isUploading={uploading}
                />
                <FileUpload
                    label="Lado Esq."
                    currentImageUrl={previews.side_left ?? undefined}
                    onFileSelect={(file) => handleFileChange('side_left', file)}
                    isUploading={uploading}
                />
                <FileUpload
                    label="Lado Dir."
                    currentImageUrl={previews.side_right ?? undefined}
                    onFileSelect={(file) => handleFileChange('side_right', file)}
                    isUploading={uploading}
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
                gap="element"
                height="auto"
                paddingY="element"
            >
                <Font
                    variant="sub-tiny"
                    weight="black"
                    uppercase
                    italic
                    tracking="widest"
                    align="center"
                    whitespace="normal"
                    {...{
                        color: "inherit",
                    }}>
                    Enviar Novas Fotos de Progresso
                </Font>
                <Icon icon={ChevronRight} size="sm" />
            </Button>
        </Stack>
    );
}


