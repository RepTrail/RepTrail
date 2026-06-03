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
        <Box position="relative" group fullWidth flex1 display="flex" direction="col">
            <Surface
                id="tour-dropzone"
                variant="tonal-emerald"
                border="dashed"
                borderWidth={2}
                rounded={STORE_TOKENS.RADIUS.SYSTEM}
                padding={STORE_TOKENS.PADDING.EMPTY_STATE}
                display="flex"
                direction="col"
                align="center"
                justify="center"
                transition
                fullWidth
                flex1
                pointerEvents={uploading || parsing ? 'none' : 'auto'}
                cursor={uploading || parsing ? 'default' : 'pointer'}
                opacity={uploading || parsing ? STORE_TOKENS.OPACITY.SHELF : STORE_TOKENS.OPACITY.FULL}
                hoverBorder="emerald-400"
                hoverBg={STORE_TOKENS.COLORS.SUCCESS}
                hoverBgOpacity={STORE_TOKENS.OPACITY.LOW}
            >
                <Stack align="center" fullWidth>
                    {uploading || parsing ? (
                        <Stack align="center" gap={STORE_TOKENS.SPACING.CONTAINER}>
                            <Box position="relative">
                                <Icon icon={Loader2} size="xl" color={STORE_TOKENS.COLORS.SUCCESS} animate="spin" />
                            </Box>
                            <Stack align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Font
                                    variant="body"
                                    weight="bold"
                                    align="center"
                                    {...{
                                        color: "white",
                                    }}>
                                    {uploading ? 'Enviando arquivo...' : 'A IA está lendo o PDF...'}
                                </Font>
                                <Font
                                    variant="description"
                                    align="center"
                                    {...{
                                        color: "zinc-500",
                                    }}>
                                    Isso pode levar alguns segundos dependendo do tamanho do documento.
                                </Font>
                            </Stack>
                        </Stack>
                    ) : (
                        <Stack align="center" gap={STORE_TOKENS.SPACING.CONTAINER}>
                            <Surface variant="tonal-emerald" padding={STORE_TOKENS.PADDING.CONTAINER} hoverScale={110} animation="in-fade-zoom">
                                <Icon icon={Upload} size="lg" color={STORE_TOKENS.COLORS.SUCCESS} />
                            </Surface>
                            <Stack align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Font
                                    variant="heading"
                                    weight="black"
                                    uppercase
                                    italic
                                    align="center"
                                    {...{
                                        color: "white",
                                    }}>Arraste seu arquivo aqui</Font>
                                <Font
                                    variant="description"
                                    align="center"
                                    {...{
                                        color: "zinc-500",
                                    }}>Ou clique para navegar pelo computador</Font>
                            </Stack>
                            <Box position="relative">
                                <DSButton
                                    variant="outline-emerald"
                                    size="md"
                                    {...{
                                        rounded: "system",
                                    }}>
                                    Selecionar Arquivo
                                </DSButton>
                                <Box
                                    as="input"
                                    type={"file" as any}
                                    position="absolute"
                                    pin="inset"
                                    opacity={STORE_TOKENS.OPACITY.NONE}
                                    cursor="pointer"
                                    onChange={onFileChange}
                                    {...({ accept: ".pdf" } as any)}
                                />
                            </Box>
                        </Stack>
                    )}
                </Stack>
            </Surface>
        </Box>
    );
}
