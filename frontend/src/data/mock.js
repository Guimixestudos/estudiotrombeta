// Data file for Trombeta Estúdio landing page

export const BRAND = {
  name: "TROMBETA ESTÚDIO",
  tagline: "Estratégia. Posicionamento. Resultados.",
  whatsapp: "5511971198699",
  whatsappDisplay: "+55 11 97119-8699",
  email: "contato@estudiotrombeta.com",
  instagram: "https://www.instagram.com/estudiotrombeta_/",
  instagramHandle: "@estudiotrombeta_",
  // New brand logos (Jan/2026 rebrand)
  // logoMark = símbolo "T" dourado (transparente, ideal para Navbar)
  // logoFull = lockup completo "T" + TROMBETA ESTÚDIO (footer, OG image)
  logoMark: "/logo-mark.png",
  logoFull: "/logo-full.jpg",
  // Legacy alias kept for backward-compat , points to the new mark
  logoUrl: "/logo-mark.png",
  // Assets servidos localmente (independentes de qualquer CDN externo)
  heroVisualUrl: "/clients/hero-visual.jpeg",
  // (assets de fotos convertidos para JPEG p/ performance)
  krdLogoUrl: "/clients/krd.jpg",
  agwLogoUrl: "/clients/agw-logo.png",
  ebenezerLogoUrl: "/clients/ebenezer.png",
};

export const NAV_LINKS = [
  { label: "Início", href: "#hero" },
  { label: "Estúdio", href: "#sobre" },
  { label: "Serviços", href: "#servicos" },
  { label: "Cases", href: "#cases" },
  { label: "Processo", href: "#processo" },
  { label: "Contato", href: "#contato" },
];

// Honest, sober proof-points, no fabricated round numbers.
export const STATS = [
  { label: "Posicionamento", value: "Premium" },
  { label: "Operação", value: "360°" },
  { label: "Equipe", value: "Multi\u00ADdisciplinar" },
  { label: "Foco", value: "Receita" },
];

export const SERVICES = [
  {
    icon: "Compass",
    title: "Estratégia de Marketing",
    desc: "Leitura de mercado, definição de posicionamento e plano de crescimento conectado à operação comercial.",
  },
  {
    icon: "TrendingUp",
    title: "Gestão de Tráfego",
    desc: "Mídia paga em Meta, Google e LinkedIn com leitura constante de funil e custo por oportunidade.",
  },
  {
    icon: "Target",
    title: "Posicionamento Digital",
    desc: "Reposicionamento de marca, narrativa e oferta para faixas de ticket maiores.",
  },
  {
    icon: "Clapperboard",
    title: "Produção Audiovisual",
    desc: "Vídeo, comercial, VSL, lives e conteúdo para empresários, influenciadores e marcas.",
  },
  {
    icon: "Crown",
    title: "Branding",
    desc: "Identidade visual, naming, manual de marca e narrativa para marcas que precisam ser percebidas como referência.",
  },
  {
    icon: "PenTool",
    title: "Criação de Conteúdo",
    desc: "Conteúdo orientado por autoridade, posicionamento e conversão, não por tendência.",
  },
  {
    icon: "Briefcase",
    title: "Estrutura Comercial",
    desc: "Esteira de vendas, scripts, CRM e processos para transformar lead em receita previsível.",
  },
  {
    icon: "Magnet",
    title: "Captação de Leads",
    desc: "Funis, landing pages, automações e qualificação de oportunidades para vendas consultivas.",
  },
  {
    icon: "Share2",
    title: "Gestão de Redes Sociais",
    desc: "Operação completa de Instagram, LinkedIn, TikTok e YouTube com agenda estratégica.",
  },
  {
    icon: "MonitorSmartphone",
    title: "Websites & Landing Pages",
    desc: "Sites institucionais e LPs de conversão com performance, SEO e estética coerente com a marca.",
  },
];

