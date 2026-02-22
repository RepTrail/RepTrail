'use client'

import { useState, useEffect } from 'react'
import { getStoreProducts, logProductClick } from '@/actions/store-actions'
import {
    ShoppingBag,
    ExternalLink,
    Search,
    Filter,
    ArrowLeft,
    Tag,
    ChevronDown,
    Zap,
    Flame,
    Star,
    ShieldCheck
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function StoreExplorePage() {
    const pathname = usePathname()
    const isTrainer = pathname.includes('/dashboard/trainer')
    const backPath = isTrainer ? '/dashboard/trainer/loja' : '/dashboard/student/loja'

    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState<string | null>(null)
    const [subCategory, setSubCategory] = useState<string | null>(null)

    useEffect(() => {
        loadProducts()
    }, [])

    async function loadProducts() {
        setLoading(true)
        const data = await getStoreProducts()
        setProducts(data)
        setLoading(false)
    }

    const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)))

    // Subcategories for "Suplemento"
    const supplementsSub = ['Pré-treino', 'Vitaminas', 'Whey', 'Outros']

    const filteredProducts = products.filter(p => {
        const pName = p.name?.toLowerCase() || ''
        const pDesc = p.description?.toLowerCase() || ''
        const sTerm = search.toLowerCase()

        const matchesSearch = pName.includes(sTerm) || pDesc.includes(sTerm)
        const matchesCategory = !category || p.category === category
        const matchesSub = !subCategory || p.sub_category === subCategory || (category === 'Suplemento' && subCategory === 'Outros' && !p.sub_category)

        return matchesSearch && matchesCategory && matchesSub
    })

    async function handleBuy(product: any) {
        await logProductClick(product.id)
        window.open(product.link_url, '_blank')
    }

    return (
        <div className="space-y-10 pb-20 animate-in fade-in duration-700">
            {/* Header / Nav */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-zinc-800/50">
                <div className="flex items-center gap-4">
                    <Link href={backPath}>
                        <Button variant="ghost" size="icon" className="rounded-full bg-zinc-900/50 border border-zinc-800/50 hover:bg-zinc-800 w-12 h-12">
                            <ArrowLeft className="w-5 h-5 text-zinc-400" />
                        </Button>
                    </Link>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Explorar Coleção</h1>
                        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest leading-none">RepTrail Performance Store</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 flex-1 max-w-2xl justify-end">
                    <div className="relative group flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-orange-500 transition-colors z-20" />
                        <Input
                            placeholder="Pesquisar na coleção..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="h-12 pl-12 bg-zinc-900/50 border-zinc-800/50 rounded-2xl focus:border-orange-500/50 font-bold text-xs backdrop-blur-sm"
                        />
                    </div>

                    <div className="flex gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="h-12 bg-zinc-900/50 border-zinc-800/50 rounded-2xl font-bold uppercase tracking-widest text-[10px] justify-between px-6 min-w-[140px]">
                                    <span className="flex items-center gap-2">
                                        <Filter className="w-3.5 h-3.5 text-zinc-400" />
                                        {category || 'Categorias'}
                                    </span>
                                    <ChevronDown className="w-4 h-4 opacity-50" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-zinc-950 border-zinc-800 text-white min-w-[200px] rounded-2xl p-2">
                                <DropdownMenuItem onClick={() => { setCategory(null); setSubCategory(null); }} className="font-bold uppercase tracking-widest text-[10px] py-3 cursor-pointer rounded-xl">
                                    Todas as Categorias
                                </DropdownMenuItem>
                                {categories.map(cat => (
                                    <DropdownMenuItem key={cat} onClick={() => { setCategory(cat); setSubCategory(null); }} className="font-bold uppercase tracking-widest text-[10px] py-3 cursor-pointer rounded-xl">
                                        {cat}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {category === 'Suplemento' && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="h-12 bg-orange-500/10 border-orange-500/20 rounded-2xl font-bold uppercase tracking-widest text-[10px] justify-between text-orange-500 px-6 min-w-[140px]">
                                        <span className="flex items-center gap-2">
                                            <Tag className="w-3.5 h-3.5" />
                                            {subCategory || 'Tipo'}
                                        </span>
                                        <ChevronDown className="w-4 h-4 opacity-50" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-zinc-950 border-zinc-800 text-white min-w-[200px] rounded-2xl p-2">
                                    <DropdownMenuItem onClick={() => setSubCategory(null)} className="font-bold uppercase tracking-widest text-[10px] py-3 cursor-pointer rounded-xl">
                                        Todos os Tipos
                                    </DropdownMenuItem>
                                    {supplementsSub.map(sub => (
                                        <DropdownMenuItem key={sub} onClick={() => setSubCategory(sub)} className="font-bold uppercase tracking-widest text-[10px] py-3 cursor-pointer rounded-xl">
                                            {sub}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                </div>
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                        <div className="w-2 h-8 bg-orange-500 transform -skew-x-12" />
                        <div className="w-2 h-8 bg-orange-500/30 transform -skew-x-12" />
                    </div>
                    <span className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                        {filteredProducts.length} itens encontrados
                    </span>
                </div>
            </div>

            {/* Grid */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {loading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="h-[450px] bg-zinc-900/40 border border-zinc-800/50 rounded-[2.5rem] animate-pulse" />
                    ))
                ) : filteredProducts.map(product => (
                    <Card key={product.id} className="group relative flex flex-col bg-zinc-950 border border-zinc-800 hover:border-orange-500/50 transition-all duration-500 rounded-3xl overflow-hidden hover:shadow-[0_0_40px_-5px_rgba(249,115,22,0.15)]">
                        {/* High Contrast Badge */}
                        <div className="absolute top-4 left-4 z-20">
                            <div className="bg-orange-600/90 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-md shadow-lg shadow-orange-900/20 transform -skew-x-12 border border-orange-500/20">
                                <span className="block skew-x-12">{product.sub_category || product.category || 'PRODUTO'}</span>
                            </div>
                        </div>

                        {/* Image Area */}
                        <div className="relative h-72 bg-zinc-900/50 p-6 flex items-center justify-center overflow-hidden border-b border-zinc-800/50 group-hover:bg-zinc-900/80 transition-colors">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_70%)]" />
                            <img
                                src={product.image_url || 'https://via.placeholder.com/200'}
                                alt={product.name}
                                className="w-full h-full object-contain relative z-10 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 drop-shadow-2xl"
                            />
                        </div>

                        <CardContent className="p-6 flex-1 flex flex-col gap-5 bg-gradient-to-b from-zinc-950 to-zinc-900/50">
                            <div className="space-y-2">
                                <h3 className="text-xl font-black text-white italic uppercase leading-none line-clamp-2 group-hover:text-orange-500 transition-colors duration-300">
                                    {product.name}
                                </h3>
                                <p className="text-xs font-bold text-zinc-500 line-clamp-2 uppercase tracking-wide">
                                    {product.description}
                                </p>
                            </div>

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
                                        {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3 h-3 text-orange-500 fill-orange-500" />)}
                                    </div>
                                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">4.9/5.0</p>
                                </div>
                            </div>

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
                <div className="py-24 text-center space-y-6 bg-zinc-900/20 border border-zinc-800/50 border-dashed rounded-[3rem] animate-in slide-in-from-bottom-4 duration-500">
                    <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800 mx-auto shadow-2xl">
                        <ShoppingBag className="w-8 h-8 text-zinc-800" />
                    </div>
                    <div className="space-y-2">
                        <p className="text-white font-black uppercase italic text-xl">Nenhum tesouro encontrado</p>
                        <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest max-w-xs mx-auto">Tente mudar os filtros ou o termo de busca.</p>
                    </div>
                </div>
            )}
        </div>
    )
}
