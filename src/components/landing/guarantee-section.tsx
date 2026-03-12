
import { ShieldCheck, Calendar, RefreshCcw, CheckCircle2 } from "lucide-react";

export function GuaranteeSection() {
    return (
        <section className="py-[50px] md:py-[100px] px-[20px] bg-zinc-950 w-full relative overflow-hidden border-b border-zinc-900">
            {/* Background Aesthetics */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/5 via-zinc-950 to-zinc-950 opacity-60" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full -mr-[250px] -mt-[250px]" />

            <div className="w-full max-w-[1100px] mx-auto relative z-10">
                <div className="bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem] p-8 md:p-16 backdrop-blur-sm flex flex-col md:flex-row items-center gap-12 hover:border-emerald-500/20 transition-all duration-500 group">

                    {/* Badge/Icon Section */}
                    <div className="relative shrink-0">
                        <div className="absolute inset-0 bg-emerald-500 blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />
                        <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-emerald-500/30 flex items-center justify-center bg-zinc-950 shadow-2xl">
                            <div className="flex flex-col items-center">
                                <span className="text-4xl md:text-6xl font-black text-white italic leading-none">07</span>
                                <span className="text-[10px] md:text-xs font-black text-emerald-500 uppercase tracking-[0.2em]">Dias</span>
                            </div>

                            {/* Orbital Icon */}
                            <div className="absolute -top-2 -right-2 w-10 h-10 md:w-14 md:h-14 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                <ShieldCheck className="w-5 h-5 md:w-7 md:h-7 text-zinc-950" />
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-col gap-6 text-center md:text-left">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-[10px] font-black uppercase tracking-widest text-emerald-500">
                                <RefreshCcw className="w-3 h-3" />
                                Risco Zero Garantido
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-tight">
                                Teste sem compromisso por <span className="text-emerald-500">7 dias.</span>
                            </h2>
                            <p className="text-zinc-400 text-lg leading-relaxed max-w-xl">
                                Temos tanta confiança na nossa infraestrutura que oferecemos uma <span className="text-white font-bold">garantia incondicional</span>. Se em 7 dias você sentir que o RepTrail não é para você, devolvemos 100% do seu investimento. Sem perguntas.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                            <div className="flex items-center gap-3 text-zinc-300">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                                <span className="text-sm font-bold uppercase tracking-wide italic">Cancelamento Instantâneo</span>
                            </div>
                            <div className="flex items-center gap-3 text-zinc-300">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                                <span className="text-sm font-bold uppercase tracking-wide italic">Reembolso sem Burocracia</span>
                            </div>
                            <div className="flex items-center gap-3 text-zinc-300">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                                <span className="text-sm font-bold uppercase tracking-wide italic">Acesso Total Liberado</span>
                            </div>
                            <div className="flex items-center gap-3 text-zinc-300">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                                <span className="text-sm font-bold uppercase tracking-wide italic">Suporte VIP Incluso</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
