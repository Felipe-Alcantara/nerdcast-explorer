# 📡 API Pública do Jovem Nerd

> Documentação não-oficial dos endpoints públicos descobertos durante o desenvolvimento do NerdCast Explorer.
>
> Última verificação: **2026-05-25**.

## Resumo executivo

O site jovemnerd.com.br é um WordPress com REST API pública aberta, **sem autenticação**, em duas camadas:

1. **WordPress REST API padrão** (`/wp-json/wp/v2/`) — schema genérico do WP, traz tudo via `_embed=true`.
2. **API customizada do Jovem Nerd** (`/wp-json/jovemnerd/v1/`) — schema enxuto e específico, com campos extras como MP3 URLs, duração e skip de publicidade. **É a melhor opção** para consumir os dados.

Base URL: `https://api.jovemnerd.com.br/wp-json/`

---

## 🎙️ Endpoints — NerdCast (API customizada)

### Listar episódios

```http
GET /jovemnerd/v1/nerdcasts?per_page=100&page=N
```

| Param | Descrição |
|---|---|
| `per_page` | 1–100, padrão 28 |
| `page` | número da página, começa em 1 |

Pagina até retornar lista vazia. **Não retorna headers `X-WP-Total/TotalPages`** (não dá pra saber o total antecipadamente).

Em maio/2026 retornava **2.135 episódios** distribuídos em 17 programas:

| Programa (slug) | Quantidade |
|---|---:|
| `nerdcast` | 1.049 |
| `la-do-bunker` | 220 |
| `caneca-de-mamicas` | 217 |
| `mau-acompanhado` | 144 |
| `nerdtech` | 114 |
| `empreendedor` | 97 |
| `speak-english` | 50 |
| `nerdcash` | 49 |
| `papo-de-parceiro` | 32 |
| `vaitecatar` | 29 |
| `hypezilla` | 25 |
| `nerd-na-cloud` | 24 |
| `extra` | 23 |
| `depois-do-expediente` | 20 |
| `generacast` | 14 |
| `nerdologia` | 10 |
| `jovem-nerd-esporte-clube` | 1 |

### Detalhar episódio

```http
GET /jovemnerd/v1/nerdcasts/{id}
```

### Schema do episódio

```json
{
  "id": 685027,
  "url": "https://admin.jovemnerd.com.br/nerdcast/o-justiceiro-uma-ultima-morte.../",
  "published_at": "2026-05-22T14:25:02-03:00",
  "modified_at": "2026-05-22T14:25:02-03:00",
  "duration": 4579,
  "title": "O Justiceiro Uma Última Morte...",
  "slug": "o-justiceiro-uma-ultima-morte-mas-tinha-que-ser-a-do-cachorro",
  "episode": "1031",
  "product": "nerdcast",
  "product_name": "NerdCast",
  "product_email": "nerdcast@jovemnerd.com.br",
  "friendly_post_type": "NerdCast",
  "friendly_post_type_slug": "nerdcast",
  "friendly_post_time": "190 horas e 17 minutos",
  "subject": "Séries",
  "image": "https://uploads.jovemnerd.com.br/.../nc1031_punisher_especial-760x428.jpg",
  "image_alt": null,
  "audio_high":   "https://nerdcast.jovemnerd.com.br/nerdcast_1031_punisher_last_kill.mp3",
  "audio_medium": "https://nerdcast.jovemnerd.com.br/nerdcast_1031_punisher_last_kill.mp3",
  "audio_low":    "https://nerdcast.jovemnerd.com.br/nerdcast_1031_punisher_last_kill.mp3",
  "audio_zip":    "https://nerdcast.jovemnerd.com.br/nerdcast_1031_punisher_last_kill.mp3",
  "insertions": [],
  "ads": [],
  "description": "<p>Hurrm. Hurrm. HUUUUUUURM!</p>\n",
  "jump-to-time": { "test": "00:08:43", "start-time": 523, "end-time": 1376 },
  "guests": [
    { "id": 1212122462, "name": "Carlos Voltor", "twitter": "carlosvoltor",
      "image": "https://uploads.jovemnerd.com.br/.../carlos_voltor.jpg" }
  ],
  "editor": { "name": "Rádiofobia Podcast e Multimídia", "link": "..." }
}
```

#### Observações sobre os campos

- `audio_*` — todas as variantes (high/medium/low/zip) costumam apontar pro **mesmo MP3** atualmente. Pode mudar com sponsored content.
- `episode` é **string** (`"1031"`), não número. Pode conter sufixo (`"54a"`, `"54b"`).
- `jump-to-time` — quando presente, marca o trecho de publicidade pra pular (`start-time` e `end-time` em segundos).
- `duration` em segundos.
- `guests` — em episódios antigos pode vir como **lista de strings** (só nome solto). Trate os dois formatos.
- `subject` — uma única string (tema único por ep). Lista completa via `/nerdcasts/subjects`.

### Lista de convidados

```http
GET /jovemnerd/v1/nerdcasts/guests
```

Retorna todos os ~627 convidados **em uma única chamada** (não pagina; ignora `per_page`).

```json
[
  {
    "id": 1212136778,
    "name": "Adriano Paciello",
    "twitter": "",
    "image": "https://jovemnerd.com.br/.../adriano-paciello.jpg",
    "friendly_post_type_slug": "podcast_guest"
  }
]
```

### Lista de temas

```http
GET /jovemnerd/v1/nerdcasts/subjects
```

Retorna 44 temas em uma única chamada. Schema simples:

```json
{ "name": "animacao", "verboseName": "Animação" }
```

### Lista de programas (instável)

