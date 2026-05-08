'use client'

import React, { useRef, useState } from 'react'
import { Font } from './font'
import { Icon } from './icon'
import { User, Image as ImageIcon, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileUploadProps {
    label: string
    variant?: 'generic' | 'profile'
    onFileSelect?: (file: File) => void
}

export function FileUpload({ label, variant = 'generic', onFileSelect }: FileUploadProps) {
    const [preview, setPreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

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
            <Font variant="auxiliary" color="zinc-500" weight="black" uppercase tracking="widest">
                {label}
            </Font>

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
            />

            <div
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                    "cursor-pointer group transition-all duration-300 relative",
                    "border-2 border-dashed border-white/5 bg-zinc-950/40",
                    "hover:border-emerald-500/50 hover:bg-emerald-500/5",
                    "flex items-center justify-center overflow-hidden",
                    variant === 'profile'
                        ? "w-24 h-24 rounded-full self-start"
                        : "w-full h-32 rounded-[5px]"
                )}
            >
                {preview ? (
                    <>
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); clearFile() }}
                            className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5 hover:bg-red-500 transition-colors"
                        >
                            <Icon icon={X} size="xs" color="white" />
                        </button>
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-1">
                        <Icon
                            icon={variant === 'profile' ? User : ImageIcon}
                            size="sm"
                            color="zinc-500"
                            className="group-hover:text-emerald-500 transition-colors"
                        />
                        <Font variant="sub-tiny" color="zinc-600" weight="black" uppercase className="group-hover:text-emerald-400">
                            {variant === 'profile' ? 'FOTO' : 'UPLOAD'}
                        </Font>
                    </div>
                )}
            </div>
        </div>
    )
}
