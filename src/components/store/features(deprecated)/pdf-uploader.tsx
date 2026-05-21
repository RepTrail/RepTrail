/* eslint-disable no-restricted-syntax */
'use client'

import { useState } from 'react'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/query-keys'
import { cn } from "@/lib/utils"
import { createClient } from '@/lib/supabase/client'
import { Badge } from "@/components/store/base/badge"

import { Upload, FileText, Check, Loader2, X, Sparkles, User, Mail, Phone } from 'lucide-react'
import { Icon } from '@/components/store/base/icon'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Button as DSButton } from '@/components/store/base/button'
import { Separator } from '@/components/store/base/separator'
import { Surface } from '@/components/store/base/surface'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { useToast } from '@/hooks/use-toast'
import { PdfDataView } from './pdf-data-view'
import { parseUploadedPdf } from '@/actions/pdf-actions'
import { saveParsedData } from '@/actions/save-actions'
import { normalizeDays } from '@/lib/utils'
import { findStudentByName } from '@/actions/trainer-actions'
import { useTrainerOnboarding } from '@/hooks/use-trainer-onboarding'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input as DSInput } from "@/components/store/base/input"

export function PdfUploader({ type, students = [], role = 'trainer', userId, studentId: initialStudentId }: { type: 'workout' | 'diet', students?: any[], role?: 'trainer' | 'student', userId: string, studentId?: string }) {
    const [uploading, setUploading] = useState(false)
    const [parsing, setParsing] = useState(false)
    const [parsedData, setParsedData] = useState<any>(null)
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)
    const [selectedOptionIndex, setSelectedOptionIndex] = useState<number>(0)
    const [detectedStudentName, setDetectedStudentName] = useState<string | null>(null)
    const [studentMatch, setStudentMatch] = useState<{ exact: any, suggestions: any[] } | null>(null)
    const [bindingMode, setBindingMode] = useState<'matched' | 'create' | 'skip'>('skip')
    const [placeholderName, setPlaceholderName] = useState('')
    const [placeholderEmail, setPlaceholderEmail] = useState('')
    const [placeholderWhatsapp, setPlaceholderWhatsapp] = useState('')

    // Selection state
    const [selectedCardioIndices, setSelectedCardioIndices] = useState<Set<number>>(new Set())
    const [selectedErgoIndices, setSelectedErgoIndices] = useState<Set<number>>(new Set())
    const [selectedDietDays, setSelectedDietDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6])

    const toggleCardio = (idx: number) => {
        const next = new Set(selectedCardioIndices)
        if (next.has(idx)) next.delete(idx)
        else next.add(idx)
        setSelectedCardioIndices(next)
    }

    const toggleErgo = (idx: number) => {
        const next = new Set(selectedErgoIndices)
        if (next.has(idx)) next.delete(idx)
        else next.add(idx)
        setSelectedErgoIndices(next)
    }
    // ─── Mutations ─────────────────────────────────────────────────────────────
    const { mutate: handleSaveFinal, isPending: isSaving } = useMutation({
        mutationFn: async (variables: any) => {
            console.log(`[PDF-UPLOADER] Calling saveParsedData action...`);
            return await saveParsedData(
                variables.type,
                variables.data,
                variables.studentId,
                variables.createPlaceholder
            );
        },
        onSuccess: (result, variables) => {
            if (result.error) {
                toast({ variant: "destructive", title: "Erro ao salvar", description: result.error });
                return;
            }

            console.log(`[PDF-UPLOADER] Save success. Invalidating queries for student: ${variables.studentId || 'library'}`);

            // Close preview
            setParsedData(null);
            setSelectedStudentId(null);
            setSelectedOptionIndex(0);

            // Invalidate everything relevant with a slight delay to ensure DB propagation
            setTimeout(() => {
                const sid = variables.studentId || (result as any).data?.placeholderId || (result as any).results?.placeholderId;
                console.log(`[PDF-UPLOADER] Triggering final invalidation for trainer and student ${sid}...`);

                // Clear all student-related queries for the trainer to ensure sync
                queryClient.invalidateQueries({ queryKey: ['trainer', 'student'] });
                
                if (sid) {
                    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ergogenics.all(sid) });
                    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cardio.assignments(sid) });
                }

                // Invalidate everything else - this only refetches ACTIVE queries, preventing unexpected fetch errors
                queryClient.invalidateQueries({ queryKey: ['trainer'] });
                queryClient.invalidateQueries({ queryKey: ['workouts'] });
                queryClient.invalidateQueries({ queryKey: ['diets'] });
                queryClient.invalidateQueries({ queryKey: ['cardio'] });
                queryClient.invalidateQueries({ queryKey: ['ergogenics'] });
            }, 800);

            // Onboarding transition: If they just imported, move to AHA moment
            if (onboardingStep === 'import_diet') {
                nextStep('aha_moment')

                // Store ghost student data for personalization in the AHA banner
                const ghostInfo = variables.createPlaceholder || { name: detectedStudentName || 'Aluno' };
                localStorage.setItem(`onboarding_ghost_${userId}`, JSON.stringify(ghostInfo));
            }

            toast({
                title: "✅ Plano importado com sucesso",
                description: `${type === 'workout' ? 'Treino' : 'Dieta'} processado e vinculado.`
            });
        },
        onSettled: () => {
            // Final safety net
            setTimeout(() => {
                queryClient.invalidateQueries()
            }, 1000)
        }
    })
    const { toast } = useToast()
    const supabase = createClient()
    const queryClient = useQueryClient()
    const { step: onboardingStep, nextStep } = useTrainerOnboarding(userId, {
        activeStudents: 0,
        workoutsCount: 0,
        dietsCount: 0
    })

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return

        const file = e.target.files[0]
        setUploading(true)

        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `${fileName}`

            // 1. Upload
            const { error: uploadError } = await supabase.storage
                .from('pdfs')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            toast({ title: "Arquivo enviado!", description: "Iniciando processamento com IA..." })
            setUploading(false)
            setParsing(true)

            // 2. Parse
            const result = await parseUploadedPdf(filePath, type)

            if (result.error) {
                throw new Error(result.error)
            }


            setParsedData(result.data)
            setSelectedOptionIndex(0)

            // 3. Initialize selections
            if (result.data) {
                const cardios = result.data.parsed_data?.cardios || []
                const ergogenics = result.data.parsed_data?.ergogenics || []

                const initialCardios = new Set<number>()
                const anyHasDays = cardios.some((c: any) => {
                    const d = c.application_days || c.days_of_week || c.day_of_week;
                    return d && (Array.isArray(d) ? d.length > 0 : true);
                });

                // Initialize cardio application_days if missing
                const isStudent = role === 'student';
                const updatedCardios = cardios.map((c: any, i: number) => {
                    const rawDays = c.application_days || c.days_of_week || c.day_of_week;
                    const hasDays = rawDays && (Array.isArray(rawDays) ? rawDays.length > 0 : true);

                    if (anyHasDays) {
                        if (hasDays) {
                            initialCardios.add(i);
                            return { ...c, application_days: normalizeDays(rawDays) };
                        }
                        return c;
                    } else {
                        // If none have days, only auto-select daily for student mode
                        if (isStudent && i === 0) {
                            initialCardios.add(i);
                            return { ...c, application_days: [0, 1, 2, 3, 4, 5, 6] };
                        }
                        // For trainers, we keep it as is (empty) unless the AI specified it
                        return { ...c, application_days: normalizeDays(rawDays || []) };
                    }
                });

                if (updatedCardios.length > 0) {
                    result.data.parsed_data.cardios = updatedCardios;
                }
                setSelectedCardioIndices(initialCardios)

                // Ergogenics: select all by default and ensure days are daily if missing
                const updatedErgos = ergogenics.map((ergo: any) => ({
                    ...ergo,
                    application_days: normalizeDays(ergo.application_days)
                }));
                if (updatedErgos.length > 0) {
                    result.data.parsed_data.ergogenics = updatedErgos;
                }
                setSelectedErgoIndices(new Set(updatedErgos.map((_: any, i: number) => i)))
            }

            if (role === 'trainer' && result.data?.detected_student_name) {
                setDetectedStudentName(result.data.detected_student_name)
                const match = await findStudentByName(result.data.detected_student_name)
                setStudentMatch(match)
                if (match.exact) {
                    setSelectedStudentId(match.exact.student_id)
                    setBindingMode('matched')
                } else if (match.suggestions.length === 0) {
                    setBindingMode('create')
                } else {
                    setBindingMode('skip')
                }
            } else {
                setDetectedStudentName(null)
                setStudentMatch(null)
                setBindingMode('skip')
            }

            toast({ title: "Processamento concluído!", description: "Revise os dados antes de salvar." })

        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Falha na importação",
                description: error.message
            })
        } finally {
            setUploading(false)
            setParsing(false)
        }
    }

    const handleSave = () => {
        if (role === 'trainer' && type === 'workout' && parsedData?.parsed_data?.ergogenics?.length > 0 && !selectedStudentId) {
            toast({
                variant: "destructive",
                title: "Atenção!",
                description: "Ergogênicos detectados. Selecione um aluno para salvar o protocolo."
            })
            return
        }

        // 🔒 TYPE LOCK: Prevent saving diet as workout or vice versa
        const isActuallyDiet = (parsedData?.parsed_data?.meals?.length > 0 || parsedData?.parsed_data?.options?.length > 0);
        const isActuallyWorkout = (parsedData?.parsed_data?.workouts?.length > 0 || parsedData?.parsed_data?.exercises?.length > 0);

        if (type === 'workout' && isActuallyDiet && !isActuallyWorkout) {
            toast({
                variant: "destructive",
                title: "Arquivo Incompatível",
                description: "Este PDF parece ser uma DIETA. Use a aba de Dieta para importar."
            })
            return
        }
        if (type === 'diet' && isActuallyWorkout && !isActuallyDiet) {
            toast({
                variant: "destructive",
                title: "Arquivo Incompatível",
                description: "Este PDF parece ser um TREINO. Use a aba de Treino para importar."
            })
            return
        }

        if (role === 'trainer' && bindingMode === 'create' && !placeholderEmail) {
            toast({
                variant: "destructive",
                title: "Atenção: Email não informado!",
                description: "Sem o email você não consegue enviar o acesso automaticamente para o aluno."
            })
            // We don't return here anymore, we let them save if they really want, 
            // but the toast serves as a "friction-lite" warning.
        }

        let dataToSave = { ...parsedData.parsed_data }

        // Filter based on selections
        if (dataToSave.cardios) {
            dataToSave.cardios = dataToSave.cardios
                .filter((_: any, i: number) => selectedCardioIndices.has(i))
                .map((c: any) => ({
                    ...c,
                    application_days: normalizeDays(c.application_days)
                }))
        }
        if (dataToSave.ergogenics) {
            dataToSave.ergogenics = dataToSave.ergogenics.filter((_: any, i: number) => selectedErgoIndices.has(i))
        }

        // If it's a diet with options, we only save the selected one
        if (type === 'diet' && parsedData.parsed_data?.options?.length > 0) {
            const selectedOption = parsedData.parsed_data.options[selectedOptionIndex]
            dataToSave = {
                ...dataToSave,
                diet_name: selectedOption.name,
                meals: selectedOption.meals,
                days_of_week: (selectedDietDays && selectedDietDays.length > 0) ? selectedDietDays : (role === 'student' ? [0, 1, 2, 3, 4, 5, 6] : []),
            }
            // 🚨 DUPLICATION FIX: Remove all options to prevent save-actions from looping through them
            delete dataToSave.options;
        } else if (type === 'diet') {
            dataToSave = {
                ...dataToSave,
                days_of_week: normalizeDays(selectedDietDays),
            }
        }

        let createPlaceholderObj = undefined
        if (role === 'trainer' && bindingMode === 'create' && !selectedStudentId) {
            createPlaceholderObj = {
                name: placeholderName || detectedStudentName || "Novo Aluno",
                email: placeholderEmail,
                whatsapp: placeholderWhatsapp
            }
        }

        const finalStudentId = selectedStudentId || initialStudentId;

        console.log(`[PDF-UPLOADER] 🚨 DEBUG SAVE:`, {
            type,
            finalStudentId,
            selectedStudentId,
            initialStudentId,
            bindingMode,
            hasPlaceholder: !!createPlaceholderObj,
            email: placeholderEmail
        });

        handleSaveFinal({
            type,
            data: dataToSave,
            studentId: finalStudentId || undefined,
            createPlaceholder: createPlaceholderObj,
            userId
        })
    }

    return (
        <Stack id="tour-import-card" fullWidth gap={STORE_TOKENS.SPACING.CONTAINER}>
            <div>
                {!parsedData ? (
                    <div className="relative group">
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
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full" />
                                            <Loader2 className="h-16 w-16 animate-spin text-emerald-500 relative" />
                                        </div>
                                        <Stack align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                            <Font variant="body" weight="bold" color="white">
                                                {uploading ? 'Enviando arquivo...' : 'A IA está lendo o PDF...'}
                                            </Font>
                                            <Font variant="description" color="zinc-500">
                                                Isso pode levar alguns segundos dependendo do tamanho do documento.
                                            </Font>
                                        </Stack>
                                    </Stack>
                                ) : (
                                    <Stack align="center" gap={STORE_TOKENS.SPACING.CONTAINER}>
                                        <Surface
                                            variant="tonal-emerald"
                                            padding={STORE_TOKENS.PADDING.CONTAINER}
                                            hoverScale={110}
                                            animation="in-fade-zoom"
                                        >
                                            <Icon icon={Upload} size="lg" color="emerald" />
                                        </Surface>
                                        <Stack align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                            <Font variant="body" weight="bold" color="white">Arraste seu arquivo aqui</Font>
                                            <Font variant="description" color="zinc-500">Ou clique para navegar pelo computador</Font>
                                        </Stack>
                                        <DSButton variant="outline-emerald" size="md" rounded="system" className="relative">
                                            Selecionar Arquivo
                                            <input
                                                type="file"
                                                accept=".pdf"
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                onChange={handleFileChange}
                                            />
                                        </DSButton>
                                    </Stack>
                                )}
                            </Stack>
                        </div>
                    </div>
                ) : (
                    <Stack gap={STORE_TOKENS.SPACING.CONTAINER} className="animate-pulse">
                        {/* Status Message */}
                        <Surface id="tour-parsed-status" variant="tonal-emerald" padding={STORE_TOKENS.PADDING.CONTAINER}>
                            <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.CONTAINER}>
                                <Surface variant="tonal-emerald" padding={STORE_TOKENS.PADDING.ELEMENT}>
                                    <Icon icon={Check} size="sm" color="emerald" />
                                </Surface>
                                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                    <Font variant="label-caps" color="emerald">Leitura Concluída</Font>
                                    <Font variant="description" color="emerald">Revise abaixo as informações extraídas pela nossa IA.</Font>
                                </Stack>
                            </Stack>
                        </Surface>

                        {/* Student Link Card */}
                        {role === 'trainer' && (
                            <Surface variant="raised" padding={STORE_TOKENS.PADDING.CONTAINER}>
                                <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                                    <Stack direction="row" align="center" justify="between" gap={STORE_TOKENS.SPACING.CONTAINER}>
                                        <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                            <Icon icon={User} size="xs" color="emerald" />
                                            <Font variant="body" weight="bold" color="white">Vincular Importação:</Font>
                                            {detectedStudentName && (
                                                <Badge label={`Detectado: ${detectedStudentName}`} variant="outline" color="zinc" />
                                            )}
                                        </Stack>
                                        {(studentMatch?.exact || (selectedStudentId && bindingMode === 'matched')) && (
                                            <Badge label="Aluno Vinculado" variant="glass" color="emerald" />
                                        )}
                                    </Stack>

                                    {studentMatch?.exact && bindingMode === 'matched' ? (
                                        <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                                            <Font variant="description" color="zinc-400">
                                                Identificamos o aluno <Font variant="description" color="emerald" weight="bold">{studentMatch.exact.full_name}</Font> automaticamente.
                                            </Font>
                                            <Stack direction="row" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                                <DSButton
                                                    variant="outline-zinc"
                                                    size="sm"
                                                    onClick={() => {
                                                        setBindingMode('skip');
                                                        setSelectedStudentId(null);
                                                    }}
                                                >
                                                    Alterar Vínculo
                                                </DSButton>
                                            </Stack>
                                        </Stack>
                                    ) : (
                                        <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                                            <Separator opacity={5} />
                                            
                                            <Font variant="auxiliary" weight="black" uppercase color="zinc-500" tracking="widest">
                                                {detectedStudentName ? "Como deseja processar esta importação?" : "Quem deve receber este treino/dieta?"}
                                            </Font>

                                            <Stack direction="row" gap={STORE_TOKENS.SPACING.CONTAINER} className="w-full flex-wrap md:flex-nowrap">
                                                <DSButton
                                                    id="tour-btn-create-student"
                                                    type="button"
                                                    variant={bindingMode === 'create' ? 'outline-emerald' : 'ghost'}
                                                    className={cn(
                                                        "flex-1 !h-[56px] transition-all duration-300",
                                                        bindingMode === 'create' && "shadow-[0_0_20px_rgba(16,185,129,0.15)] scale-[1.02]"
                                                    )}
                                                    onClick={() => {
                                                        setBindingMode('create');
                                                        setSelectedStudentId(null);
                                                        if (detectedStudentName && !placeholderName) setPlaceholderName(detectedStudentName);
                                                    }}
                                                >
                                                    Criar Novo Aluno
                                                </DSButton>

                                                <div className="flex-1 min-w-[200px]">
                                                    <Select value={selectedStudentId || undefined} onValueChange={(val) => { setSelectedStudentId(val); setBindingMode('matched'); }}>
                                                        <SelectTrigger
                                                            className={cn(
                                                                "w-full rounded-system !h-[56px] bg-zinc-950/40 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 border-2 px-6 flex items-center justify-between",
                                                                bindingMode === 'matched'
                                                                    ? "border-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.15)] scale-[1.02]"
                                                                    : "border-white/5 text-zinc-500 hover:border-white/10"
                                                            )}
                                                        >
                                                            <SelectValue placeholder="Escolher Existente" />
                                                        </SelectTrigger>
                                                        <SelectContent position="popper" side="bottom" sideOffset={12} className="bg-zinc-900 border-2 border-white/5 text-white w-[var(--radix-select-trigger-width)] z-[100] rounded-system shadow-2xl p-2 overflow-hidden">
                                                            <div className="px-2 py-3 text-[8px] font-black uppercase tracking-widest text-zinc-600 border-b border-white/5 mb-2">Sugestões e Lista de Alunos</div>
                                                            {studentMatch?.suggestions?.filter((s: any) => s.active !== false).map((s: any) => (
                                                                <SelectItem key={s.student_id} value={s.student_id} className="text-xs py-4 rounded-system focus:bg-emerald-500/10 focus:text-emerald-400 cursor-pointer">
                                                                    {s.full_name} (Sugerido)
                                                                </SelectItem>
                                                            ))}
                                                            {students.filter(s => s.active && !studentMatch?.suggestions?.find((ms: any) => ms.student_id === s.student_id)).map(s => (
                                                                <SelectItem key={s.student_id} value={s.student_id} className="text-xs py-4 rounded-system focus:bg-white/5 cursor-pointer">
                                                                    {s.student?.[0]?.full_name || s.student?.full_name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <DSButton
                                                    type="button"
                                                    variant={bindingMode === 'skip' ? 'outline-zinc' : 'ghost'}
                                                    className={cn(
                                                        "flex-1 !h-[56px] transition-all duration-300",
                                                        bindingMode === 'skip' && "shadow-xl"
                                                    )}
                                                    onClick={() => { setBindingMode('skip'); setSelectedStudentId(''); }}
                                                >
                                                    Não Vincular
                                                </DSButton>
                                            </Stack>

                                            {bindingMode === 'create' && (
                                                <Surface variant="raised" padding={STORE_TOKENS.PADDING.CONTAINER} animateIn="fade">
                                                    <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                                                        <DSInput
                                                            label="Nome do Novo Aluno"
                                                            placeholder="Digite o nome completo..."
                                                            value={placeholderName}
                                                            onChange={(e) => setPlaceholderName(e.target.value)}
                                                        />
                                                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                                            <DSInput
                                                                label="Email do Aluno"
                                                                placeholder="email@aluno.com"
                                                                type="email"
                                                                required
                                                                icon={<Icon icon={Mail} size="xs" color="zinc-500" />}
                                                                value={placeholderEmail}
                                                                onChange={(e) => setPlaceholderEmail(e.target.value)}
                                                            />
                                                            <Font variant="sub-tiny" color="zinc-600" weight="bold" uppercase tracking="widest" className="px-1">
                                                                O aluno precisa criar a conta com esse email para sincronizar o protocolo automaticamente.
                                                            </Font>
                                                        </Stack>

                                                        <DSInput
                                                            label="WhatsApp do Aluno"
                                                            placeholder="(00) 00000-0000"
                                                            type="tel"
                                                            icon={<Icon icon={Phone} size="xs" color="zinc-500" />}
                                                            value={placeholderWhatsapp}
                                                            onChange={(e) => setPlaceholderWhatsapp(e.target.value)}
                                                        />

                                                        <Font variant="sub-tiny" color="emerald" weight="black" uppercase tracking="widest" className="px-1">
                                                            * O email e WhatsApp são fundamentais para o envio automático do acesso.
                                                        </Font>
                                                    </Stack>
                                                </Surface>
                                            )}
                                        </Stack>
                                    )}
                                </Stack>
                            </Surface>
                        )}

                        {/* Assignment Feedback Card */}
                        {role === 'trainer' && (
                            <Surface variant="tonal-emerald" padding={STORE_TOKENS.PADDING.CONTAINER} animation="in-fade-zoom">
                                <Stack direction="row" justify="between" align="center" gap={STORE_TOKENS.SPACING.CONTAINER}>
                                    <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.CONTAINER}>
                                        <Surface
                                            variant={selectedStudentId || bindingMode === 'create' ? 'tonal-emerald' : 'raised'}
                                            padding={STORE_TOKENS.PADDING.CONTAINER}
                                        >
                                            <Icon icon={User} size="md" color={selectedStudentId || bindingMode === 'create' ? 'emerald' : 'zinc-500'} />
                                        </Surface>
                                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                            <Font {...STORE_TOKENS.TYPOGRAPHY.LABEL} color="zinc-500">Destinatário da Importação</Font>
                                            <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                                <Font variant="heading" weight="black" uppercase italic color="white">
                                                    {selectedStudentId
                                                        ? (students.find((s: any) => s.student_id === selectedStudentId)?.student?.[0]?.full_name ||
                                                            students.find((s: any) => s.student_id === selectedStudentId)?.student?.full_name ||
                                                            studentMatch?.exact?.full_name || 'Aluno Selecionado')
                                                        : (bindingMode === 'create' ? (placeholderName || detectedStudentName || 'Novo Aluno') : 'Somente Biblioteca')
                                                    }
                                                </Font>
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                    {(selectedStudentId || bindingMode === 'create') && (
                                        <Surface variant="tonal-emerald" padding={STORE_TOKENS.PADDING.ELEMENT}>
                                            <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                <Font {...STORE_TOKENS.TYPOGRAPHY.LABEL} color="emerald">Vinculação Ativa</Font>
                                            </Stack>
                                        </Surface>
                                    )}
                                </Stack>
                            </Surface>
                        )}

                        {/* Data Preview */}
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

                        {/* Actions */}
                        <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                            <Separator opacity={5} />
                            <Stack direction="row" justify="end" gap={STORE_TOKENS.SPACING.CONTAINER}>
                                <DSButton
                                    variant="ghost"
                                    onClick={() => { setParsedData(null); setSelectedStudentId('') }}
                                    gap={STORE_TOKENS.SPACING.ELEMENT}
                                >
                                    <Icon icon={X} size="xs" color="zinc-500" />
                                    Cancelar
                                </DSButton>
                                <DSButton
                                    id="tour-save-button"
                                    variant="outline-emerald"
                                    onClick={handleSave}
                                    disabled={isSaving || (role === 'trainer' && bindingMode === 'create' && (!placeholderName || !placeholderEmail))}
                                    gap={STORE_TOKENS.SPACING.ELEMENT}
                                    loading={isSaving}
                                >
                                    {!isSaving && <Icon icon={Check} size="xs" color="emerald" />}
                                    {bindingMode === 'create'
                                        ? `Salvar e Vincular a ${placeholderName || detectedStudentName || 'Novo Aluno'}`
                                        : `Salvar ${type === 'workout' ? 'Treino' : 'Dieta'}`
                                    }
                                </DSButton>
                            </Stack>
                        </Stack>
                    </Stack>
                )}
            </div>

            {/* Feature Badges Footer */}
            <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Separator opacity={5} />
                <Stack direction="row" gap={STORE_TOKENS.SPACING.CONTAINER} wrap="wrap">
                    <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Icon icon={Sparkles} size="xs" color="zinc-600" />
                        <Font {...STORE_TOKENS.TYPOGRAPHY.LABEL} color="zinc-600">AI Powered Extraction</Font>
                    </Stack>
                    <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Icon icon={Check} size="xs" color="zinc-600" />
                        <Font {...STORE_TOKENS.TYPOGRAPHY.LABEL} color="zinc-600">Auto Structured JSON</Font>
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    )
}