```http
GET /jovemnerd/v1/nerdcasts/playlists
```

⚠️ **Frequentemente retorna 502 Bad Gateway**. Em maio/2026 estava down nas três tentativas com backoff. Como workaround, agregue a lista a partir dos próprios episódios (`product` + `product_name`).

---

## 📰 Endpoints — Outros conteúdos

### Notícias do NerdBunker
```http
GET /jovemnerd/v1/nerdbunker
GET /jovemnerd/v1/nerdbunker/{id}
GET /jovemnerd/v1/nerdbunker-cat
GET /jovemnerd/v1/nerdbunker/highlights
```

### Videocasts
```http
GET /jovemnerd/v1/videocasts
GET /jovemnerd/v1/videocasts/{id}
GET /jovemnerd/v1/videocasts/products
GET /jovemnerd/v1/videocasts/playlists
```

### MRGs (Mata Rapaz Gourmet)
```http
GET /jovemnerd/v1/mrgs
GET /jovemnerd/v1/mrgs/{id}
```

### Outros endpoints custom
```http
GET /jovemnerd/v1/blogs-e-colunas
GET /jovemnerd/v1/colunas-e-opiniao
GET /jovemnerd/v1/direto-do-bunker
GET /jovemnerd/v1/vaitecatar
GET /jovemnerd/v1/query
GET /jovemnerd/v1/search?term=lost
GET /jovemnerd/v1/author
GET /jovemnerd/v1/get-latest-related-post/{id}
```

---

## 🔧 Endpoints — WordPress REST padrão (alternativa)

Use só se o endpoint custom estiver caído. Schema mais bagunçado, exige `_embed=true` pra trazer dados relacionados.

### Episódios (com tudo embedded)
```http
GET /wp/v2/podcast?per_page=100&page=N&_embed=true
```

Retornava **2.658 episódios** em maio/2026 (~500 a mais que o endpoint custom — pode incluir tipos que não vão pra listagem oficial).

Headers úteis:
- `X-WP-Total` — total de itens
- `X-WP-TotalPages` — total de páginas

Campos relevantes em cada item:
- `id`, `slug`, `link`, `date`
- `title.rendered`, `content.rendered`, `excerpt.rendered`
- `featured_media` (id da imagem destacada)
- `podcast_guest[]`, `podcast_theme[]`, `podcast_product[]`, `news_tag[]` — IDs de taxonomia
- `_embedded.wp:featuredmedia[0].source_url` — URL da imagem
- `_embedded.wp:term[]` — taxonomias expandidas (filtre pelo `taxonomy`)

### Taxonomias diretas
```http
GET /wp/v2/podcast_guest?per_page=100      # 683 itens
GET /wp/v2/podcast_product?per_page=100    # 31 itens
GET /wp/v2/podcast_theme?per_page=100      # 44 itens
GET /wp/v2/news_tag?per_page=100           # 29.965 itens (não vale replicar inteiro)
```

Cada termo tem `acf` com campos custom (ex: `acf.guest_photo`, `acf.guest_twitter`).

### Filtrar episódios por taxonomia
```http
GET /wp/v2/podcast?podcast_theme=123&podcast_guest=456&_embed=true
```

---

## 🖼️ CDN de imagens

Domínio: `https://uploads.jovemnerd.com.br/`

Suporte a **resize dinâmico via query string** (provavelmente Cloudflare Image Resizing ou similar):

```
?ims=408x240/filters:quality(75)
?ims=56x56/filters:quality(75)    # avatar redondo
?ims=1210x544                     # banner widescreen
```

Sufixos `-NxN` no nome do arquivo também são tamanhos pré-gerados pelo WP:
- `-760x428.jpg` — card médio
- `-1210x544.jpg` — banner desktop
- `-3000x3000.jpg` — capa quadrada do podcast (full)

**Hot-linking direto é viável** para o caso de uso de um site de fã (baixo volume, sem reupload). Não requer proxy.

---

## ⚙️ Limites e boas práticas

- Sem rate limit observado, mas seja respeitoso: **delay de 100–300ms** entre requisições em batches grandes.
- Use um `User-Agent` identificável (ex: `nerdcast-explorer/0.1`).
- O endpoint `/playlists` é flaky — sempre trate falha com fallback.
- Cache local: os dados mudam **~semanalmente** (1–2 NerdCasts novos por semana). Não precisa polling agressivo.

---

## 🔍 Como descobri tudo isso

1. Inspecionei o HTML de uma página de listagem (Next.js SSR) — os dados de SSR são entregues via `self.__next_f.push([1, "..."])` mas usam referências `$XX` pra chunks lazy, então não dá pra fazer parse direto.
2. Procurei por padrões `wp-json`, `api.`, `admin.jovemnerd` no HTML — confirmaram que o backend é WordPress.
3. Testei `/wp-json/` no domínio `api.` — retornou o discovery doc do WP REST com **todos os namespaces e rotas**.
4. Achei o namespace custom `jovemnerd/v1` com endpoints especializados que entregam o schema final usado pelo frontend (incluindo MP3, duração, skips).

Discovery endpoint útil:
```http
GET https://api.jovemnerd.com.br/wp-json/
```

Retorna `routes` com todos os endpoints disponíveis e `namespaces` com os módulos.

---

## ❤️ Atribuição

Os dados são propriedade da **Jovem Nerd S/A**. Este projeto é um trabalho de fã não-oficial, sem fins lucrativos, que apenas reorganiza dados publicamente disponíveis para facilitar a navegação por novos ouvintes. Os áudios e imagens originais permanecem no CDN deles e não são re-hospedados.
