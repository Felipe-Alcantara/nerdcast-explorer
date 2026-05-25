"""
Baixa todos os episodios, convidados, temas e programas via API custom do
Jovem Nerd.

Endpoints (todos publicos, sem auth):
- /jovemnerd/v1/nerdcasts             -> episodios (paginado)
- /jovemnerd/v1/nerdcasts/guests      -> convidados
- /jovemnerd/v1/nerdcasts/subjects    -> temas
- /jovemnerd/v1/nerdcasts/playlists   -> programas (NerdCast, La do Bunker...)

Saida (data/):
- episodes.json   substitui o atual
- guests.json
- themes.json
- programs.json
"""

import html
import json
import time
import urllib.error
import urllib.request
from pathlib import Path

API = "https://api.jovemnerd.com.br/wp-json/jovemnerd/v1"
HEADERS = {"User-Agent": "nerdcast-explorer/0.1"}
DATA_DIR = Path(__file__).parent.parent / "data"
PER_PAGE = 100
SLEEP_BETWEEN = 0.15


def fetch_json(url: str):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read())


def fetch_paginated(endpoint: str) -> list:
    """Busca por paginas ate retornar vazio. So funciona pra /nerdcasts."""
    items: list = []
    page = 1
    while True:
        url = f"{API}/{endpoint}?per_page={PER_PAGE}&page={page}"
        try:
            batch = fetch_json(url)
        except urllib.error.HTTPError as e:
            if e.code in (400, 404):
                break
            raise
        if not batch:
            break
        items.extend(batch)
        print(f"  {endpoint} pagina {page} ({len(batch)} itens, total acumulado: {len(items)})")
        if len(batch) < PER_PAGE:
            break
        page += 1
        time.sleep(SLEEP_BETWEEN)
    return items


def fetch_single(endpoint: str, retries: int = 3) -> list:
    """Endpoints como guests/subjects/playlists retornam tudo em uma chamada."""
    url = f"{API}/{endpoint}"
    for attempt in range(retries):
        try:
            return fetch_json(url)
        except urllib.error.HTTPError as e:
            print(f"  tentativa {attempt+1}: HTTP {e.code} em {endpoint}")
            if attempt == retries - 1:
                raise
            time.sleep(1.5 * (attempt + 1))
    return []


def clean_text(t) -> str:
    if not t:
        return ""
    return html.unescape(str(t)).strip()


_GUEST_LOOKUP: dict[str, dict] = {}


def set_guest_lookup(guests: list) -> None:
    """Indexa guests globais por nome normalizado para enriquecer episodios."""
    _GUEST_LOOKUP.clear()
    for g in guests:
        name = (g.get("name") or "").strip().lower()
        if name:
            _GUEST_LOOKUP[name] = g


def enrich_guest(name: str) -> dict:
    """Procura nome no lookup global e retorna registro completo."""
    key = name.strip().lower()
    hit = _GUEST_LOOKUP.get(key)
    if hit:
        return {
            "id": hit.get("id"),
            "name": hit.get("name") or name,
            "twitter": hit.get("twitter") or "",
            "photo": hit.get("photo") or "",
        }
    return {"id": None, "name": name, "twitter": "", "photo": ""}


def parse_episode_guests(raw_guests) -> list:
    """
    O endpoint LIST retorna guests como string ('Nome1,Nome2,Nome3').
    O endpoint DETAIL retorna como list[dict] com photo+twitter completos.
    Esta funcao trata os dois formatos e enriquece via lookup global.
    """
    if not raw_guests:
        return []
    if isinstance(raw_guests, str):
        names = [n.strip() for n in raw_guests.split(",") if n.strip()]
        return [enrich_guest(clean_text(n)) for n in names]
    if isinstance(raw_guests, list):
        out = []
        for g in raw_guests:
            if isinstance(g, str):
                out.append(enrich_guest(clean_text(g)))
            elif isinstance(g, dict):
                out.append({
                    "id": g.get("id"),
                    "name": clean_text(g.get("name")),
                    "twitter": g.get("twitter") or "",
                    "photo": g.get("image") or g.get("photo") or "",
                })
        return out
    return []


