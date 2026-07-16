import React from "react";
import { DIFFERENTIALS, PROCESS } from "../data/mock";
import { useReveal } from "../hooks/useReveal";
import {
  Brain, Rocket, Diamond, Sparkles, Building2, ShieldCheck,
} from "lucide-react";

const ICONS = { Brain, Rocket, Diamond, Sparkles, Building2, ShieldCheck };

const DiffCard = ({ d, index }) => {
  const ref = useReveal();
  const Icon = ICONS[d.icon] || Sparkles;
  return (
    <div
      ref={ref}
      data-testid={`diff-${index}`}
      className="reveal group relative p-7 md:p-8 border-b border-r border-gold last:border-r [&:nth-child(3n)]:border-r-0 hover:bg-[#0c0c0d] transition-colors"
      style={{ transitionDelay: `${(index % 3) * 0.08}s` }}
    >
      <div className="absolute top-7 right-7 font-display text-[11px] tracking-[0.3em] uppercase text-[#5e5b54]">
        0{index + 1}
      </div>
      <Icon size={28} strokeWidth={1.4} className="text-gold-light mb-6" />
      <h3 className="font-display text-[22px] md:text-[24px] text-[#f0ecdf] leading-tight mb-3">
        {d.title}
      </h3>
      <p className="text-[14px] text-[#9a978d] leading-relaxed font-light">
        {d.desc}
      </p>
      <div className="h-px w-0 group-hover:w-full transition-all duration-700 bg-gold absolute bottom-0 left-0" />
    </div>
  );
};

const ProcessStep = ({ p, index }) => {
  const ref = useReveal();
  const isEven = index % 2 === 1;
  return (
    <div
      ref={ref}
      data-testid={`process-step-${index}`}
      className={`reveal step-row relative grid grid-cols-12 gap-4 items-center group cursor-default ${
        isEven ? "lg:[direction:rtl]" : ""
      }`}
      style={{ transitionDelay: `${index * 0.06}s` }}
    >
      <div className="col-span-2 lg:col-span-1 flex items-center justify-center relative">
        <div className="step-bullet">{index + 1}</div>
      </div>
      <div className="col-span-10 lg:col-span-11 [direction:ltr]">
        <div className="border border-gold p-6 md:p-8 bg-[#0a0a0b] group-hover:border-gold-strong group-hover:translate-x-1 transition-all duration-500">
          <div className="flex items-center gap-4 mb-2">
            <span className="font-display text-gold-light text-[14px] tracking-[0.3em]">
              {p.step}
            </span>
            <span className="h-px flex-1 bg-gold" />
          </div>
          <h3 className="font-display text-[26px] md:text-[30px] text-[#f0ecdf] leading-tight">
            {p.title}
          </h3>
          <p className="text-[14px] text-[#9a978d] leading-relaxed mt-2 max-w-2xl font-light">
            {p.desc}
          </p>
        </div>
      </div>
    </div>
  );
};

export const Differentials = () => {
  const headerRef = useReveal();
  const quoteRef = useReveal();
  return (
    <section
      id="diferenciais"
      data-testid="differentials-section"
      className="relative py-28 md:py-36 bg-[#0a0a0b] overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div ref={headerRef} className="reveal max-w-3xl mb-16">
          <div className="section-label mb-6">Por que Trombeta</div>
          <h2 className="font-display kerning-tight text-[clamp(2.2rem,4.5vw,3.8rem)] leading-[1.02] text-[#f0ecdf]" data-testid="differentials-title">
            Operamos diferente porque{" "}
            <span className="serif-italic text-gold-light">pensamos diferente</span>.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-gold">
          {DIFFERENTIALS.map((d, i) => (
            <DiffCard d={d} index={i} key={i} />
          ))}
        </div>

        <div ref={quoteRef} className="reveal mt-20 lg:mt-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,166,71,0.18),transparent_60%)]" />
          <div className="relative text-center px-6">
            <p className="font-display italic text-[clamp(1.8rem,4vw,3.2rem)] leading-[1.15] text-[#f0ecdf] max-w-4xl mx-auto">
              "Não criamos apenas posts.
              <br />
              Criamos{" "}
              <span className="gold-text-grad not-italic font-semibold">
                percepção, posicionamento e crescimento
              </span>
              ."
            </p>
            <div className="h-divider w-32 mx-auto mt-8" />
          </div>
        </div>
      </div>
    </section>
  );
};

export const Process = () => {
  const headerRef = useReveal();
  return (
    <section
      id="processo"
      data-testid="process-section"
      className="relative py-28 md:py-36 bg-[#050505] overflow-hidden"
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        <div ref={headerRef} className="reveal max-w-3xl mb-16">
          <div className="section-label mb-6">Processo</div>
          <h2 className="font-display kerning-tight text-[clamp(2.2rem,4.5vw,3.8rem)] leading-[1.02] text-[#f0ecdf]" data-testid="process-title">
            Do diagnóstico à{" "}
            <span className="serif-italic text-gold-light">escala</span>. Sem
            pular etapas.
          </h2>
          <p className="text-[15px] text-[#9a978d] mt-6 max-w-2xl font-light leading-relaxed">
            Um método em 6 estágios para reposicionar marcas e construir
            operações comerciais que crescem com previsibilidade.
          </p>
        </div>

        <div className="relative space-y-6 md:space-y-8">
          {/* central vertical line */}
          <div className="absolute left-[6%] lg:left-[3.7%] top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-[rgba(212,166,71,0.4)] to-transparent" />
          {PROCESS.map((p, i) => (
            <ProcessStep p={p} index={i} key={i} />
          ))}
        </div>
      </div>
    </section>
  );
};
