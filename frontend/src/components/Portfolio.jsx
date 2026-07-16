import React, { useMemo, useState, useEffect } from "react";
import { REAL_CASES, AUDIOVISUAL_FEATURED, BRAND } from "../data/mock";
import { useReveal } from "../hooks/useReveal";
import {
  ExternalLink, Play, Film, ArrowUpRight, CheckCircle2, Plus, Minus,
} from "lucide-react";

const ALL_CASES = REAL_CASES;

// Featured card , used for EMATECH (highlights its industrial services).
const FeaturedCase = ({ item }) => {
  const ref = useReveal();
  return (
    <a
      ref={ref}
      href={item.site && item.site !== "#" ? item.site : "#contato"}
      target={item.site && item.site.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer"
      data-testid={`case-card-${item.id}`}
      className="reveal group relative lg:col-span-2 lg:row-span-2 min-h-[480px] overflow-hidden border border-gold bg-[#0a0a0b] grid grid-cols-1 md:grid-cols-2"
    >
      <div className="relative min-h-[260px] md:min-h-full overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#050505]/40" />
        <span className="absolute top-5 left-5 px-3 py-1 bg-[#050505]/75 backdrop-blur border border-gold-strong text-[10px] tracking-[0.3em] uppercase text-gold-light">
          {item.category}
        </span>
        <span className="absolute top-5 right-5 px-3 py-1 bg-gold text-[#050505] text-[9px] tracking-[0.3em] uppercase font-semibold">
          Em destaque
        </span>
      </div>

      <div className="p-7 md:p-10 flex flex-col justify-between">
        <div>
          <h3 className="font-display text-[28px] md:text-[34px] text-[#f0ecdf] leading-tight">
            {item.name}
          </h3>
          <div className="h-divider w-16 my-5" />
          <p className="text-[14px] text-[#bcb9af] leading-relaxed font-light">
            {item.description}
          </p>

          {item.highlights && (
            <ul className="mt-6 space-y-2.5">
              {item.highlights.map((h, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-[13px] text-[#dcd8c8] leading-snug"
                >
                  <CheckCircle2
                    size={15}
                    strokeWidth={1.6}
                    className="text-gold-light shrink-0 mt-0.5"
                  />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Optional metrics row , renders only if case.metrics is provided */}
          {item.metrics && item.metrics.length > 0 && (
            <div className="mt-6 grid grid-cols-3 gap-3 border-t border-gold pt-5">
              {item.metrics.slice(0, 3).map((m, i) => (
                <div key={i} className="text-center">
                  <div className="font-display gold-text-grad text-[20px] md:text-[22px] leading-tight">
                    {m.value}
                  </div>
                  <div className="text-[9px] tracking-[0.22em] uppercase text-[#7d7a72] mt-1 leading-tight">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-7 flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {item.tags?.map((t) => (
              <span
                key={t}
                className="text-[10px] tracking-[0.22em] uppercase text-gold-light border border-gold px-2 py-0.5"
              >
                {t}
              </span>
            ))}
          </div>
          {item.site && item.site.startsWith("http") && (
            <span className="flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-gold-light group-hover:gap-3 transition-all">
              Visitar <ExternalLink size={12} strokeWidth={2} />
            </span>
          )}
        </div>
      </div>
    </a>
  );
};

const CaseCard = ({ item, index }) => {
  const ref = useReveal();
  const isExternal = item.site && item.site.startsWith("http");

  // ----- Logo-cover cards: split layout (logo em cima, texto sólido embaixo) -----
  if (item.isLogoCover) {
    // JPGs têm background embutido , preenchem 100% do topo (object-cover).
    // PNGs (transparência) usam object-contain com pequeno respiro.
    const isJpg = /\.(jpe?g)$/i.test(item.image || "");
    const imgFitClass = isJpg
      ? "object-cover"
      : "object-contain p-3 md:p-4";
    return (
      <a
        ref={ref}
        href={item.site && item.site !== "#" ? item.site : "#contato"}
        target={isExternal ? "_blank" : undefined}
        rel="noreferrer"
        data-testid={`case-card-${item.id}`}
        className="reveal group relative flex flex-col overflow-hidden border border-gold min-h-[380px] bg-[#0a0a0b]"
        style={{ transitionDelay: `${(index % 6) * 0.06}s` }}
      >
        {/* TOP , logo isolado */}
        <div
          className="relative h-[54%] overflow-hidden"
          style={item.logoBg ? { background: item.logoBg } : { background: "#0a0a0b" }}
        >
          <img
            src={item.image}
            alt={item.name}
            className={`w-full h-full ${imgFitClass} transition-transform duration-[1200ms] ease-out group-hover:scale-105`}
          />
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <span className="px-3 py-1 bg-[#050505]/80 backdrop-blur border border-gold-strong text-[10px] tracking-[0.3em] uppercase text-gold-light">
              {item.category}
            </span>
            <span className="opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-500 w-10 h-10 grid place-items-center bg-gold text-[#050505]">
              <ArrowUpRight size={18} strokeWidth={2.4} />
            </span>
          </div>
        </div>

        {/* Divisor dourado sutil */}
        <div className="h-px bg-[rgba(212,166,71,0.45)]" />

        {/* BOTTOM , texto em bloco sólido */}
        <div className="relative flex-1 p-5 md:p-6 bg-[#0a0a0b] flex flex-col">
          <h3 className="font-display text-[20px] md:text-[22px] text-[#f0ecdf] leading-tight mb-1.5 line-clamp-1">
            {item.name}
          </h3>
          <p className="text-[12.5px] text-[#bcb9af] leading-relaxed font-light line-clamp-3 mb-3">
            {item.description}
          </p>
          <div className="mt-auto flex flex-wrap items-center gap-1.5">
            {item.tags?.map((t) => (
              <span
                key={t}
                className="text-[9.5px] tracking-[0.22em] uppercase text-gold-light border border-gold px-2 py-0.5"
              >
                {t}
              </span>
            ))}
            {isExternal && (
              <span className="ml-auto flex items-center gap-1 text-[10px] tracking-[0.25em] uppercase text-gold-light group-hover:gap-2 transition-all">
                Visitar <ExternalLink size={12} strokeWidth={2} />
              </span>
            )}
          </div>
        </div>

        {/* Glow sutil ao hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition pointer-events-none">
          <div className="absolute -inset-1 bg-[radial-gradient(circle_at_50%_100%,rgba(212,166,71,0.22),transparent_55%)]" />
        </div>
      </a>
    );
  }

  // ----- Cards com foto (Ematech, Tech Software, AGW): layout original overlay -----
  return (
    <a
      ref={ref}
      href={item.site && item.site !== "#" ? item.site : "#contato"}
      target={isExternal ? "_blank" : undefined}
      rel="noreferrer"
      data-testid={`case-card-${item.id}`}
      className="reveal group relative block overflow-hidden border border-gold min-h-[380px] bg-[#0a0a0b]"
      style={{ transitionDelay: `${(index % 6) * 0.06}s` }}
    >
      <div className="absolute inset-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 img-dim" />
      </div>

      <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-10">
        <span className="px-3 py-1 bg-[#050505]/80 backdrop-blur border border-gold-strong text-[10px] tracking-[0.3em] uppercase text-gold-light">
          {item.category}
        </span>
        <span className="opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-500 w-10 h-10 grid place-items-center bg-gold text-[#050505]">
          <ArrowUpRight size={18} strokeWidth={2.4} />
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-7 z-10">
        <h3 className="font-display text-[22px] md:text-[26px] text-[#f0ecdf] leading-tight mb-2">
          {item.name}
        </h3>
        <p className="text-[13px] text-[#bcb9af] leading-relaxed font-light max-w-[40ch] mb-4">
          {item.description}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {item.tags?.map((t) => (
            <span
              key={t}
              className="text-[10px] tracking-[0.22em] uppercase text-gold-light border border-gold px-2 py-0.5"
            >
              {t}
            </span>
          ))}
          {isExternal && (
            <span className="ml-auto flex items-center gap-1 text-[10px] tracking-[0.25em] uppercase text-gold-light">
              Visitar <ExternalLink size={12} strokeWidth={2} />
            </span>
          )}
        </div>
      </div>

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition pointer-events-none">
        <div className="absolute -inset-1 bg-[radial-gradient(circle_at_50%_100%,rgba(212,166,71,0.25),transparent_55%)]" />
      </div>
    </a>
  );
};

export const Portfolio = () => {
  const headerRef = useReveal();
  const audioRef = useReveal();
  const [filter, setFilter] = useState("Todos");

  const categories = useMemo(() => {
    const set = new Set(ALL_CASES.map((c) => c.category));
    return ["Todos", ...Array.from(set)];
  }, []);

  const filtered = useMemo(
    () =>
      filter === "Todos"
        ? ALL_CASES
        : ALL_CASES.filter((c) => c.category === filter),
    [filter]
  );

  // "Ver mais": na categoria "Todos" exibimos um subconjunto inicial para não
  // listar todos os cases de uma vez. Outras categorias mostram tudo.
  const INITIAL_VISIBLE = 6;
  const [showAll, setShowAll] = useState(false);

  // Sempre que o filtro muda, voltamos ao estado recolhido.
  useEffect(() => {
    setShowAll(false);
  }, [filter]);

  const isAll = filter === "Todos";
  const visible =
    isAll && !showAll ? filtered.slice(0, INITIAL_VISIBLE) : filtered;
  const hasMore = isAll && filtered.length > INITIAL_VISIBLE;

  return (
    <section
      id="cases"
      data-testid="portfolio-section"
      className="relative py-28 md:py-36 bg-[#050505] overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div
          ref={headerRef}
          className="reveal flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16"
        >
          <div className="max-w-2xl">
            <div className="section-label mb-6">Cases & Portfólio</div>
            <h2
              className="font-display kerning-tight text-[clamp(2.2rem,4.5vw,3.8rem)] leading-[1.02] text-[#f0ecdf]"
              data-testid="portfolio-title"
            >
              Marcas que confiam o crescimento à{" "}
              <span className="serif-italic text-gold-light">nossa operação</span>.
            </h2>
          </div>
          <p className="text-[15px] text-[#9a978d] max-w-md font-light leading-relaxed">
            De engenharia industrial a tecnologia, varejo e serviços,
            cada operação é desenhada para mover indicadores reais de receita.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-10">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              data-testid={`portfolio-filter-${c}`}
              className={`pill ${filter === c ? "active" : ""}`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 auto-rows-[380px]">
          {visible.map((c, i) =>
            c.featured ? (
              <FeaturedCase item={c} key={c.id} />
            ) : (
              <CaseCard item={c} index={i} key={c.id} />
            )
          )}
        </div>

        {hasMore && (
          <div className="mt-12 flex flex-col items-center gap-3">
            <button
              type="button"
              data-testid="portfolio-toggle-more"
              onClick={() => setShowAll((v) => !v)}
              className="btn-outline-gold"
            >
              {showAll ? (
                <>
                  Ver menos <Minus size={14} strokeWidth={2.2} />
                </>
              ) : (
                <>
                  Ver mais <Plus size={14} strokeWidth={2.2} />
                </>
              )}
            </button>
            {!showAll && (
              <span className="text-[11px] tracking-[0.3em] uppercase text-[#7d7a72]">
                Exibindo {visible.length} de {filtered.length}
              </span>
            )}
          </div>
        )}

        {/* Audiovisual featured */}
        <div
          ref={audioRef}
          className="reveal mt-20 lg:mt-28 relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-0 border border-gold overflow-hidden"
        >
          <div className="lg:col-span-7 relative min-h-[360px] lg:min-h-[460px]">
            <img
              src={AUDIOVISUAL_FEATURED.image}
              alt="Produção audiovisual premium"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/40 to-[#050505]/80 lg:to-transparent" />
            <div className="absolute top-5 left-5 flex items-center gap-2">
              <span className="px-3 py-1 bg-[#050505]/70 backdrop-blur border border-gold-strong text-[10px] tracking-[0.3em] uppercase text-gold-light flex items-center gap-2">
                <Film size={12} /> Produção Audiovisual
              </span>
            </div>
            <a
              href={BRAND.instagram}
              target="_blank"
              rel="noreferrer"
              data-testid="audiovisual-play"
              className="absolute left-8 bottom-8 flex items-center gap-3 group"
            >
              <span className="w-14 h-14 rounded-full bg-gold text-[#050505] grid place-items-center group-hover:scale-105 transition-transform shadow-[0_8px_22px_-10px_rgba(212,166,71,0.5)]">
                <Play size={20} fill="#050505" strokeWidth={0} />
              </span>
              <span className="text-[12px] tracking-[0.3em] uppercase text-gold-light">
                Reel do estúdio
              </span>
            </a>
          </div>

          <div className="lg:col-span-5 p-8 md:p-12 bg-[#0a0a0b] flex flex-col justify-center">
            <div className="section-label mb-6">Estúdio audiovisual</div>
            <h3 className="font-display text-[28px] md:text-[36px] leading-tight text-[#f0ecdf] mb-5">
              {AUDIOVISUAL_FEATURED.headline}
            </h3>
            <p className="text-[15px] text-[#9a978d] font-light leading-relaxed mb-6">
              {AUDIOVISUAL_FEATURED.description}
            </p>
            <ul className="space-y-3">
              {AUDIOVISUAL_FEATURED.highlights.map((h, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-[14px] text-[#dcd8c8]"
                >
                  <span className="w-1.5 h-1.5 bg-gold mt-2 rounded-full shrink-0" />
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
