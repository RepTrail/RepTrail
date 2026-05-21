/* eslint-disable no-restricted-syntax */
import React from 'react';
import { Stack } from '@/components/store/base/stack';
import { Surface } from '@/components/store/base/surface';
import { Font } from '@/components/store/base/font';
import { Icon } from '@/components/store/base/icon';
import { Button as DSButton } from '@/components/store/base/button';
import { STORE_TOKENS } from '@/components/store/constants/tokens';
import { cn } from '@/lib/utils';
import { Upload, Loader2 } from 'lucide-react';

interface PdfDropzoneProps {
    uploading: boolean;
    parsing: boolean;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PdfDropzone({ uploading, parsing, onFileChange }: PdfDropzoneProps) {
    return (
        <div className="relative group min-h-0">
            <div
                id="tour-dropzone"
                className={cn(
                    'flex flex-col items-center justify-center border-2 border-dashed rounded-system transition-all',
                    uploading || parsing
                        ? 'bg-zinc-900/20 border-zinc-800 pointer-events-none'
                        : 'bg-transparent border-zinc-800 hover:border-emerald-500/50 hover:bg-emerald-500/[0.02] cursor-pointer group'
                )}
            >
                <Stack align="center" padding={STORE_TOKENS.PADDING.EMPTY_STATE}>
                    {uploading || parsing ? (
                        <Stack align="center" gap={STORE_TOKENS.SPACING.CONTAINER}>
                            <div className="relative min-h-0">
                                <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full" />
                                <Loader2 className="h-16 w-16 animate-spin text-emerald-500 relative min-h-0" />
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
                            <Surface variant="tonal-emerald" padding={STORE_TOKENS.PADDING.CONTAINER} hoverScale={110} animation="in-fade-zoom">
                                <Icon icon={Upload} size="lg" color="emerald" />
                            </Surface>
                            <Stack align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Font variant="body" weight="bold" color="white" align="center">Arraste seu arquivo aqui</Font>
                                <Font variant="description" color="zinc-500" align="center">Ou clique para navegar pelo computador</Font>
                            </Stack>
                            <DSButton variant="outline-emerald" size="md" rounded="system" className="relative min-h-0">
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
