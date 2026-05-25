# 🎙️ NerdCast Explorer

<div align="center">

![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Acervo não-oficial do NerdCast — explore, filtre e acompanhe todos os episódios desde 2006.**

[🎯 Sobre o Projeto](#-sobre-o-projeto) • [🚀 Features](#-features) • [📁 Estrutura](#-estrutura-do-projeto) • [🤝 Contribuir](#-contribuições)

</div>

---

O Jovem Nerd existe desde 2006 e o NerdCast é um dos podcasts mais antigos e queridos do Brasil — com mais de 2.000 episódios espalhados por dezenas de programas diferentes. Mas o site oficial não acompanhou o crescimento do acervo: sem filtros avançados, sem ordenação flexível, sem como ver todos os episódios de uma vez. O **NerdCast Explorer** nasceu pra resolver isso.

## 📋 Índice

- [🎯 **Sobre o Projeto**](#-sobre-o-projeto) ⭐ **DESTAQUE**
- [🚀 Features](#-features)
- [📁 Estrutura do Projeto](#-estrutura-do-projeto)
- [🎯 Como Usar](#-como-usar)
- [⚠️ Limitações](#️-limitações)
- [📝 Licença](#-licença)
- [👤 Autor](#-autor)
- [🤝 Contribuições](#-contribuições)

---

## 🎯 Sobre o Projeto ⭐

Quem chega hoje no site do Jovem Nerd pela primeira vez se depara com uma experiência que não acompanhou o crescimento do acervo. Não há filtros avançados, não é possível ordenar do jeito que você quer, e muito menos acompanhar o próprio progresso de escuta. Para o nerd completista que quer zerar o backlog, isso é frustrante.

O **NerdCast Explorer** é um acervo não-oficial, construído por fãs para fãs, com o único objetivo de tornar esse universo de conteúdo mais navegável — sem substituir o site do Jovem Nerd, mas complementando o que ele não oferece.

### ✨ **O que você encontra aqui:**

- 🎙️ **Todos os episódios desde abril de 2006** — NerdCast, Lá do Bunker, NerdTech, e mais
- 🔍 **Filtros e ordenação livres** — por programa, ano, tema, número do ep
- ✅ **Checklist pessoal** — marque o que já ouviu, sem cadastro, salvo no browser
- 📊 **Stats e exploração** — gráficos, rankings, linha do tempo
- 🗺️ **Guia para iniciantes** — episódios clássicos, por onde começar
- 🔄 **Dados atualizados automaticamente** — via feeds RSS com GitHub Actions

---

## 🚀 Features

### 🔍 Lista Completa (`site/`)

**Lista de todos os episódios com:**
- Busca por título
- Filtro por programa (NerdCast, Lá do Bunker, NerdTech…)
- Filtro por ano / intervalo de datas
- Ordenação: mais recente, mais antigo, número do ep
- Modo compacto ou cards
- Sem paginação forçada — carrega tudo de uma vez

📖 [Ver documentação do site](site/README.md)

---

### ✅ Checklist Pessoal (`site/`)

**Acompanhe seu progresso:**
- Marcar eps como ouvidos (salvo em `localStorage`, sem cadastro)
- Progresso por programa: "você ouviu 312 de 962 NerdCasts"
- Filtro "só os que faltam"
- Exportar progresso em JSON ou CSV

---

### 📊 Stats & Exploração (`site/`)

**Visualize o acervo:**
- Episódios por ano (gráfico)
- Linha do tempo interativa
- Ranking de temas mais frequentes

---

### 🗺️ Guia para Iniciantes (`site/`)

**Para quem está chegando agora:**
- Curadoria de episódios clássicos marcados com ⭐
- Agrupamento por tema (RPG, Star Wars, História, Tecnologia…)
- Sugestão de ordem para quem quer zerar o backlog

---

### 🗄️ Pipeline de Dados (`scripts/`)

**`convert_xlsx.py`**
- Converte o Excel histórico (2006–2024) para `episodes.json`
- Normaliza campos, limpa dados e deduplica entradas

**`update_rss.py`**
- Consome os feeds RSS do Jovem Nerd
- Faz merge com o JSON existente sem duplicar episódios
- Executado semanalmente via GitHub Actions

**`scrape_all.py`**
- Scraper pontual para preencher gaps históricos
- Usado apenas para varredura inicial ou períodos sem feed

---

## 📁 Estrutura do Projeto

```
nerdcast-explorer/
│
├── 📁 data/                   # Fonte de verdade — gerada, não editada manualmente
│   └── episodes.json          # Todos os episódios desde 2006
│
├── 📁 scripts/                # Scripts Python de coleta e atualização
│   ├── convert_xlsx.py        # Converte o Excel histórico para JSON
│   ├── update_rss.py          # Atualiza via feeds RSS (rodado pelo CI)
│   └── scrape_all.py          # Scraper pontual para gaps históricos
│
├── 📁 site/                   # Frontend React + TypeScript + Tailwind
│   ├── 📁 src/
│   │   ├── 📁 components/     # EpisodeList, Filters, Checklist, Stats
│   │   ├── 📁 pages/          # Páginas da aplicação
│   │   └── 📁 data/           # Hook de acesso ao episodes.json
│   └── README.md
│
├── 📁 .github/
│   └── 📁 workflows/
│       └── update-data.yml    # GitHub Action semanal de atualização
│
├── IA.md                      # Contexto técnico do projeto para IA
├── README.md                  # Este arquivo
└── LICENSE
```

---

## 🎯 Como Usar

### Para acessar o site

> Em breve — o site será hospedado via GitHub Pages ou Vercel.

### Para rodar localmente

#### Pré-requisitos

- Python 3.11+
- Node.js 20+

#### Instalação

```bash
# Clone o repositório
git clone https://github.com/Felipe-Alcantara/nerdcast-explorer.git

# Entre na pasta
cd nerdcast-explorer
```

#### Gerando os dados

```bash
# Instale as dependências Python
pip install -r scripts/requirements.txt

# Converta o Excel histórico para JSON
python scripts/convert_xlsx.py

# Atualize com os feeds RSS mais recentes
python scripts/update_rss.py
```

#### Rodando o site

```bash
# Entre na pasta do site
cd site

# Instale as dependências
npm install

# Rode em modo desenvolvimento
npm run dev
```

---

## ⚠️ Limitações

- **Projeto não-oficial**: não tem vínculo com o Jovem Nerd ou a Jovem Nerd S/A
- **Dados históricos**: o Excel base cobre até dezembro de 2024 — gaps podem existir
- **RSS limitado**: feeds RSS do site oficial retornam apenas os últimos ~100 eps por programa
- **Checklist local**: o progresso fica salvo no browser — não sincroniza entre dispositivos

---

## 📝 Licença

Este projeto está sob a licença MIT — veja o arquivo `LICENSE`.

---

## 👤 Autor

**Felipe Martin**
- GitHub: [@Felipe-Alcantara](https://github.com/Felipe-Alcantara)
- Repositório: [nerdcast-explorer](https://github.com/Felipe-Alcantara/nerdcast-explorer)

---

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para:
- Reportar episódios faltando ou com dados errados
- Sugerir novas funcionalidades
- Melhorar scripts de coleta
- Contribuir com o frontend

---

⭐ Se este projeto foi útil, considere dar uma estrela no GitHub!
