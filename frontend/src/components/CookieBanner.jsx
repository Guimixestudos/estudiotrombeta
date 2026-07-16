import React, { useEffect, useState } from "react";
import { Cookie, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const STORAGE_KEY = "trombeta_cookie_consent";

export const CookieBanner = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) {
      const t = setTimeout(() => setOpen(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  const decide = (value) => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ value, at: new Date().toISOString() })
    );
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      data-testid="cookie-banner"
      className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:bottom-6 md:max-w-md z-[80] anim-fade-up"
    >
      <div className="relative bg-[#0a0a0b]/95 backdrop-blur-xl border border-gold-strong p-5 md:p-6 shadow-[0_18px_40px_-20px_rgba(0,0,0,0.8)]">
        <button
          onClick={() => decide("dismissed")}
          aria-label="Fechar"
          className="absolute top-3 right-3 text-[#7d7a72] hover:text-gold transition"
        >
          <X size={16} />
        </button>

        <div className="flex items-start gap-3">
          <div className="w-9 h-9 grid place-items-center border border-gold rounded-full shrink-0 mt-0.5">
            <Cookie size={15} className="text-gold-light" />
          </div>
          <div>
            <div className="text-[10px] tracking-[0.3em] uppercase text-gold-light mb-1.5">
              Cookies & Privacidade
            </div>
            <p className="text-[13px] text-[#bcb9af] font-light leading-relaxed">
              Usamos cookies para melhorar sua experiência e analisar o uso do
              site. Ao continuar, você concorda com a nossa{" "}
              <button
                onClick={() => navigate("/privacidade")}
                className="text-gold-light underline-offset-2 hover:underline"
              >
                política de privacidade
              </button>
              .
            </p>

            <div className="flex flex-wrap gap-2 mt-4">
              <button
                data-testid="cookie-accept"
                onClick={() => decide("accepted")}
                className="btn-gold !py-2.5 !px-4 !text-[11px]"
              >
                Aceitar
              </button>
              <button
                data-testid="cookie-reject"
                onClick={() => decide("rejected")}
                className="btn-outline-gold !py-2.5 !px-4 !text-[11px]"
              >
                Recusar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const BackToTop = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      data-testid="back-to-top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Voltar ao topo"
      className="fixed bottom-24 right-6 z-30 w-11 h-11 border border-gold bg-[#0a0a0b]/85 backdrop-blur text-gold-light grid place-items-center hover:bg-gold hover:text-[#050505] transition anim-fade-in"
    >
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m18 15-6-6-6 6" />
      </svg>
    </button>
  );
};
