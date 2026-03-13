'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { SectionHeader } from './section-header';

const faqs = [
    {
        question: "Como o Motor de Prescrição funciona?",
        answer: "O nosso sistema possui uma interface simples e intuitiva onde você pode salvar seus próprios templates (dietas, treinos) e prescrevê-los em segundos. Chega de digitar a mesma série dezenas de vezes."
    },
    {
        question: "O aplicativo é gratuito para meus alunos?",
        answer: "Sim! Os alunos têm acesso 100% gratuito ao aplicativo. Apenas o treinador (você) assina os planos do RepTrail para gerenciar seus alunos e negócios."
    },
    {
        question: "Como funciona a Máquina de Vendas?",
        answer: "Nós oferecemos uma landing page pública que funciona como sua vitrine no nosso marketplace. Interessados podem te encontrar e nós convertemos leads diretamente para a sua base, sem a necessidade de você vender no orgânico."
    },
    {
        question: "Posso cancelar minha conta a qualquer momento?",
        answer: "Sim! Trabalhamos com planos sem fidelidade. Você pode evoluir de plano conforme cresce sua base ou cancelar a qualquer momento diretamente no seu painel."
    },
    {
        question: "Como a Análise de Performance me ajuda?",
        answer: "O RepTrail gera métricas baseadas em comparativos de fotos, de cargas progressivas, e evolução do percentual de gordura. O software organiza as informações e cria feedbacks visuais para reter seu aluno por mais tempo."
    }
];

export function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="py-[50px] md:py-[100px] px-[20px] bg-zinc-950 w-full border-b border-zinc-900 relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/40 via-zinc-950 to-zinc-950" />

            <div className="w-full max-w-[1100px] mx-auto relative z-10 flex flex-col gap-[30px] md:gap-[50px]">
                <SectionHeader 
                    title={<>Perguntas <span className="text-emerald-500">Frequentes.</span></>}
                    subtitle="Tudo o que você precisa saber para alavancar com o RepTrail."
                />

                <div className="flex flex-col gap-[20px] mx-auto w-full">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-colors"
                        >
                            <button
                                className="w-full flex items-center justify-between p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            >
                                <span className="text-lg font-black text-white italic whitespace-normal">{faq.question}</span>
                                <ChevronDown
                                    className={`w-5 h-5 text-emerald-500 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}
                                />
                            </button>
                            <div
                                className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                                <p className="px-6 pb-6 text-zinc-400 leading-relaxed font-medium">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
