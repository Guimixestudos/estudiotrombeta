# PRD, Trombeta Estúdio

## Problem statement (original)
"Quero que analise meu site, entenda a estrutura pois iremos fazer algumas alterações,
repositório público em https://github.com/Guimixestudos/estudiotrombeta, domínio
https://estudiotrombeta.com (Hostinger frontend + Railway backend / api.estudiotrombeta.com).

Iteração 1:
1. Frase confusa 'Multidisciplinar Time Receita Foco' na seção Sobre.
2. Linha Trombeta no gráfico precisa de mais destaque vs Mercado.
3. Marquee Marcas que confiaram: nem todos clientes têm link clicável; trocar link da
   Giovana para https://www.instagram.com/s_giovanaribeiro/ ; adicionar link de Tech Software.
4. Mais animação no gráfico.
5. Responsividade.
6. Site não deve usar travessão (—); trocar por vírgula.

Iteração 2 (após preview):
7. Logos do site sumiram (Navbar/Footer/LogoIntro com ícones quebrados).
8. Favicon e meta tags genéricos.
9. Build pronto para subir no Hostinger.

Iteração 3 (após preview):
10. Erro no login do admin: 'Admin não configurado'.
11. Logo do Ebenezer Petshop mostrando círculo roxo gigante sem mostrar o logo.
12. Backend no Railway crashado: 'Error loading ASGI app. Could not import module main'."

## Stack
- Frontend: React 19 + CRA/Craco + Tailwind + framer-motion + recharts (Hostinger em prod)
- Backend: FastAPI + Motor (MongoDB) + slowapi + bcrypt + JWT (Railway em prod, api.estudiotrombeta.com)
- Cookie banner LGPD + JWT bearer + brute-force lockout + security headers

## User personas
- Guilherme (owner), executivos que entram pelo site e usam o form de contato como lead.
- Admin (Guilherme) acessa /admin para gerenciar leads (auth JWT).

## Core requirements (static)
1. Site é uma landing premium em PT-BR com tema dourado sobre preto.
2. Formulário público de contato cria leads via POST /api/contact (rate-limited + honeypot).
3. Marquee de marcas exibe 8 clientes com logos circulares + nome embaixo, todos clicáveis.
4. Gráfico Crescimento compara curva Trombeta vs Mercado em 12 meses.
5. Textos visíveis devem evitar travessão (—). Vírgula é a preferida.
6. Deploy backend no Railway com `uvicorn server:app` (ou `main:app` via fallback).
7. Deploy frontend no Hostinger via build estático + .htaccess para SPA routing.

## What's been implemented
### Iteration 1 (Jan/2026)
- (a) Stats no About: label em cima (eyebrow) + valor embaixo. Soft-hyphen no valor "Multi­disciplinar".
- (b) GrowthChart: linha Trombeta strokeWidth=3.6 + glow duplo. Tooltip com TROMBETA destacado em dourado/uppercase/bold + valor grande; Mercado abaixo de divisor sutil. Legenda Trombeta semibold.
- (c) Marquee: link Giovana → s_giovanaribeiro; Tech Software ganhou link tecsoftware.com.br.
- (d) Partículas no gráfico aumentadas de 10 para 16.
- (e) Todos os travessões (—) removidos do código.
- (f) Tech Software case (Portfolio) ganhou link clicável.
- (g) Responsividade validada em 1920×1080, 768×1024, 390×844.

### Iteration 2 (Jan/2026)
- (h) Copiada toda a pasta `frontend/public/` que tinha sido esquecida: favicons (16/32/48/192/512), apple-touch-icon, logo-mark.png, logo-full.jpg, og-image.jpg, manifest.json, robots.txt, sitemap.xml.
- (i) Substituído index.html placeholder pelo correto com SEO completo (PT-BR), OpenGraph, Twitter Cards, JSON-LD (Organization + ProfessionalService + WebSite), favicons multi-size, e badge Emergent escondido.
- (j) .htaccess para Hostinger Apache (SPA routing + HTTPS redirect + security headers + cache + gzip + .env block).
- (k) Build de produção gerado em /app/frontend/build/ (1.8 MB zipado).
- (l) Limpeza: removido temp_repo/; test_reports/ e test_result.md adicionados ao .gitignore.

