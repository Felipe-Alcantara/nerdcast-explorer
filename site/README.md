# NerdCast Explorer Site

Frontend do NerdCast Explorer, construído com React 19, TypeScript, Tailwind CSS 4 e Vite.

## Funcionalidades

- Lista episódios a partir de JSONs estáticos em `public/`.
- Busca por título e convidados.
- Filtros por programa, tema, convidado, período, não ouvidos, curtidos e playlist.
- Checklist de ouvidos via `localStorage`.
- Likes via `localStorage`.
- Playlists pessoais via `localStorage`.
- Descrição completa sob demanda pelo WordPress REST do Jovem Nerd.

## Estrutura

```text
src/
├── components/      # UI da aplicação
├── hooks/           # Estados locais persistidos
├── utils/           # Fetch externo, storage, classnames, filtros e sanitização
├── App.tsx          # Orquestração principal
├── index.css        # Estilos globais
└── types.ts         # Contratos de dados
```

## Scripts

```bash
npm run dev      # servidor local Vite
npm run lint     # ESLint
npm run test     # Vitest
npm run build    # TypeScript + build de produção
npm run preview  # preview do build
```

## Dados

O site espera estes arquivos em `public/`:

- `episodes.json`
- `programs.json`
- `themes.json`

Eles podem ser atualizados a partir da raiz do projeto com:

```bash
python scripts/fetch_api.py
Copy-Item data/*.json site/public/
```

O build usa caminhos relativos (`base: './'`) para funcionar tanto na raiz de um domínio quanto em subpastas como GitHub Pages.

## Qualidade

Antes de entregar alterações no frontend, rode:

```bash
npm run lint
npm run test
npm run build
```
