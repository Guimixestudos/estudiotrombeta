import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { BRAND, SERVICE_OPTIONS } from "../data/mock";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import { toast } from "sonner";
import { X, Send, CheckCircle2, MessageCircle } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const ContactDialog = ({ open, onClose }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    message: "",
  });
  const [honey, setHoney] = useState(""); // honeypot anti-bot
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleChange = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const reset = () => {
    setForm({ name: "", email: "", phone: "", company: "", service: "", message: "" });
    setHoney("");
    setConsent(false);
    setDone(false);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      toast.error("Preencha nome, email e telefone.");
      return;
    }
    if (!consent) {
      toast.error("Você precisa aceitar a política de privacidade.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API}/contact`, {
        ...form,
        source: "landing-dialog",
        website: honey, // honeypot field , must be empty
      });
      setDone(true);
      toast.success("Solicitação enviada. Em breve nosso time entra em contato.");
    } catch (err) {
      console.error(err);
      const status = err?.response?.status;
      let msg = err?.response?.data?.detail;
      if (status === 429) {
        msg = "Muitas solicitações em pouco tempo. Aguarde 1 minuto e tente novamente.";
      }
      toast.error(
        msg ||
          "Erro ao enviar. Tente novamente ou fale conosco pelo WhatsApp."
      );
    } finally {
      setLoading(false);
    }
  };

  const waLink = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(
    `Olá Trombeta! Sou ${form.name || "..."} e gostaria de conversar com um especialista.`
  )}`;

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          onClose();
          setTimeout(reset, 300);
        }
      }}
    >
      <DialogContent
        data-testid="contact-dialog"
        className="bg-[#0a0a0b] border border-gold-strong text-[#e8e6df] max-w-2xl p-0 overflow-hidden max-h-[92dvh] sm:max-h-[88vh] flex flex-col"
      >
        <DialogTitle className="sr-only">Agendar Reunião com Trombeta Estúdio</DialogTitle>
        <DialogDescription className="sr-only">
          Formulário para falar com um especialista da Trombeta Estúdio.
        </DialogDescription>

        {/* Header , fixed */}
        <div className="relative p-7 md:p-9 border-b border-gold bg-[radial-gradient(circle_at_85%_-20%,rgba(212,166,71,0.25),transparent_55%)] shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-[#7d7a72] hover:text-gold transition"
            data-testid="contact-close"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
          <div className="section-label mb-3">Falar com Especialista</div>
          <h3 className="font-display text-[26px] md:text-[32px] leading-tight text-[#f0ecdf]">
            Vamos desenhar a sua{" "}
            <span className="serif-italic text-gold-light">próxima fase</span>.
          </h3>
          <p className="text-[13px] text-[#9a978d] mt-2 font-light">
            Preencha os dados, nossa equipe responde em até 24h úteis.
          </p>
        </div>

        {/* Body , scrollable on mobile when content overflows */}
        {!done ? (
          <form onSubmit={submit} className="p-7 md:p-9 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto flex-1 min-h-0">
            {/* Honeypot field , invisible to humans, attractive to bots */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={honey}
              onChange={(e) => setHoney(e.target.value)}
              aria-hidden="true"
              style={{
                position: "absolute",
                left: "-9999px",
                width: "1px",
                height: "1px",
                opacity: 0,
                pointerEvents: "none",
              }}
            />
            <Field
              testid="contact-name"
              label="Nome*"
              value={form.name}
              onChange={handleChange("name")}
              placeholder="Seu nome completo"
            />
            <Field
              testid="contact-email"
              type="email"
              label="Email*"
              value={form.email}
              onChange={handleChange("email")}
              placeholder="voce@empresa.com"
            />
            <Field
              testid="contact-phone"
              label="Telefone / WhatsApp*"
              value={form.phone}
              onChange={handleChange("phone")}
              placeholder="(11) 90000-0000"
            />
            <Field
              testid="contact-company"
              label="Empresa"
              value={form.company}
              onChange={handleChange("company")}
              placeholder="Nome da empresa"
            />

            <div className="md:col-span-2">
              <label className="text-[10px] tracking-[0.3em] uppercase text-[#9a978d] mb-2 block">
                Serviço de interesse
              </label>
              <select
                data-testid="contact-service"
                value={form.service}
                onChange={handleChange("service")}
                className="w-full bg-[#050505] border border-gold text-[#e8e6df] px-4 py-3 text-[14px] focus:border-gold-strong outline-none transition"
              >
                <option value="">Selecione...</option>
                {SERVICE_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-[10px] tracking-[0.3em] uppercase text-[#9a978d] mb-2 block">
                Conte sobre seu projeto
              </label>
              <textarea
                data-testid="contact-message"
                value={form.message}
                onChange={handleChange("message")}
                rows={4}
                placeholder="Faturamento atual, principal desafio, o que busca resolver..."
                className="w-full bg-[#050505] border border-gold text-[#e8e6df] px-4 py-3 text-[14px] focus:border-gold-strong outline-none transition resize-none"
              />
            </div>

            <div className="md:col-span-2 flex items-start gap-3 mt-1">
              <input
                id="contact-consent"
                type="checkbox"
                data-testid="contact-consent"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 w-4 h-4 accent-[#d4a647] cursor-pointer"
              />
              <label
                htmlFor="contact-consent"
                className="text-[12px] text-[#9a978d] leading-relaxed font-light cursor-pointer select-none"
              >
                Li e concordo com a{" "}
                <Link
                  to="/privacidade"
                  target="_blank"
                  className="text-gold-light underline-offset-2 hover:underline"
                >
                  Política de Privacidade
                </Link>{" "}
                e autorizo o contato comercial da Trombeta Estúdio (LGPD).
              </label>
            </div>

            <div className="md:col-span-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-2">
              <button
                type="submit"
                disabled={loading}
                data-testid="contact-submit"
                className="btn-gold flex-1 disabled:opacity-60"
              >
                {loading ? "Enviando..." : "Enviar Solicitação"}
                {!loading && <Send size={14} strokeWidth={2.2} />}
              </button>
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                data-testid="contact-whatsapp"
                className="btn-outline-gold flex-1"
              >
                <MessageCircle size={14} />
                WhatsApp
              </a>
            </div>
          </form>
        ) : (
          <div data-testid="contact-success" className="p-10 text-center overflow-y-auto flex-1 min-h-0">
            <div className="w-16 h-16 mx-auto rounded-full bg-gold/15 grid place-items-center mb-5">
              <CheckCircle2 size={32} className="text-gold-light" />
            </div>
            <h4 className="font-display text-[26px] text-[#f0ecdf] mb-3">
              Recebemos sua solicitação
            </h4>
            <p className="text-[14px] text-[#9a978d] mb-8 font-light max-w-md mx-auto">
              Em breve nosso time entra em contato para entender seu cenário e
              propor o próximo passo. Enquanto isso, se preferir, fale com a
              gente direto pelo WhatsApp.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="btn-gold"
              >
                Ir para o WhatsApp <MessageCircle size={14} />
              </a>
              <button
                onClick={() => {
                  onClose();
                  setTimeout(reset, 300);
                }}
                className="btn-outline-gold"
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

const Field = ({ label, testid, ...rest }) => (
  <div>
    <label className="text-[10px] tracking-[0.3em] uppercase text-[#9a978d] mb-2 block">
      {label}
    </label>
    <input
      data-testid={testid}
      {...rest}
      className="w-full bg-[#050505] border border-gold text-[#e8e6df] px-4 py-3 text-[14px] placeholder:text-[#5e5b54] focus:border-gold-strong outline-none transition"
    />
  </div>
);
