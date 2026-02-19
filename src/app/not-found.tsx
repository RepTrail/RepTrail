
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'
import { Home, ArrowLeft, Search } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4 relative overflow-hidden">
            {/* Background Spot */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[128px] pointer-events-none" />

            <div className="max-w-2xl mx-auto text-center space-y-12 relative z-10">
                <div className="flex flex-col items-center gap-6">
                    <Logo size="xl" />

                    <div className="space-y-4">
                        <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-600 italic uppercase tracking-tighter">
                            404
                        </h1>
                        <div className="space-y-2">
                            <p className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wide">
                                Página não encontrada
                            </p>
                            <p className="text-sm text-zinc-500 font-medium uppercase tracking-widest max-w-md mx-auto leading-relaxed">
                                Parece que você está fora da trilha. O link pode ter sido alterado ou removido.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md mx-auto">
                    <Link href="/" className="w-full sm:w-auto">
                        <Button className="w-full h-14 px-8 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/30 transition-all hover:-translate-y-1">
                            <Home className="w-4 h-4 mr-2" />
                            Ir para Início
                        </Button>
                    </Link>

                    <Link href="/buscar-personal" className="w-full sm:w-auto">
                        <Button variant="outline" className="w-full h-14 px-8 rounded-xl bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white font-bold uppercase tracking-widest transition-all hover:-translate-y-1">
                            <Search className="w-4 h-4 mr-2" />
                            Buscar Personal
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
