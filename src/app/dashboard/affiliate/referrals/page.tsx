
import { getAffiliateReferrals } from '@/actions/affiliate-actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Users, UserCheck } from 'lucide-react'

export default async function AffiliateReferralsPage() {
    const referrals = await getAffiliateReferrals()

    // Quick stats for this page
    const total = referrals.length
    const active = referrals.filter(r => r.status === 'active').length
    const conversion = total > 0 ? ((active / total) * 100).toFixed(1) : '0.0'

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-white italic uppercase tracking-tight">
                    Meus Indicados
                </h1>
                <p className="text-zinc-500 text-sm font-medium mt-2">
                    Acompanhe todos os usuários que se cadastraram através do seu link.
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center justify-between">
                            Total de Cadastros
                            <Users className="w-4 h-4 text-zinc-600" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-white">{total}</div>
                    </CardContent>
                </Card>
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center justify-between">
                            Clientes Ativos (Pagantes)
                            <UserCheck className="w-4 h-4 text-emerald-600" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-emerald-400">{active}</div>
                    </CardContent>
                </Card>
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center justify-between">
                            Taxa de Assinatura
                            <span className="text-zinc-600">%</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-amber-400">{conversion}%</div>
                        <p className="text-[10px] text-zinc-500 font-medium">De cadastro para pagante</p>
                    </CardContent>
                </Card>
            </div>

            {/* Referrals List */}
            <Card className="bg-zinc-900 border-zinc-800 rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-zinc-800/50 py-4">
                    <CardTitle className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        Lista Completa ({total})
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {referrals.length > 0 ? (
                        <div className="divide-y divide-zinc-800/50">
                            {referrals.map((r) => (
                                <div key={r.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 hover:bg-zinc-800/30 transition-colors gap-4">
                                    <div className="flex items-center gap-3 pb-4">
                                        <Avatar className="h-10 w-10 border border-zinc-700">
                                            <AvatarImage src={r.avatar_url || undefined} />
                                            <AvatarFallback className="bg-zinc-800 text-zinc-400 font-bold text-xs">
                                                {r.full_name?.substring(0, 2).toUpperCase() || '?'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-bold text-zinc-200">{r.full_name || 'Usuário sem nome'}</p>
                                                {r.role === 'trainer' && (
                                                    <Badge variant="secondary" className="text-[9px] h-4 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20">
                                                        PERSONAL
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-[11px] text-zinc-500 font-mono">{r.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 justify-between md:justify-end w-full md:w-auto">
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Cadastro</p>
                                            <p className="text-xs text-zinc-400">{new Date(r.created_at).toLocaleDateString('pt-BR')}</p>
                                        </div>

                                        <div className="min-w-[100px] flex justify-end">
                                            {r.status === 'active' ? (
                                                <Badge className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold uppercase tracking-widest text-[10px]">
                                                    Assinante
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-zinc-500 border-zinc-700 font-bold uppercase tracking-widest text-[10px]">
                                                    Gratuito
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 text-center space-y-3">
                            <Users className="w-12 h-12 text-zinc-800 mx-auto" />
                            <p className="text-zinc-500 text-sm">Você ainda não tem indicados.</p>
                            <p className="text-zinc-600 text-xs text-center max-w-sm mx-auto">
                                Compartilhe seu link de afiliado nas redes sociais para começar a construir sua base de indicados.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
