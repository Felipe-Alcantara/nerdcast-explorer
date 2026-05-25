# 🤖 Contexto Operacional — NerdCast Explorer

> Arquivo de memória técnica do projeto para uso por IA.
> Atualizar sempre que houver decisão técnica, mudança de stack, bug resolvido ou milestone atingida.
> Seguir as instruções do template em `felixo-standards/core/IA.md`.

---

## 🎯 OBJETIVO DO PROJETO

[2026-05-25] Acervo não-oficial do NerdCast para complementar o site do Jovem Nerd.
Público: ouvintes do NerdCast, do completista ao iniciante.
Objetivo central: listar todos os episódios com filtros, checklist pessoal e stats — sem substituir o site oficial.
Deploy alvo: GitHub Pages ou Vercel (site estático, zero custo).

---

## 🏁 METAS & MILESTONES

[2026-05-25] ✅ Identidade do projeto definida — nome, descrição, propósito
[2026-05-25] ✅ Estrutura inicial do repositório criada — README, IA.md, pastas
[2026-05-25] ⬜ Converter Excel histórico (2006–2024) para `data/episodes.json`
[2026-05-25] ⬜ Script `update_rss.py` — consumir feeds RSS e fazer merge com o JSON
[2026-05-25] ⬜ Script `scrape_all.py` — scraper pontual para gaps históricos
[2026-05-25] ⬜ GitHub Action semanal de atualização de dados
[2026-05-25] ⬜ Frontend — lista completa com filtros e ordenação
[2026-05-25] ⬜ Frontend — checklist pessoal via localStorage
[2026-05-25] ⬜ Frontend — stats e exploração
[2026-05-25] ⬜ Frontend — guia para iniciantes
[2026-05-25] ⬜ Deploy do site

---

## 🛠️ STACK & DEPENDÊNCIAS

[2026-05-25] Scripts de dados: Python 3.11+
[2026-05-25] Frontend: React 18 + TypeScript + Tailwind CSS (padrão felixo-standards)
[2026-05-25] Build/dev: Vite (padrão felixo-standards)
[2026-05-25] Dados: JSON estático gerado por Python — sem backend, sem banco
[2026-05-25] Checklist: localStorage no browser — sem login, sem servidor
[2026-05-25] Automação: GitHub Actions (schedule semanal)
[2026-05-25] Hosting: GitHub Pages ou Vercel (a definir)

Dependências Python a instalar:
- `openpyxl` ou `pandas` — leitura do Excel
- `feedparser` ou `requests` + `xml.etree` — consumo dos feeds RSS
- `beautifulsoup4` + `requests` — scraper pontual (opcional)

---

## 📐 DECISÕES DE ARQUITETURA

[2026-05-25] Site estático com JSON — sem backend nem banco. Justificativa: projeto de fã, custo zero, dados mudam pouco (semanal).
[2026-05-25] `data/episodes.json` como fonte de verdade — gerado por scripts Python, nunca editado manualmente.
[2026-05-25] Checklist no localStorage — sem login. Justificativa: simplicidade > persistência cross-device para v1.
[2026-05-25] Scripts Python separados por responsabilidade: `convert_xlsx.py` (one-shot histórico), `update_rss.py` (recorrente), `scrape_all.py` (pontual).
[2026-05-25] GitHub Actions para atualização automática — roda `update_rss.py` semanalmente e faz commit/PR automático se houver novos eps.

---

## 🎨 DECISÕES DE DESIGN & CONVENÇÕES

[2026-05-25] Padrão de código: seguir `felixo-standards/core/DESIGN_SYSTEM_FRONTEND.md` e `DESIGN_SYSTEM_BACKEND.md`.
[2026-05-25] Idioma: português no README e nos comentários; inglês no código (variáveis, funções, nomes de arquivo).
[2026-05-25] Commits: Conventional Commits — feat/fix/docs/data/refactor.
[2026-05-25] Nome do repositório: `nerdcast-explorer` (simples, descritivo, fácil de achar).

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

---

## 📝 NOTAS GERAIS

[2026-05-25] Projeto inspirado em dois posts do Reddit r/jovemnerd:
  - Post original (perdido) com o Excel histórico de todos os eps até 2024
  - Post com checklist: https://www.reddit.com/r/jovemnerd/comments/1p3abum/checklist_epis%C3%B3dios_do_nerdcast_google_planilhas/

[2026-05-25] O repositório `felixo-standards/` é uma cópia local dos padrões do Felixo System Design.
  Origem: https://github.com/Felipe-Alcantara/Felixo-System-Design
  Não está vinculado ao git do projeto — pode ser atualizado com o script do felixo README.

[2026-05-25] Os Arquivos Excel/ não devem ser commitados diretamente no repositório público — mover para .gitignore após a conversão para JSON.

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
