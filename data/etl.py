import json
import sys
from datetime import datetime, timezone
from pathlib import Path

import pandas as pd

BASE_DIR = Path(__file__).resolve().parent
RAW_CSV_PATH = BASE_DIR / "raw" / "customer_support_tickets.csv"
PROCESSED_JSON_PATH = BASE_DIR / "processed" / "metrics.json"

# Nomes de coluna do "Customer Support Ticket Dataset" (Kaggle). Ajuste aqui
# se a versão baixada do dataset tiver nomes ligeiramente diferentes.
DATE_COLUMN = "Date of Purchase"
CATEGORY_COLUMN = "Ticket Type"

TOP_CATEGORIES_LIMIT = 5


def load_dataset(csv_path=RAW_CSV_PATH) -> pd.DataFrame:
    return pd.read_csv(csv_path)


def parse_dates(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df[DATE_COLUMN] = pd.to_datetime(df[DATE_COLUMN], errors="coerce")
    return df.dropna(subset=[DATE_COLUMN])


def compute_daily_counts(df: pd.DataFrame) -> list[dict]:
    daily_counts = df[DATE_COLUMN].dt.date.value_counts().sort_index()
    return [{"date": str(date), "count": int(count)} for date, count in daily_counts.items()]


def compute_top_categories(df: pd.DataFrame, limit: int = TOP_CATEGORIES_LIMIT) -> list[dict]:
    top = df[CATEGORY_COLUMN].value_counts().head(limit)
    return [{"category": category, "count": int(count)} for category, count in top.items()]


def compute_metrics(df: pd.DataFrame) -> dict:
    parsed = parse_dates(df)
    return {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "total_tickets": int(len(parsed)),
        "by_day": compute_daily_counts(parsed),
        "top_categories": compute_top_categories(parsed),
    }


def save_metrics(metrics: dict, output_path=PROCESSED_JSON_PATH) -> None:
    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(
        json.dumps(metrics, indent=2, ensure_ascii=False), encoding="utf-8"
    )


def run(csv_path=RAW_CSV_PATH, output_path=PROCESSED_JSON_PATH) -> dict:
    df = load_dataset(csv_path)
    metrics = compute_metrics(df)
    save_metrics(metrics, output_path)
    return metrics


if __name__ == "__main__":
    if not RAW_CSV_PATH.exists():
        sys.exit(
            f"Dataset não encontrado em {RAW_CSV_PATH}.\n"
            "Baixe o 'Customer Support Ticket Dataset' do Kaggle "
            "(https://www.kaggle.com/datasets/suraj520/customer-support-ticket-dataset) "
            "e salve o CSV nesse caminho."
        )
    run()
    print(f"Métricas geradas em {PROCESSED_JSON_PATH}")
