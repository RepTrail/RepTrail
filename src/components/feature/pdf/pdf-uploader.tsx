'use client'

import { useState } from 'react'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/query-keys'
import { cn } from "@/lib/utils"
import { ENTITIES } from '@/lib/outbox-db'
import { createClient } from '@/lib/supabase/client'
import { Badge } from "@/components/ui/badge"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Upload, FileText, Check, Loader2, FileUp, X, Sparkles, User, Mail, Phone } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { PdfDataView } from './pdf-data-view'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
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
import { Input } from "@/components/ui/input"

export function PdfUploader({ type, students = [], role = 'trainer', userId, studentId: initialStudentId }: { type: 'workout' | 'diet', students?: any[], role?: 'trainer' | 'student', userId: string, studentId?: string }) {
    const [uploading, setUploading] = useState(false)
    const [parsing, setParsing] = useState(false)
    const [parsedData, setParsedData] = useState<any>(null)
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)
    const [selectedOptionIndex, setSelectedOptionIndex] = useState<number>(0)
    const [detectedStudentName, setDetectedStudentName] = useState<string | null>(null)
    const [studentMatch, setStudentMatch] = useState<{exact: any, suggestions: any[]} | null>(null)
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
                
                // Clear the specific student detail query
                if (sid) {
                    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.trainer.studentDetail(sid) });
                    queryClient.invalidateQueries({ queryKey: ['trainer', 'student', sid] });
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
                const anyHasDays = cardios.some((c: any) => c.application_days && c.application_days.length > 0)
                
                // Initialize cardio application_days if missing
                const updatedCardios = cardios.map((c: any, i: number) => {
                    const hasDays = c.application_days && c.application_days.length > 0;
                    if (anyHasDays) {
                        if (hasDays) {
                            initialCardios.add(i);
                            return { ...c, application_days: normalizeDays(c.application_days) };
                        }
                        return c;
                    } else {
                        // If none have days, select the first one and make it daily
                        if (i === 0) {
                            initialCardios.add(i);
                            return { ...c, application_days: [0, 1, 2, 3, 4, 5, 6] };
                        }
                        return { ...c, application_days: [] };
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
                days_of_week: (selectedDietDays && selectedDietDays.length > 0) ? selectedDietDays : [0, 1, 2, 3, 4, 5, 6],
            }
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
        <Card id="tour-import-card" className="w-full bg-zinc-950 border-zinc-800 shadow-2xl rounded-2xl overflow-hidden border-t-zinc-700/50">
            <CardHeader className="bg-zinc-900/20 border-b border-zinc-900/50 pb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl font-black text-white italic uppercase tracking-tight flex items-center gap-2">
                            <FileUp className="w-5 h-5 text-emerald-500" />
                            Importar {type === 'workout' ? 'Treino' : 'Dieta'}
                        </CardTitle>
                        <CardDescription className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mt-1">
                            Formatos suportados: PDF (Máx 5MB)
                        </CardDescription>
                    </div>
                    {(uploading || parsing) && (
                        <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full">
                            <Loader2 className="w-3 h-3 animate-spin text-emerald-500" />
                            PROCESSANDO
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="p-8">
                {!parsedData ? (
                    <div className="relative group">
                        <div 
                            id="tour-dropzone"
                            className={`
                            flex flex-col items-center justify-center p-12 lg:p-20 border-2 border-dashed rounded-3xl transition-all
                            ${uploading || parsing
                                ? 'bg-zinc-900/20 border-zinc-800 pointer-events-none'
                                : 'bg-transparent border-zinc-800 hover:border-emerald-500/50 hover:bg-emerald-500/[0.02] cursor-pointer group'}
                        `}>
                            {uploading || parsing ? (
                                <div className="flex flex-col items-center gap-6">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full" />
                                        <Loader2 className="h-16 w-16 animate-spin text-emerald-500 relative" />
                                    </div>
                                    <div className="text-center space-y-2">
                                        <p className="text-white font-bold text-lg">
                                            {uploading ? 'Enviando arquivo...' : 'A IA está lendo o PDF...'}
                                        </p>
                                        <p className="text-zinc-500 text-sm max-w-[300px]">
                                            Isso pode levar alguns segundos dependendo do tamanho do documento.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="p-6 bg-zinc-900 rounded-3xl border border-zinc-800 mb-6 transition-all group-hover:scale-110 group-hover:border-zinc-700 group-hover:text-emerald-500 shadow-xl">
                                        <Upload className="h-8 w-8 text-zinc-500 group-hover:text-emerald-500 transition-colors" />
                                    </div>
                                    <div className="text-center space-y-1 mb-8">
                                        <h3 className="text-lg font-bold text-white tracking-tight">Arraste seu arquivo aqui</h3>
                                        <p className="text-sm text-zinc-500">Ou clique para navegar pelo computador</p>
                                    </div>
                                    <Button className="bg-white text-zinc-950 hover:bg-zinc-200 rounded-2xl font-bold h-12 px-8 shadow-none transition-all relative">
                                        Selecionar Arquivo
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            onChange={handleFileChange}
                                        />
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Status Message */}
                        <div id="tour-parsed-status" className="flex items-center gap-3 pb-4 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl">
                            <div className="p-2 bg-emerald-500/20 rounded-full">
                                <Check className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold uppercase tracking-tight">Leitura Concluída</p>
                                <p className="text-xs text-emerald-400/70">Revise abaixo as informações extraídas pela nossa IA.</p>
                            </div>
                        </div>

                        {/* Student Link Card */}
                        {role === 'trainer' && (
                            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col gap-4 shadow-lg">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div className="flex flex-wrap items-center gap-2 text-zinc-300">
                                        <div className="flex items-center gap-2">
                                            <User className="w-5 h-5 text-emerald-500" />
                                            <span className="text-sm font-bold tracking-tight">Vincular Importação:</span>
                                        </div>
                                        {detectedStudentName && (
                                            <span className="text-[10px] sm:text-sm font-black text-white px-2 py-1 bg-zinc-800 rounded-md border border-zinc-700/50">Detectado: {detectedStudentName}</span>
                                        )}
                                    </div>
                                    {(studentMatch?.exact || (selectedStudentId && bindingMode === 'matched')) && (
                                        <div className="flex">
                                            <Badge className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 text-[10px] sm:text-xs">Aluno Vinculado</Badge>
                                        </div>
                                    )}
                                </div>
                                
                                {studentMatch?.exact && bindingMode === 'matched' ? (
                                    <div className="flex flex-col gap-3">
                                        <p className="text-xs text-zinc-500">
                                            Identificamos o aluno <strong className="text-emerald-400">{studentMatch.exact.full_name}</strong> automaticamente.
                                        </p>
                                        <div className="flex gap-2">
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="h-8 text-[10px] uppercase font-black px-4"
                                                onClick={() => {
                                                    setBindingMode('skip');
                                                    setSelectedStudentId(null);
                                                }}
                                            >
                                                Alterar Vínculo
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4 pt-2 border-t border-zinc-800">
                                        <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">
                                            {detectedStudentName ? "Como deseja processar esta importação?" : "Quem deve receber este treino/dieta?"}
                                        </p>
                                        
                                        <div 
                                            id="tour-binding-modes"
                                            className="flex flex-col md:flex-row items-stretch gap-4 w-full"
                                        >
                                            <div id="tour-binding-container" className="flex-1">
                                                <Button 
                                                    id="tour-btn-create-student"
                                                    type="button" 
                                                    variant={bindingMode === 'create' ? 'default' : 'outline'}
                                                className={cn(
                                                    "flex-1 rounded-2xl !h-[56px] w-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 border-2",
                                                    bindingMode === 'create' 
                                                        ? "bg-emerald-500 text-black border-emerald-400 hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] scale-[1.02]" 
                                                        : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 text-zinc-500"
                                                )}
                                                onClick={() => { 
                                                    setBindingMode('create'); 
                                                    setSelectedStudentId(null);
                                                    if (detectedStudentName && !placeholderName) setPlaceholderName(detectedStudentName);
                                                }}
                                            >
                                                Criar Novo Aluno
                                            </Button>
                                        </div>
                                            
                                            <div className="flex-1">
                                                <Select value={selectedStudentId || undefined} onValueChange={(val) => { setSelectedStudentId(val); setBindingMode('matched'); }}>
                                                    <SelectTrigger 
                                                        className={cn(
                                                            "w-full rounded-2xl !h-[56px] bg-zinc-900/50 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 border-2 px-6 flex items-center justify-between",
                                                            bindingMode === 'matched' 
                                                                ? "border-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.2)] scale-[1.02]" 
                                                                : "border-zinc-800 text-zinc-500 hover:border-zinc-700"
                                                        )}
                                                        style={{ height: '56px' }}
                                                    >
                                                        <SelectValue placeholder="Escolher Existente" />
                                                    </SelectTrigger>
                                                    <SelectContent position="popper" side="bottom" sideOffset={12} className="bg-zinc-900 border-2 border-zinc-800 text-white w-[var(--radix-select-trigger-width)] z-[100] rounded-2xl shadow-2xl p-2 overflow-hidden">
                                                        <div className="px-2 py-3 text-[8px] font-black uppercase tracking-widest text-zinc-600 border-b border-zinc-800 mb-2">Sugestões e Lista de Alunos</div>
                                                        {studentMatch?.suggestions?.filter((s: any) => s.active !== false).map((s: any) => (
                                                            <SelectItem key={s.student_id} value={s.student_id} className="text-xs py-4 rounded-xl focus:bg-emerald-500/10 focus:text-emerald-400 cursor-pointer">
                                                                {s.full_name} (Sugerido)
                                                            </SelectItem>
                                                        ))}
                                                        {students.filter(s => s.active && !studentMatch?.suggestions?.find((ms: any) => ms.student_id === s.student_id)).map(s => (
                                                            <SelectItem key={s.student_id} value={s.student_id} className="text-xs py-4 rounded-xl focus:bg-zinc-800 cursor-pointer">
                                                                {s.student?.[0]?.full_name || s.student?.full_name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <Button 
                                                type="button" 
                                                variant={bindingMode === 'skip' ? 'default' : 'outline'}
                                                className={cn(
                                                    "flex-1 rounded-2xl !h-[56px] w-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 border-2",
                                                    bindingMode === 'skip' 
                                                        ? "bg-zinc-700 text-white border-zinc-600 shadow-xl" 
                                                        : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 text-zinc-500"
                                                )}
                                                onClick={() => { setBindingMode('skip'); setSelectedStudentId(''); }}
                                            >
                                                Não Vincular
                                            </Button>
                                        </div>

                                        {bindingMode === 'create' && (
                                            <div id="tour-student-fields" className="p-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl space-y-4 animate-in slide-in-from-top-2">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Nome do Novo Aluno</label>
                                                    <Input 
                                                        placeholder="Digite o nome completo..." 
                                                        className="bg-zinc-900 border-zinc-800 text-white h-12 rounded-xl"
                                                        value={placeholderName}
                                                        onChange={(e) => setPlaceholderName(e.target.value)}
                                                    />
                                                </div>
                                                <div className="space-y-3">
                                                    <div className="flex flex-col gap-1 px-1">
                                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Email do Aluno</label>
                                                        <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest leading-relaxed">
                                                            O aluno precisa criar a conta com esse email para sincronizar o protocolo automaticamente.
                                                        </p>
                                                    </div>
                                                    <div className="relative">
                                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                                                        <Input 
                                                            placeholder="email@aluno.com" 
                                                            type="email"
                                                            required
                                                            className="bg-zinc-900 border-zinc-800 text-white h-12 rounded-xl pl-11"
                                                            value={placeholderEmail}
                                                            onChange={(e) => setPlaceholderEmail(e.target.value)}
                                                        />
                                                    </div>

                                                    <div className="space-y-2 pt-2">
                                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">WhatsApp do Aluno</label>
                                                        <div className="relative">
                                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                                                            <Input 
                                                                placeholder="(00) 00000-0000" 
                                                                type="tel"
                                                                className="bg-zinc-900 border-zinc-800 text-white h-12 rounded-xl pl-11"
                                                                value={placeholderWhatsapp}
                                                                onChange={(e) => setPlaceholderWhatsapp(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="px-1 py-1">
                                                        <p className="text-[8px] font-black text-emerald-500/50 uppercase tracking-widest">
                                                            * O email e WhatsApp são fundamentais para o envio automático do acesso.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Assignment Feedback Card */}
                        {role === 'trainer' && (
                            <div className="bg-zinc-900 border-2 border-emerald-500/20 p-4 sm:p-6 rounded-2xl shadow-xl animate-in zoom-in-95 duration-300">
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                                    <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                                        <div className={cn(
                                            "p-4 rounded-2xl shadow-lg transition-all",
                                            selectedStudentId || bindingMode === 'create' ? "bg-emerald-500 text-black" : "bg-zinc-800 text-zinc-500"
                                        )}>
                                            <User className="w-6 h-6" />
                                        </div>
                                        <div className="space-y-1">
                                            <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Destinatário da Importação</span>
                                            <div className="flex flex-col sm:flex-row items-center gap-3">
                                                <h3 className="text-lg sm:text-xl font-black text-white italic uppercase tracking-tight">
                                                    {selectedStudentId 
                                                        ? (students.find(s => s.student_id === selectedStudentId)?.student?.[0]?.full_name || 
                                                           students.find(s => s.student_id === selectedStudentId)?.student?.full_name || 
                                                           studentMatch?.exact?.full_name || 
                                                           "Aluno Selecionado")
                                                        : (bindingMode === 'create' 
                                                            ? (placeholderName || detectedStudentName || "Novo Aluno")
                                                            : "Somente Biblioteca")
                                                    }
                                                </h3>
                                                <Badge variant="outline" className={cn(
                                                    "text-[9px] font-black italic uppercase border-2",
                                                    selectedStudentId || bindingMode === 'create' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-zinc-800 text-zinc-500 border-zinc-700"
                                                )}>
                                                    {selectedStudentId ? "Aluno Existente" : (bindingMode === 'create' ? "Novo Aluno" : "Biblioteca")}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    {(selectedStudentId || bindingMode === 'create') && (
                                        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Vinculação Ativa</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Data Preview */}
                        <div id="tour-parsed-data" className="space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-4">
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                    <FileText className="w-3 h-3 text-emerald-500" />
                                    Dados Extraídos
                                </span>

                                {type === 'diet' && parsedData.parsed_data?.options?.length > 1 && (
                                    <div className="flex items-center gap-3 pb-4">
                                        <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Escolher Cardápio:</span>
                                        <Select
                                            value={selectedOptionIndex.toString()}
                                            onValueChange={(v) => setSelectedOptionIndex(parseInt(v))}
                                        >
                                            <SelectTrigger className="h-9 min-w-[180px] bg-zinc-900 border-zinc-800 text-xs font-bold text-emerald-400 rounded-xl">
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
                                    </div>
                                )}
                            </div>

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
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-6 border-t border-zinc-900/50">
                            {typeof window !== 'undefined' && localStorage.getItem(`onboarding_step_${userId}`) === 'import_diet' && bindingMode !== 'matched' && (
                                <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest animate-pulse mb-2 sm:mb-0">
                                    ⚠️ Crie o aluno para vincular automaticamente
                                </p>
                            )}
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    setParsedData(null)
                                    setSelectedStudentId('')
                                }}
                                className="text-zinc-500 hover:text-white rounded-xl h-12 px-6 font-bold uppercase tracking-widest text-[10px] w-full sm:w-auto"
                            >
                                <X className="w-4 h-4 mr-2" />
                                Cancelar
                            </Button>
                            <Button
                                id="tour-save-button"
                                onClick={handleSave}
                                disabled={isSaving || (role === 'trainer' && bindingMode === 'create' && (!placeholderName || !placeholderEmail))}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-12 px-10 font-bold shadow-lg shadow-emerald-500/10 transition-all active:scale-95 flex gap-2 disabled:opacity-50 w-full sm:w-auto items-center justify-center"
                            >
                                {isSaving ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        SALVANDO...
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-4 h-4" />
                                        {bindingMode === 'create' 
                                            ? `SALVAR E VINCULAR A ${placeholderName?.toUpperCase() || detectedStudentName?.toUpperCase() || 'NOVO ALUNO'}`
                                            : `SALVAR ${type === 'workout' ? 'TREINO' : 'DIETA'}`
                                        }
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>

            {/* Feature Badges Footer */}
            <div className="bg-zinc-900/30 px-8 py-4 border-t border-zinc-900/50 flex flex-wrap gap-4">
                <div className="flex items-center gap-1.5 text-zinc-600">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-tight">AI Powered Extraction</span>
                </div>
                <div className="flex items-center gap-1.5 text-zinc-600">
                    <Check className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-tight">Auto Structured JSON</span>
                </div>
            </div>
        </Card>
    )
}
