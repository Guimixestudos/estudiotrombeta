import React from "react";
import { BRAND, NAV_LINKS, SERVICES } from "../data/mock";
import { Instagram, Mail, Phone, MapPin, ArrowUpRight, Send } from "lucide-react";

export const Footer = ({ onOpenContact }) => {
  const year = new Date().getFullYear();
  const waLink = `https://wa.me/${BRAND.whatsapp}`;

  return (
    <footer
      data-testid="footer"
      className="relative bg-[#040404] border-t border-gold pt-20 pb-8 overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-px gold-line" />
      <div className="absolute -top-32 -right-32 w-[460px] h-[460px] rounded-full bg-[radial-gradient(circle,rgba(212,166,71,0.10),transparent_70%)] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-14 h-14 flex items-center justify-center">
                <img
                  src={BRAND.logoMark}
                  alt="Trombeta Estúdio"
                  width={56}
                  height={56}
                  className="relative w-14 h-14 object-contain"
                />
              </div>
              <div>
                <div className="font-display text-gold text-[20px] tracking-[0.22em] font-semibold">
                  TROMBETA
                </div>
                <div className="text-[10px] text-[#9a978d] tracking-[0.42em] uppercase">
                  Estúdio
                </div>
              </div>
            </div>
            <p className="text-[14px] text-[#9a978d] font-light leading-relaxed max-w-sm">
              Estúdio de marketing estratégico focado em posicionamento, autoridade
              e crescimento real para empresas que querem sair do comum.
            </p>

            <div className="flex items-center gap-3 mt-7">
              <a
                href={BRAND.instagram}
                target="_blank"
                rel="noreferrer"
                data-testid="footer-instagram"
                className="w-10 h-10 grid place-items-center border border-gold text-gold-light hover:bg-gold hover:text-[#050505] transition"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                data-testid="footer-whatsapp"
                className="w-10 h-10 grid place-items-center border border-gold text-gold-light hover:bg-gold hover:text-[#050505] transition"
                aria-label="WhatsApp"
              >
                <Phone size={16} />
              </a>
              <a
                href={`mailto:${BRAND.email}`}
                data-testid="footer-email-icon"
                className="w-10 h-10 grid place-items-center border border-gold text-gold-light hover:bg-gold hover:text-[#050505] transition"
                aria-label="Email"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Links rápidos */}
          <div className="lg:col-span-2">
            <h4 className="text-[11px] tracking-[0.32em] uppercase text-gold-light mb-5">
              Navegação
            </h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-[13px] text-[#bcb9af] hover:text-gold transition"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Serviços */}
          <div className="lg:col-span-3">
            <h4 className="text-[11px] tracking-[0.32em] uppercase text-gold-light mb-5">
              Serviços
            </h4>
            <ul className="space-y-3">
              {SERVICES.slice(0, 6).map((s) => (
                <li key={s.title}>
                  <button
                    onClick={onOpenContact}
                    className="text-[13px] text-[#bcb9af] hover:text-gold transition text-left"
                  >
                    {s.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato + newsletter */}
          <div className="lg:col-span-3">
            <h4 className="text-[11px] tracking-[0.32em] uppercase text-gold-light mb-5">
              Contato
            </h4>
            <ul className="space-y-3 text-[13px] text-[#bcb9af]">
              <li className="flex items-center gap-3">
                <Phone size={14} className="text-gold-light" />
                <a href={waLink} target="_blank" rel="noreferrer" className="hover:text-gold transition">
                  {BRAND.whatsappDisplay}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={14} className="text-gold-light" />
                <a href={`mailto:${BRAND.email}`} className="hover:text-gold transition">
                  {BRAND.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={14} className="text-gold-light" />
                <span>São Paulo · Brasil</span>
              </li>
            </ul>

            <button
              data-testid="footer-cta"
              onClick={onOpenContact}
              className="btn-gold w-full mt-7 justify-center"
            >
              Agendar Reunião <ArrowUpRight size={14} strokeWidth={2.2} />
            </button>
          </div>
        </div>

        <div className="h-divider mb-8" />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-[11px] tracking-[0.18em] text-[#5e5b54] uppercase">
            © {year} Trombeta Estúdio. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-5 text-[11px] tracking-[0.18em] uppercase">
            <a
              href="/privacidade"
              className="text-[#7d7a72] hover:text-gold transition"
              data-testid="footer-privacy-link"
            >
              Política de Privacidade
            </a>
            <span className="text-[#5e5b54]">Estúdio de marketing · Brasil</span>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp bubble */}
      <a
        href={waLink}
        target="_blank"
        rel="noreferrer"
        data-testid="floating-whatsapp"
        className="fixed bottom-5 right-5 md:bottom-6 md:right-6 z-40 w-12 h-12 md:w-14 md:h-14 rounded-full bg-gold text-[#050505] grid place-items-center shadow-[0_8px_30px_-8px_rgba(0,0,0,0.7)] hover:scale-105 transition-transform"
        aria-label="WhatsApp"
      >
        <Send size={20} strokeWidth={2} />
      </a>
    </footer>
  );
};