def simplify_episode(raw: dict) -> dict:
    """Schema final usado pelo site."""
    pub = raw.get("published_at", "") or raw.get("pub_date", "")
    date_only = pub[:10] if pub else ""
    year = int(date_only[:4]) if len(date_only) >= 4 and date_only[:4].isdigit() else None
    month = int(date_only[5:7]) if len(date_only) >= 7 and date_only[5:7].isdigit() else None

    episode_number = None
    ep_raw = raw.get("episode")
    if ep_raw:
        try:
            episode_number = int(str(ep_raw).strip())
        except ValueError:
            pass

    guests = parse_episode_guests(raw.get("guests"))

    return {
        "id": f"ep-{raw['id']}",
        "wp_id": raw.get("id"),
        "slug": raw.get("slug", ""),
        "url": raw.get("url", ""),
        "title": clean_text(raw.get("title")),
        "description": clean_text(raw.get("description")),
        "date": date_only,
        "year": year,
        "month": month,
        "episode_number": episode_number,
        "duration_seconds": raw.get("duration"),
        "program": {
            "slug": raw.get("product", ""),
            "name": clean_text(raw.get("product_name")),
        },
        "theme": clean_text(raw.get("subject")) or None,
        "image": raw.get("image", ""),
        "audio": {
            "high": raw.get("audio_high", ""),
            "medium": raw.get("audio_medium", ""),
            "low": raw.get("audio_low", ""),
            "zip": raw.get("audio_zip", ""),
        },
        "guests": guests,
    }


def simplify_guest(g: dict) -> dict:
    return {
        "id": g.get("id"),
        "name": clean_text(g.get("name")),
        "twitter": g.get("twitter") or "",
        "photo": g.get("image") or "",
    }


def simplify_subject(t: dict) -> dict:
    """subjects: {'name': 'animacao', 'verboseName': 'Animação'}"""
    return {
        "slug": t.get("name", ""),
        "name": clean_text(t.get("verboseName") or t.get("name")),
    }


def simplify_playlist(p: dict) -> dict:
    out = {}
    for k in ("id", "name", "slug", "title", "count", "label", "value"):
        if k in p and p[k] is not None:
            out[k] = clean_text(p[k]) if isinstance(p[k], str) else p[k]
    return out


def derive_programs(episodes: list) -> list:
    """Fallback: agrega lista de programas dos proprios episodios."""
    seen: dict = {}
    for e in episodes:
        prog = e.get("program") or {}
        slug = prog.get("slug")
        if not slug or slug in seen:
            continue
        seen[slug] = {"slug": slug, "name": prog.get("name", ""), "count": 0}
    for e in episodes:
        slug = (e.get("program") or {}).get("slug")
        if slug in seen:
            seen[slug]["count"] += 1
    return sorted(seen.values(), key=lambda p: -p["count"])


def main():
    DATA_DIR.mkdir(exist_ok=True)

    # Convidados primeiro: usados para enriquecer guests dos episodios.
    print("Baixando convidados...")
    guests = []
    try:
        guests = [simplify_guest(g) for g in fetch_single("nerdcasts/guests")]
        (DATA_DIR / "guests.json").write_text(
            json.dumps(guests, ensure_ascii=False, indent=2), encoding="utf-8"
        )
        print(f"OK: {len(guests)} convidados em data/guests.json")
    except Exception as e:
        print(f"ERRO em guests: {e}")
    set_guest_lookup(guests)

    print("\nBaixando episodios...")
    raw_eps = fetch_paginated("nerdcasts")
    episodes = [simplify_episode(e) for e in raw_eps]
    episodes.sort(key=lambda e: e["date"], reverse=True)
    (DATA_DIR / "episodes.json").write_text(
        json.dumps(episodes, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(f"OK: {len(episodes)} episodios em data/episodes.json")

    print("\nBaixando temas...")
    try:
        themes = [simplify_subject(t) for t in fetch_single("nerdcasts/subjects")]
        (DATA_DIR / "themes.json").write_text(
            json.dumps(themes, ensure_ascii=False, indent=2), encoding="utf-8"
        )
        print(f"OK: {len(themes)} temas em data/themes.json")
    except Exception as e:
        print(f"ERRO em themes: {e}")

    print("\nBaixando programas...")
    programs = []
    try:
        raw_playlists = fetch_single("nerdcasts/playlists")
        programs = [simplify_playlist(p) for p in raw_playlists]
        print(f"OK: {len(programs)} programas via API")
    except Exception as e:
        print(f"  endpoint playlists falhou ({e}); derivando dos episodios...")
        programs = derive_programs(episodes)
        print(f"OK: {len(programs)} programas derivados")
    (DATA_DIR / "programs.json").write_text(
        json.dumps(programs, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    print("\nConcluido.")


if __name__ == "__main__":
    main()