export const DIFFERENTIALS = [
  {
    icon: "Brain",
    title: "Estratégia antes da execução",
    desc: "Nada é produzido antes de mapearmos posicionamento, mercado, oferta e funil.",
  },
  {
    icon: "Rocket",
    title: "Marketing conectado à receita",
    desc: "Trabalhamos por metas comerciais. Cada movimento responde por um indicador.",
  },
  {
    icon: "Diamond",
    title: "Posicionamento premium",
    desc: "Conduzimos marcas para faixas de preço maiores aumentando percepção de valor antes do volume.",
  },
  {
    icon: "Sparkles",
    title: "Conteúdo com objetivo",
    desc: "Cada post, vídeo e campanha existe para mover um indicador específico do funil.",
  },
  {
    icon: "Building2",
    title: "Marketing e vendas integrados",
    desc: "Operação alinhada do clique ao fechamento, sem ruído entre as áreas.",
  },
  {
    icon: "ShieldCheck",
    title: "Autoridade digital",
    desc: "Construímos reputação, narrativa e prova social que sustentam ticket alto.",
  },
];

export const PROCESS = [
  { step: "01", title: "Diagnóstico", desc: "Imersão em marca, mercado, oferta, funil e operação atual." },
  { step: "02", title: "Estratégia", desc: "Posicionamento, narrativa, metas comerciais e plano de mídia." },
  { step: "03", title: "Estruturação", desc: "Identidade, ativos, CRM, automações e governança de operação." },
  { step: "04", title: "Execução", desc: "Produção, campanhas e operação com padrão de estúdio." },
  { step: "05", title: "Crescimento", desc: "Otimização contínua orientada por dados, LTV e CAC." },
  { step: "06", title: "Escala", desc: "Expansão de mercado, novas ofertas e novos canais." },
];

