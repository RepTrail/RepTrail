'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useQueryClient } from '@/lib/dal'
import { useToast } from '@/hooks/use-toast'
import { Modal } from './modal'
import { Button } from '@/components/store/base/button'
import { Input } from '@/components/store/base/input'
import { FormSelect } from '@/components/store/base/form-select'
import { Textarea } from '@/components/store/base/textarea'
import { WeekdayPicker } from '@/components/store/base/weekday-picker'
import { Stack } from '@/components/store/base/stack'
import { Box } from '@/components/store/base/box'
import { Grid } from '@/components/store/base/grid'
import { Font } from '@/components/store/base/font'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { 
    Users, 
    Dumbbell, 
    Utensils, 
    Activity, 
    FlaskConical, 
    LucideIcon 
} from 'lucide-react'

const getActionIcon = (actionType: string): LucideIcon | undefined => {
    switch (actionType) {
        case 'create-student':
            return Users
        case 'create-student-workout':
        case 'create-manual-workout':
            return Dumbbell
        case 'create-student-diet':
        case 'create-manual-diet':
            return Utensils
        case 'create-student-cardio':
            return Activity
        case 'create-student-ergogenic':
            return FlaskConical
        default:
            return undefined
    }
}

interface FormField {
    name: string
    label: string
    placeholder?: string
    type?: 'text' | 'number' | 'textarea' | 'select' | 'days'
    required?: boolean
    gridCols?: number
    merged?: boolean
    defaultValue?: any
    options?: Array<{ label: string; value: string }>
}

interface UnifiedCreationDialogProps {
    title: string
    description: string
    icon?: LucideIcon
    trigger?: React.ReactElement<any>
    triggerLabel?: string
    fields: FormField[]
    actionType: string
    parentId?: string
    successMessage: string
    footerLabel: string
    colorScheme?: 'emerald' | 'orange' | 'red' | 'blue' | 'primary'
    queryKey?: readonly unknown[]
}

/**
 * UnifiedCreationDialog: An advanced dialog component that handles unified resource creation forms.
 * Fully compliant with the RepTrail Design System Rules and Atomic Architecture.
 */
