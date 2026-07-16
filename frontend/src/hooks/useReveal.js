import { useEffect, useRef, useState } from "react";

/**
 * useReveal , adds .is-visible to the ref's element when it enters viewport.
 * Usage: const ref = useReveal(); <div ref={ref} className="reveal">
 */
export function useReveal(options = {}) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px", ...options }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/**
 * useCountUp , animate counter when visible.
 */
export function useCountUp(target, duration = 1800) {
  const ref = useRef(null);
  const [val, setVal] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !startedRef.current) {
            startedRef.current = true;
            const startTime = performance.now();
            const animate = (now) => {
              const t = Math.min(1, (now - startTime) / duration);
              const eased = 1 - Math.pow(1 - t, 3);
              setVal(Math.floor(eased * target));
              if (t < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
          }
        });
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);

  return [ref, val];
}
