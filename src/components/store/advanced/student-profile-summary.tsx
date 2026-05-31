'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Surface } from '@/components/store/base/surface'
import { Icon } from '@/components/store/base/icon'
import { Button } from '@/components/store/base/button'
import { FileUpload } from '@/components/store/base/file-upload'
import { ShieldCheck } from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { uploadAvatar } from '@/lib/dal/remote'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

interface StudentProfileSummaryProps {
    name: string
    email: string
    avatarUrl?: string | null
    userId?: string
}

/**
 * StudentProfileSummary: Advanced component for the main profile identification card.
 * Extracted from StudentProfileSectionContent.
 * Preserves exact alignment, padding, and token usage.
 */
export function StudentProfileSummary({ name, email, avatarUrl, userId }: StudentProfileSummaryProps) {
    const { toast } = useToast()
    const router = useRouter()
    const [isUploading, setIsUploading] = useState(false)

    const handleFileSelect = async (file: File) => {
        setIsUploading(true)
        toast({
            title: "Salvando foto...",
            description: "Aguarde enquanto sua imagem de perfil está sendo processada."
        })

        try {
            const formData = new FormData()
            formData.append('file', file)

            const res = await uploadAvatar(formData)
            if (res.success) {
                toast({
                    title: "Foto atualizada!",
                    description: "Sua foto de perfil foi salva com sucesso."
                })
                router.refresh()
            } else {
                toast({
                    variant: "destructive",
                    title: "Erro ao salvar foto",
                    description: res.error || "Tente novamente mais tarde."
                })
            }
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erro inesperado",
                description: error.message || "Ocorreu um erro no upload."
            })
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <Surface variant="glass" padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} border="none">
            <Stack align="center" gap={STORE_TOKENS.SPACING.CONTAINER}>
                <FileUpload 
                    label="FOTO DE PERFIL" 
                    variant="profile" 
                    currentImageUrl={avatarUrl ?? undefined}
                    onFileSelect={handleFileSelect} 
                    isUploading={isUploading}
                />

                <Stack align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Font
                        variant="h3"
                        align="center"
                        {...{
                            color: STORE_TOKENS.COLORS.TEXT.PRIMARY,
                        }}>
                        {name}
                    </Font>
                    <Font
                        variant="sub-tiny"
                        weight="black"
                        uppercase
                        tracking="widest"
                        {...{
                            color: STORE_TOKENS.COLORS.TEXT.MUTED,
                        }}>
                        {email}
                    </Font>
                </Stack>

                {userId ? (
                    <Link
                        href={`/aluno/${userId}`}
                        target="_blank"
                        {...{
                            className: "w-full",
                        }}>
                        <Button variant="outline-orange" fullWidth size="lg">
                            <Stack direction="row" align="center" justify="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Icon icon={ShieldCheck} size="xs" />
                                <Font variant="body-sm" weight="black" uppercase italic>VER PERFIL PÚBLICO</Font>
                            </Stack>
                        </Button>
                    </Link>
                ) : (
                    <Button variant="outline-orange" fullWidth size="lg" disabled>
                        <Stack direction="row" align="center" justify="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Icon icon={ShieldCheck} size="xs" />
                            <Font variant="body-sm" weight="black" uppercase italic>VER PERFIL PÚBLICO</Font>
                        </Stack>
                    </Button>
                )}
            </Stack>
        </Surface>
    );
}
