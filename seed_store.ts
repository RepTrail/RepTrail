
import { createAdminClient } from './src/lib/supabase/admin'

async function seedStore() {
    const supabase = createAdminClient()
    if (!supabase) {
        console.error('Supabase admin client could not be initialized.')
        return
    }

    const products = [
        {
            name: "Creatina Monohidratada (250g)",
            description: "A Creatina mais pura do mercado. Auxilia no aumento de força, potência e ganho de massa muscular. Ideal para atletas de alta performance.",
            image_url: "https://www.gsuplementos.com.br/upload/produto/imagem/creatina-monohidratada-250g-growth-supplements-1.png",
            official_price: 85.50,
            link_url: "https://www.gsuplementos.com.br/creatina-monohidratada-250g-growth-supplements-p985939",
            category: "Suplementos"
        },
        {
            name: "Whey Protein Concentrado (1kg) - Sabor Chocolate",
            description: "Alta concentração de proteínas, BCAA e Glutamina. O melhor custo-benefício para sua recuperação muscular pós-treino.",
            image_url: "https://www.gsuplementos.com.br/upload/produto/imagem/whey-protein-concentrado-1kg-growth-supplements-1.png",
            official_price: 110.00,
            link_url: "https://www.gsuplementos.com.br/whey-protein-concentrado-1kg-growth-supplements-p985860",
            category: "Proteínas"
        },
        {
            name: "Pré-Treino Haze (300g) - Blue Razz",
            description: "Foco extremo, energia duradoura e pump muscular sinistro. Formulado para levar seus treinos ao próximo nível.",
            image_url: "https://www.gsuplementos.com.br/upload/produto/imagem/pre-treino-haze-300g-growth-supplements-1.png",
            official_price: 125.00,
            link_url: "https://www.gsuplementos.com.br/pre-treino-haze-300g-growth-supplements-p985800",
            category: "Energia"
        },
        {
            name: "Multivitamínico Ultra (120 tabletes)",
            description: "Complexo completo de vitaminas e minerais essenciais para manter o sistema imunológico forte e o metabolismo em dia.",
            image_url: "https://www.gsuplementos.com.br/upload/produto/imagem/multivitaminico-ultra-120-tabletes-growth-supplements-1.png",
            official_price: 45.00,
            link_url: "https://www.gsuplementos.com.br/multivitaminico-ultra-120-tabletes-growth-supplements-p985830",
            category: "Vitaminas"
        }
    ]

    console.log('--- Seeding store_products ---')
    const { error } = await supabase
        .from('store_products')
        .insert(products)

    if (error) {
        console.error('Error seeding products:', error)
    } else {
        console.log('Successfully added 4 products to the store.')
    }
}

seedStore()
