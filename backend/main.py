"""
Railway / Heroku-style fallback entrypoint.

Some platforms (including Railway when no Procfile is detected) default to
running ``uvicorn main:app``. Our application module is named ``server.py``,
so we re-export ``app`` here to make the default command work out of the box.

Recommended deploy command (see Procfile): ``uvicorn server:app --host 0.0.0.0 --port $PORT``
"""
from server import app  # noqa: F401

__all__ = ["app"]
