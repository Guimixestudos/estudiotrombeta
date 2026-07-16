import React from "react";
import { STATS } from "../data/mock";
import { useReveal } from "../hooks/useReveal";
import { Quote } from "lucide-react";

const StatItem = ({ stat, index }) => {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className="reveal flex flex-col gap-3 min-w-0"
      data-testid={`stat-${index}`}
      style={{ transitionDelay: `${index * 0.08}s` }}
    >
      <div className="text-[10px] tracking-[0.32em] uppercase text-[#7d7a72] font-medium">
        {stat.label}
      </div>
      <div className="h-px w-10 bg-gold" />
      <div className="font-display gold-text-grad text-[clamp(1.15rem,1.6vw,1.65rem)] leading-[1.1] break-words hyphens-auto" lang="pt-BR">
        {stat.value}
      </div>
    </div>
  );
};

export const About = () => {
  const labelRef = useReveal();
  const titleRef = useReveal();
  const bodyRef = useReveal();

  return (
    <section
      id="sobre"
      data-testid="about-section"
      className="relative py-28 md:py-36 bg-[#050505] overflow-hidden"
    >
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[1px] h-2/3 bg-gradient-to-b from-transparent via-[rgba(212,166,71,0.35)] to-transparent" />
      <div className="absolute right-0 top-1/3 w-[1px] h-1/2 bg-gradient-to-b from-transparent via-[rgba(212,166,71,0.20)] to-transparent" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* LEFT */}
          <div className="lg:col-span-5">
            <div ref={labelRef} className="reveal section-label mb-6">
              O Estúdio
            </div>
            <h2
              ref={titleRef}
              className="reveal font-display kerning-tight text-[clamp(2.2rem,4.5vw,3.8rem)] leading-[1.02] text-[#f0ecdf]"
              style={{ transitionDelay: "0.1s" }}
              data-testid="about-title"
            >
              Mais do que marketing,{" "}
              <span className="serif-italic text-gold-light">
                inteligência estratégica
              </span>{" "}
              para empresas que querem sair do comum.
            </h2>

            <div className="hidden lg:flex flex-col gap-6 mt-12 pl-6 border-l border-gold">
              <div className="flex gap-4 items-start">
                <Quote size={22} className="text-gold shrink-0 mt-1" />
                <p className="font-display italic text-[19px] text-[#dcd8c8] leading-snug">
                  "Não vendemos posts. Vendemos percepção, posicionamento e crescimento."
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div ref={bodyRef} className="reveal lg:col-span-7" style={{ transitionDelay: "0.2s" }}>
            <p className="text-[17px] md:text-[19px] text-[#bcb9af] leading-[1.75] font-light">
              A <span className="text-gold-light">Trombeta Estúdio</span> nasceu com
              um objetivo claro: criar posicionamento, autoridade e crescimento
              real para empresas que querem sair do comum.
            </p>
            <p className="text-[17px] md:text-[19px] text-[#bcb9af] leading-[1.75] font-light mt-6">
              Mais do que marketing, desenvolvemos{" "}
              <span className="text-gold-light">percepção de valor</span>,
              presença digital e estratégias que geram impacto, conexão e vendas.
              Operamos como um time interno de growth, com a mesma exigência de
              resultado e o mesmo padrão estético de marcas internacionais.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6 mt-14">
              {STATS.map((s, i) => (
                <StatItem stat={s} index={i} key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
