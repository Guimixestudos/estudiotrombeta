import React, { useMemo, useRef, useState, useEffect } from "react";
import { motion, useReducedMotion, useInView } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceDot,
} from "recharts";
import { useReveal, useCountUp } from "../hooks/useReveal";
import { TrendingUp, Sparkles, Layers, ArrowUpRight } from "lucide-react";

// Conceptual growth curve. Trombeta compound vs traditional market.
// Indices (base 100). Illustrative only.
const DATA = [
  { month: "M1", trombeta: 100, mercado: 100 },
  { month: "M2", trombeta: 108, mercado: 102 },
  { month: "M3", trombeta: 124, mercado: 106 },
  { month: "M4", trombeta: 148, mercado: 111 },
  { month: "M5", trombeta: 176, mercado: 116 },
  { month: "M6", trombeta: 212, mercado: 122 },
  { month: "M7", trombeta: 258, mercado: 128 },
  { month: "M8", trombeta: 312, mercado: 134 },
  { month: "M9", trombeta: 372, mercado: 141 },
  { month: "M10", trombeta: 438, mercado: 148 },
  { month: "M11", trombeta: 510, mercado: 155 },
  { month: "M12", trombeta: 588, mercado: 162 },
];

const STAGES = [
  {
    icon: Layers,
    range: "Mês 1 a 3",
    title: "Diagnóstico & estruturação",
    desc: "Posicionamento, oferta, narrativa e funil. A operação ganha base sólida antes da mídia.",
  },
  {
    icon: TrendingUp,
    range: "Mês 4 a 8",
    title: "Aceleração",
    desc: "Tráfego pago, conteúdo de autoridade e estrutura comercial entram em escala simultânea.",
  },
  {
    icon: Sparkles,
    range: "Mês 9 a 12+",
    title: "Crescimento composto",
    desc: "Reposicionamento, LTV elevado e ticket maior. A marca passa a operar em outra faixa.",
  },
];

// ---------- Custom Tooltip ----------
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  // Sort so Trombeta is always first / on top
  const sorted = [...payload].sort((a, b) =>
    a.dataKey === "trombeta" ? -1 : b.dataKey === "trombeta" ? 1 : 0
  );
  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      data-testid="growth-tooltip"
      className="relative bg-[#050505]/95 border border-gold-strong px-4 py-3 backdrop-blur-md shadow-[0_18px_50px_-12px_rgba(212,166,71,0.55)] min-w-[180px]"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* corner accents */}
      <span className="absolute -top-px -left-px w-2 h-2 border-t border-l border-gold-light" />
      <span className="absolute -top-px -right-px w-2 h-2 border-t border-r border-gold-light" />
      <span className="absolute -bottom-px -left-px w-2 h-2 border-b border-l border-gold-light" />
      <span className="absolute -bottom-px -right-px w-2 h-2 border-b border-r border-gold-light" />

      <div className="text-[9px] tracking-[0.32em] uppercase text-gold-light mb-2 font-medium">
        {label}
      </div>
      {sorted.map((p) => {
        const isTrombeta = p.dataKey === "trombeta";
        return (
          <div
            key={p.dataKey}
            className={`flex items-center gap-2 leading-tight ${
              isTrombeta ? "py-1.5" : "pt-1.5 mt-1.5 border-t border-[rgba(212,166,71,0.18)]"
            }`}
          >
            {isTrombeta ? (
              <span
                className="w-2.5 h-2.5 rounded-full inline-block ring-2 ring-[rgba(212,166,71,0.25)]"
                style={{
                  background:
                    "radial-gradient(circle, #f0c870 0%, #d4a647 55%, #a07a2b 100%)",
                  boxShadow: "0 0 10px rgba(240,200,112,0.85)",
                }}
              />
            ) : (
              <span
                className="w-2 h-2 rounded-full inline-block opacity-70"
                style={{ background: "#5a5751" }}
              />
            )}
            <span
              className={
                isTrombeta
                  ? "text-gold-light font-semibold text-[12px] tracking-wide"
                  : "text-[#9a978d] text-[11px]"
              }
            >
              {isTrombeta ? "TROMBETA" : "Mercado"}
            </span>
            <span
              className={`ml-auto font-display ${
                isTrombeta
                  ? "gold-text-grad text-[18px] leading-none"
                  : "text-[#bcb9af] text-[13px]"
              }`}
            >
              {p.value}
            </span>
          </div>
        );
      })}
    </motion.div>
  );
};

