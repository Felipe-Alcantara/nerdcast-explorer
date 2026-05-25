# 🤖 Contexto Operacional — NerdCast Explorer

> Arquivo de memória técnica do projeto para uso por IA.
> Atualizar sempre que houver decisão técnica, mudança de stack, bug resolvido ou milestone atingida.
> Seguir as instruções do template em `felixo-standards/core/IA.md`.

---

## 🎯 OBJETIVO DO PROJETO

[2026-05-25] Acervo não-oficial do NerdCast para complementar o site do Jovem Nerd.
Público: ouvintes do NerdCast, do completista ao iniciante.
Objetivo central: listar episódios com filtros, checklist pessoal, likes, playlists locais e descrição completa — sem substituir o site oficial.
Deploy alvo: GitHub Pages ou Vercel (site estático, zero custo).

---

## 🏁 METAS & MILESTONES

[2026-05-25] ✅ Identidade do projeto definida — nome, descrição, propósito
[2026-05-25] ✅ Estrutura inicial do repositório criada — README, IA.md, pastas
[2026-05-25] ✅ Script `fetch_api.py` — consumir API pública do Jovem Nerd e gerar JSONs
[2026-05-25] ✅ Script `convert_xlsx.py` — converter Excel histórico local para `data/episodes.json`
[2026-05-25] ✅ Frontend — lista completa com filtros e ordenação
[2026-05-25] ✅ Frontend — checklist pessoal via localStorage
[2026-05-25] ✅ Frontend — likes e playlists via localStorage
[2026-05-25] ⬜ Frontend — stats e exploração
[2026-05-25] ⬜ Frontend — guia para iniciantes
[2026-05-25] ⬜ Deploy do site

---

## 🛠️ STACK & DEPENDÊNCIAS

[2026-05-25] Scripts de dados: Python 3.11+
[2026-05-25] Frontend: React 19 + TypeScript + Tailwind CSS 4 (padrão felixo-standards adaptado ao projeto)
[2026-05-25] Build/dev: Vite 8 (padrão felixo-standards adaptado ao projeto)
[2026-05-25] Dados: JSON estático gerado por Python — sem backend, sem banco
[2026-05-25] Checklist: localStorage no browser — sem login, sem servidor
[2026-05-25] Hosting: GitHub Pages ou Vercel (a definir)

Dependências Python a instalar:
- `openpyxl` — leitura do Excel histórico local

---

## 📐 DECISÕES DE ARQUITETURA

[2026-05-25] Site estático com JSON — sem backend nem banco. Justificativa: projeto de fã, custo zero, dados mudam pouco (semanal).
[2026-05-25] `data/episodes.json` como fonte de verdade — gerado por scripts Python, nunca editado manualmente.
[2026-05-25] Checklist no localStorage — sem login. Justificativa: simplicidade > persistência cross-device para v1.
[2026-05-25] Scripts Python separados por responsabilidade: `fetch_api.py` (coleta via API pública), `convert_xlsx.py` (conversão do Excel histórico local).
[2026-05-25] Filtro por convidado derivado de `episodes.json` — evita novo arquivo de índice e mantém contagem sincronizada com os episódios carregados.
[2026-05-25] Playlists pessoais no localStorage (`nerdcast-playlists`) — sem login/backend, alinhado ao checklist local e suficiente para a v1.
[2026-05-25] Likes de episódio no localStorage (`nerdcast-liked`) — estado independente de ouvido, com filtro dedicado para recuperar favoritos.

---

## 🎨 DECISÕES DE DESIGN & CONVENÇÕES

[2026-05-25] Padrão de código: seguir `felixo-standards/core/DESIGN_SYSTEM_FRONTEND.md` e `DESIGN_SYSTEM_BACKEND.md`.
[2026-05-25] Idioma: português no README e nos comentários; inglês no código (variáveis, funções, nomes de arquivo).
[2026-05-25] Commits: Conventional Commits — feat/fix/docs/data/refactor.
[2026-05-25] Nome do repositório: `nerdcast-explorer` (simples, descritivo, fácil de achar).

---

## 🧪 TESTES IMPORTANTES

