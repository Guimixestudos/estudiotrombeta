import React, { useState, useCallback } from "react";
import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { About } from "../components/About";
import { Services } from "../components/Services";
import { Portfolio } from "../components/Portfolio";
import { Differentials, Process } from "../components/Differentials";
import { GrowthChart } from "../components/GrowthChart";
import { Testimonials, CTA } from "../components/Testimonials";
import { Footer } from "../components/Footer";
import { ContactDialog } from "../components/ContactDialog";
import { CookieBanner, BackToTop } from "../components/CookieBanner";
import { ScrollProgress } from "../components/ScrollProgress";
import { LogoIntro } from "../components/LogoIntro";
import { Toaster } from "../components/ui/sonner";

export default function Landing() {
  const [contactOpen, setContactOpen] = useState(false);

  const openContact = useCallback(() => setContactOpen(true), []);
  const closeContact = useCallback(() => setContactOpen(false), []);

  const scrollTo = useCallback((sel) => {
    const el = document.querySelector(sel);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className="App">
      <LogoIntro />
      <ScrollProgress />
      <Navbar onOpenContact={openContact} />

      <main>
        <Hero onOpenContact={openContact} onScrollTo={scrollTo} />
        <About />
        <Services onOpenContact={openContact} />
        <Portfolio />
        <Differentials />
        <GrowthChart />
        <Process />
        <Testimonials />
        <CTA onOpenContact={openContact} />
      </main>

      <Footer onOpenContact={openContact} />

      <ContactDialog open={contactOpen} onClose={closeContact} />
      <CookieBanner />
      <BackToTop />

      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#0a0a0b",
            border: "1px solid rgba(212,166,71,0.45)",
            color: "#e8e6df",
            fontFamily: "Inter, sans-serif",
          },
        }}
      />
    </div>
  );
}