### Iteration 3 (Jan/2026)
- (m) **Railway fix**: criados `/app/backend/Procfile` (`web: uvicorn server:app --host 0.0.0.0 --port $PORT`), `/app/backend/main.py` (re-exporta `app` para sobreviver ao default `uvicorn main:app`), `/app/backend/railway.json` (com healthcheck em /api/health), `/app/backend/runtime.txt` (Python 3.11.10), `/app/Procfile` root-level.
- (n) **Ebenezer logo fix**: bg do badge mudado de `#3b1a72` (roxo) para `#0a0a0b` (preto) e `fit: contain` → `cover`. Agora o logo aparece inteiro sem o "círculo roxo gigante".
- (o) **Backend auth**: NÃO foi modificada. Verificado via `git diff` que server.py não tem mudanças funcionais; só comentários (sem em-dash). O erro "Admin não configurado" no preview local é apenas porque ADMIN_PASSWORD_HASH está vazio em /app/backend/.env (esperado em preview). Em produção (Railway) as credenciais do usuário continuam válidas.
- (p) Criado `/app/backend/.env.example` documentando todas as variáveis necessárias no Railway.
- (q) Build atualizado em /app/frontend/build/ e re-zipado em /app/trombeta-hostinger-build.zip (1.8 MB).

### Iteration 4 (Jun/2026) — WM Gessos + consistência + hardening produção
- (r) **WM Gessos** adicionado: logo enviado pelo usuário salvo localmente em `/app/frontend/public/wm-gessos.png`. Inserido como PRIMEIRO item de `CLIENT_LOGOS` (marquee do hero, fit `cover`, link https://www.instagram.com/wmgessos_/) e como case em `REAL_CASES` (id `wm-gessos`, categoria nova **Construção**, copy montada a partir do contexto "Sua obra, nosso compromisso").
- (s) **Ebenezer (hero)**: alterado de `fit: contain` para `fit: cover` com `bg: #3b1a72` (emblema circular roxo em PNG transparente 1024² preenche o círculo igual aos demais). Corrige a queixa de "ícone menor que os outros".
- (t) **Consistência hero ↔ cases**: Giovana Ribeiro (que estava só no marquee) agora também tem case (id `giovana-ribeiro`, categoria **Audiovisual**). Todos os 9 clientes do hero têm case correspondente.
- (u) **Botão "Ver mais"** no Portfolio: na categoria "Todos" exibe no máximo 6 cards + botão `portfolio-toggle-more` (Ver mais/Ver menos). Reseta ao trocar de filtro.
- (v) **Independência da Emergent (produção externa)**: TODAS as imagens que vinham de `customer-assets.emergentagent.com` foram re-hospedadas localmente em `/app/frontend/public/clients/`. Removidos do `index.html`: script `assets.emergent.sh/emergent-main.js`, badge `#emergent-badge`, bloco PostHog (analytics) e `dns-prefetch` para emergentagent. Removido `@emergentbase/visual-edits` do `craco.config.js` e do `package.json`. Build de produção verificado: 0 referências a posthog/emergent/customer-assets no bundle.
- (w) Dependências `bleach`/`slowapi` (já declaradas no requirements) instaladas no ambiente; `lenis` adicionado ao frontend.
- Test status iteration 4: testing_agent frontend 100% (WM Gessos marquee+case+filtro Construção, badges uniformes/Ebenezer ok, Ver mais/menos, reset de filtro, POST /api/contact 200, sem scripts Emergent). Build de produção OK em /app/frontend/build/.

### Iteration 5 (Jul/2026) — Novo cliente Estação das Tintas
- (x) **Estação das Tintas** adicionado: logo (PNG 1.2 MB) salvo em `/app/frontend/public/clients/estacao-tintas.png`. Inserido em `CLIENT_LOGOS` (marquee do hero, `bg: #ffffff`, `fit: contain`, link https://www.instagram.com/estacaodastintas_/) e como case em `REAL_CASES` (id `estacao-das-tintas`, categoria **Varejo**, `isLogoCover: true`, `logoBg: #0a0a0b`). Nenhum outro arquivo foi tocado, arquitetura e demais clientes intactos. Build de produção validado, dependência `lenis` reinstalada via `yarn install`.

### Iteration 6 (Jul/2026) — Redesign dos cards logo-cover (legibilidade)
- (y) **Fix crítico de legibilidade** em `Portfolio.jsx > CaseCard`: para itens com `isLogoCover: true` (7 cards: KRD, Ebenezer, Papi, Fornalha, Giovana, WM Gessos, Estação das Tintas) o card foi dividido em 2 blocos verticais sólidos ao invés de logo com gradiente semitransparente:
  - TOP (54%): logo isolado com `object-contain p-8 md:p-9`, background = `logoBg` (padrão `#0a0a0b`), badge categoria + arrow hover ↗
  - Divisor dourado semitransparente (`rgba(212,166,71,0.45)`)
  - BOTTOM (46%): bloco `#0a0a0b` sólido com título (`line-clamp-1`), descrição (`line-clamp-3`), tags e VISITAR
  - Hover: zoom suave 105% no logo (era 110%), arrow fade-in, glow radial sutil preservado
- (z) Cards com foto normal (Ematech featured, Tech Software, AGW) **mantiveram layout original** (foto-fundo + gradiente + texto overlay) — else branch do componente. Zero regressão.
- Diff final: 1 arquivo (`Portfolio.jsx`), +73/-11 linhas. Build de produção OK (309 KB gzip).

## Files changed/created (iterations 1 a 3)
- /app/frontend/src/data/mock.js (STATS, CLIENT_LOGOS Giovana/Tech/Ebenezer, REAL_CASES Tech Software)
- /app/frontend/src/components/About.jsx (StatItem invertido + soft-hyphen)
- /app/frontend/src/components/GrowthChart.jsx (tooltip premium, linha grossa, glow, partículas)
- /app/frontend/src/components/Hero.jsx (slug NFD-normalize)
- /app/frontend/public/* (16 arquivos: favicons, logos, OG image, manifest, sitemap, robots, .htaccess, index.html SEO)
- /app/backend/server.py (em-dash → vírgula em comentários; sem mudança lógica)
- /app/backend/Procfile (NOVO)
- /app/backend/main.py (NOVO, fallback ASGI)
- /app/backend/railway.json (NOVO)
- /app/backend/runtime.txt (NOVO)
- /app/backend/.env.example (NOVO, doc das envs Railway)
- /app/Procfile (NOVO, root-level fallback)
- /app/.gitignore (adicionado test_reports/, test_result.md)
- /app/memory/PRD.md (este arquivo)

## Test status
- iteration_1.json: backend 100%, frontend 100% (7/7 pytest passed)
- Preview local: GET /api/health → 200, GET /api/ → 200, POST /api/contact funcional
- `uvicorn main:app` testado localmente → mesma resposta de `uvicorn server:app`

## Backlog / Future enhancements
- P1: Adicionar tracking (GA4 + Meta Pixel) nos cliques do marquee e botão Agendar Reunião
- P2: WhatsApp flutuante com mensagem pré-preenchida + UTM por seção
- P2: Página individual de cases (rota /cases/:id)
- P3: A/B testing entre headline atual e alternativas

## Next actions (handoff)
1. Salvar no GitHub via botão "Save to Github" no chat.
2. **Railway**: garantir que o serviço Backend tenha "Root Directory" = `/backend` (Settings → Source). As envs ADMIN_USERNAME, ADMIN_PASSWORD_HASH, JWT_SECRET, MONGO_URL, DB_NAME, CORS_ORIGINS já estão configuradas pelo usuário, manter. Após push, Railway vai detectar Procfile/railway.json e usar `uvicorn server:app`. Health check em /api/health.
3. **Hostinger**: subir o conteúdo de /app/frontend/build/ (ou trombeta-hostinger-build.zip) para public_html. .htaccess incluído.
4. Tornar repo privado de novo após push.

## Deploy commands (referência rápida)
- Build frontend: `cd /app/frontend && yarn build`
- Test backend local: `cd /app/backend && uvicorn server:app --reload`
- Test fallback: `cd /app/backend && uvicorn main:app --reload`
- Health check: `curl https://api.estudiotrombeta.com/api/health`
