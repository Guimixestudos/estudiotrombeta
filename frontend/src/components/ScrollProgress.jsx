import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";

/**
 * ScrollProgress , barra dourada fina e premium no topo da página
 * mostrando o progresso de leitura.
 */
export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.4,
  });

  return (
    <motion.div
      data-testid="scroll-progress"
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-[#8c6a1f] via-[#f0c870] to-[#8c6a1f] pointer-events-none"
    />
  );
};
