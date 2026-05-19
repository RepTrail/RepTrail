import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { createStudentWorkout } from '@/actions/student-content-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function CreateStudentWorkoutPage() {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/auth/login')

    // Verify auto-training is active
    const { data: profile } = await supabase
        .from('profiles')
        .select('auto_training_status')
        .eq('id', user.id)
        .single()

    const isAutoTrainingActive = profile?.auto_training_status === 'active' || profile?.auto_training_status === 'trial'
    if (!isAutoTrainingActive) redirect('/dashboard/student/workouts')

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/student/workouts">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Voltar
                    </Button>
                </Link>
                <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">
                    Criar <span className="text-orange-500">Treino</span>
                </h1>
            </div>

            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-white">Novo Treino</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={createStudentWorkout} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-2">Nome do Treino</label>
                            <Input
                                name="name"
                                placeholder="Ex: Treino A - Peito e Tríceps"
                                className="bg-zinc-800 border-zinc-700 text-white"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-2">Descrição (opcional)</label>
                            <Textarea
                                name="description"
                                placeholder="Breve descrição do treino..."
                                className="bg-zinc-800 border-zinc-700 text-white resize-none"
                                rows={3}
                            />
                        </div>

                        <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                            Criar Treino
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
