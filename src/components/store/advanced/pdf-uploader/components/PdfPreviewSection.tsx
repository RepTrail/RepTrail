/* eslint-disable no-restricted-syntax */
import React from 'react';
import { Stack } from '@/components/store/base/stack';
import { Font } from '@/components/store/base/font';
import { Icon } from '@/components/store/base/icon';
import { STORE_TOKENS } from '@/components/store/constants/tokens';
import { FileText } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { PdfDataView } from '@/components/store/features(deprecated)/pdf-data-view';

interface PdfPreviewSectionProps {
    type: 'workout' | 'diet';
    parsedData: any;
    setParsedData: (data: any) => void;
    selectionHooks: any;
}

export function PdfPreviewSection({ type, parsedData, setParsedData, selectionHooks }: PdfPreviewSectionProps) {
    const {
        selectedOptionIndex, setSelectedOptionIndex,
        selectedCardioIndices, toggleCardio,
        selectedErgoIndices, toggleErgo,
        setSelectedDietDays
    } = selectionHooks;

    return (
        <Stack id="tour-parsed-data" gap={STORE_TOKENS.SPACING.CONTAINER}>
            <Stack direction="row" justify="between" align="center" gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Icon icon={FileText} size="xs" color="emerald" />
                    <Font {...STORE_TOKENS.TYPOGRAPHY.LABEL} color="zinc-500">Dados Extraídos</Font>
                </Stack>
                {type === 'diet' && parsedData.parsed_data?.options?.length > 1 && (
                    <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Font {...STORE_TOKENS.TYPOGRAPHY.LABEL} color="zinc-600">Escolher Cardápio:</Font>
                        <Select
                            value={selectedOptionIndex.toString()}
                            onValueChange={(v) => setSelectedOptionIndex(parseInt(v))}
                        >
                            <SelectTrigger className="h-9 min-w-[180px] bg-zinc-900 border-zinc-800 text-xs font-bold text-emerald-400 rounded-system">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                {parsedData.parsed_data.options.map((opt: any, idx: number) => (
                                    <SelectItem key={idx} value={idx.toString()} className="text-xs font-bold">
                                        {opt.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Stack>
                )}
            </Stack>

            <PdfDataView
                type={type}
                data={type === 'diet' && parsedData.parsed_data?.options?.length > 0
                    ? {
                        ...parsedData.parsed_data,
                        meals: parsedData.parsed_data.options[selectedOptionIndex].meals,
                        diet_name: parsedData.parsed_data.options[selectedOptionIndex].name
                    }
                    : parsedData.parsed_data
                }
                selectedCardioIndices={selectedCardioIndices}
                selectedErgoIndices={selectedErgoIndices}
                onToggleCardio={toggleCardio}
                onToggleErgo={toggleErgo}
                onUpdateCardioDays={(idx: number, days: number[]) => {
                    const newData = {
                        ...parsedData,
                        parsed_data: {
                            ...parsedData.parsed_data,
                            cardios: parsedData.parsed_data.cardios.map((c: any, i: number) =>
                                i === idx ? { ...c, application_days: days } : c
                            )
                        }
                    }
                    setParsedData(newData)
                }}
                onUpdateErgoDays={(idx: number, days: number[]) => {
                    const newData = {
                        ...parsedData,
                        parsed_data: {
                            ...parsedData.parsed_data,
                            ergogenics: parsedData.parsed_data.ergogenics.map((e: any, i: number) =>
                                i === idx ? { ...e, application_days: days } : e
                            )
                        }
                    }
                    setParsedData(newData)
                }}
                onUpdateDietDays={(days: number[]) => setSelectedDietDays(days)}
            />
        </Stack>
    );
}