// ---------------- REAL CASES ----------------
// 💡 OPCIONAL , Adicionar métricas reais (credibilidade): adicione um campo
// "metrics" em qualquer case com até 3 objetos { value, label }. Exemplo:
//   metrics: [
//     { value: "+312%", label: "Leads qualificados" },
//     { value: "18→47", label: "Reuniões / mês" },
//     { value: "4.2x",  label: "ROAS mídia paga" },
//   ]
// Por padrão NENHUMA métrica é exibida (sem números fake). Quando você tiver
// dados reais validados pelo cliente, basta adicionar o campo "metrics" no case.
export const REAL_CASES = [
  {
    id: "ematech",
    name: "Ematech Industrial",
    category: "Indústria",
    site: "https://ematechindustrial.com.br/",
    description:
      "Engenharia industrial especializada em pintura e revestimento de pisos, reforço estrutural com epóxi e estruturação de pontes e viadutos. Reposicionamento digital, site institucional e presença de mercado.",
    image:
      "https://ematechindustrial.com.br/images/services/pintura-industrial.jpeg",
    tags: ["Posicionamento", "Site", "Conteúdo"],
    highlights: [
      "Pintura e revestimento industrial (PU e epóxi)",
      "Reforço estrutural com epóxi: recuperação sem demolição",
      "Estruturação de pontes e viadutos",
    ],
    featured: true,
  },
  {
    id: "wm-gessos",
    name: "WM Gessos",
    category: "Construção",
    site: "https://www.instagram.com/wmgessos_/",
    description:
      "Gesso e acabamentos para construção civil: forros, sancas, molduras e drywall. Sob o lema \u201cSua obra, nosso compromisso\u201d, estruturamos identidade visual, posicionamento local e presença digital para gerar orçamentos qualificados e fortalecer a autoridade da marca na região.",
    image: "/wm-gessos.jpg",
    tags: ["Identidade", "Redes Sociais", "Captação"],
    isLogoCover: true,
    logoBg: "#0a0a0b",
  },
  {
    id: "ava",
    name: "Tech Software",
    category: "Tecnologia",
    site: "https://www.tecsoftware.com.br/",
    description:
      "Empresa de tecnologia. Construção de narrativa, presença digital moderna e site institucional alinhado à proposta de valor.",
    image: "/clients/techsoftware-interior.jpg",
    tags: ["Branding", "Site", "Conteúdo"],
  },
  {
    id: "agw",
    name: "AGW Group",
    category: "Corporativo",
    site: "https://agwgroup.com.br",
    description:
      "Grupo corporativo. Posicionamento institucional, governança de marca e presença digital coerente com o porte da operação.",
    image: "/clients/agw-space.jpg",
    tags: ["Branding", "Posicionamento", "Site"],
  },
  {
    id: "krd",
    name: "KRD Portões",
    category: "Serralheria",
    site: "https://www.instagram.com/krdportoes/",
    description:
      "Empresa do setor de portões e serralheria. Identidade visual, posicionamento e captação de obras locais.",
    image: "/clients/krd.jpg",
    tags: ["Identidade", "Captação", "Tráfego"],
    isLogoCover: true,
  },
  {
    id: "ebenezer",
    name: "Ebenezer · Casa de Ração & Petshop",
    category: "Varejo",
    site: "https://www.instagram.com/petshopebenezer.oficial/",
    description:
      "Casa de ração e petshop. Identidade visual, posicionamento de bairro e estratégia de recompra para clientes fiéis.",
    image: "/clients/ebenezer.png",
    tags: ["Identidade", "Redes Sociais", "Recompra"],
    isLogoCover: true,
    logoBg: "#3b1a72",
  },
  {
    id: "giovana-ribeiro",
    name: "Giovana Ribeiro",
    category: "Audiovisual",
    site: "https://www.instagram.com/s_giovanaribeiro/",
    description:
      "Referência em sexologia cristã para casais. Produção audiovisual, conteúdo e presença digital com padrão de estúdio, da pré-produção à finalização.",
    image: "/clients/giovana.png",
    tags: ["Audiovisual", "Conteúdo", "Posicionamento"],
    isLogoCover: true,
    logoBg: "#000000",
  },
  {
    id: "papi-adore",
    name: "Papi & Adore · Pizzaria e Restaurante",
    category: "Gastronomia",
    site: "https://www.instagram.com/papieadore/",
    description:
      "Pizzaria e restaurante. Posicionamento de marca, presença digital e estratégia de conteúdo orientada à recorrência.",
    image: "/clients/papi.jpg",
    tags: ["Identidade", "Redes Sociais", "Conteúdo"],
    isLogoCover: true,
  },
  {
    id: "fornalha-bravus",
    name: "Fornalha dos Bravus · Pizzaria",
    category: "Gastronomia",
    site: "https://www.instagram.com/fornalhadosbravus/",
    description:
      "Pizzaria autoral. Construção de marca, presença digital e captação de clientes locais com narrativa forte.",
    image: "/clients/bravus.jpg",
    tags: ["Identidade", "Redes Sociais", "Tráfego"],
    isLogoCover: true,
  },
  {
    id: "estacao-das-tintas",
    name: "Estação das Tintas",
    category: "Varejo",
    site: "https://www.instagram.com/estacaodastintas_/",
    description:
      "Loja especializada em tintas, acessórios e materiais para pintura. Identidade visual, posicionamento local e presença digital para atrair pintores, obras e consumidores da região.",
    image: "/clients/estacao-tintas.png",
    tags: ["Identidade", "Redes Sociais", "Captação"],
    isLogoCover: true,
    logoBg: "#ffffff",
  },
];

// Conceito / cases ilustrativos , claramente sinalizados.
export const FICTITIOUS_CASES = [];

export const AUDIOVISUAL_FEATURED = {
  headline: "Produções para nomes que movem mercado",
  description:
    "Realizamos produções audiovisuais para influenciadores, empresários e nomes do mercado digital, incluindo conteúdo para a Giovana Ribeiro, referência em sexologia cristã para casais. Da pré-produção à finalização, com padrão de estúdio.",
  highlights: [
    "Giovana Ribeiro · Sexologia Cristã",
    "Influenciadores e empresários nacionais",
    "Gravações comerciais e VSLs",
    "Lives, eventos e conteúdo institucional",
  ],
  image:
    "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1600&q=80",
};

