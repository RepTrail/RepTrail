import React from 'react';
import { Stack } from '@/components/store/base/stack';
import { Surface } from '@/components/store/base/surface';
import { Font } from '@/components/store/base/font';
import { Icon } from '@/components/store/base/icon';
import { Box } from '@/components/store/base/box';
import { Button as DSButton } from '@/components/store/base/button';
import { STORE_TOKENS } from '@/components/store/constants/tokens';
import { Upload, Loader2 } from 'lucide-react';

interface PdfDropzoneProps {
    uploading: boolean;
    parsing: boolean;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PdfDropzone({ uploading, parsing, onFileChange }: PdfDropzoneProps) {
    return (
        <Box position="relative" group fullWidth>
            <Surface
                id="tour-dropzone"
                variant="tonal-emerald"
                border="dashed"
                borderWidth={2}
                rounded="system"
                padding={STORE_TOKENS.PADDING.EMPTY_STATE}
                display="flex"
                direction="col"
                align="center"
                justify="center"
                transition
                fullWidth
                pointerEvents={uploading || parsing ? 'none' : 'auto'}
                cursor={uploading || parsing ? 'default' : 'pointer'}
                opacity={uploading || parsing ? 80 : 100}
                hoverBorder="emerald-400"
                hoverBg="emerald"
                hoverBgOpacity={5}
            >
                <Stack align="center" fullWidth>
                    {uploading || parsing ? (
                        <Stack align="center" gap={STORE_TOKENS.SPACING.CONTAINER}>
                            <Box position="relative">
                                <Icon icon={Loader2} size="xl" color="emerald" animate="spin" />
                            </Box>
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
                                <Font variant="heading" weight="black" uppercase italic color="white" align="center">Arraste seu arquivo aqui</Font>
                                <Font variant="description" color="zinc-500" align="center">Ou clique para navegar pelo computador</Font>
                            </Stack>
                            <Box position="relative">
                                <DSButton variant="outline-emerald" size="md" rounded="system">
                                    Selecionar Arquivo
                                </DSButton>
                                <Box
                                    as="input"
                                    type={"file" as any}
                                    accept=".pdf"
                                    position="absolute"
                                    pin="inset"
                                    opacity={0}
                                    cursor="pointer"
                                    onChange={onFileChange}
                                />
                            </Box>
                        </Stack>
                    )}
                </Stack>
            </Surface>
        </Box>
    );
}
