import os
import sys

_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _ROOT not in sys.path:
    sys.path.insert(0, _ROOT)

from database.db import Base, engine  # noqa: E402

if __name__ == "__main__":
    Base.metadata.create_all(engine)
    print("Tablas creadas o ya existentes (metadata SQLAlchemy).")
