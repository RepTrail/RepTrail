import React from 'react';
import { Stack } from '@/components/store/base/stack';
import { Font } from '@/components/store/base/font';
import { STORE_TOKENS } from '@/components/store/constants/tokens';
import { FileText } from 'lucide-react';
import { FormSelect } from '@/components/store/base/form-select';
import { Box } from '@/components/store/base/box';
import { PdfDataView } from '@/components/store/advanced/pdf-data-view';
import { RegistrySection } from '@/components/store/advanced/registry-section';

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

    const selectOptions = parsedData.parsed_data?.options?.map((opt: any, idx: number) => ({
        label: opt.name,
        value: idx.toString()
    })) || []

    return (
        <RegistrySection 
            id="tour-parsed-data"
            title="Dados Extraídos"
            subtitle="Confira abaixo as informações interpretadas pela inteligência artificial a partir do seu arquivo."
            icon={FileText}
            rightElement={
                type === 'diet' && parsedData.parsed_data?.options?.length > 1 ? (
                    <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Font variant="sub-tiny" color="SECONDARY" uppercase weight="bold">Cardápio:</Font>
                        <Box minWidth={180}>
                            <FormSelect
                                options={selectOptions}
                                value={selectedOptionIndex.toString()}
                                onChange={(v) => setSelectedOptionIndex(parseInt(v))}
                                placeholder="Escolher Cardápio..."
                            />
                        </Box>
                    </Stack>
                ) : null
            }
        >
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
        </RegistrySection>
    );
}
