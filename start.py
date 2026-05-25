"""
Instala dependencias e inicia o NerdCast Explorer.
Execute: python start.py
"""

import subprocess
import sys
import os
from pathlib import Path

ROOT = Path(__file__).parent
SITE = ROOT / "site"
DATA = ROOT / "data" / "episodes.json"
PY_REQUIREMENTS = ROOT / "scripts" / "requirements.txt"


def run(cmd, cwd=None, check=True):
    print(f"  > {' '.join(cmd)}")
    return subprocess.run(cmd, cwd=cwd, check=check)


def step(msg):
    print(f"\n[{msg}]")


def check_node():
    result = subprocess.run(["node", "--version"], capture_output=True, text=True)
    if result.returncode != 0:
        print("ERRO: Node.js nao encontrado. Instale em https://nodejs.org/")
        sys.exit(1)
    print(f"  Node {result.stdout.strip()} encontrado")


def install_python_deps():
    step("Dependencias Python")
    try:
        import openpyxl  # noqa: F401
        print("  openpyxl ja instalado")
    except ImportError:
        run([sys.executable, "-m", "pip", "install", "-r", str(PY_REQUIREMENTS), "-q"])
        print("  dependencias Python instaladas")


def generate_data():
    step("Dados dos episodios")
    if DATA.exists():
        import json
        count = len(json.loads(DATA.read_text(encoding="utf-8")))
        print(f"  episodes.json ja existe ({count} episodios)")
    else:
        print("  Convertendo Excel para JSON...")
        run([sys.executable, str(ROOT / "scripts" / "convert_xlsx.py")])


def install_npm_deps():
    step("Dependencias do site (npm)")
    if (SITE / "node_modules").exists():
        print("  node_modules ja existe, pulando npm install")
    else:
        run(["npm", "install"], cwd=SITE)


def start_dev_server():
    step("Iniciando servidor de desenvolvimento")
    print("  Abrindo http://localhost:5173 ...\n")
    print("  (Pressione Ctrl+C para encerrar)\n")
    print("=" * 50)

    try:
        if sys.platform == "win32":
            subprocess.run(["npm", "run", "dev"], cwd=SITE, shell=True)
        else:
            subprocess.run(["npm", "run", "dev"], cwd=SITE)
    except KeyboardInterrupt:
        print("\n\nServidor encerrado.")


def main():
    print("=" * 50)
    print("  NerdCast Explorer — Setup & Start")
    print("=" * 50)

    os.chdir(ROOT)
    check_node()
    install_python_deps()
    generate_data()
    install_npm_deps()
    start_dev_server()


if __name__ == "__main__":
    main()
