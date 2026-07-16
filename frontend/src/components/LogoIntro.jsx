import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { BRAND } from "../data/mock";

const SESSION_KEY = "trombeta_intro_shown";
const COOLDOWN_KEY = "trombeta_intro_last";
const COOLDOWN_MS = 30 * 60 * 1000; // 30 min

const shouldShow = () => {
  try {
    // 1) Não mostrar duas vezes na MESMA sessão
    if (sessionStorage.getItem(SESSION_KEY)) return false;
    // 2) Cooldown de 30 min entre sessões (1ª visita sempre passa)
    const last = localStorage.getItem(COOLDOWN_KEY);
    if (last) {
      const elapsed = Date.now() - parseInt(last, 10);
      if (elapsed < COOLDOWN_MS) return false;
    }
    return true;
  } catch {
    return true;
  }
};

const markShown = () => {
  try {
    sessionStorage.setItem(SESSION_KEY, "1");
    localStorage.setItem(COOLDOWN_KEY, String(Date.now()));
  } catch {}
};

export const LogoIntro = () => {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!shouldShow()) return;
    setOpen(true);
    // Bloquear scroll enquanto a intro estiver visível
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    let raf;
    const start = performance.now();
    const TOTAL = reduceMotion ? 600 : 2200; // ms

    const tick = (t) => {
      const elapsed = t - start;
      const p = Math.min(1, elapsed / TOTAL);
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        // Fechar após pequeno delay para terminar a animação de saída
        setTimeout(() => {
          markShown();
          setOpen(false);
          document.body.style.overflow = prevOverflow;
        }, 280);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="logo-intro"
          data-testid="logo-intro"
          className="fixed inset-0 z-[100] bg-[#050505] flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
          }}
        >
          {/* Subtle radial backdrop */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,166,71,0.08),transparent_60%)]" />

          {/* Center: Logo + brand + loader */}
          <motion.div
            className="relative flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{
              opacity: 0,
              scale: 0.6,
              y: -180,
              transition: { duration: 0.8, ease: [0.65, 0, 0.35, 1] },
            }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.img
              src={BRAND.logoMark}
              alt="Trombeta Estúdio"
              width={200}
              height={200}
              className="w-[160px] h-[160px] md:w-[200px] md:h-[200px] object-contain"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1,
                transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] },
              }}
            />

            {/* Wordmark */}
            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="font-display text-gold tracking-[0.42em] text-[18px] md:text-[22px] font-semibold">
                TROMBETA
              </div>
              <div className="text-[10px] md:text-[11px] text-[#9a978d] tracking-[0.6em] uppercase mt-1">
                Estúdio
              </div>
            </motion.div>

            {/* Loading bar */}
            <motion.div
              className="mt-12 w-[200px] md:w-[260px] h-[1px] bg-[rgba(212,166,71,0.18)] overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <div
                className="h-full bg-gradient-to-r from-[#8c6a1f] via-[#f0c870] to-[#8c6a1f] origin-left"
                style={{ transform: `scaleX(${progress})` }}
              />
            </motion.div>

            <motion.div
              className="mt-3 text-[9px] md:text-[10px] text-[#7d7a72] tracking-[0.4em] uppercase tabular-nums"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              {String(Math.round(progress * 100)).padStart(3, "0")}%
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
