"""
Converte o Excel histórico (2006-2024) para data/episodes.json.
Ferramenta legada para quem tem os arquivos originais.
Para dados atuais e schema completo do site, use fetch_api.py.
"""

import json
import re
import openpyxl
from datetime import datetime
from pathlib import Path

XLSX_PATH = Path(__file__).parent.parent / "Arquivos Excel" / "Análise Feed NerdCast.xlsx"
OUTPUT_PATH = Path(__file__).parent.parent / "data" / "episodes.json"


def clean_title(raw: str) -> str:
    title = re.sub(r"^Título:\s*", "", raw.strip())
    title = re.sub(r"\s*-\s*$", "", title.strip())
    return title.strip()


def clean_type(raw: str) -> str:
    return raw.strip() if raw else "NerdCast"


def parse_date(dt_value) -> str:
    if isinstance(dt_value, datetime):
        return dt_value.strftime("%Y-%m-%d")
    return ""


def parse_episode_number(raw) -> int | None:
    if raw is None:
        return None
    try:
        return int(str(raw).strip())
    except (ValueError, AttributeError):
        return None


def convert():
    wb = openpyxl.load_workbook(XLSX_PATH, read_only=True, data_only=True)
    ws = wb["BASE"]
    rows = list(ws.iter_rows(values_only=True))
    wb.close()

    episodes = []
    for i, row in enumerate(rows[1:], start=1):
        padded = list(row) + [None] * 12
        title_raw, url, _, _, _, _, dt_data, _, _, tipo, ep_num = padded[:11]

        if not title_raw or not str(title_raw).startswith("Título"):
            continue

        title = clean_title(str(title_raw))
        ep_type = clean_type(str(tipo)) if tipo else "NerdCast"
        date_str = parse_date(dt_data)
        year = int(date_str[:4]) if date_str else None
        month = int(date_str[5:7]) if date_str else None
        episode_number = parse_episode_number(ep_num)

        slug = f"ep-{i:04d}"

        episodes.append({
            "id": slug,
            "title": title,
            "type": ep_type,
            "episode_number": episode_number,
            "date": date_str,
            "year": year,
            "month": month,
            "url": str(url) if url and not str(url).startswith("=") else "",
        })

    OUTPUT_PATH.parent.mkdir(exist_ok=True)
    OUTPUT_PATH.write_text(
        json.dumps(episodes, ensure_ascii=False, indent=2),
        encoding="utf-8"
    )
    print(f"OK: {len(episodes)} episodios exportados para {OUTPUT_PATH}")


if __name__ == "__main__":
    convert()