// ---------- Stage Card with motion ----------
const StageCard = ({ stage, index }) => {
  const ref = useReveal();
  const Icon = stage.icon;
  return (
    <motion.div
      ref={ref}
      data-testid={`growth-stage-${index}`}
      className="reveal relative pl-6 border-l border-gold group"
      style={{ transitionDelay: `${index * 0.12}s` }}
    >
      <span className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-gold ring-4 ring-[#050505] group-hover:scale-150 transition-transform duration-500 anim-pulse-dot" />
      <div className="flex items-center gap-3 mb-2">
        <Icon size={16} strokeWidth={1.6} className="text-gold-light transition-transform duration-500 group-hover:rotate-[8deg]" />
        <span className="text-[10px] tracking-[0.3em] uppercase text-gold-light font-medium">
          {stage.range}
        </span>
      </div>
      <h4 className="font-display text-[20px] md:text-[22px] text-[#f0ecdf] leading-tight mb-2">
        {stage.title}
      </h4>
      <p className="text-[13px] text-[#9a978d] leading-relaxed font-light">
        {stage.desc}
      </p>
    </motion.div>
  );
};

// ---------- Animated KPI ----------
const KpiBadge = ({ value, label, suffix = "", prefix = "", testid }) => {
  const [ref, animated] = useCountUp(value, 2200);
  return (
    <div
      ref={ref}
      data-testid={testid}
      className="relative bg-[#050505]/60 border border-gold-strong px-4 py-3 backdrop-blur-sm"
    >
      <div className="font-display gold-text-grad text-[22px] md:text-[26px] leading-none">
        {prefix}
        {animated}
        {suffix}
      </div>
      <div className="text-[9px] tracking-[0.28em] uppercase text-[#7d7a72] mt-1.5">
        {label}
      </div>
    </div>
  );
};

// ---------- Floating gold particles inside chart ----------
const ChartParticles = ({ count = 8 }) => {
  const particles = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        delay: Math.random() * 6,
        duration: 7 + Math.random() * 5,
        x: 10 + Math.random() * 80,
        size: 2 + Math.random() * 2,
      })),
    [count]
  );
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            bottom: "8%",
            width: p.size,
            height: p.size,
            background:
              "radial-gradient(circle, rgba(240,200,112,1) 0%, rgba(212,166,71,0.5) 60%, transparent 100%)",
            boxShadow: "0 0 8px rgba(212,166,71,0.7)",
            animation: `chart-float ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
};

// ---------- Main section ----------
export const GrowthChart = () => {
  const headerRef = useReveal();
  const chartRef = useRef(null);
  const inView = useInView(chartRef, { once: true, margin: "-15%" });
  const reduceMotion = useReducedMotion();
  const [chartReady, setChartReady] = useState(false);

  // Delay chart mount slightly so the entrance animation reads cleanly
  useEffect(() => {
    if (inView) {
      const t = setTimeout(() => setChartReady(true), 250);
      return () => clearTimeout(t);
    }
  }, [inView]);

  const chartData = useMemo(() => DATA, []);

  // Final values for the KPI bar derived from the chart math itself (not invented)
  const trombetaFinal = DATA[DATA.length - 1].trombeta;
  const mercadoFinal = DATA[DATA.length - 1].mercado;
  const trombetaUplift = trombetaFinal - 100; // +488
  const mercadoUplift = mercadoFinal - 100; // +62
  const multiplier = (trombetaFinal / mercadoFinal).toFixed(1); // 3.6

  return (
    <section
      id="crescimento"
      data-testid="growth-section"
      className="relative py-24 md:py-36 bg-[#050505] overflow-hidden"
    >
      {/* decorative gold lines */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 gold-line h-px" />
      <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full bg-[radial-gradient(circle_at_center,rgba(212,166,71,0.07),transparent_60%)] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[480px] h-[480px] rounded-full bg-[radial-gradient(circle_at_center,rgba(212,166,71,0.05),transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 dot-grid opacity-[0.08] pointer-events-none" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-5 sm:px-6 md:px-10">
        {/* Header */}
        <div ref={headerRef} className="reveal max-w-3xl mb-12 md:mb-20">
          <div className="section-label mb-5 md:mb-6">Impacto Real</div>
          <h2
            className="font-display kerning-tight text-[clamp(2rem,4.5vw,3.8rem)] leading-[1.04] text-[#f0ecdf]"
            data-testid="growth-title"
          >
            Fazemos marcas{" "}
            <span className="serif-italic text-gold-light">crescerem</span>,
            com método, posicionamento e receita composta.
          </h2>
          <p className="text-[14px] sm:text-[15px] md:text-[16px] text-[#9a978d] mt-5 md:mt-6 max-w-2xl font-light leading-relaxed">
            Crescer não é sorte. É o resultado de uma operação que combina
            estratégia, posicionamento e canais comerciais trabalhando como um
            só sistema. Abaixo, a curva conceitual de uma operação Trombeta
            comparada ao crescimento típico de marketing tradicional.
          </p>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* LEFT. Stages */}
          <div className="lg:col-span-5 space-y-8 md:space-y-10">
            {STAGES.map((s, i) => (
              <StageCard stage={s} index={i} key={i} />
            ))}
          </div>

          {/* RIGHT. Chart */}
          <motion.div
            ref={chartRef}
            data-testid="growth-chart"
            className="lg:col-span-7 relative bg-[#0a0a0b] border border-gold p-4 sm:p-5 md:p-7 overflow-hidden"
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* corner markers */}
            <span className="absolute top-3 left-3 w-4 h-4 border-t border-l border-gold-light pointer-events-none z-20" />
            <span className="absolute top-3 right-3 w-4 h-4 border-t border-r border-gold-light pointer-events-none z-20" />
            <span className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-gold-light pointer-events-none z-20" />
            <span className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-gold-light pointer-events-none z-20" />

            {/* scan line sweep on entrance */}
            {!reduceMotion && (
              <motion.div
                aria-hidden
                className="absolute inset-0 pointer-events-none z-[5]"
                initial={{ x: "-100%", opacity: 0 }}
                animate={inView ? { x: "120%", opacity: [0, 0.45, 0] } : {}}
                transition={{ duration: 1.6, delay: 0.6, ease: "easeOut" }}
                style={{
                  background:
                    "linear-gradient(105deg, transparent 35%, rgba(240,200,112,0.18) 50%, transparent 65%)",
                }}
              />
            )}

            {/* particles */}
            {!reduceMotion && <ChartParticles count={16} />}

            {/* Chart header */}
            <div className="relative z-10 flex items-start justify-between mb-4 flex-wrap gap-3">
              <div>
                <div className="text-[10px] tracking-[0.3em] uppercase text-[#7d7a72] mb-1">
                  Curva conceitual · base 100
                </div>
                <div className="font-display text-[17px] sm:text-[19px] md:text-[20px] text-[#f0ecdf] leading-tight">
                  Crescimento <span className="serif-italic text-gold-light">composto</span> em 12 meses
                </div>
              </div>
              <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-[11px] tracking-[0.18em] uppercase">
                <span className="flex items-center gap-2 text-gold-light font-semibold">
                  <span
                    className="w-4 h-[3px] inline-block rounded-full"
                    style={{
                      background:
                        "linear-gradient(90deg, #a07a2b 0%, #d4a647 50%, #f0c870 100%)",
                      boxShadow: "0 0 8px rgba(240,200,112,0.7)",
                    }}
                  />{" "}
                  Trombeta
                </span>
                <span className="flex items-center gap-2 text-[#7d7a72]">
                  <span className="w-3 h-[2px] bg-[#5a5751] inline-block" /> Mercado
                </span>
              </div>
            </div>

            {/* Chart */}
            <div className="relative h-[280px] sm:h-[320px] md:h-[380px] w-full">
              {chartReady && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: -18, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="goldFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#d4a647" stopOpacity={0.6} />
                        <stop offset="55%" stopColor="#d4a647" stopOpacity={0.18} />
                        <stop offset="100%" stopColor="#d4a647" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="mercadoFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#5a5751" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="#5a5751" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="goldStroke" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#a07a2b" />
                        <stop offset="50%" stopColor="#d4a647" />
                        <stop offset="100%" stopColor="#f0c870" />
                      </linearGradient>
                      <filter id="glowGold" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="4.5" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    <CartesianGrid
                      stroke="rgba(212,166,71,0.08)"
                      strokeDasharray="3 6"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      stroke="#5a5751"
                      tick={{
                        fill: "#7d7a72",
                        fontSize: 10,
                        letterSpacing: "0.16em",
                        fontFamily: "Inter, sans-serif",
                      }}
                      tickLine={false}
                      axisLine={{ stroke: "rgba(212,166,71,0.15)" }}
                      interval="preserveStartEnd"
                      minTickGap={6}
                    />
                    <YAxis
                      stroke="#5a5751"
                      tick={{
                        fill: "#7d7a72",
                        fontSize: 10,
                        fontFamily: "Inter, sans-serif",
                      }}
                      tickLine={false}
                      axisLine={false}
                      width={40}
                    />
                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={{
                        stroke: "rgba(212,166,71,0.35)",
                        strokeDasharray: "4 4",
                      }}
                    />
                    <ReferenceLine
                      y={100}
                      stroke="rgba(212,166,71,0.18)"
                      strokeDasharray="2 6"
                      label={{
                        value: "Base 100",
                        position: "insideLeft",
                        fill: "#5e5b54",
                        fontSize: 9,
                        letterSpacing: "0.16em",
                        textTransform: "uppercase",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="mercado"
                      stroke="#5a5751"
                      strokeWidth={1.4}
                      strokeOpacity={0.7}
                      fill="url(#mercadoFill)"
                      isAnimationActive={!reduceMotion}
                      animationDuration={1600}
                      animationEasing="ease-out"
                    />
                    <Area
                      type="monotone"
                      dataKey="trombeta"
                      stroke="url(#goldStroke)"
                      strokeWidth={3.6}
                      fill="url(#goldFill)"
                      isAnimationActive={!reduceMotion}
                      animationDuration={2600}
                      animationEasing="ease-out"
                      animationBegin={350}
                      filter="url(#glowGold)"
                      activeDot={{
                        r: 7,
                        fill: "#f0c870",
                        stroke: "#050505",
                        strokeWidth: 2,
                        className: "anim-pulse-gold",
                      }}
                    />
                    {/* Pulsing dot at the end of Trombeta curve */}
                    <ReferenceDot
                      x="M12"
                      y={trombetaFinal}
                      r={5}
                      fill="#f0c870"
                      stroke="#050505"
                      strokeWidth={2}
                      ifOverflow="extendDomain"
                      isFront
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}

              {/* Pulse halo over the last Trombeta dot. Approximate position via top/right. */}
              {!reduceMotion && chartReady && (
                <span
                  aria-hidden
                  className="absolute pointer-events-none anim-pulse-halo"
                  style={{
                    right: "1.5%",
                    top: "5%",
                    width: 24,
                    height: 24,
                  }}
                />
              )}
            </div>

            {/* KPI bar derived from the chart math */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 1.3 }}
              className="relative z-10 grid grid-cols-3 gap-2 sm:gap-3 mt-5"
            >
              <KpiBadge
                value={trombetaUplift}
                prefix="+"
                suffix="%"
                label="Curva Trombeta"
                testid="growth-kpi-trombeta"
              />
              <KpiBadge
                value={mercadoUplift}
                prefix="+"
                suffix="%"
                label="Mercado tradicional"
                testid="growth-kpi-mercado"
              />
              <KpiBadge
                value={parseFloat(multiplier)}
                suffix="x"
                label="Vantagem composta"
                testid="growth-kpi-multiplier"
              />
            </motion.div>

            {/* Disclaimer */}
            <div className="relative z-10 mt-4 pt-3 border-t border-[rgba(212,166,71,0.15)]">
              <p className="text-[9px] sm:text-[10px] tracking-[0.16em] uppercase text-[#5e5b54] leading-relaxed flex items-start gap-2">
                <ArrowUpRight size={11} strokeWidth={2} className="text-gold-light shrink-0 mt-0.5" />
                <span>
                  Curva ilustrativa baseada na metodologia Trombeta. Os
                  resultados variam conforme mercado, ticket, maturidade e
                  investimento de cada operação.
                </span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
