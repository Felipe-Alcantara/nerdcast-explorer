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
[2026-05-25] ✅ Frontend — comentários locais por episódio via localStorage
[2026-05-25] ✅ Qualidade — frontend modularizado em hooks, componentes focados e utilitários testáveis
[2026-05-25] ✅ Qualidade — Vitest cobrindo sanitização, playlists, formatação e filtros críticos
[2026-05-28] ✅ Frontend — compartilhamento de playlists via URL (`#share=`), arquivo JSON e código copiável
[2026-05-28] ✅ Frontend — resolução de conflitos na importação de playlists (substituir, mesclar, duplicar, pular)
[2026-05-28] ✅ Frontend — FilterStats (ouvidos, curtidos, barra de progresso) visível no mobile e no drawer de filtros
[2026-05-28] ✅ Frontend — filtros sempre visíveis (removido drawer fullscreen mobile)
[2026-05-28] ✅ Frontend — export/import de backup completo (ouvidos, curtidos, anotações, playlists) via `DataBackupDialog`
[2026-05-28] ✅ Fix — `start.py` detecta e usa o `npm` co-localizado com o `node` encontrado no PATH, evitando mismatch de versão (Node 18 vs Node 25)
[2026-05-28] ✅ Deploy — produção ativa em https://nerdcast.felixo.com.br via Railway com auto-deploy do `main`
[2026-05-28] ⬜ Frontend — stats e exploração
[2026-05-28] ⬜ Frontend — guia para iniciantes

---

## 🛠️ STACK & DEPENDÊNCIAS

[2026-05-25] Scripts de dados: Python 3.11+
[2026-05-25] Frontend: React 19 + TypeScript + Tailwind CSS 4 (padrão felixo-standards adaptado ao projeto)
[2026-05-25] Build/dev: Vite 8 (padrão felixo-standards adaptado ao projeto)
[2026-05-25] Testes frontend: Vitest + jsdom
[2026-05-25] Dados: JSON estático gerado por Python — sem backend, sem banco
[2026-05-25] Checklist: localStorage no browser — sem login, sem servidor
[2026-05-25] Hosting: GitHub Pages ou Vercel (a definir)
[2026-05-28] Hosting: Railway com Dockerfile — auto-deploy via push no `main`. Deploy ativo em https://nerdcast.felixo.com.br

Dependências Python a instalar:
- `openpyxl` — leitura do Excel histórico local

---

## 📐 DECISÕES DE ARQUITETURA

[2026-05-25] Site estático com JSON — sem backend nem banco. Justificativa: projeto de fã, custo zero, dados mudam pouco (semanal).
[2026-05-25] `data/episodes.json` como fonte de verdade — gerado por scripts Python, nunca editado manualmente.
[2026-05-25] Checklist no localStorage — sem login. Justificativa: simplicidade > persistência cross-device para v1.
[2026-05-25] Scripts Python separados por responsabilidade: `fetch_api.py` (coleta via API pública), `convert_xlsx.py` (conversão do Excel histórico local).
[2026-05-25] `start.py` usa `fetch_api.py` como bootstrap de dados atuais quando JSONs obrigatórios faltam e sincroniza `data/*.json` para `site/public/`.
[2026-05-25] Filtro por convidado derivado de `episodes.json` — evita novo arquivo de índice e mantém contagem sincronizada com os episódios carregados.
[2026-05-25] Playlists pessoais no localStorage (`nerdcast-playlists`) — sem login/backend, alinhado ao checklist local e suficiente para a v1.
[2026-05-25] Likes de episódio no localStorage (`nerdcast-liked`) — estado independente de ouvido, com filtro dedicado para recuperar favoritos.
[2026-05-25] Comentários por episódio no localStorage (`nerdcast-episode-comments`) — anotações privadas do usuário para marcações e momentos engraçados, sem backend e sem sincronização.
[2026-05-25] `App.tsx` atua como orquestrador; carregamento de dados e filtros ficam em hooks (`useEpisodeData`, `useEpisodeFilters`).
[2026-05-25] Componentes grandes foram divididos por responsabilidade: cards, descrição, metadados, ações rápidas, filtros, stats e playlists.
[2026-05-25] Regras puras de filtro, formatação, sanitização e normalização de playlists ficam em `utils/` ou hooks exportáveis com testes dedicados.
[2026-05-25] Build Vite usa `base: './'` e fetch de JSONs via `import.meta.env.BASE_URL` para funcionar em subpastas como GitHub Pages.
[2026-05-25] Utilitário `cx` incorporado do `felixo-standards/guias/frontend/GUIA-COMPONENTES-UI-COMPOSTOS.md` para classes condicionais sem dependência externa.
[2026-05-25] Utilitários de storage centralizam o padrão Felixo de localStorage com fallback silencioso para checklist, likes e playlists.
[2026-05-28] Compartilhamento de playlists via `utils/playlistShare.ts` — serialização em Base64 comprimida, lida automaticamente pelo `App.tsx` na abertura via URL `#share=...`.
[2026-05-28] Backup completo em `utils/dataBackup.ts` — exporta/importa as 4 chaves do localStorage (`nerdcast-watched`, `nerdcast-liked`, `nerdcast-episode-comments`, `nerdcast-playlists`) em arquivo JSON versionado. Importação pede confirmação antes de sobrescrever e recarrega a página após sucesso.
[2026-05-28] FilterBar simplificado — removido o drawer fullscreen mobile. Todos os filtros ficam sempre visíveis em coluna, sem estado de abertura/fechamento.
[2026-05-28] FilterStats exibido no mobile diretamente na barra de filtros (sempre visível), alinhado ao comportamento já existente no desktop.
[2026-05-28] `start.py` corrigido para usar o `npm` do mesmo diretório do `node` encontrado via `shutil.which`, evitando que o npm do sistema instale bindings nativos para uma versão diferente de Node.

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
[2026-05-25] ✅ `npm run test` — Vitest validou sanitização HTML, normalização de playlists, formatação e filtros de episódios.
[2026-05-25] ✅ `npm run test` — Vitest validou `cx` e helpers de storage local.
[2026-05-25] ✅ `python -m compileall -q start.py scripts` — scripts Python compilam sem erro de sintaxe.
[2026-05-25] ✅ `npm audit --audit-level=moderate` — nenhuma vulnerabilidade encontrada.
[2026-05-25] ✅ Vitest cobre normalização de comentários locais por episódio.
[2026-05-28] ✅ `tsc --noEmit` — sem erros de tipo após adição de `DataBackupDialog` e `PlaylistShareDialog`.
[2026-05-28] ✅ Vitest cobre `playlistShare.ts` (serialização/desserialização do `#share=` URL).

