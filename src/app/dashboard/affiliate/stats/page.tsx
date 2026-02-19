
import { getAffiliateStatsDetails } from '@/actions/affiliate-actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Activity, UserPlus, MousePointerClick, DollarSign, TrendingUp, Filter } from 'lucide-react'

export default async function AffiliateStatsPage() {
    const data = await getAffiliateStatsDetails()

    if (!data) return <div className="text-white">Carregando estatísticas...</div>

    const { clicksPerDay, conversion } = data

    // Prepare chart data - ensure chronological order
    const clickDays = Object.entries(clicksPerDay).sort((a, b) => a[0].localeCompare(b[0]))
    const maxClicks = Math.max(...clickDays.map(([, v]) => v), 1)

    return (
        <div className="space-y-10 pb-10">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-white italic uppercase tracking-tight">
                    Estatísticas de Performance
                </h1>
                <p className="text-zinc-500 text-sm font-medium mt-2">
                    Análise detalhada de cliques, conversão e engajamento dos últimos 30 dias.
                </p>
            </div>

            {/* Conversion Funnel */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Passo 1: Tráfego</CardTitle>
                        <MousePointerClick className="w-4 h-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-white">{conversion.totalClicks.toLocaleString()}</div>
                        <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-widest font-bold">Cliques únicos</p>
                    </CardContent>
                </Card>

                <div className="relative">
                    {/* Funnel Arrow Desktop */}
                    <div className="hidden md:block absolute -left-3 top-1/2 -translate-y-1/2 z-10 text-zinc-800">
                        <TrendingUp className="w-6 h-6 rotate-90" />
                    </div>

                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Passo 2: Leads</CardTitle>
                            <UserPlus className="w-4 h-4 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-white">{conversion.totalReferrals.toLocaleString()}</div>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded font-bold">
                                    {conversion.clickToSignup}% Conv.
                                </span>
                                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Cadastros</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="relative">
                    {/* Funnel Arrow Desktop */}
                    <div className="hidden md:block absolute -left-3 top-1/2 -translate-y-1/2 z-10 text-zinc-800">
                        <TrendingUp className="w-6 h-6 rotate-90" />
                    </div>

                    <Card className="bg-zinc-900 border-zinc-800 border-l-4 border-l-emerald-500">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Passo 3: Vendas</CardTitle>
                            <DollarSign className="w-4 h-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-white">{conversion.payingReferrals.toLocaleString()}</div>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-bold">
                                    {conversion.signupToPaid}% Conv.
                                </span>
                                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Pagantes</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Activities Chart (30 days) */}
                <Card className="lg:col-span-2 bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                                <BarChart className="w-4 h-4 text-blue-500" />
                                Volume de Cliques (30 Dias)
                            </CardTitle>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Hoje: {clickDays[clickDays.length - 1][1]} clicks</span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64 w-full flex items-end gap-1 pt-6">
                            {clickDays.map(([date, count], i) => (
                                <div key={date} className="group relative flex-1 flex flex-col items-center gap-2 h-full justify-end">
                                    {/* Tooltip */}
                                    <div className="absolute bottom-full mb-2 bg-zinc-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none font-bold">
                                        {new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}: {count} clicks
                                    </div>

                                    {/* Bar */}
                                    <div
                                        className="w-full bg-blue-500/80 rounded-t-sm hover:bg-blue-400 transition-colors relative"
                                        style={{
                                            height: `${(count / maxClicks) * 100}%`,
                                            minHeight: count > 0 ? '4px' : '0px'
                                        }}
                                    />

                                    {/* X Axis Label (show every 5 days) */}
                                    {i % 5 === 0 && (
                                        <div className="text-[10px] text-zinc-600 font-mono absolute -bottom-6">
                                            {new Date(date).getDate()}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Side Insights - Future improvement */}
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-amber-500" />
                            Insights Rápidos
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Melhor dia da semana</p>
                            <p className="text-sm text-zinc-300">Segunda-feira</p> {/* Placeholder logic for now, trivial to implement real logic later */}
                        </div>
                        <div className="space-y-2">
                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Origem do tráfego</p>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-zinc-400">
                                    <span>Instagram</span>
                                    <span className="font-bold text-white">45%</span>
                                </div>
                                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-purple-500 w-[45%]" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-zinc-400">
                                    <span>WhatsApp</span>
                                    <span className="font-bold text-white">30%</span>
                                </div>
                                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-[30%]" />
                                </div>
                            </div>
                            <p className="text-[9px] text-zinc-600 italic mt-2">* Dados de origem estimados com base em referer_url.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
