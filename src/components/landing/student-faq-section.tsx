'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { SectionHeader } from './section-header';

const faqs = [
    {
        question: "O aplicativo é gratuito para alunos?",
        answer: "Sim, se você for convidado por um personal trainer que já utiliza o RepTrail. Caso queira treinar sozinho, oferecemos o Plano de Auto Treino, que é uma assinatura paga, mas você pode testar todas as funcionalidades por 7 dias grátis sem precisar cadastrar um cartão."
    },
    {
        question: "Como funciona o período de 7 dias grátis?",
        answer: "Ao se cadastrar no módulo de Auto-Treino, você ganha 7 dias para testar todas as funcionalidades do Plano de Auto Treino: geração de treinos por IA, cálculo de macros e importação de PDFs. Não pedimos cartão de crédito para o teste!"
    },
    {
        question: "Como eu encontro um personal trainer?",
        answer: "Temos um Marketplace oficial integrado. Você pode buscar por nome, especialidade ou objetivos. Todos os profissionais são verificados pela nossa curadoria para garantir a melhor entrega."
    },
    {
        question: "O que é o 'Auto-Treino'?",
        answer: "É o nosso módulo de inteligência artificial para quem quer autonomia. Você pode gerar treinos e dietas automaticamente, calcular seus macros e até importar um treino em PDF que a nossa AI converte instantaneamente para o formato do app."
    },
    {
        question: "Minhas fotos de evolução são privadas?",
        answer: "Sim. Por padrão, suas fotos são visíveis apenas para você e seu personal trainer. Você tem total controle e pode optar por torná-las públicas caso queira aparecer no feed da comunidade ou servir de inspiração na landing page do seu treinador."
    }
];

export function StudentFAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="py-[50px] md:py-[100px] px-[20px] bg-zinc-950 w-full border-b border-zinc-900 relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/40 via-zinc-950 to-zinc-950" />

            <div className="w-full max-w-[1100px] mx-auto relative z-10 flex flex-col gap-[30px] md:gap-[50px]">
                <SectionHeader 
                    badgeIcon={HelpCircle}
                    badgeVariant="orange"
                    badgeText="FAQ Aluno"
                    title={<>Dúvidas <span className="text-orange-500">Frequentes.</span></>}
                    subtitle="Tire suas dúvidas sobre como o RepTrail vai acelerar seus resultados."
                />

                <div className="flex flex-col gap-[20px] mx-auto w-full">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-colors"
                        >
                            <button
                                className="w-full flex items-center justify-between p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50"
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            >
                                <span className="text-lg font-black text-white italic whitespace-normal">{faq.question}</span>
                                <ChevronDown
                                    className={`w-5 h-5 text-orange-500 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}
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