[2026-05-25] ✅ `npm run lint` — ESLint sem erros no frontend.
[2026-05-25] ✅ `npm run build` — TypeScript + Vite build sem erros.
[2026-05-25] ✅ `npm run lint` — filtro por convidado integrado sem erro de lint.
[2026-05-25] ✅ `npm run build` — build validou tipos do novo filtro por convidado.
[2026-05-25] ✅ `npm run lint` — criador local de playlists sem erro de lint.
[2026-05-25] ✅ `npm run build` — TypeScript + Vite validaram hook, controles e integração das playlists.
[2026-05-25] ✅ `npm run lint` — likes de episódio e filtro "Só curtidos" sem erro de lint.
[2026-05-25] ✅ `npm run build` — TypeScript + Vite validaram hook e integração de likes.
[2026-05-25] ✅ `python -m compileall -q start.py scripts` — scripts Python compilam sem erro de sintaxe.
[2026-05-25] ✅ `npm audit --audit-level=moderate` — nenhuma vulnerabilidade encontrada.

---

## 🐛 BUGS & FIXES RELEVANTES

[2026-05-25] BUG: Cards de episódio exibiam só o teaser curto vindo de `description`.
CAUSA: o endpoint de lista `/jovemnerd/v1/nerdcasts` retorna apenas o resumo; o conteúdo completo fica no WordPress REST `wp/v2/podcast/?slug=...`.
FIX: o frontend busca `content.rendered` sob demanda ao abrir "Ver descricao completa", com cache, sanitizacao de HTML e fallback para o resumo local.

---

## 🔗 INTEGRAÇÕES & SERVIÇOS EXTERNOS

[2026-05-25] Feeds RSS do Jovem Nerd — usados para atualização incremental de episódios.
  Endpoints conhecidos:
  - `https://jovemnerd.com.br/feed/podcast/nerdcast/`
  - `https://jovemnerd.com.br/feed/podcast/nerdtech/`
  - `https://jovemnerd.com.br/feed/podcast/la-do-bunker/`
  Limitação: feeds retornam apenas os últimos ~100 eps por programa.

[2026-05-25] Base histórica: Excel com 1.767 episódios de 20 programas (2006–dez/2024), fornecido pelo usuário.
  Arquivo: `Arquivos Excel/Análise Feed NerdCast.xlsx`

[2026-05-25] WordPress REST do Jovem Nerd — usado no frontend para carregar descricao completa de episodio sob demanda.
  Endpoint: `https://admin.jovemnerd.com.br/wp-json/wp/v2/podcast/?slug={slug}`
  Campo usado: `content.rendered`

---

## 📝 NOTAS GERAIS

[2026-05-25] Projeto inspirado em dois posts do Reddit r/jovemnerd:
  - Post original (perdido) com o Excel histórico de todos os eps até 2024
  - Post com checklist: https://www.reddit.com/r/jovemnerd/comments/1p3abum/checklist_epis%C3%B3dios_do_nerdcast_google_planilhas/

[2026-05-25] O repositório `felixo-standards/` é uma cópia local dos padrões do Felixo System Design.
  Origem: https://github.com/Felipe-Alcantara/Felixo-System-Design
  Não está vinculado ao git do projeto — pode ser atualizado com o script do felixo README.

[2026-05-25] Os Arquivos Excel/ não devem ser commitados diretamente no repositório público — mover para .gitignore após a conversão para JSON.
[2026-05-25] Os Excel originais foram removidos do índice do Git com `git rm --cached` e permanecem locais por `.gitignore`.

---

## 🧠 CHAIN OF THOUGHT

[2026-05-25] CONTEXTO: Decidindo estratégia de dados (API oficial vs RSS vs scraper).
PENSAMENTO: Jovem Nerd não tem API pública documentada.
PENSAMENTO: O site expõe feeds RSS — caminho mais limpo e respeitoso.
PENSAMENTO: Feeds RSS limitados a ~100 eps por programa — insuficiente para histórico completo.
PENSAMENTO: Solução: Excel como base histórica (2006–2024) + RSS para atualização incremental + scraper pontual para gaps.
RESULTADO: Estratégia híbrida. Scripts separados por responsabilidade.

---

> **Assinatura de Origem**
> Baseado no template `felixo-standards/core/IA.md` do repositório **Felixo System Design**.
> Origem: https://github.com/Felipe-Alcantara/Felixo-System-Design
