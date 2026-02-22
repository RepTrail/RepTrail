'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Ruler, Weight, User, Activity, Calculator, ArrowRight, Target, Check } from "lucide-react"
import { updateStudentProfile } from '@/actions/student-actions'
import { Badge } from '@/components/ui/badge'

export function AnamnesisForm({ initialData }: { initialData?: any }) {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)

    // Form State
    const [formData, setFormData] = useState({
        age: initialData?.age || '',
        sex: initialData?.sex || 'male',
        height: initialData?.height || '',
        weight: initialData?.weight || initialData?.current_weight || '',
        activity_level: initialData?.activity_level || 'moderate',
        // Measurements for Navy Seal
        neck_cm: initialData?.neck_cm || '',
        waist_cm: initialData?.waist_cm || '',
        hip_cm: initialData?.hip_cm || '',
    })

    const [calculatedBF, setCalculatedBF] = useState<string | null>(null)

    // Navy Seal Calculation Logic
    useEffect(() => {
        const h = parseFloat(formData.height)
        const neck = parseFloat(formData.neck_cm)
        const waist = parseFloat(formData.waist_cm)
        const hip = parseFloat(formData.hip_cm)

        if (formData.sex === 'male') {
            if (!h || !waist || !neck || waist <= neck) {
                setCalculatedBF(null)
                return
            }
            // Navy Seal Formula (Male): %BF = 495 / (1.0324 - 0.19077 * log10(waist-neck) + 0.15456 * log10(height)) - 450
            const bf = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(h)) - 450
            setCalculatedBF(Math.max(2, bf).toFixed(1))
        } else {
            if (!h || !waist || !neck || !hip || (waist + hip) <= neck) {
                setCalculatedBF(null)
                return
            }
            // Navy Seal Formula (Female): %BF = 495 / (1.29579 - 0.35004 * log10(waist+hip-neck) + 0.22100 * log10(height)) - 450
            const bf = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(h)) - 450
            setCalculatedBF(Math.max(2, bf).toFixed(1))
        }
    }, [formData])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        const res = await updateStudentProfile({
            ...formData,
            body_fat: calculatedBF
        })

        if (res.success) {
            toast({
                title: "Protocolo Atualizado!",
                description: "Suas métricas de elite foram calculadas e salvas.",
            })
        } else {
            toast({
                variant: "destructive",
                title: "Falha na sincronização",
                description: res.error || "Ocorreu um erro ao salvar os dados.",
            })
        }
        setLoading(false)
    }

    return (
        <Card className="bg-zinc-950 border-zinc-900 shadow-2xl rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-8 md:p-12 border-b border-zinc-900 bg-zinc-900/10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                                <Activity className="w-6 h-6 text-emerald-500" />
                            </div>
                            <CardTitle className="text-3xl font-black text-white italic uppercase tracking-tighter">Anamnese de Performance</CardTitle>
                        </div>
                        <CardDescription className="text-zinc-500 font-medium text-sm">
                            Utilizando o protocolo da Marinha Americana (Navy Seal Body Fat Formula).
                        </CardDescription>
                    </div>
                    <Badge variant="outline" className="h-10 border-emerald-500/30 bg-emerald-500/5 text-emerald-500 text-[10px] font-black uppercase tracking-widest px-6 rounded-xl">
                        Protocolo Militar Ativo
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="p-8 md:p-12">
                <form onSubmit={handleSubmit} className="space-y-12">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-3">
                            <Label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                <User className="w-3 h-3" /> Idade
                            </Label>
                            <Input
                                type="number"
                                placeholder="25"
                                value={formData.age}
                                onChange={e => setFormData(prev => ({ ...prev, age: e.target.value }))}
                                className="h-16 bg-zinc-900/30 border-zinc-800 focus:border-emerald-500/50 rounded-2xl font-black italic text-xl px-6"
                                required
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                <Ruler className="w-3 h-3" /> Altura (cm)
                            </Label>
                            <Input
                                type="number"
                                placeholder="180"
                                value={formData.height}
                                onChange={e => setFormData(prev => ({ ...prev, height: e.target.value }))}
                                className="h-16 bg-zinc-900/30 border-zinc-800 focus:border-emerald-500/50 rounded-2xl font-black italic text-xl px-6"
                                required
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                <Weight className="w-3 h-3" /> Peso (kg)
                            </Label>
                            <Input
                                type="number"
                                step="0.1"
                                placeholder="85.5"
                                value={formData.weight}
                                onChange={e => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                                className="h-16 bg-zinc-900/30 border-zinc-800 focus:border-emerald-500/50 rounded-2xl font-black italic text-xl px-6"
                                required
                            />
                        </div>
                    </div>

                    {/* Navy Seal Measurements */}
                    <div className="p-8 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Target className="w-32 h-32 text-emerald-500" />
                        </div>

                        <div className="space-y-8 relative z-10">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <h4 className="text-sm font-black text-white italic uppercase tracking-widest">Medições Antropométricas</h4>
                                    <Badge variant="outline" className="border-none bg-emerald-500 text-zinc-950 text-[8px] font-black uppercase h-5 px-2">Precisão Máxima</Badge>
                                </div>
                                <p className="text-xs text-zinc-500 font-medium italic">Insira suas medidas exatas com fita métrica para o cálculo de elite.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Pescoço (cm)</Label>
                                    <Input
                                        type="number"
                                        step="0.1"
                                        placeholder="Ex: 40"
                                        value={formData.neck_cm}
                                        onChange={e => setFormData(prev => ({ ...prev, neck_cm: e.target.value }))}
                                        className="h-16 bg-zinc-950 border-emerald-500/20 focus:border-emerald-500/50 rounded-2xl font-black italic text-xl px-6"
                                        required
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Cintura - Umbigo (cm)</Label>
                                    <Input
                                        type="number"
                                        step="0.1"
                                        placeholder="Ex: 82"
                                        value={formData.waist_cm}
                                        onChange={e => setFormData(prev => ({ ...prev, waist_cm: e.target.value }))}
                                        className="h-16 bg-zinc-950 border-emerald-500/20 focus:border-emerald-500/50 rounded-2xl font-black italic text-xl px-6"
                                        required
                                    />
                                </div>
                                {formData.sex === 'female' && (
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Quadril (cm)</Label>
                                        <Input
                                            type="number"
                                            step="0.1"
                                            placeholder="Ex: 95"
                                            value={formData.hip_cm}
                                            onChange={e => setFormData(prev => ({ ...prev, hip_cm: e.target.value }))}
                                            className="h-16 bg-zinc-950 border-emerald-500/20 focus:border-emerald-500/50 rounded-2xl font-black italic text-xl px-6"
                                            required
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Sex & Activity */}
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <Label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Gênero Biológico</Label>
                                <RadioGroup
                                    value={formData.sex}
                                    onValueChange={v => setFormData(prev => ({ ...prev, sex: v }))}
                                    className="flex gap-4"
                                >
                                    <div className="flex-1">
                                        <RadioGroupItem value="male" id="male" className="peer sr-only" />
                                        <Label
                                            htmlFor="male"
                                            className="flex items-center justify-center h-16 bg-zinc-900/30 border border-zinc-800 rounded-2xl cursor-pointer hover:bg-zinc-800 peer-data-[state=checked]:border-emerald-500 peer-data-[state=checked]:bg-emerald-500/5 transition-all text-[10px] font-black uppercase italic tracking-widest text-zinc-500 peer-data-[state=checked]:text-emerald-500"
                                        >
                                            Masculino
                                        </Label>
                                    </div>
                                    <div className="flex-1">
                                        <RadioGroupItem value="female" id="female" className="peer sr-only" />
                                        <Label
                                            htmlFor="female"
                                            className="flex items-center justify-center h-16 bg-zinc-900/30 border border-zinc-800 rounded-2xl cursor-pointer hover:bg-zinc-800 peer-data-[state=checked]:border-pink-500 peer-data-[state=checked]:bg-pink-500/5 transition-all text-[10px] font-black uppercase italic tracking-widest text-zinc-500 peer-data-[state=checked]:text-pink-500"
                                        >
                                            Feminino
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            <div className="space-y-4">
                                <Label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Nível de Atividade</Label>
                                <Select
                                    value={formData.activity_level}
                                    onValueChange={v => setFormData(prev => ({ ...prev, activity_level: v }))}
                                >
                                    <SelectTrigger className="h-16 bg-zinc-900/30 border-zinc-800 rounded-2xl font-black italic uppercase text-[11px] tracking-widest px-6">
                                        <SelectValue placeholder="Selecione..." />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-950 border-zinc-900 text-white">
                                        <SelectItem value="sedentary" className="font-bold uppercase text-[10px] tracking-wider py-4">Sedentário (Nenhum exercício)</SelectItem>
                                        <SelectItem value="light" className="font-bold uppercase text-[10px] tracking-wider py-4">Leve (1-3 dias/semana)</SelectItem>
                                        <SelectItem value="moderate" className="font-bold uppercase text-[10px] tracking-wider py-4">Moderado (3-5 dias/semana)</SelectItem>
                                        <SelectItem value="active" className="font-bold uppercase text-[10px] tracking-wider py-4">Intenso (6-7 dias/semana)</SelectItem>
                                        <SelectItem value="athlete" className="font-bold uppercase text-[10px] tracking-wider py-4">Elite (Atleta prof.)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Result Dashboard */}
                        <div className="flex flex-col justify-end gap-8">
                            <div className={`p-8 rounded-[2.5rem] border transition-all duration-700 ${calculatedBF ? 'bg-emerald-500/5 border-emerald-500/20 shadow-2xl shadow-emerald-500/5' : 'bg-zinc-900/10 border-zinc-800 opacity-50'}`}>
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Estimativa Navy Seal</p>
                                    {calculatedBF && <Check className="w-5 h-5 text-emerald-500" />}
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="text-7xl font-black text-white italic tracking-tighter tabular-nums">
                                        {calculatedBF || '--.-'}<span className="text-3xl text-emerald-500 ml-1">%</span>
                                    </div>
                                    <div className="flex-1 border-l border-zinc-800 pl-6 hidden lg:block">
                                        <p className="text-[9px] font-bold text-zinc-500 leading-relaxed uppercase tracking-widest mb-1">Status Metabólico</p>
                                        <p className="text-xs font-black text-white uppercase italic">
                                            {calculatedBF ? (parseFloat(calculatedBF) < 10 ? 'Elite' : parseFloat(calculatedBF) < 15 ? 'Atleta' : parseFloat(calculatedBF) < 20 ? 'Fitness' : 'Iniciante') : 'Aguardando Medições'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading || !calculatedBF}
                                className="w-full h-16 rounded-2xl bg-white hover:bg-emerald-500 hover:text-white text-zinc-950 font-black uppercase italic tracking-widest transition-all shadow-2xl active:scale-[0.98] group text-base"
                            >
                                {loading ? "Processando Protocolo..." : "Salvar Dados Antropométricos"}
                                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
