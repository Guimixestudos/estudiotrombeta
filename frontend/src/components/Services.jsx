import React from "react";
import { motion } from "framer-motion";
import { SERVICES } from "../data/mock";
import { useReveal } from "../hooks/useReveal";
import { useTilt } from "../hooks/useMagnetic";
import {
  Compass, TrendingUp, Target, Clapperboard, Crown, PenTool,
  Briefcase, Magnet, Share2, MonitorSmartphone, ArrowUpRight,
} from "lucide-react";

const ICONS = {
  Compass, TrendingUp, Target, Clapperboard, Crown, PenTool,
  Briefcase, Magnet, Share2, MonitorSmartphone,
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: (i % 4) * 0.08 + Math.floor(i / 4) * 0.05,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const ServiceCard = ({ svc, index, onOpenContact }) => {
  const tiltRef = useTilt(5);
  const Icon = ICONS[svc.icon] || Compass;
  return (
    <motion.div
      ref={tiltRef}
      data-testid={`service-card-${index}`}
      onClick={onOpenContact}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpenContact?.(); } }}
      className="premium-card tilt-card p-7 md:p-8 group cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[rgba(212,166,71,0.6)]"
      variants={cardVariants}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* corners */}
      <span className="premium-card-corner border-t border-l top-3 left-3 opacity-0 group-hover:opacity-100 transition" />
      <span className="premium-card-corner border-b border-r bottom-3 right-3 opacity-0 group-hover:opacity-100 transition" />

      <div className="svc-icon-plate mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[-4deg]">
        <Icon size={22} className="text-gold-light" strokeWidth={1.6} />
      </div>

      <h3 className="font-display text-[22px] md:text-[24px] text-[#f0ecdf] leading-tight mb-3">
        {svc.title}
      </h3>
      <p className="text-[14px] text-[#9a978d] leading-relaxed font-light">
        {svc.desc}
      </p>

      <div className="mt-7 flex items-center gap-2 text-gold-light text-[11px] tracking-[0.28em] uppercase opacity-60 group-hover:opacity-100 group-hover:gap-3 transition-all">
        Saber mais <ArrowUpRight size={14} strokeWidth={2} />
      </div>
    </motion.div>
  );
};

export const Services = ({ onOpenContact }) => {
  const headerRef = useReveal();
  return (
    <section
      id="servicos"
      data-testid="services-section"
      className="relative py-28 md:py-36 bg-[#0a0a0b] overflow-hidden"
    >
      {/* top gold line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 gold-line h-px" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div ref={headerRef} className="reveal max-w-3xl mb-16 md:mb-20">
          <div className="section-label mb-6">Serviços</div>
          <h2 className="font-display kerning-tight text-[clamp(2.2rem,4.5vw,3.8rem)] leading-[1.02] text-[#f0ecdf]" data-testid="services-title">
            Operação completa de{" "}
            <span className="serif-italic text-gold-light">crescimento</span>, do
            posicionamento ao fechamento.
          </h2>
          <p className="text-[16px] text-[#9a978d] mt-6 max-w-2xl font-light leading-relaxed">
            Não somos apenas uma agência. Somos um time de growth dedicado a
            transformar empresas em marcas de referência no seu segmento.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
          {SERVICES.map((svc, i) => (
            <ServiceCard svc={svc} index={i} key={i} onOpenContact={onOpenContact} />
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <button
            data-testid="services-cta"
            onClick={onOpenContact}
            className="btn-outline-gold"
          >
            Pedir Diagnóstico Estratégico
            <ArrowUpRight size={14} strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </section>
  );
};
