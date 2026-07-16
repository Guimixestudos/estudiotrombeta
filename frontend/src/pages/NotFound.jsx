import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";
import { BRAND } from "../data/mock";

export default function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    // SEO: tell search engines not to index this URL
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-[#e8e6df] flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(212,166,71,0.15),transparent_55%)]" />

      <div className="relative max-w-xl text-center anim-fade-up">
        <img
          src={BRAND.logoMark}
          alt="Trombeta Estúdio"
          width={64}
          height={64}
          className="w-16 h-16 mx-auto object-contain mb-8"
        />

        <div className="font-display gold-text-grad text-[clamp(5rem,12vw,9rem)] leading-none">
          404
        </div>
        <div className="h-divider w-32 mx-auto my-6" />

        <h1 className="font-display text-[28px] md:text-[36px] text-[#f0ecdf] leading-tight">
          Página fora de <span className="serif-italic text-gold-light">cena</span>.
        </h1>
        <p className="text-[15px] text-[#9a978d] mt-5 font-light leading-relaxed">
          A página que você procura não existe ou foi movida. Vamos te levar
          de volta ao estúdio.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-9">
          <button onClick={() => navigate("/")} className="btn-gold">
            <Home size={14} /> Voltar para o site
          </button>
          <button onClick={() => navigate(-1)} className="btn-outline-gold">
            <ArrowLeft size={14} /> Página anterior
          </button>
        </div>
      </div>
    </div>
  );
}
