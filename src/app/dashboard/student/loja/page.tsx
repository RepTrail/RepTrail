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
    Flame,
    Search,
    ArrowRight
} from 'lucide-react'
import { ProductSkeleton } from './loading'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Logo } from '@/components/ui/logo'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function StudentStorePage() {
    const pathname = usePathname()
    const isTrainer = pathname.includes('/dashboard/trainer')
    const explorePath = isTrainer ? '/dashboard/trainer/loja/explorar' : '/dashboard/student/loja/explorar'

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
        <div className="space-y-12 animate-in fade-in duration-700 ">
            {/* Header Section */}
            <div className="space-y-2 sm:space-y-5">
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">
                        Minha <span className="text-orange-500">Loja</span>
                    </h1>
                </div>
                {/* Subtítulo com Search */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <p className="text-zinc-500 text-sm font-medium max-w-md leading-relaxed">
                        Suplementos de alta performance selecionados criteriosamente para acelerar seus resultados.
                    </p>

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
            </div>

            {/* Featured Hero Card */}
            <div className="relative group overflow-hidden rounded-[2rem] sm:rounded-[3rem] bg-zinc-900 border border-zinc-800/80 shadow-2xl shadow-black/50">
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/60 to-transparent z-10" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(249,115,22,0.1),transparent_50%)]" />

                <img
                    src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=1200"
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[4s]"
                />

                <div className="relative z-20 p-6 sm:p-12 md:p-16 flex flex-col justify-center max-w-2xl space-y-8">
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

                    <Link href={explorePath} className="w-full sm:w-fit">
                        <Button className="w-full sm:w-fit h-auto min-h-[3.5rem] py-4 px-10 rounded-2xl bg-orange-500 hover:bg-orange-400 text-zinc-950 font-black uppercase italic tracking-wide shadow-xl shadow-orange-500/20 active:scale-95 transition-all">
                            Explorar Coleção
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Products Grid */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {loading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                        <ProductSkeleton key={i} />
                    ))
                ) : filteredProducts.map(product => (
                    <Card key={product.id} className="group relative flex flex-col bg-zinc-950 border border-zinc-800 hover:border-orange-500/50 transition-all duration-500 rounded-3xl overflow-hidden hover:shadow-[0_0_40px_-5px_rgba(249,115,22,0.15)]">
                        {/* High Contrast Badge */}
                        <div className="absolute top-4 left-4 z-20">
                            <div className="bg-orange-600/90 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-md shadow-lg shadow-orange-900/20 transform -skew-x-12 border border-orange-500/20">
                                <span className="block skew-x-12">{product.category || 'OFERTA'}</span>
                            </div>
                        </div>

                        {/* Image Area - Subtle gradient backdrop */}
                        <div className="relative h-72 bg-zinc-900/50 p-6 flex items-center justify-center overflow-hidden border-b border-zinc-800/50 group-hover:bg-zinc-900/80 transition-colors">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_70%)]" />
                            <img
                                src={product.image_url || 'https://via.placeholder.com/200'}
                                alt={product.name}
                                className="w-full h-full object-contain relative z-10 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 drop-shadow-2xl"
                            />
                        </div>

                        <CardContent className="p-6 flex-1 flex flex-col gap-5 bg-gradient-to-b from-zinc-950 to-zinc-900/50">
                            {/* Title & Desc */}
                            <div className="space-y-2">
                                <h3 className="text-xl font-black text-white italic uppercase leading-none line-clamp-2 group-hover:text-orange-500 transition-colors duration-300">
                                    {product.name}
                                </h3>
                                <p className="text-xs font-bold text-zinc-500 line-clamp-2 uppercase tracking-wide">
                                    {product.description}
                                </p>
                            </div>

                            {/* Price Section */}
                            <div className="mt-auto pt-4 border-t border-zinc-800/50 flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-1.5 mb-2">
                                        <div className="flex items-center gap-1 text-emerald-500">
                                            <ShieldCheck className="w-3 h-3" />
                                            <span className="text-[9px] font-black uppercase tracking-widest">Original & Lacrado</span>
                                        </div>
                                    </div>
                                    <div className="flex items-baseline gap-0.5 text-white">
                                        <span className="text-xs font-bold text-zinc-500 mr-1">R$</span>
                                        <span className="text-4xl font-black italic tracking-tighter">
                                            {Math.floor(product.official_price || 0)}
                                        </span>
                                        <span className="text-sm font-bold text-zinc-500 mb-auto ml-0.5">
                                            ,{(product.official_price % 1 || 0).toFixed(2).split('.')[1]}
                                        </span>
                                    </div>
                                </div>

                                <div className="text-right space-y-1">
                                    <div className="flex gap-0.5 justify-end">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <Star
                                                key={i}
                                                className={`w-3 h-3 ${i <= Math.round(product.rating || 5) ? 'text-orange-500 fill-orange-500' : 'text-zinc-800'}`}
                                            />
                                        ))}
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <p className="text-[9px] font-black text-white uppercase tracking-widest leading-none">
                                            {(product.rating || 5.0).toFixed(1)}/5.0
                                        </p>
                                        {product.reviews_count > 0 && (
                                            <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mt-1">
                                                {product.reviews_count.toLocaleString('pt-BR')} opiniões
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Button */}
                            <Button
                                onClick={() => handleBuy(product)}
                                className="w-full h-14 bg-white hover:bg-orange-500 text-black hover:text-white font-black uppercase italic tracking-widest rounded-xl transition-all shadow-[0_4px_0_0_#27272a] hover:shadow-[0_2px_0_0_#9a3412] active:shadow-none translate-y-0 active:translate-y-1 text-sm border-none ring-0 focus:ring-0"
                            >
                                <span className="flex items-center gap-2">
                                    Comprar Agora <ExternalLink className="w-4 h-4 ml-1" />
                                </span>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {!loading && filteredProducts.length === 0 && (
                <div className="py-12 sm:py-24 text-center space-y-6 bg-zinc-900/20 border border-zinc-800/50 border-dashed rounded-[2rem] sm:rounded-[3rem] animate-in slide-in-from-bottom-4 duration-500">
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
