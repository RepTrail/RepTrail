 
import React from 'react';
import { Stack } from '@/components/store/base/stack';
import { Surface } from '@/components/store/base/surface';
import { Font } from '@/components/store/base/font';
import { Icon } from '@/components/store/base/icon';
import { Button as DSButton } from '@/components/store/base/button';
import { STORE_TOKENS } from '@/components/store/constants/tokens';
import { useRegistry, RegistryColor } from '@/components/store/advanced/registry-context';
import { cn } from '@/lib/utils';
import { Upload, Loader2 } from 'lucide-react';

interface PdfDropzoneProps {
    uploading: boolean;
    parsing: boolean;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DROPZONE_HOVER: Record<RegistryColor, string> = {
    orange: 'hover:border-orange-500/50 hover:bg-orange-500/[0.02]',
    emerald: 'hover:border-emerald-500/50 hover:bg-emerald-500/[0.02]',
    blue: 'hover:border-blue-500/50 hover:bg-blue-500/[0.02]',
    red: 'hover:border-red-500/50 hover:bg-red-500/[0.02]',
    amber: 'hover:border-amber-500/50 hover:bg-amber-500/[0.02]',
    zinc: 'hover:border-zinc-500/50 hover:bg-zinc-500/[0.02]',
}

const LOADER_GLOW: Record<RegistryColor, string> = {
    orange: 'bg-orange-500/20',
    emerald: 'bg-emerald-500/20',
    blue: 'bg-blue-500/20',
    red: 'bg-red-500/20',
    amber: 'bg-amber-500/20',
    zinc: 'bg-zinc-500/20',
}

const LOADER_SPIN: Record<RegistryColor, string> = {
    orange: 'text-orange-500',
    emerald: 'text-emerald-500',
    blue: 'text-blue-500',
    red: 'text-red-500',
    amber: 'text-amber-500',
    zinc: 'text-zinc-500',
}

export function PdfDropzone({ uploading, parsing, onFileChange }: PdfDropzoneProps) {
    const { primaryColor } = useRegistry()

    return (
        <div className="relative group min-h-0">
            <div
                id="tour-dropzone"
                className={cn(
                    'flex flex-col items-center justify-center border-2 border-dashed rounded-system transition-all',
                    uploading || parsing
                        ? 'bg-zinc-900/20 border-zinc-800 pointer-events-none'
                        : cn('bg-transparent border-zinc-800 cursor-pointer group', DROPZONE_HOVER[primaryColor])
                )}
            >
                <Stack align="center" padding={STORE_TOKENS.PADDING.EMPTY_STATE}>
                    {uploading || parsing ? (
                        <Stack align="center" gap={STORE_TOKENS.SPACING.CONTAINER}>
                            <div className="relative min-h-0">
                                <div className={cn('absolute inset-0 blur-2xl rounded-full', LOADER_GLOW[primaryColor])} />
                                <Loader2 className={cn('h-16 w-16 animate-spin relative min-h-0', LOADER_SPIN[primaryColor])} />
                            </div>
                            <Stack align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Font variant="body" weight="bold" color="white" align="center">
                                    {uploading ? 'Enviando arquivo...' : 'A IA está lendo o PDF...'}
                                </Font>
                                <Font variant="description" color="zinc-500" align="center">
                                    Isso pode levar alguns segundos dependendo do tamanho do documento.
                                </Font>
                            </Stack>
                        </Stack>
                    ) : (
                        <Stack align="center" gap={STORE_TOKENS.SPACING.CONTAINER}>
                            <Surface variant="tonal-primary" padding={STORE_TOKENS.PADDING.CONTAINER} hoverScale={110} animation="in-fade-zoom">
                                <Icon icon={Upload} size="lg" color="primary" />
                            </Surface>
                            <Stack align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Font variant="body" weight="bold" color="white" align="center">Arraste seu arquivo aqui</Font>
                                <Font variant="description" color="zinc-500" align="center">Ou clique para navegar pelo computador</Font>
                            </Stack>
                            <DSButton variant="outline-primary" size="md" rounded="system" className="relative min-h-0">
                                Selecionar Arquivo
                                <input
                                    type="file"
                                    accept=".pdf"
                                    className="absolute inset-0 opacity-0 cursor-pointer min-h-0"
                                    onChange={onFileChange}
                                />
                            </DSButton>
                        </Stack>
                    )}
                </Stack>
            </div>
        </div>
    );
}
