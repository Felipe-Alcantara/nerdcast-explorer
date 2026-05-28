# 🎙️ NerdCast Explorer

<div align="center">

![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Acervo não-oficial do NerdCast para explorar, filtrar, favoritar e organizar episódios.**

[Demo ao vivo](https://nerdcast.felixo.com.br) • [Sobre](#sobre-o-projeto) • [Funcionalidades](#funcionalidades) • [Estrutura](#estrutura-do-projeto) • [Como Usar](#como-usar)

</div>

---

## Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Como Usar](#como-usar)
- [Dados e Integrações](#dados-e-integrações)
- [Deploy](#deploy)
- [Limitações](#limitações)
- [Licença](#licença)
- [Autor](#autor)

---

## Sobre o Projeto

O **NerdCast Explorer** é um site estático, não-oficial, feito para complementar a navegação pelo acervo público do Jovem Nerd. O objetivo é oferecer filtros, checklist pessoal, likes, playlists locais, comentários por episódio e descrição completa dos episódios sem re-hospedar áudios ou imagens.

Os dados principais ficam em JSON estático dentro de `data/` e `site/public/`. Estados pessoais ficam apenas no navegador via `localStorage`.

---

## Funcionalidades

### Site React (`site/`)

- Busca por título e convidado.
- Filtros por programa, tema, convidado, período, não ouvidos, curtidos e playlist.
- Ordenação por data, do mais recente ou mais antigo.
- Checklist local de episódios ouvidos.
- Likes locais para marcar favoritos.
- Playlists pessoais salvas no navegador, com exportação e importação para compartilhar entre usuários (arquivo JSON, código copiável ou link `#share=...` com auto-detecção).
- Resolução manual de conflitos na importação (substituir, mesclar, criar nova ou pular por item).
- Comentários locais por episódio para anotar marcações e momentos engraçados.
- Descrição completa carregada sob demanda pelo WordPress REST do Jovem Nerd.
- Carregamento incremental da lista com botão "Carregar mais".

### Scripts de Dados (`scripts/`)

**`fetch_api.py`**
- Baixa episódios, convidados, temas e programas via API pública do Jovem Nerd.
- Normaliza o schema usado pelo frontend.
- Gera `episodes.json`, `guests.json`, `themes.json` e `programs.json` em `data/`.

**`convert_xlsx.py`**
- Converte o Excel histórico local para `data/episodes.json`.
- É mantido como ferramenta auxiliar para quem tem os arquivos originais.
- Os Excel originais ficam ignorados pelo Git e não devem ser versionados.

**`start.py`**
- Verifica Node.js.
- Instala `openpyxl` se necessário.
- Gera dados pela API quando os JSONs obrigatórios ainda não existem.
- Sincroniza `data/*.json` para `site/public/`.
- Instala dependências npm do site e inicia o Vite.

---

## Estrutura do Projeto

```text
nerdcast-explorer/
├── data/                  # JSONs gerados para consumo do site
├── docs/                  # Documentação técnica de integrações
├── scripts/               # Scripts Python de coleta/conversão
├── site/                  # Frontend React + TypeScript + Tailwind
│   ├── public/            # JSONs e assets servidos pelo Vite
│   └── src/
│       ├── components/    # Componentes de UI da aplicação
│       ├── hooks/         # Estado local persistido
│       └── utils/         # Integrações, sanitização e share de playlists
├── Dockerfile             # Build do site servido em produção
├── railway.json           # Configuração de deploy na Railway
├── IA.md                  # Contexto operacional para IA
├── README.md              # Este arquivo
└── start.py               # Setup e dev server local
```

---

## Como Usar

### Opção rápida

```bash
# Instala dependências necessárias e inicia o site
python start.py
```

### Rodando manualmente

```bash
# Instale dependências Python para conversão do Excel, se necessário
pip install -r scripts/requirements.txt

# Atualize os JSONs pela API pública do Jovem Nerd
python scripts/fetch_api.py

# Copie os dados atualizados para o site, se necessário
Copy-Item data/*.json site/public/

# Instale e rode o frontend
cd site
npm install
npm run dev
```

### Validação

```bash
cd site
npm run lint
npm run test
npm run build
npm audit --audit-level=moderate
```

```bash
python -m compileall -q start.py scripts
```

---

## Dados e Integrações

- API custom do Jovem Nerd: `https://api.jovemnerd.com.br/wp-json/jovemnerd/v1`
- WordPress REST para descrição completa: `https://admin.jovemnerd.com.br/wp-json/wp/v2/podcast/?slug={slug}`
- Áudios e imagens continuam hospedados nos domínios oficiais do Jovem Nerd.
- Documentação não-oficial: [docs/JOVEM_NERD_API.md](docs/JOVEM_NERD_API.md)

---

## Deploy

- Produção: <https://nerdcast.felixo.com.br>
- Hospedagem: Railway com auto-deploy a partir do `main`.
- Build: `Dockerfile` na raiz constrói o frontend e serve os assets estáticos.
- Configuração do deploy: [railway.json](railway.json).

---

## Limitações

- Projeto não-oficial, sem vínculo com Jovem Nerd ou Jovem Nerd S/A.
- Checklist, likes e comentários ficam no navegador e não sincronizam automaticamente entre dispositivos.
- Playlists não sincronizam automaticamente, mas podem ser exportadas e importadas manualmente.
- A descrição completa depende de chamada externa ao WordPress REST no primeiro carregamento.

---

## Licença

Este projeto está sob a licença MIT. Veja [LICENSE](LICENSE).

---

## Autor

**Felipe Martin**

- GitHub: [@Felipe-Alcantara](https://github.com/Felipe-Alcantara)
- Repositório: [nerdcast-explorer](https://github.com/Felipe-Alcantara/nerdcast-explorer)

---

## Contribuições

Contribuições são bem-vindas para corrigir dados, melhorar filtros, evoluir a interface ou reforçar a cobertura de testes.

---

⭐ Se o projeto foi útil, considere deixar uma estrela no GitHub!
