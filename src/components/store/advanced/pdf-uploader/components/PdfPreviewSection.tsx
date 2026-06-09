import React from 'react';
import { Stack } from '@/components/store/base/stack';
import { Font } from '@/components/store/base/font';
import { STORE_TOKENS } from '@/components/store/constants/tokens';
import { FileText } from 'lucide-react';
import { FormSelect } from '@/components/store/base/form-select';
import { Box } from '@/components/store/base/box';
import { PdfDataView } from '@/components/store/advanced/pdf-data-view';
import { Inline } from '@/components/store/base/layout';
import { Icon } from '@/components/store/base/icon';

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
        <Stack gap={STORE_TOKENS.SPACING.SECTION} id="tour-parsed-data">
            <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT} fullWidth>
                <Stack direction={{ base: 'col', lg: 'row' }} justify="between" align={{ base: 'stretch', lg: 'end' }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                            <Icon icon={FileText} color={STORE_TOKENS.COLORS.BRAND as any} size="lg" />
                            <Font variant="heading" weight="black" uppercase italic color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>{"Dados Extraídos"}</Font>
                        </Inline>
                        <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.MUTED}>{"Confira abaixo as informações interpretadas pela inteligência artificial a partir do seu arquivo."}</Font>
                    </Stack>
                    {type === 'diet' && parsedData.parsed_data?.options?.length > 1 ? (
                        <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Font
                                variant="sub-tiny"
                                uppercase
                                weight="bold"
                                {...{
                                    color: "SECONDARY",
                                }}>Cardápio:</Font>
                            <Box minWidth={180}>
                                <FormSelect
                                    options={selectOptions}
                                    value={selectedOptionIndex.toString()}
                                    onChange={(v) => setSelectedOptionIndex(parseInt(v))}
                                    placeholder="Escolher Cardápio..."
                                />
                            </Box>
                        </Stack>
                    ) : null}
                </Stack>
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
                onUpdateErgoUnit={(idx: number, unit: string) => {
                    const newData = {
                        ...parsedData,
                        parsed_data: {
                            ...parsedData.parsed_data,
                            ergogenics: parsedData.parsed_data.ergogenics.map((e: any, i: number) =>
                                i === idx ? { ...e, unit } : e
                            )
                        }
                    }
                    setParsedData(newData)
                }}
                onUpdateDietDays={(days: number[]) => {
                    setSelectedDietDays(days)
                    const newData = {
                        ...parsedData,
                        parsed_data: { ...parsedData.parsed_data, days_of_week: days }
                    }
                    setParsedData(newData)
                }}
            />
        </Stack>
    );
}