---

## 🐛 BUGS & FIXES RELEVANTES

[2026-05-28] BUG: `npm install` instalava bindings nativos do `rolldown` para Node 18 (sistema), mas o `start.py` rodava com Node 25 (nvm) — resultado: erro "Cannot find native binding" ao iniciar o Vite.
CAUSA: `start.py` chamava `npm` do PATH padrão, que resolvia para o npm do Node 18, enquanto o `node` resolvido pelo shell era o Node 25 do nvm.
FIX: `start.py` agora usa `shutil.which("node")` para localizar o binário do Node, e deriva o `npm` do mesmo diretório (`Path(node).parent / "npm"`), garantindo versões compatíveis.

[2026-05-25] BUG: Cards de episódio exibiam só o teaser curto vindo de `description`.
CAUSA: o endpoint de lista `/jovemnerd/v1/nerdcasts` retorna apenas o resumo; o conteúdo completo fica no WordPress REST `wp/v2/podcast/?slug=...`.
FIX: o frontend busca `content.rendered` sob demanda ao abrir "Ver descricao completa", com cache, sanitizacao de HTML e fallback para o resumo local.

---

## 🔗 INTEGRAÇÕES & SERVIÇOS EXTERNOS

[2026-05-25] API custom do Jovem Nerd — fonte atual para geração dos JSONs estáticos.
  Base: `https://api.jovemnerd.com.br/wp-json/jovemnerd/v1`
  Script: `scripts/fetch_api.py`
  Saída: `data/episodes.json`, `data/guests.json`, `data/themes.json`, `data/programs.json`

[2026-05-25] Feeds RSS do Jovem Nerd — avaliados como fallback/descoberta, mas não são o fluxo atual.
  Limitação: retornam apenas os últimos ~100 eps por programa.

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

[2026-05-25] CONTEXTO: Estratégia de dados.
RESUMO: RSS foi avaliado e descartado como fonte principal por limite de histórico. A API custom do Jovem Nerd cobre o acervo com schema mais próximo do frontend.
RESULTADO: `fetch_api.py` é o fluxo atual para dados completos; `convert_xlsx.py` permanece como ferramenta legada para os arquivos Excel locais.

[2026-05-25] CONTEXTO: Alinhamento Felixo-Standards.
RESUMO: O audit apontou documentação desatualizada, arquivos Excel versionados, componentes grandes e baixa cobertura de testes.
RESULTADO: Documentação realinhada, Excel removido do índice do Git, frontend modularizado e regras críticas cobertas por Vitest.

[2026-05-28] CONTEXTO: Persistência e portabilidade dos dados do usuário.
ALTERNATIVAS: (a) sync via conta/servidor; (b) export/import manual de JSON; (c) compartilhamento apenas de playlists via URL.
DECISÃO: Export/import de backup completo em JSON (`dataBackup.ts`) + compartilhamento de playlists via URL Base64 (`playlistShare.ts`). Mantém zero backend e zero login.
VALIDAÇÃO: `tsc --noEmit` sem erros; importação com confirmação antes de sobrescrever dados existentes; reload automático após importar para refletir estado novo.

---

> **Assinatura de Origem**
> Baseado no template `felixo-standards/core/IA.md` do repositório **Felixo System Design**.
> Origem: https://github.com/Felipe-Alcantara/Felixo-System-Design
