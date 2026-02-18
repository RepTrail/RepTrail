import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'
import { Home, ArrowLeft, Search } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4">
            <div className="max-w-2xl mx-auto text-center space-y-8">
                <div className="space-y-4">
                    <Logo size="xl" />
                    <div className="space-y-2">
                        <h1 className="text-6xl md:text-8xl font-black text-white italic uppercase tracking-tighter">
                            404
                        </h1>
                        <p className="text-xl md:text-2xl font-bold text-zinc-400 uppercase tracking-wide">
                            Página não encontrada
                        </p>
                        <p className="text-sm text-zinc-600 font-medium uppercase tracking-widest max-w-md mx-auto">
                            O rastro que você está procurando não existe mais ou foi movido.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
                    <Link href="/">
                        <Button className="h-14 px-8 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase italic tracking-wide shadow-lg shadow-emerald-500/20 text-lg">
                            <Home className="w-5 h-5 mr-2" />
                            Voltar para Home
                        </Button>
                    </Link>
                    <Link href="/buscar-personal">
                        <Button variant="outline" className="h-14 px-8 rounded-2xl border-zinc-800 hover:bg-zinc-900 text-zinc-300 hover:text-white font-bold uppercase tracking-wide">
                            <Search className="w-5 h-5 mr-2" />
                            Buscar Personal
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
