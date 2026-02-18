import { getTrainerProfile } from "@/actions/trainer-actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, User, CreditCard, Sparkles, Zap, Crown } from "lucide-react"
import { createClient } from '@/lib/supabase/server'
import { ClientProfileForm } from "@/components/feature/trainer/client-profile-form"

export default async function TrainerProfilePage() {
    const profile = await getTrainerProfile()
    const supabase = await createClient()

    // Fetch Real Stats for Gamification
    const { count: activeStudents } = await supabase
        .from('trainer_students')
        .select('*', { count: 'exact', head: true })
        .eq('trainer_id', profile?.id)
        .eq('active', true)

    const currentTier = (profile?.plan_tier as 'start' | 'pro' | 'elite') || 'start'

    const tierColors = {
        start: 'text-blue-500',
        pro: 'text-emerald-500',
        elite: 'text-amber-500'
    }
    const tierBgColors = {
        start: 'bg-blue-500/5 border-b border-blue-500/10',
        pro: 'bg-emerald-500/5 border-b border-emerald-500/10',
        elite: 'bg-amber-500/5 border-b border-amber-500/10'
    }
    const tierIcons = {
        start: Zap,
        pro: Sparkles,
        elite: Crown
    }

    const TierIcon = tierIcons[currentTier]
    const tierColor = tierColors[currentTier]
    const tierBg = tierBgColors[currentTier]

    return (
        <div className="space-y-10 pb-10">
            {/* Header */}
            <div className="space-y-1 pb-2 border-b border-zinc-800/50">
                <h1 className="text-4xl font-black tracking-tight text-white font-sans italic uppercase">
                    Meu Perfil Profissional
                </h1>
                <p className="text-zinc-500 text-sm font-medium">
                    Gerencie sua identidade e veja seu progresso como treinador.
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-12">
                {/* Main Settings */}
                <div className="lg:col-span-8 space-y-6">
                    <Card className="bg-zinc-950 border-zinc-800 shadow-2xl overflow-hidden rounded-2xl border-t-zinc-700/50">
                        <CardHeader className="bg-zinc-900/10 border-b border-zinc-900/50 py-4">
                            <CardTitle className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                                <User className="w-5 h-5 text-emerald-500" />
                                Dados Profissionais
                            </CardTitle>
                            <CardDescription className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest leading-none mt-1">
                                Essas informações ficam visíveis para seus alunos e no convite.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-8">
                            <ClientProfileForm profile={profile} />
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar area */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="bg-zinc-950 border-zinc-800 shadow-2xl rounded-2xl overflow-hidden group">
                        <CardHeader className={`${tierBg} py-4`}>
                            <CardTitle className={`text-sm font-bold ${tierColor} flex items-center gap-2 uppercase tracking-widest`}>
                                <Award className="w-4 h-4" />
                                Gamificação
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="flex flex-col items-center justify-center py-4 bg-zinc-900/30 rounded-2xl border border-zinc-800/50 border-dashed">
                                <div className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">Nível</div>
                                <div className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-2">
                                    {(profile?.plan_tier || 'START').toUpperCase()}
                                    <TierIcon className={`w-5 h-5 ${tierColor} animate-pulse`} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800/50 text-center">
                                    <div className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Avaliação</div>
                                    <div className={`text-xl font-bold ${tierColor}`}>
                                        {profile?.rating && profile.rating > 0 ? `${profile.rating} ★` : 'S/ Av.'}
                                    </div>
                                    {(!profile?.rating || profile.rating === 0) && (
                                        <p className="text-[8px] text-zinc-600 mt-1 uppercase font-bold tracking-tight">Sem avaliações ainda</p>
                                    )}
                                </div>
                                <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800/50 text-center">
                                    <div className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Alunos</div>
                                    <div className="text-xl font-bold text-white">{activeStudents || 0}</div>
                                </div>
                            </div>

                            <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest text-center">
                                Baseado na atividade real da sua conta.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-zinc-950 border-zinc-800 shadow-2xl rounded-2xl overflow-hidden group opacity-60">
                        <CardHeader className="bg-purple-500/5 border-b border-purple-500/10 py-4">
                            <CardTitle className="text-sm font-bold text-purple-500 flex items-center gap-2 uppercase tracking-widest">
                                <CreditCard className="w-4 h-4" />
                                Pagamentos & Planos
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                                Gerencie seus preços e receba pagamentos diretamente dos alunos.
                            </p>
                            <div className="p-3 bg-zinc-900/50 rounded-xl border border-zinc-800 text-[10px] font-bold text-zinc-600 uppercase tracking-widest text-center">
                                Stripe Connect em breve
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
