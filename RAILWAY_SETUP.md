# Configuração Railway, Trombeta Backend

Guia rápido para configurar o backend (`api.estudiotrombeta.com`) no Railway.

## Pré-requisitos

- Serviço **Backend** já criado e conectado ao repo `Guimixestudos/estudiotrombeta`.
- Plugin **MongoDB** já provisionado (`mongodb-volume` no print).

---

## 1. Settings do serviço (uma vez só)

No painel `fulfilling-perception` > Backend > **Settings**:

| Campo | Valor |
| --- | --- |
| **Root Directory** | `/backend` |
| **Build Command** | (vazio, deixe o Nixpacks detectar) |
| **Start Command** | `uvicorn server:app --host 0.0.0.0 --port $PORT` |
| **Healthcheck Path** | `/api/health` |
| **Restart Policy** | `On Failure` (max 10 retries) |

> Esses valores tambem estão no arquivo `backend/railway.json`, mas o Railway às vezes ignora se a UI tiver algum override manual. Confira na UI.

---

## 2. Variables (obrigatórias)

Vá em **Variables > Raw Editor** e cole:

```
# Mongo (obrigatório). Se está usando o plugin Mongo do Railway,
# clique em "Add Reference" e selecione MONGO_URL do mongodb-volume.
MONGO_URL=${{ mongodb-volume.MONGO_URL }}
DB_NAME=trombeta

# CORS (obrigatório). Domínios autorizados a chamar a API.
CORS_ORIGINS=https://estudiotrombeta.com,https://www.estudiotrombeta.com
CORS_ORIGIN_REGEX=^https://.*\.preview\.emergentagent\.com$

# Admin / JWT (obrigatório para o painel /admin)
ADMIN_USERNAME=guilherme
ADMIN_PASSWORD_HASH=$2b$12$COLE_AQUI_O_HASH_GERADO_PELO_SCRIPT
JWT_SECRET=COLE_AQUI_UMA_STRING_ALEATORIA_LONGA
JWT_EXPIRE_HOURS=12

# Brute force (opcionais , defaults seguros)
LOGIN_MAX_ATTEMPTS=5
LOGIN_LOCKOUT_MINUTES=15
CONTACT_RATE_LIMIT=3/minute
```

### Como gerar `ADMIN_PASSWORD_HASH` e `JWT_SECRET`

No SEU computador (NUNCA no chat público):

```bash
cd backend
pip install bcrypt==4.1.2
python scripts/gen_admin_hash.py
```

O script pede usuário + senha, gera o hash bcrypt + um JWT_SECRET aleatório e imprime o bloco pronto para colar no Railway.

---

## 3. Cuidados com o caractere `$` no hash bcrypt

O hash sempre começa com `$2b$12$...`. O Railway PRECISA receber esses `$` literais. Use o **Raw Editor** (e não a interface chave-por-chave), porque ele preserva o conteúdo bruto.

**Como conferir que ficou certo:**
1. Salve as variáveis.
2. Veja o hash na UI: deve aparecer com 3 cifrões: `$2b$12$....` (mascarado mas com o início visível).
3. Se ficou `$2b12...` ou `2b$12...`, sumiu um cifrão e o hash está quebrado, cole de novo.

---

## 4. Verificar deploy

Depois de salvar Variables, o Railway redeployapor sozinho (30s a 2min).

```bash
# Healthcheck (deve retornar {"status":"ok",...})
curl https://api.estudiotrombeta.com/api/health

# Tentar login (substitua USERNAME/PASSWORD pelos seus reais)
curl -X POST https://api.estudiotrombeta.com/api/admin/login \
     -H "Content-Type: application/json" \
     -d '{"username":"USERNAME","password":"PASSWORD"}'
```

Resposta esperada do login com credenciais corretas:
```json
{"access_token":"eyJ...","token_type":"bearer","expires_in":43200}
```

Se ainda receber `{"detail":"Admin não configurado"}`:
- ADMIN_PASSWORD_HASH está vazio ou corrompido. Volte ao passo 2.

Se receber `{"detail":"Credenciais inválidas"}`:
- Hash OK, mas usuário ou senha estão errados. Rode o script de novo
  e cole exatamente como ele sugeriu.

---

## 5. Como ver os logs

`fulfilling-perception > Backend > Deployments > View logs`

Procure por `Application startup complete` e `Uvicorn running on http://0.0.0.0:8080`. Erros de import (tipo "Could not import module main") indicam que o Start Command não foi atualizado, refaça o passo 1.

---

## 6. Variáveis "ghost", limpeza

Se você experimentou várias vezes, o Railway pode ter variáveis antigas como `ADMIN_PASSWORD` (em texto plano) deixadas no painel. Apague tudo que NÃO está na lista da seção 2. O serviço só usa o que está documentado no `server.py`.
