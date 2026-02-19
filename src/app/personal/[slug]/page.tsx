import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'
import { ShieldCheck, Star, MapPin, Trophy, MessageCircle, ArrowLeft, Dumbbell, User, Instagram, Quote, Image as ImageIcon, ExternalLink } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

export default async function TrainerPublicProfile({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Normalize slug - remove null, undefined, or empty strings
    const normalizedSlug = slug?.trim().toUpperCase() || ''

    if (!normalizedSlug || normalizedSlug === 'NULL' || normalizedSlug === 'UNDEFINED') {
        notFound()
    }


    // Use the RPC to fetch all data at once securely
    const { data: publicData, error: rpcError } = await supabase
        .rpc('get_trainer_public_profile', { trainer_slug: normalizedSlug })

    if (rpcError || !publicData) {
        console.error('Error fetching public profile via RPC:', rpcError)
        notFound()
    }

    const { trainer, reviews, photos } = publicData

    if (!trainer || !trainer.trainer_code) {
        notFound()
    }

    // Process photo pairs from the flattened list of photos
    let photoPairs: { studentName: string; oldest: any; newest: any }[] = []
    if (photos && photos.length > 0) {
        const byStudent = new Map<string, any[]>()
        for (const p of photos) {
            const sid = p.student_id
            if (!byStudent.has(sid)) byStudent.set(sid, [])
            byStudent.get(sid)!.push(p)
        }
        photoPairs = Array.from(byStudent.entries())
            .filter(([, arr]) => arr.length >= 2)
            .map(([studentId, arr]) => {
                const first = arr[0]
                const last = arr[arr.length - 1]
                const studentName = first.student_name || 'Aluno'
                return {
                    studentName,
                    oldest: first,
                    newest: last
                }
            })
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white selection:bg-emerald-500/30">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900">
                <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Logo />
                        {user && (
                            <Link href="/dashboard/student" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group">
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                <span className="text-sm font-medium">Voltar ao Dashboard</span>
                            </Link>
                        )}
                    </div>
                    {!user && (
                        <Link href="/auth/login">
                            <Button variant="outline" className="border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-900">
                                Entrar
                            </Button>
                        </Link>
                    )}
                </div>
            </header>

            <main className="container mx-auto px-4 md:px-6 pt-32 pb-20">
                <div className="max-w-4xl mx-auto space-y-12">

                    {/* Hero Section */}
                    <div className="relative group p-8 md:p-12 bg-zinc-900/50 border border-zinc-800 rounded-[3rem] overflow-hidden shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-50" />

                        <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center md:items-start text-center md:text-left">
                            <div className="relative shrink-0">
                                <div className="absolute inset-0 bg-emerald-500 blur-3xl opacity-20 rounded-full" />
                                <Avatar className="w-48 h-48 border-4 border-zinc-900 shadow-xl relative z-10">
                                    <AvatarImage src={trainer.avatar_url} className="object-cover" />
                                    <AvatarFallback className="bg-zinc-800 text-zinc-500 text-4xl font-black uppercase">
                                        {trainer.full_name?.substring(0, 2)}
                                    </AvatarFallback>
                                </Avatar>
                                {trainer.is_elite && (
                                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-zinc-950 border border-amber-500/50 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg z-20 whitespace-nowrap">
                                        <Trophy className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                        <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Elite Trainer</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 space-y-6">
                                <div className="space-y-2">
                                    <h1 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter">
                                        {trainer.full_name}
                                    </h1>
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-medium text-zinc-400">
                                        {trainer.location && (
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="w-4 h-4 text-emerald-500" />
                                                <span>{trainer.location}</span>
                                            </div>
                                        )}
                                        {trainer.cref && (
                                            <div className="flex items-center gap-1.5">
                                                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                                <span>CREF: {trainer.cref}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-1.5 text-amber-500">
                                            <Star className="w-4 h-4 fill-amber-500" />
                                            <span>{Number(trainer.average_rating || 0).toFixed(1)} Rating</span>
                                            <span className="text-zinc-600">•</span>
                                            <span className="text-zinc-500">{trainer.total_reviews || 0} avaliações</span>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-zinc-300 leading-relaxed text-lg max-w-2xl">
                                    {trainer.bio || "Treinador focado em resultados e alta performance. Especialista em ajudar alunos a atingirem seu potencial máximo."}
                                </p>

                                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                    {trainer.specialty && (
                                        <span className="px-3 py-1 bg-zinc-800 rounded-lg text-xs font-bold text-zinc-300 uppercase tracking-wide">
                                            {trainer.specialty}
                                        </span>
                                    )}
                                </div>

                                <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center md:justify-start items-center">
                                    {trainer.whatsapp ? (
                                        <Link
                                            href={`https://wa.me/${trainer.whatsapp?.replace(/\D/g, '')}?text=Olá ${trainer.full_name}, vi seu perfil no RepTrail e gostaria de saber mais sobre sua consultoria!`}
                                            target="_blank"
                                        >
                                            <Button className="h-14 px-8 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase italic tracking-wide w-full sm:w-auto shadow-lg shadow-emerald-500/20 text-lg">
                                                <MessageCircle className="w-5 h-5 mr-2" />
                                                Contratar Agora
                                            </Button>
                                        </Link>
                                    ) : (
                                        <Button disabled className="h-14 px-8 rounded-2xl bg-zinc-800 text-zinc-500 font-black uppercase italic tracking-wide w-full sm:w-auto cursor-not-allowed">
                                            Agenda Fechada
                                        </Button>
                                    )}
                                    {trainer.instagram && (
                                        <Link
                                            href={`https://instagram.com/${trainer.instagram.replace(/^@/, '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Button variant="outline" className="h-14 px-10 rounded-2xl border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white font-black uppercase italic tracking-wide w-full sm:w-auto transition-all duration-300 group shadow-xl active:scale-95">
                                                <Instagram className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform text-pink-500" />
                                                Instagram
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats / Info Grid */}
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-zinc-900/30 border border-zinc-800/50 p-8 rounded-3xl space-y-4">
                            <div className="w-12 h-12 bg-zinc-950 rounded-xl flex items-center justify-center border border-zinc-800">
                                <UsersIcon className="w-6 h-6 text-emerald-500" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-white italic uppercase">Transformações</h3>
                                <p className="text-zinc-500 text-sm mt-1">Alunos satisfeitos que mudaram de vida.</p>
                            </div>
                        </div>
                        <div className="bg-zinc-900/30 border border-zinc-800/50 p-8 rounded-3xl space-y-4">
                            <div className="w-12 h-12 bg-zinc-950 rounded-xl flex items-center justify-center border border-zinc-800">
                                <Dumbbell className="w-6 h-6 text-orange-500" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-white italic uppercase">Metodologia</h3>
                                <p className="text-zinc-500 text-sm mt-1">Treinos periodizados e focados na sua evolução.</p>
                            </div>
                        </div>
                        <div className="bg-zinc-900/30 border border-zinc-800/50 p-8 rounded-3xl space-y-4">
                            <div className="w-12 h-12 bg-zinc-950 rounded-xl flex items-center justify-center border border-zinc-800">
                                <ActivityIcon className="w-6 h-6 text-blue-500" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-white italic uppercase">Suporte Total</h3>
                                <p className="text-zinc-500 text-sm mt-1">Acompanhamento próximo para garantir resultados.</p>
                            </div>
                        </div>
                    </div>

                    {/* Reviews Section */}
                    {reviews && reviews.length > 0 && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-3xl md:text-4xl font-black text-white italic uppercase tracking-tighter">
                                    Avaliações dos Alunos
                                </h2>
                                <div className="flex items-center gap-2 text-amber-500">
                                    <Star className="w-5 h-5 fill-amber-500" />
                                    <span className="text-lg font-black">{Number(trainer.average_rating || 0).toFixed(1)}</span>
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {reviews.map((review: any) => (
                                    <Card key={review.id} className="bg-zinc-900/30 border border-zinc-800/50 rounded-3xl overflow-hidden group hover:border-zinc-700/50 transition-all">
                                        <CardContent className="p-6 space-y-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-10 w-10 border border-zinc-800">
                                                        <AvatarImage src={review.student?.avatar_url} />
                                                        <AvatarFallback className="bg-zinc-800 text-zinc-500 text-xs font-black uppercase">
                                                            {review.student?.full_name?.substring(0, 2) || 'A'}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="text-sm font-bold text-white">{review.student?.full_name || 'Aluno'}</p>
                                                        <div className="flex items-center gap-1">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <Star
                                                                    key={star}
                                                                    className={`w-3 h-3 ${star <= review.rating ? 'text-amber-500 fill-amber-500' : 'text-zinc-700'}`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <Quote className="w-5 h-5 text-zinc-800 group-hover:text-emerald-500/30 transition-colors" />
                                            </div>
                                            {review.comment && (
                                                <p className="text-zinc-400 text-sm leading-relaxed italic line-clamp-3">
                                                    "{review.comment}"
                                                </p>
                                            )}
                                            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                                                {new Date(review.created_at).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}
                                            </p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Progress Photos Section - pares Antes/Depois por aluno */}
                    {photoPairs && photoPairs.length > 0 && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-3xl md:text-4xl font-black text-white italic uppercase tracking-tighter">
                                    Transformações
                                </h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {photoPairs.map((pair) => {
                                    const oldUrl = pair.oldest.front_url || pair.oldest.back_url || pair.oldest.side_right_url || pair.oldest.side_left_url
                                    const newUrl = pair.newest.front_url || pair.newest.back_url || pair.newest.side_right_url || pair.newest.side_left_url
                                    if (!oldUrl || !newUrl) return null
                                    return (
                                        <div key={pair.studentName + pair.oldest.id} className="space-y-3">
                                            <p className="text-sm font-black text-zinc-300 italic uppercase tracking-wide px-1">
                                                {pair.studentName}
                                            </p>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 transition-all">
                                                    <Image
                                                        src={oldUrl}
                                                        alt={`${pair.studentName} no início`}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-transparent">
                                                        <div className="absolute bottom-2 left-2 right-2">
                                                            <p className="text-[10px] font-bold text-white uppercase tracking-widest">
                                                                No início
                                                            </p>
                                                            <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">
                                                                {new Date(pair.oldest.created_at).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 transition-all">
                                                    <Image
                                                        src={newUrl}
                                                        alt={`${pair.studentName} hoje`}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-transparent">
                                                        <div className="absolute bottom-2 left-2 right-2">
                                                            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                                                                Hoje
                                                            </p>
                                                            <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">
                                                                {new Date(pair.newest.created_at).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Instagram CTA Section */}
                    {trainer.instagram && (
                        <div className="relative p-8 md:p-12 bg-gradient-to-br from-zinc-900/50 to-zinc-950 border border-zinc-800 rounded-[3rem] overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-transparent opacity-50" />
                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="space-y-2 text-center md:text-left">
                                    <h3 className="text-2xl md:text-3xl font-black text-white italic uppercase tracking-tighter">
                                        Acompanhe no Instagram
                                    </h3>
                                    <p className="text-zinc-400 text-sm">
                                        Veja mais transformações, dicas e conteúdo exclusivo
                                    </p>
                                </div>
                                <Link
                                    href={`https://instagram.com/${trainer.instagram.replace(/^@/, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button className="h-14 px-8 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black uppercase italic tracking-wide shadow-lg shadow-purple-500/20 group/btn">
                                        <Instagram className="w-5 h-5 mr-2" />
                                        Seguir no Instagram
                                        <ExternalLink className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )}

                </div>
            </main>
        </div>
    )
}

function UsersIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    )
}

function ActivityIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
    )
}
