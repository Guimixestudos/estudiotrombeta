import React from "react";
import { BRAND } from "../data/mock";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PrivacyPolicy() {
  const navigate = useNavigate();
  return (
    <div className="App min-h-screen bg-[#050505] text-[#e8e6df]">
      <div className="absolute top-0 left-0 right-0 h-px gold-line" />

      <div className="max-w-[860px] mx-auto px-6 md:px-10 py-12 md:py-20">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-[#9a978d] hover:text-gold transition mb-10"
        >
          <ArrowLeft size={14} /> Voltar ao site
        </button>

        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 grid place-items-center border border-gold rounded-full">
            <ShieldCheck size={20} className="text-gold-light" />
          </div>
          <div>
            <div className="text-[10px] tracking-[0.4em] uppercase text-gold">
              Trombeta Estúdio
            </div>
            <h1 className="font-display text-[34px] md:text-[44px] text-[#f0ecdf] leading-tight">
              Política de Privacidade
            </h1>
          </div>
        </div>

        <div className="h-divider w-32 mb-10" />

        <div className="space-y-8 text-[15px] text-[#bcb9af] leading-[1.85] font-light">
          <Section title="1. Quem somos">
            A <strong className="text-gold-light">Trombeta Estúdio</strong> é um
            estúdio de marketing estratégico que opera no Brasil. Este documento
            descreve como tratamos os dados pessoais coletados através do site
            <em className="text-gold-light"> estudiotrombeta.com</em>, em
            conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018, LGPD).
          </Section>

          <Section title="2. Dados que coletamos">
            Coletamos apenas os dados que você nos fornece voluntariamente ao
            preencher nosso formulário de contato:
            <ul className="list-disc pl-6 mt-3 space-y-1.5">
              <li>Nome completo</li>
              <li>E-mail</li>
              <li>Telefone / WhatsApp</li>
              <li>Empresa (opcional)</li>
              <li>Serviço de interesse (opcional)</li>
              <li>Mensagem livre (opcional)</li>
            </ul>
          </Section>

          <Section title="3. Para que usamos seus dados">
            Os dados são utilizados exclusivamente para:
            <ul className="list-disc pl-6 mt-3 space-y-1.5">
              <li>Responder à sua solicitação de contato</li>
              <li>Agendar reuniões e enviar propostas comerciais</li>
              <li>
                Comunicar novidades, conteúdos e ofertas da Trombeta Estúdio
                (somente se houver consentimento expresso)
              </li>
            </ul>
            Não comercializamos, alugamos nem compartilhamos seus dados com terceiros para fins de marketing.
          </Section>

          <Section title="4. Base legal (LGPD)">
            O tratamento dos seus dados é fundamentado em:
            <ul className="list-disc pl-6 mt-3 space-y-1.5">
              <li>Consentimento, ao preencher o formulário de contato (Art. 7º, I)</li>
              <li>Execução de procedimentos preliminares relacionados a contrato (Art. 7º, V)</li>
              <li>Legítimo interesse para resposta a solicitações comerciais (Art. 7º, IX)</li>
            </ul>
          </Section>

          <Section title="5. Armazenamento e segurança">
            Seus dados são armazenados em servidores com criptografia e
            controles de acesso restritos. Aplicamos medidas técnicas e
            administrativas razoáveis para protegê-los contra acesso não
            autorizado, perda ou divulgação indevida.
          </Section>

          <Section title="6. Tempo de retenção">
            Mantemos seus dados pelo tempo necessário para cumprir as
            finalidades descritas, ou por até <strong className="text-gold-light">5 anos</strong> após o último
            contato, salvo obrigação legal de retenção por prazo maior.
          </Section>

          <Section title="7. Seus direitos (LGPD)">
            Você pode, a qualquer momento, solicitar:
            <ul className="list-disc pl-6 mt-3 space-y-1.5">
              <li>Confirmação da existência de tratamento dos seus dados</li>
              <li>Acesso aos seus dados</li>
              <li>Correção de dados incompletos, inexatos ou desatualizados</li>
              <li>Anonimização, bloqueio ou eliminação de dados desnecessários</li>
              <li>Portabilidade dos dados</li>
              <li>Revogação do consentimento</li>
            </ul>
            Para exercer qualquer um destes direitos, escreva para{" "}
            <a
              href={`mailto:${BRAND.email}`}
              className="text-gold-light hover:underline"
            >
              {BRAND.email}
            </a>
            .
          </Section>

          <Section title="8. Cookies">
            Utilizamos cookies essenciais para o funcionamento do site e cookies
            analíticos para entender como os visitantes interagem com o
            conteúdo. Você pode aceitar ou rejeitar cookies não essenciais
            através do banner exibido na primeira visita.

            <div className="mt-4">
              <button
                data-testid="reset-cookies"
                onClick={() => {
                  localStorage.removeItem("trombeta_cookie_consent");
                  alert(
                    "Suas preferências foram resetadas. O banner reaparecerá ao recarregar o site."
                  );
                }}
                className="text-[12px] tracking-[0.22em] uppercase text-gold-light underline-offset-2 hover:underline"
              >
                Redefinir preferências de cookies
              </button>
            </div>
          </Section>

          <Section title="9. Contato do encarregado (DPO)">
            Para questões relacionadas à privacidade ou LGPD, entre em contato pelo
            e-mail{" "}
            <a
              href={`mailto:${BRAND.email}`}
              className="text-gold-light hover:underline"
            >
              {BRAND.email}
            </a>{" "}
            ou pelo WhatsApp{" "}
            <a
              href={`https://wa.me/${BRAND.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="text-gold-light hover:underline"
            >
              {BRAND.whatsappDisplay}
            </a>
            .
          </Section>

          <Section title="10. Atualizações desta política">
            Esta política pode ser atualizada periodicamente. A data da última
            atualização será sempre informada abaixo. Recomendamos consulta
            regular.
          </Section>

          <div className="pt-6 text-[12px] tracking-[0.2em] uppercase text-[#7d7a72]">
            Última atualização:{" "}
            {new Date().toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

const Section = ({ title, children }) => (
  <section>
    <h2 className="font-display text-[20px] md:text-[22px] text-[#f0ecdf] mb-3">
      {title}
    </h2>
    <div>{children}</div>
  </section>
);
