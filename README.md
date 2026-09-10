# CicloPago - Site Oficial

Site institucional do **CicloPago** - Gestão Inteligente de Consórcios. Landing page estática com painel administrativo e integração Supabase.

🔗 **Stack:** HTML/CSS/JS puro + Supabase + hospedagem Vercel

## 📁 Estrutura

```
siteciclopago/
├── index.html          # Landing page principal
├── painel.html         # Painel admin (/painel)
├── painel.js / painel.css
├── styles.css / script.js
├── site-config.js      # Config padrão (fallback)
├── apply-config.js     # Aplica config dinâmica no site
├── db.js               # Camada Supabase (site_config + auth)
├── supabase.js         # Credenciais Supabase
├── assets/             # Imagens, vídeo, logo
├── downloads/
│   └── ciclopago.apk   # APK (~47MB)
├── sql/
│   └── setup.sql       # Schema + RLS + dados iniciais
└── vercel.json         # Config Vercel (headers, rewrites)
```

## 🚀 Deploy - Passo a Passo

### 1. Pré-requisitos

- Conta no [GitHub](https://github.com)
- Conta na [Vercel](https://vercel.com) (login com GitHub)
- Git instalado: https://git-scm.com/download/win (selecione "Use Git from command line")

> **Nota:** Pasta atual está em `OneDrive` - funciona, mas se der erro de permissão no `git`, pause sincronização do OneDrive temporariamente ou mova para `C:\projetos\siteciclopago`.

### 2. Conectar ao GitHub

No terminal (PowerShell) dentro da pasta do projeto:

```powershell
# 1. Inicializar repo (se ainda não for)
git init

# 2. Verificar arquivos
git status

# 3. Adicionar todos
git add .

# 4. Commit inicial
git commit -m "feat: site CicloPago v1.0.4 - deploy inicial"

# 5. Criar repositório no GitHub (via site):
#    https://github.com/new
#    Nome: siteciclopago  (ou ciclopago-site)
#    Deixe vazio (sem README/gitignore)
#    NÃO marque private se quiser Vercel gratuito sem config extra (tanto faz)

# 6. Conectar remote (troque SEU_USUARIO)
git remote add origin https://github.com/SEU_USUARIO/siteciclopago.git
git branch -M main
git push -u origin main
```

**APK de 47MB:** GitHub permite até 100MB por arquivo, então o `ciclopago.apk` passa tranquilo. Se no futuro o APK passar de 100MB, use Git LFS ou hospede no Supabase Storage / Releases do GitHub.

### 3. Conectar à Vercel

1. Acesse https://vercel.com/new
2. Clique **Add New... > Project**
3. Selecione **Import Git Repository** > escolha `siteciclopago`
4. Configurações:
   - **Framework Preset:** `Other`
   - **Root Directory:** `./` (padrão)
   - **Build Command:** vazio (sem build)
   - **Output Directory:** `./` (padrão)
   - **Install Command:** vazio
5. Clique **Deploy**

Vercel vai detectar o `vercel.json` automaticamente (headers de cache, rewrite `/painel` → `/painel.html`).

Após deploy:
- URL ficará `https://SEU_PROJETO.vercel.app`
- Todo `git push` na branch `main` gera deploy automático
- Preview deploys para PRs também funcionam

### 4. Configurar Domínio (opcional)

Na Vercel: Project > Settings > Domains > Add Domain > digite `ciclopago.com.br` > siga DNS.

## 🔧 Painel Administrativo

- Acesso: `https://seu-dominio.vercel.app/painel` ou `/painel.html`
- Autenticação via Supabase Auth (email/senha criados em Supabase > Authentication > Users)
- Edita todo o conteúdo do site (hero, features, FAQ, etc.) e salva em `site_config` (JSONB)

Para aplicar: `sql/setup.sql` deve ter sido rodado no Supabase SQL Editor (já contém RLS: leitura pública, escrita só autenticado).

## 🔐 Supabase

Credenciais estão em `supabase.js` (anon key pública - ok para frontend). Se quiser rotacionar:
1. Supabase > Project Settings > API > gere nova anon key
2. Atualize `supabase.js` e faça novo commit/push.

## 📦 Atualizar APK

1. Substitua `downloads/ciclopago.apk`
2. Atualize versão em `site-config.js` (`download.version` / `hero.badge`) ou pelo painel
3. Commit + push → deploy automático

## 🛠️ Desenvolvimento Local

Não precisa build. Só abrir `index.html` no navegador ou usar extensão Live Server (VS Code).

```powershell
# Servidor simples com Python (opcional)
python -m http.server 8000
# abrir http://localhost:8000
```

---

© 2026 CicloPago Consórcios. Todos os direitos reservados.
