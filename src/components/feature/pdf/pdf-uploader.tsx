'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Badge } from "@/components/ui/badge"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Upload, FileText, Check, Loader2, FileUp, X, Sparkles } from 'lucide-react'
import { parseUploadedPdf } from '@/actions/pdf-actions'
import { saveParsedData } from '@/actions/save-actions'
import { useToast } from '@/hooks/use-toast'
import { PdfDataView } from './pdf-data-view'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function PdfUploader({ type, students = [] }: { type: 'workout' | 'diet', students?: any[] }) {
    const [uploading, setUploading] = useState(false)
    const [parsing, setParsing] = useState(false)
    const [saving, setSaving] = useState(false)
    const [parsedData, setParsedData] = useState<any>(null)
    const [selectedStudentId, setSelectedStudentId] = useState<string>('')
    const { toast } = useToast()
    const supabase = createClient()

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

    const handleSave = async () => {
        if (type === 'workout' && parsedData?.parsed_data?.ergogenics?.length > 0 && !selectedStudentId) {
            toast({
                variant: "destructive",
                title: "Atenção!",
                description: "Ergogênicos detectados. Selecione um aluno para salvar o protocolo."
            })
            return
        }

        setSaving(true)
        const result = await saveParsedData(type, parsedData.parsed_data, selectedStudentId)
        setSaving(false)

        if (result.success) {
            toast({ title: "Sucesso!", description: `${type === 'workout' ? 'Treino' : 'Dieta'} salvo${selectedStudentId ? ' e vinculado ao aluno' : ''}.` })
            setParsedData(null)
            setSelectedStudentId('')
        } else {
            toast({ variant: "destructive", title: "Erro ao salvar", description: result.error })
        }
    }

    return (
        <Card className="w-full bg-zinc-950 border-zinc-800 shadow-2xl rounded-2xl overflow-hidden border-t-zinc-700/50">
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
                        <div className={`
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
                                    <Button className="bg-white text-zinc-950 hover:bg-zinc-200 rounded-xl font-bold h-12 px-8 shadow-xl transition-all relative">
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
                        <div className="flex items-center gap-3 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl">
                            <div className="p-2 bg-emerald-500/20 rounded-full">
                                <Check className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold uppercase tracking-tight">Leitura Concluída</p>
                                <p className="text-xs text-emerald-400/70">Revise abaixo as informações extraídas pela nossa IA.</p>
                            </div>
                        </div>

                        {/* Ergogenics Alert (Only for Workouts) */}
                        {type === 'workout' && parsedData.parsed_data?.ergogenics?.length > 0 && (
                            <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex flex-col gap-3 shadow-lg shadow-amber-500/5">
                                <div className="flex items-center gap-2 text-amber-500">
                                    <Sparkles className="w-4 h-4" />
                                    <p className="text-xs font-bold uppercase tracking-tight">Protocolo Ergogênico Detectado!</p>
                                </div>
                                <p className="text-[10px] text-zinc-400 uppercase font-bold leading-tight">
                                    Selecione o aluno abaixo para vincular este protocolo automaticamente ao salvá-lo.
                                </p>
                                <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                                    <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white h-11 rounded-xl">
                                        <SelectValue placeholder="Escolher Aluno..." />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                        {students.map((s) => (
                                            <SelectItem key={s.student_id} value={s.student_id}>
                                                {s.student?.[0]?.full_name || s.student?.full_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* Data Preview */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                    <FileText className="w-3 h-3 text-emerald-500" />
                                    Dados Extraídos
                                </span>
                            </div>
                            <PdfDataView type={type} data={parsedData.parsed_data} />
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-6 border-t border-zinc-900/50">
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    setParsedData(null)
                                    setSelectedStudentId('')
                                }}
                                disabled={saving}
                                className="text-zinc-500 hover:text-white rounded-xl h-12 px-6 font-bold uppercase tracking-widest text-[10px]"
                            >
                                <X className="w-4 h-4 mr-2" />
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={saving}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-12 px-10 font-bold shadow-lg shadow-emerald-500/10 transition-all active:scale-95 flex gap-2"
                            >
                                {saving ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> SALVANDO...</>
                                ) : (
                                    <><Check className="w-4 h-4" /> SALVAR {type === 'workout' ? 'TREINO' : 'DIETA'}</>
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
