import React, { useEffect, useState } from "react";
import { BRAND, NAV_LINKS } from "../data/mock";
import { Menu, X } from "lucide-react";
import { useMagnetic } from "../hooks/useMagnetic";

export const Navbar = ({ onOpenContact }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const ctaMagneticRef = useMagnetic(0.18);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (href) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header
      data-testid="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#050505]/85 backdrop-blur-xl border-b border-gold"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 h-[82px] flex items-center justify-between">
        {/* Logo */}
        <button
          data-testid="nav-logo"
          onClick={() => handleNav("#hero")}
          className="flex items-center gap-3 group"
          aria-label="Trombeta Estúdio, Início"
        >
          <div className="relative w-12 h-12 flex items-center justify-center">
            <img
              src={BRAND.logoMark}
              alt="Trombeta Estúdio"
              width={48}
              height={48}
              className="relative w-12 h-12 object-contain transition-transform duration-500 group-hover:scale-[1.04]"
            />
          </div>
          <div className="leading-tight">
            <div className="font-display text-[15px] text-gold tracking-[0.25em] font-semibold">
              TROMBETA
            </div>
            <div className="text-[10px] text-[#9a978d] tracking-[0.42em] uppercase">
              Estúdio
            </div>
          </div>
        </button>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-10">
          {NAV_LINKS.map((l) => (
            <button
              key={l.href}
              data-testid={`nav-link-${l.href.replace("#", "")}`}
              onClick={() => handleNav(l.href)}
              className="text-[12px] tracking-[0.28em] uppercase text-[#bdbab0] hover:text-gold transition relative group"
            >
              {l.label}
              <span className="absolute left-0 -bottom-2 h-px w-0 bg-gold transition-all duration-500 group-hover:w-full" />
            </button>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-4">
          <span ref={ctaMagneticRef} className="magnetic-wrap">
            <button
              data-testid="nav-cta-meeting"
              onClick={onOpenContact}
              className="btn-gold"
            >
              Agendar Reunião
            </button>
          </span>
        </div>

        {/* Mobile burger */}
        <button
          data-testid="nav-mobile-toggle"
          className="lg:hidden text-gold p-2"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          data-testid="nav-mobile-menu"
          className="lg:hidden bg-[#050505] border-t border-gold px-6 py-8 anim-fade-in"
        >
          <div className="flex flex-col gap-5">
            {NAV_LINKS.map((l) => (
              <button
                key={l.href}
                onClick={() => handleNav(l.href)}
                className="text-left text-[13px] tracking-[0.3em] uppercase text-[#bdbab0] hover:text-gold transition"
              >
                {l.label}
              </button>
            ))}
            <button
              data-testid="nav-mobile-cta"
              onClick={() => {
                setMobileOpen(false);
                onOpenContact();
              }}
              className="btn-gold mt-4 w-full"
            >
              Agendar Reunião
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