// Real, sober testimonials (without fabricated metrics).
export const TESTIMONIALS = [
  {
    name: "Eduardo Lins",
    role: "Diretor · Ematech Industrial",
    text:
      "Indústria não costuma ter esse cuidado com a comunicação. O trabalho com a Trombeta deu outra cara para a empresa, passamos a falar com decisores diferentes.",
  },
  {
    name: "Time Tech Software",
    role: "Tech Software",
    text:
      "Eles entenderam o que o nosso produto representa antes de qualquer peça. Isso fez toda a diferença em como passamos a nos comunicar com o mercado.",
  },
  {
    name: "Equipe AGW Group",
    role: "AGW Group",
    text:
      "Trabalho sério, sem firula. Conseguiram traduzir a complexidade do grupo em uma comunicação clara e coerente com o nosso porte.",
  },
];

// Client logos for the Hero "Marcas que confiaram" marquee.
// Each entry can define:
//   - logo (URL) → renders the image. When null, falls back to a typographic
//     monogram using `initials`.
//   - bg → background color of the circular badge (defaults to #0a0a0b).
//     Choose a color matching the logo so it feels like a self-contained brand badge.
//   - fit → "cover" (logo fills the whole circle, recommended for logos with built-in backgrounds)
//     or "contain" (logo sits centered with padding, for transparent PNGs).
//   - site → optional URL (Instagram, website) , when present, the circle becomes a clickable link.
export const CLIENT_LOGOS = [
  {
    name: "WM Gessos",
    initials: "WM",
    logo: "/wm-gessos.jpg",
    bg: "#0a0a0b",
    fit: "cover",
    site: "https://www.instagram.com/wmgessos_/",
  },
  {
    name: "KRD Portões",
    initials: "KRD",
    logo: "/clients/krd.jpg",
    bg: "#0a0a0b",
    fit: "cover",
    site: "https://www.instagram.com/krdportoes/",
  },
  {
    name: "Ebenezer Petshop",
    initials: "EB",
    logo: "/clients/ebenezer.png",
    bg: "#0a0a0b",
    fit: "cover",
    site: "https://www.instagram.com/petshopebenezer.oficial/",
  },
  {
    name: "Giovana Ribeiro",
    initials: "GR",
    logo: "/clients/giovana.png",
    bg: "#000000",
    fit: "cover",
    site: "https://www.instagram.com/s_giovanaribeiro/",
  },
  {
    name: "Papi & Adore",
    initials: "P&A",
    logo: "/clients/papi.jpg",
    bg: "#f5f3ee",
    fit: "cover",
    site: "https://www.instagram.com/papieadore/",
  },
  {
    name: "Fornalha dos Bravus",
    initials: "FB",
    logo: "/clients/bravus.jpg",
    bg: "#1a0e07",
    fit: "cover",
    site: "https://www.instagram.com/fornalhadosbravus/",
  },
  {
    name: "Ematech Industrial",
    initials: "EM",
    logo: "/clients/ematech.jpg",
    bg: "#1a1a1c",
    fit: "cover",
    site: "https://ematechindustrial.com.br/",
  },
  {
    name: "Tech Software",
    initials: "TS",
    logo: "/clients/techsoftware-logo.png",
    bg: "#03070f",
    fit: "cover",
    site: "https://www.tecsoftware.com.br/",
  },
  {
    name: "AGW Group",
    initials: "AGW",
    logo: "/clients/agw-logo2.png",
    bg: "#e8e6df",
    fit: "contain",
    site: "https://agwgroup.com.br",
  },
  {
    name: "Estação das Tintas",
    initials: "ET",
    logo: "/clients/estacao-tintas.png",
    bg: "#ffffff",
    fit: "contain",
    site: "https://www.instagram.com/estacaodastintas_/",
  },
];

export const SERVICE_OPTIONS = [
  "Estratégia de Marketing",
  "Gestão de Tráfego",
  "Posicionamento Digital",
  "Produção Audiovisual",
  "Branding",
  "Criação de Conteúdo",
  "Estrutura Comercial",
  "Captação de Leads",
  "Gestão de Redes Sociais",
  "Websites & Landing Pages",
  "Outro / Quero conversar",
];
