#!/usr/bin/env python3
"""
Script para descargar los feeds GTFS de Subtes y Colectivos desde la API del GCBA.
Extrae los archivos en data/gtfs/subtes/ y data/gtfs/colectivos/.

Uso:
    python scripts/download_gtfs.py

El script carga automáticamente GCBA_CLIENT_ID y GCBA_CLIENT_SECRET desde .env
(si existe en la raíz del proyecto). También se pueden usar variables de entorno:
    GCBA_CLIENT_ID     - Client ID de la API Transporte GCBA
    GCBA_CLIENT_SECRET - Client Secret de la API Transporte GCBA

Si no se configuran, el script intenta descargar sin credenciales.
Algunos endpoints pueden requerir registro en https://apitransporte.buenosaires.gob.ar/registro

Nota SSL: Si aparece CERTIFICATE_VERIFY_FAILED, instalá los certificados del sistema:
  - Ubuntu/Debian: sudo apt install ca-certificates
  - O exportá SSL_CERT_FILE apuntando a tu bundle de certificados
"""

import io
import os
import re
import sys
import zipfile
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import urlopen, Request
from urllib.error import HTTPError, URLError

# Cargar .env desde la raíz del proyecto
PROJECT_ROOT = Path(__file__).resolve().parent.parent
ENV_FILE = PROJECT_ROOT / ".env"


def load_dotenv() -> None:
    """Carga variables desde .env si el archivo existe."""
    if not ENV_FILE.exists():
        return
    for line in ENV_FILE.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or line.startswith("//"):
            continue
        # Soporta: KEY=value, KEY = "value", KEY = "value";
        match = re.match(r"([A-Za-z_][A-Za-z0-9_]*)\s*=\s*[\"']?([^\"';#\s]+)[\"']?\s*;?", line)
        if match:
            key, value = match.groups()
            if key and value and key not in os.environ:
                os.environ[key] = value.strip('"')


load_dotenv()

# Configuración
GCBA_BASE = "https://apitransporte.buenosaires.gob.ar"
FEEDS = {
    "subtes": f"{GCBA_BASE}/subtes/feed-gtfs",
    "colectivos": f"{GCBA_BASE}/colectivos/feed-gtfs",
}
DATA_DIR = Path(__file__).resolve().parent.parent / "data" / "gtfs"


def build_url(base_url: str) -> str:
    """Construye la URL con credenciales si están disponibles."""
    client_id = os.environ.get("GCBA_CLIENT_ID")
    client_secret = os.environ.get("GCBA_CLIENT_SECRET")

    if client_id and client_secret:
        params = urlencode({
            "client_id": client_id,
            "client_secret": client_secret,
        })
        return f"{base_url}?{params}"
    return base_url


def download_zip(url: str) -> bytes:
    """Descarga un archivo ZIP desde la URL."""
    print(f"  Descargando: {url[:60]}...")
    req = Request(url, headers={"User-Agent": "BondiYa-GTFS-Downloader/1.0"})

    try:
        with urlopen(req, timeout=60) as response:
            return response.read()
    except HTTPError as e:
        if e.code == 401:
            print("  Error: Credenciales inválidas o no configuradas.")
            print("  Registrate en https://apitransporte.buenosaires.gob.ar/registro")
        elif e.code == 403:
            print("  Error: Acceso denegado. Verificá GCBA_CLIENT_ID y GCBA_CLIENT_SECRET.")
        else:
            print(f"  Error HTTP {e.code}: {e.reason}")
        raise
    except URLError as e:
        print(f"  Error de conexión: {e.reason}")
        raise


def extract_zip(data: bytes, dest_dir: Path) -> int:
    """Extrae el contenido del ZIP en el directorio destino. Retorna cantidad de archivos."""
    dest_dir.mkdir(parents=True, exist_ok=True)
    count = 0

    with zipfile.ZipFile(io.BytesIO(data), "r") as zf:
        for name in zf.namelist():
            # Ignorar directorios y archivos __MACOSX
            if name.endswith("/") or "__MACOSX" in name:
                continue
            # Usar solo el nombre del archivo (sin rutas del ZIP)
            filename = Path(name).name
            target = dest_dir / filename
            with zf.open(name) as src, open(target, "wb") as dst:
                dst.write(src.read())
            count += 1
            print(f"    Extraído: {filename}")

    return count


def main() -> int:
    print("BondiYa — Descarga de feeds GTFS\n")
    print(f"Directorio destino: {DATA_DIR}\n")

    if not os.environ.get("GCBA_CLIENT_ID") or not os.environ.get("GCBA_CLIENT_SECRET"):
        print("⚠️  GCBA_CLIENT_ID y GCBA_CLIENT_SECRET no configurados.")
        print("   Algunos feeds pueden requerir credenciales.\n")

    total_files = 0

    for feed_name, base_url in FEEDS.items():
        print(f"📥 {feed_name.upper()}")
        dest_dir = DATA_DIR / feed_name

        try:
            url = build_url(base_url)
            zip_data = download_zip(url)
            count = extract_zip(zip_data, dest_dir)
            total_files += count
            print(f"  ✅ {count} archivos extraídos en {dest_dir}\n")
        except (HTTPError, URLError, zipfile.BadZipFile) as e:
            print(f"  ❌ Falló: {e}\n")
            return 1

    print(f"✅ Listo. {total_files} archivos GTFS en {DATA_DIR}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
