import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { BRAND, CLIENT_LOGOS } from "../data/mock";
import { ArrowUpRight, Play } from "lucide-react";
import { useMagnetic } from "../hooks/useMagnetic";

// Floating gold particle component
const Particle = ({ delay, x, tx, ty }) => (
  <span
    className="absolute block rounded-full"
    style={{
      left: `${x}%`,
      bottom: "0",
      width: 3,
      height: 3,
      background:
        "radial-gradient(circle, rgba(240,200,112,1) 0%, rgba(212,166,71,0.4) 60%, transparent 100%)",
      boxShadow: "0 0 8px rgba(212,166,71,0.7)",
      animation: `particle-float ${8 + Math.random() * 6}s linear ${delay}s infinite`,
      "--tx": `${tx}px`,
      "--ty": `${ty}px`,
    }}
  />
);

// Hero animation variants
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

const visualVariants = {
  hidden: { opacity: 0, scale: 0.94, y: 24 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.25 },
  },
};

export const Hero = ({ onOpenContact, onScrollTo }) => {
  const [particles, setParticles] = useState([]);
  const sectionRef = useRef(null);
  const reduceMotion = useReducedMotion();

  // Parallax on hero image
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const visualY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -120]);
  const visualScale = useTransform(scrollYProgress, [0, 1], [1, reduceMotion ? 1 : 1.08]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 60]);

  const magneticMeetingRef = useMagnetic(0.18);

  useEffect(() => {
    const arr = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      delay: Math.random() * 10,
      x: Math.random() * 100,
      tx: (Math.random() - 0.5) * 140,
      ty: -(100 + Math.random() * 220),
    }));
    setParticles(arr);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      data-testid="hero-section"
      className="relative min-h-screen spotlight-gold overflow-hidden pt-[100px] pb-16"
    >
      {/* Dot grid background */}
      <div className="absolute inset-0 dot-grid opacity-20" />
      {/* Vignette */}
      <div className="absolute inset-0 vignette" />

      {/* Subtle particles (reduzido) */}
      <div className="absolute inset-0 pointer-events-none opacity-60">
        {particles.map((p) => (
          <Particle key={p.id} delay={p.delay} x={p.x} tx={p.tx} ty={p.ty} />
        ))}
      </div>

      {/* Decorative single orbit (mais discreto) */}
      <div className="hidden lg:block absolute -right-[12%] top-[14%] w-[620px] h-[620px] pointer-events-none">
        <div className="absolute inset-0 rounded-full border border-[rgba(212,166,71,0.05)] anim-rotate-slow" />
        <div className="absolute inset-16 rounded-full border border-[rgba(212,166,71,0.07)] anim-rotate-slow-rev" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
        {/* LEFT - Text */}
        <motion.div
          className="relative"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ y: textY }}
        >
          <motion.div variants={itemVariants} className="section-label mb-8" data-testid="hero-label">
            Estúdio de marketing estratégico
          </motion.div>

          <motion.h1
            variants={itemVariants}
            data-testid="hero-headline"
            className="font-display kerning-tight text-[clamp(2.6rem,6.2vw,5.5rem)] leading-[0.95] font-semibold text-[#f3f0e6]"
          >
            Estratégia.
            <br />
            <span className="serif-italic text-gold-light">Posicionamento.</span>
            <br />
            <span className="shimmer-text">Resultados.</span>
          </motion.h1>

          <motion.div variants={itemVariants} className="h-divider w-32 my-8" />

          <motion.p
            variants={itemVariants}
            data-testid="hero-subheadline"
            className="text-[17px] md:text-[19px] text-[#bcb9af] leading-relaxed max-w-xl font-light"
          >
            Marketing estratégico que transforma empresas comuns em marcas
            <span className="text-gold-light"> fortes, desejadas e lucrativas</span>.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 mt-10">
            <span ref={magneticMeetingRef} className="magnetic-wrap">
              <button
                data-testid="hero-cta-meeting"
                onClick={onOpenContact}
                className="btn-gold"
              >
                Agendar Reunião <ArrowUpRight size={16} strokeWidth={2.2} />
              </button>
            </span>
            <button
              data-testid="hero-cta-projects"
              onClick={() => onScrollTo("#cases")}
              className="btn-outline-gold"
            >
              <Play size={14} strokeWidth={2.2} />
              Ver Projetos
            </button>
          </motion.div>

          {/* mini stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 xs:grid-cols-3 gap-4 sm:gap-6 mt-12 sm:mt-14 max-w-md">
            <div>
              <div className="font-display text-[20px] sm:text-[22px] gold-text-grad leading-tight">
                Estúdio
              </div>
              <div className="text-[9px] sm:text-[10px] tracking-[0.28em] uppercase text-[#7d7a72] mt-1">
                De marketing
              </div>
            </div>
            <div>
              <div className="font-display text-[20px] sm:text-[22px] gold-text-grad leading-tight">
                Operação
              </div>
              <div className="text-[9px] sm:text-[10px] tracking-[0.28em] uppercase text-[#7d7a72] mt-1">
                360°
              </div>
            </div>
            <div className="col-span-2 xs:col-span-1">
              <div className="font-display text-[20px] sm:text-[22px] gold-text-grad leading-tight">
                Foco
              </div>
              <div className="text-[9px] sm:text-[10px] tracking-[0.28em] uppercase text-[#7d7a72] mt-1">
                Receita
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* RIGHT - Visual */}
        <motion.div
          className="relative h-[420px] sm:h-[520px] lg:h-[600px]"
          variants={visualVariants}
          initial="hidden"
          animate="visible"
          style={{ y: visualY, scale: visualScale }}
        >
          {/* subtle glow */}
          <div className="absolute inset-0 rounded-[2px] pointer-events-none">
            <div className="absolute -inset-6 bg-[radial-gradient(circle_at_60%_50%,rgba(212,166,71,0.10),transparent_60%)]" />
          </div>

          {/* image */}
          <div className="relative h-full w-full overflow-hidden border border-gold-strong">
            <img
              src={BRAND.heroVisualUrl}
              alt="Estratégia · Foco · Resultados"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* corner markers */}
            <span className="absolute top-3 left-3 w-4 h-4 border-t border-l border-gold-light" />
            <span className="absolute top-3 right-3 w-4 h-4 border-t border-r border-gold-light" />
            <span className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-gold-light" />
            <span className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-gold-light" />

            {/* floating tag */}
            <div className="absolute top-5 right-5 px-3 py-1.5 bg-[#050505]/80 backdrop-blur border border-gold-strong">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-gold rounded-full anim-blink" />
                <span className="text-[10px] tracking-[0.3em] uppercase text-gold-light">
                  Performance Live
                </span>
              </div>
            </div>

            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
              <div>
                <div className="text-[10px] tracking-[0.32em] uppercase text-gold-light/80 mb-1">
                  Trombeta Estúdio
                </div>
                <div className="font-display text-[20px] md:text-[22px] text-[#f0ecdf] leading-tight">
                  Estratégia <span className="serif-italic text-gold-light">com padrão de estúdio</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Client logos marquee , premium circular badges */}
      <motion.div
        className="relative z-10 mt-16 lg:mt-24"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
        data-testid="hero-clients-marquee"
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 mb-8 flex items-center gap-4">
          <span className="text-[10px] tracking-[0.4em] uppercase text-[#7d7a72]">
            Marcas que confiaram
          </span>
          <span className="flex-1 h-px bg-[rgba(212,166,71,0.18)]" />
        </div>
        <div className="marquee">
          <div className="marquee-track py-2 items-center">
            {[...CLIENT_LOGOS, ...CLIENT_LOGOS].map((brand, i) => {
              const slug = brand.name
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "");
              const fitClass = brand.fit === "contain" ? "object-contain w-[85%] h-[85%]" : "object-cover w-full h-full";
              const bg = brand.bg || "#0a0a0b";
              const inner = (
                <>
                  <div
                    className="relative w-[88px] h-[88px] md:w-[100px] md:h-[100px] rounded-full border border-[rgba(212,166,71,0.35)] grid place-items-center overflow-hidden transition-all duration-500 group-hover:border-gold group-hover:scale-[1.04]"
                    style={{ background: bg }}
                  >
                    {brand.logo ? (
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        loading="lazy"
                        className={fitClass}
                      />
                    ) : (
                      <span className="font-display gold-text-grad text-[18px] md:text-[20px] tracking-[0.08em] leading-none">
                        {brand.initials}
                      </span>
                    )}
                    <span className="absolute inset-0 rounded-full ring-0 group-hover:ring-1 ring-[rgba(212,166,71,0.35)] transition-all duration-500 pointer-events-none" />
                  </div>
                  <span className="font-display text-[11px] md:text-[12px] tracking-[0.22em] uppercase text-[#9a978d] group-hover:text-gold-light transition-colors duration-500 whitespace-nowrap">
                    {brand.name}
                  </span>
                </>
              );
              const wrapperClass = "flex flex-col items-center gap-3 group shrink-0 min-w-[120px]";
              return brand.site ? (
                <a
                  key={i}
                  href={brand.site}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid={`client-logo-${slug}`}
                  aria-label={`Visitar ${brand.name}`}
                  className={wrapperClass}
                >
                  {inner}
                </a>
              ) : (
                <div
                  key={i}
                  data-testid={`client-logo-${slug}`}
                  className={wrapperClass}
                >
                  {inner}
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </section>
  );
};
