'use client'

import React, { useRef, useState } from 'react'
import { Font } from './font'
import { Icon } from './icon'
import { User, Image as ImageIcon, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { STORE_TOKENS } from '@/components/store/constants/tokens';

interface FileUploadProps {
    label: string
    variant?: 'generic' | 'profile'
    currentImageUrl?: string
    onFileSelect?: (file: File) => void
    isUploading?: boolean
}

export function FileUpload({ label, variant = 'generic', currentImageUrl, onFileSelect, isUploading }: FileUploadProps) {
    const [preview, setPreview] = useState<string | null>(currentImageUrl || null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Sync preview with currentImageUrl changes if needed
    React.useEffect(() => {
        if (currentImageUrl) {
            setPreview(currentImageUrl)
        }
    }, [currentImageUrl])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setPreview(url)
            onFileSelect?.(file)
        }
    }

    const clearFile = () => {
        setPreview(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    return (
        <div className="flex flex-col gap-[10px]">
            <Font variant="auxiliary" color={STORE_TOKENS.COLORS.TEXT.MUTED} weight="black" uppercase tracking="widest">
                {label}
            </Font>

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
                disabled={isUploading}
            />

            <div
                onClick={() => !isUploading && fileInputRef.current?.click()}
                className={cn(
                    "cursor-pointer group transition-all duration-300 relative",
                    "border-2 border-dashed border-white/5 bg-zinc-950/40",
                    "hover:border-emerald-500/50 hover:bg-emerald-500/5 hover:text-emerald-500",
                    "flex items-center justify-center overflow-hidden",
                    variant === 'profile'
                        ? "w-24 h-24 rounded-full self-start"
                        : "w-full h-32 rounded-[5px]"
                )}
            >
                {preview ? (
                    <>
                    <img src={preview} alt="Preview" className={cn("w-full h-full object-cover", isUploading && "opacity-40")} />
                        {!isUploading && (
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); clearFile() }}
                        className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5 hover:bg-red-500 transition-colors"
                    >
                        <Icon icon={X} size="xs" color={STORE_TOKENS.COLORS.TEXT.PRIMARY} />
                    </button>
                )}
                    </>
                ) : (
                <div className="flex flex-col items-center gap-1">
                    <Icon
                        icon={variant === 'profile' ? User : ImageIcon}
                        size="sm"
                        color={STORE_TOKENS.COLORS.TEXT.MUTED}
                        groupHoverColor="current"
                        transition
                    />
                </div>
                )}

                {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10 rounded-inherit">
                        <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
                    </div>
                )}
            </div>
        </div >
    )
}