export function UnifiedCreationDialog({
    title,
    description,
    icon,
    trigger,
    triggerLabel,
    fields,
    actionType,
    parentId,
    successMessage,
    footerLabel,
    colorScheme = 'emerald',
    queryKey,
}: UnifiedCreationDialogProps) {
    const { toast } = useToast()
    const queryClient = useQueryClient()
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Initial days state
    const daysField = fields.find((f) => f.type === 'days')
    const [selectedDays, setSelectedDays] = useState<number[]>(daysField?.defaultValue || [])

    const formRef = useRef<HTMLFormElement>(null)

    // Trigger state reset on modal open
    useEffect(() => {
        if (isOpen) {
            setError(null)
            setIsLoading(false)
            setSelectedDays(daysField?.defaultValue || [])
        }
    }, [isOpen, daysField?.defaultValue])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)

        if (parentId) {
            formData.append('student_id', parentId)
        }

        if (daysField) {
            formData.append(daysField.name, JSON.stringify(selectedDays))
        }

        try {
            let res: any

            if (actionType === 'create-student') {
                const { createStudent } = await import('@/lib/dal/remote')
                res = await createStudent({}, formData)
            } else if (actionType === 'create-student-cardio') {
                const { createStudentCardio } = await import('@/lib/dal/remote')
                res = await createStudentCardio(formData)
            } else if (actionType === 'create-student-ergogenic') {
                const { createStudentErgogenic } = await import('@/lib/dal/remote')
                res = await createStudentErgogenic(formData)
            } else if (actionType === 'create-student-workout') {
                const { createStudentWorkout } = await import('@/lib/dal/remote')
                res = await createStudentWorkout(formData)
            } else if (actionType === 'create-student-diet') {
                const { createStudentDiet } = await import('@/lib/dal/remote')
                res = await createStudentDiet(formData)
            }

            if (res && (res.error || res.success === false)) {
                setError(res.error || res.message || 'Falha ao executar ação.')
            } else {
                toast({
                    title: 'Sucesso!',
                    description: successMessage,
                })

                if (queryKey) {
                    await queryClient.invalidateQueries({ queryKey })
                }

                setIsOpen(false)

                if (res?.redirectUrl) {
                    window.location.href = res.redirectUrl
                } else if (actionType === 'create-student') {
                    window.location.reload()
                }
            }
        } catch (err: any) {
            setError(err.message || 'Um erro inesperado ocorreu.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleConfirm = () => {
        if (formRef.current) {
            formRef.current.requestSubmit()
        }
    }

    const renderField = (field: FormField) => {
        switch (field.type) {
            case 'number':
                return (
                    <Input
                        type="number"
                        name={field.name}
                        label={field.label}
                        placeholder={field.placeholder}
                        required={field.required}
                        defaultValue={field.defaultValue}
                        disabled={isLoading}
                    />
                )
            case 'textarea':
                return (
                    <Textarea
                        name={field.name}
                        label={field.label}
                        placeholder={field.placeholder}
                        required={field.required}
                        defaultValue={field.defaultValue}
                        disabled={isLoading}
                    />
                )
            case 'select':
                return (
                    <FormSelect
                        name={field.name}
                        label={field.label}
                        options={field.options || []}
                        defaultValue={field.defaultValue}
                        placeholder={field.placeholder}
                    />
                )
            case 'days':
                return (
                    <WeekdayPicker
                        label={field.label}
                        selectedDays={selectedDays}
                        onChange={setSelectedDays}
                    />
                )
            case 'text':
            default:
                return (
                    <Input
                        type="text"
                        name={field.name}
                        label={field.label}
                        placeholder={field.placeholder}
                        required={field.required}
                        defaultValue={field.defaultValue}
                        disabled={isLoading}
                    />
                )
        }
    }

    // Process fields grid layout rules
    const renderedFields: React.ReactNode[] = []
    let i = 0
    while (i < fields.length) {
        const field = fields[i]
        if (
            field.gridCols === 2 &&
            field.merged &&
            i + 1 < fields.length &&
            fields[i + 1].gridCols === 2 &&
            fields[i + 1].merged
        ) {
            const nextField = fields[i + 1]
            renderedFields.push(
                <Grid key={`${field.name}-${nextField.name}`} cols={{ base: 1, md: 2 }} gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth>
                    {renderField(field)}
                    {renderField(nextField)}
                </Grid>
            )
            i += 2
        } else {
            renderedFields.push(
                <Box key={field.name} fullWidth>
                    {renderField(field)}
                </Box>
            )
            i += 1
        }
    }

    const defaultTrigger = (
        <Button variant="outline-emerald" shine fullWidth={{ base: true, sm: false }}>
            {triggerLabel || 'Criar'}
        </Button>
    )

    const actualTrigger = trigger || defaultTrigger

    const clonedTrigger = React.cloneElement(actualTrigger, {
        onClick: (e: React.MouseEvent) => {
            e.preventDefault()
            setIsOpen(true)
            if (actualTrigger.props.onClick) {
                actualTrigger.props.onClick(e)
            }
        },
    })

    return (
        <>
            {clonedTrigger}
            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title={title}
                subtitle={description}
                icon={icon || getActionIcon(actionType)}
                confirmLabel={footerLabel}
                onConfirm={handleConfirm}
                variant={colorScheme}
                isLoading={isLoading}
            >
                <form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    {...{
                        className: "w-full",
                    }}>
                    <Stack gap={STORE_TOKENS.SPACING.CONTAINER} fullWidth>
                        {error && (
                            <Box
                                padding={STORE_TOKENS.PADDING.ELEMENT}
                                bg={STORE_TOKENS.COLORS.ERROR}
                                bgOpacity={STORE_TOKENS.OPACITY.SUBTLE}
                                border
                                rounded={STORE_TOKENS.RADIUS.SYSTEM}
                                fullWidth
                            >
                                <Font
                                    variant="body-sm"
                                    weight="bold"
                                    {...{
                                        color: "error",
                                    }}>
                                    {error}
                                </Font>
                            </Box>
                        )}

                        {renderedFields}

                        <Box display="none">
                            <button type="submit" />
                        </Box>
                    </Stack>
                </form>
            </Modal>
        </>
    );
}
