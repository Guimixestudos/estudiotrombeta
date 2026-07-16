import React, { useState, useEffect, useCallback } from "react";
import { TESTIMONIALS, BRAND } from "../data/mock";
import { useReveal } from "../hooks/useReveal";
import { Quote, ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";

export const Testimonials = () => {
  const headerRef = useReveal();
  const [idx, setIdx] = useState(0);

  const next = useCallback(() => setIdx((i) => (i + 1) % TESTIMONIALS.length), []);
  const prev = () => setIdx((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

  useEffect(() => {
    const t = setInterval(next, 7000);
    return () => clearInterval(t);
  }, [next]);

  const current = TESTIMONIALS[idx];

  return (
    <section
      id="depoimentos"
      data-testid="testimonials-section"
      className="relative py-28 md:py-36 bg-[#0a0a0b] overflow-hidden"
    >
      <div className="absolute inset-0 dot-grid opacity-15" />
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[80%] h-[1px] gold-line" />

      <div className="max-w-[1100px] mx-auto px-6 md:px-10 relative">
        <div ref={headerRef} className="reveal text-center mb-16">
          <div className="section-label justify-center mb-6 inline-flex">
            Depoimentos
          </div>
          <h2 className="font-display kerning-tight text-[clamp(2rem,4vw,3.4rem)] leading-tight text-[#f0ecdf]" data-testid="testimonials-title">
            Quem confia, <span className="serif-italic text-gold-light">cresce com a gente</span>.
          </h2>
        </div>

        <div
          data-testid="testimonial-card"
          className="relative border border-gold bg-[#050505] p-10 md:p-16 min-h-[300px]"
        >
          <Quote
            size={42}
            strokeWidth={1.2}
            className="absolute -top-6 left-10 text-gold bg-[#0a0a0b] px-2"
          />

          <div className="flex flex-col gap-8" key={idx}>
            <p className="font-display italic text-[clamp(1.3rem,2.4vw,1.9rem)] leading-[1.35] text-[#e8e6df] anim-fade-up">
              "{current.text}"
            </p>

            <div className="flex items-center justify-between flex-wrap gap-4 anim-fade-up" style={{ animationDelay: "0.15s" }}>
              <div>
                <div className="font-display text-gold-light text-[18px]">{current.name}</div>
                <div className="text-[11px] tracking-[0.3em] uppercase text-[#7d7a72] mt-1">
                  {current.role}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  data-testid="testimonial-prev"
                  onClick={prev}
                  className="w-11 h-11 border border-gold grid place-items-center text-gold-light hover:bg-gold hover:text-[#050505] transition"
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="text-[11px] tracking-[0.3em] text-[#7d7a72]">
                  {String(idx + 1).padStart(2, "0")}/{String(TESTIMONIALS.length).padStart(2, "0")}
                </div>
                <button
                  data-testid="testimonial-next"
                  onClick={next}
                  className="w-11 h-11 border border-gold grid place-items-center text-gold-light hover:bg-gold hover:text-[#050505] transition"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              data-testid={`testimonial-dot-${i}`}
              onClick={() => setIdx(i)}
              className={`h-1 transition-all duration-500 ${
                idx === i ? "w-10 bg-gold" : "w-4 bg-[#3a362c] hover:bg-[#5e5b54]"
              }`}
              aria-label={`Depoimento ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export const CTA = ({ onOpenContact }) => {
  const ref = useReveal();
  const waLink = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(
    "Olá Trombeta! Quero conversar com um especialista."
  )}`;

  return (
    <section
      id="contato"
      data-testid="cta-section"
      className="relative py-28 md:py-40 overflow-hidden bg-[#050505]"
    >
      {/* Cinematic glow */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,rgba(212,166,71,0.30),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_30%,rgba(212,166,71,0.15),transparent_45%)]" />
        <div className="absolute inset-0 dot-grid opacity-25" />
      </div>

      {/* Decorative trumpet logo watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.05]">
        <img
          src={BRAND.logoMark}
          alt=""
          className="w-[60%] max-w-[720px] object-contain"
        />
      </div>

      <div ref={ref} className="reveal relative max-w-[1100px] mx-auto px-6 md:px-10 text-center">
        <div className="section-label justify-center mb-8 inline-flex">
          Próximo passo
        </div>

        <h2
          data-testid="cta-headline"
          className="font-display kerning-tight text-[clamp(2.4rem,5.5vw,5rem)] leading-[1.0] text-[#f0ecdf]"
        >
          Sua empresa está pronta para{" "}
          <span className="serif-italic text-gold-light">crescer de verdade</span>?
        </h2>

        <p
          data-testid="cta-subheadline"
          className="text-[17px] md:text-[20px] text-[#bcb9af] mt-8 max-w-2xl mx-auto font-light leading-relaxed"
        >
          Transforme sua presença digital em autoridade, percepção de valor e
          resultado mensurável.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-12">
          <button
            data-testid="cta-talk-specialist"
            onClick={onOpenContact}
            className="btn-gold"
          >
            Falar com Especialista <ArrowUpRight size={16} strokeWidth={2.2} />
          </button>
          <a
            data-testid="cta-whatsapp"
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className="btn-outline-gold"
          >
            WhatsApp Direto
          </a>
        </div>

        <div className="mt-10 flex items-center justify-center gap-3">
          <span className="loader-dot" />
          <span className="loader-dot" />
          <span className="loader-dot" />
          <span className="text-[11px] tracking-[0.32em] uppercase text-[#7d7a72] ml-2">
            Resposta em até 24h úteis
          </span>
        </div>
      </div>
    </section>
  );
};
