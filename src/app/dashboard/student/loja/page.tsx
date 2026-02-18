'use client'

import { useState, useEffect } from 'react'
import { getStoreProducts, logProductClick } from '@/actions/store-actions'
import {
    ShoppingBag,
    ExternalLink,
    Zap,
    Heart,
    Star,
    ShieldCheck,
    Search,
    ArrowRight,
    Flame
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Logo } from '@/components/ui/logo'

export default function StudentStorePage() {
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        loadProducts()
    }, [])

    async function loadProducts() {
        setLoading(true)
        const data = await getStoreProducts()
        setProducts(data)
        setLoading(false)
    }

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category?.toLowerCase().includes(search.toLowerCase())
    )

    async function handleBuy(product: any) {
        await logProductClick(product.id)
        window.open(product.link_url, '_blank')
    }

    return (
        <div className="space-y-12 pb-20 animate-in fade-in duration-700">
            {/* Store Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-4">
                    <Logo size="lg" />
                    <p className="text-zinc-500 text-sm font-medium max-w-md leading-relaxed">
                        Suplementos de alta performance selecionados criteriosamente para acelerar seus resultados.
                    </p>
                </div>

                <div className="relative w-full md:w-96 group">
                    <div className="absolute inset-0 bg-orange-500/5 blur-2xl group-focus-within:bg-orange-500/10 transition-all" />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-orange-500 transition-colors z-20" />
                    <Input
                        placeholder="O que você precisa hoje? (Ex: Creatina)"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="h-14 pl-12 bg-zinc-900/50 border-zinc-800/50 rounded-2xl focus:border-orange-500/50 transition-all font-bold text-xs backdrop-blur-sm relative z-10"
                    />
                </div>
            </div>

            {/* Featured Hero Card */}
            <div className="relative group overflow-hidden rounded-[3.5rem] bg-zinc-900 border border-zinc-800/50 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/60 to-transparent z-10" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(249,115,22,0.1),transparent_50%)]" />

                <img
                    src="https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&q=80&w=1200"
                    alt="Growth Training"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[4s]"
                />

                <div className="relative z-20 p-12 md:p-16 flex flex-col justify-center max-w-2xl space-y-8">
                    <div className="flex items-center gap-2 px-3 py-1 bg-zinc-950/80 border border-zinc-800 w-fit rounded-full">
                        <Flame className="w-3 h-3 text-orange-500" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Growth Supplements • Parceiro Oficial</span>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-3xl md:text-7xl font-black text-white italic uppercase tracking-tighter leading-[0.9]">
                            Performance <br /> <span className="text-orange-500 text-4xl md:text-8xl">Extrema</span>
                        </h2>
                        <p className="text-zinc-400 font-medium text-lg max-w-md">
                            A base sólida que seu corpo precisa para bater novos recordes todos os dias.
                        </p>
                    </div>

                    <Button className="w-fit h-14 px-10 rounded-2xl bg-orange-500 hover:bg-orange-400 text-zinc-950 font-black uppercase italic tracking-wide shadow-xl shadow-orange-500/20 active:scale-95 transition-all">
                        Explorar Coleção
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                </div>
            </div>

            {/* Products Grid */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {loading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="h-[450px] bg-zinc-900/40 border border-zinc-800/50 rounded-[2.5rem] animate-pulse" />
                    ))
                ) : filteredProducts.map(product => (
                    <Card key={product.id} className="group flex flex-col bg-zinc-900/30 border-zinc-800/30 hover:border-orange-500/40 transition-all duration-700 rounded-[2.5rem] overflow-hidden backdrop-blur-sm hover:shadow-[0_20px_40px_-15px_rgba(249,115,22,0.15)] relative">
                        {/* Status/Category Badge */}
                        <div className="absolute top-6 left-6 z-20">
                            <Badge variant="outline" className="bg-zinc-950/80 border-zinc-800/80 text-[8px] font-black uppercase tracking-widest px-3 py-1">
                                {product.category || 'Suplemento'}
                            </Badge>
                        </div>

                        {/* Image Container */}
                        <div className="relative h-64 bg-zinc-950/20 flex items-center justify-center p-12 overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(249,115,22,0.05),transparent_70%)] group-hover:scale-150 transition-transform duration-1000" />
                            <img
                                src={product.image_url || 'https://via.placeholder.com/200'}
                                alt={product.name}
                                className="w-full h-full object-contain relative z-10 group-hover:scale-110 transition-transform duration-700"
                            />
                        </div>

                        <CardContent className="p-8 space-y-6 flex-1 flex flex-col relative z-20">
                            <div className="space-y-2 flex-1">
                                <h3 className="text-xl font-black text-white italic uppercase line-clamp-2 leading-tight group-hover:text-orange-500 transition-colors duration-500">
                                    {product.name}
                                </h3>
                                <p className="text-zinc-500 text-[11px] font-medium leading-relaxed line-clamp-3">
                                    {product.description}
                                </p>
                            </div>

                            <div className="space-y-4 pt-6 mt-auto">
                                <div className="flex items-end justify-between border-t border-zinc-800/50 pt-6">
                                    <div className="space-y-0.5">
                                        <div className="flex items-center gap-1.5 opacity-50 mb-1">
                                            <ShieldCheck className="w-3 h-3 text-emerald-500" />
                                            <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Produto Original</span>
                                        </div>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-sm font-black text-zinc-500 italic">R$</span>
                                            <span className="text-3xl font-black text-white italic tracking-tighter">
                                                {product.official_price?.toFixed(0)}
                                                <span className="text-sm opacity-50">,{(product.official_price % 1).toFixed(2).split('.')[1]}</span>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="flex items-center gap-0.5">
                                            {[1, 2, 3, 4, 5].map(s => (
                                                <Star key={s} className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                                            ))}
                                        </div>
                                        <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">5.0 (400+)</span>
                                    </div>
                                </div>

                                <Button
                                    onClick={() => handleBuy(product)}
                                    className="w-full h-14 rounded-2xl bg-white hover:bg-orange-500 hover:text-zinc-950 text-zinc-950 font-black uppercase italic tracking-wide transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 border-none"
                                >
                                    Comprar Agora
                                    <ExternalLink className="w-4 h-4 opacity-70 group-hover:rotate-12 transition-transform" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {!loading && filteredProducts.length === 0 && (
                <div className="py-24 text-center space-y-6 bg-zinc-900/20 border border-zinc-800/50 border-dashed rounded-[3rem] animate-in slide-in-from-bottom-4 duration-500">
                    <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800 mx-auto shadow-2xl">
                        <ShoppingBag className="w-8 h-8 text-zinc-800" />
                    </div>
                    <div className="space-y-2">
                        <p className="text-white font-black uppercase italic text-xl">Nenhum tesouro encontrado</p>
                        <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest max-w-xs mx-auto">Tente buscar por termos mais genéricos ou verifique as categorias.</p>
                    </div>
                    <Button
                        variant="link"
                        onClick={() => setSearch('')}
                        className="text-orange-500 uppercase font-black italic tracking-widest text-[10px] hover:text-orange-400"
                    >
                        Limpar Busca
                    </Button>
                </div>
            )}
        </div>
    )
}
