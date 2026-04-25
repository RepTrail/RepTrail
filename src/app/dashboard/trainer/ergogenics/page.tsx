import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { FlaskConical, Users, ArrowUpRight, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default async function TrainerErgogenicsHubPage() {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    // 1. Fetch real students
    const { data: students } = await supabase
        .from('trainer_students')
        .select(`
            id,
            student:profiles!student_id(
                id,
                full_name,
                avatar_url,
                details:student_details!id(
                    steroid_use
                )
            )
        `)
        .eq('trainer_id', user.id)
        .eq('active', true)

    // 2. Fetch placeholder students
    const { data: placeholders } = await supabase
        .from('pending_student_links')
        .select('*')
        .eq('trainer_id', user.id)
        .eq('status', 'pending')

    // Filter real students
    const realErgoStudents = (students || [])
        .filter((s: any) => s.student?.details?.steroid_use)
        .map((s: any) => ({
            id: s.id,
            full_name: s.student.full_name,
            avatar_url: s.student.avatar_url,
            is_placeholder: false
        }))

    // Filter placeholder students
    const placeholderErgoStudents = (placeholders || [])
        .filter((p: any) => {
            const metadata = (p.ergogenic_data as any[])?.find(e => e.__metadata)
            return metadata?.steroid_use === true
        })
        .map((p: any) => ({
            id: p.id,
            full_name: p.student_name,
            avatar_url: null,
            is_placeholder: true
        }))

    // Merge results
    const ergogenicStudents = [...realErgoStudents, ...placeholderErgoStudents]

    return (
        <div className="space-y-10 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-zinc-800/50">
                <div className="space-y-2 sm:space-y-5">
                    <h1 className="text-4xl font-black tracking-tight text-white font-sans italic uppercase flex items-center gap-3 pb-4">
                        <FlaskConical className="w-8 h-8 text-orange-500" />
                        Ergogênicos
                    </h1>
                    <p className="text-zinc-500 text-sm font-medium">
                        Gerencie protocolos farmacológicos e suplementação avançada de seus alunos.
                    </p>
                </div>
            </div>

            {ergogenicStudents.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {ergogenicStudents.map((item: any) => (
                        <Card key={item.id} className="bg-zinc-900/40 border-zinc-800/50 hover:border-zinc-700 transition-all group overflow-hidden rounded-3xl">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-12 w-12 border-2 border-zinc-800 group-hover:border-orange-500/30 transition-all">
                                        <AvatarImage src={item.avatar_url} />
                                        <AvatarFallback className="bg-zinc-950 text-zinc-500 font-bold uppercase italic text-xs">
                                            {item.full_name?.substring(0, 2)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-0.5">
                                        <h3 className="text-sm font-black text-white uppercase italic tracking-wide group-hover:text-orange-500 transition-colors">
                                            {item.full_name}
                                        </h3>
                                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-none">
                                            Protocolo Ativo {item.is_placeholder && "(Pendente)"}
                                        </p>
                                    </div>
                                </div>
                                <Button asChild variant="ghost" size="icon" className="rounded-2xl bg-zinc-950 border border-zinc-800 group-hover:bg-orange-500 group-hover:text-zinc-950 transition-all active:scale-95">
                                    <Link href={`/dashboard/trainer/students/${item.id}/ergogenics`}>
                                        <ArrowUpRight className="w-5 h-5" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 bg-zinc-900/20 border border-dashed border-zinc-800 rounded-3xl">
                    <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800">
                        <Users className="w-10 h-10 text-zinc-700" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-black text-white italic uppercase tracking-tight">Nenhum aluno utiliza ergogênicos</h3>
                        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest max-w-xs mx-auto leading-relaxed">
                            Alunos devem habilitar o uso de ergogênicos no formulário de inscrição para aparecerem aqui.
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}
