import os
import sqlite3
from datetime import date, timedelta

from fastapi import FastAPI, HTTPException
from models import Produit

app = FastAPI(title="PharmaStock API", version="1.0")

DB_PATH = os.getenv("DATA_PATH", "/app/data/pharmacy.db")


def init_db():
    with sqlite3.connect(DB_PATH) as conn:
        cursor = conn.cursor()
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS produits (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nom TEXT NOT NULL,
                lot TEXT NOT NULL,
                expiration TEXT NOT NULL,
                quantite INTEGER NOT NULL
            )
            """
        )
        conn.commit()


@app.on_event("startup")
def on_startup():
    init_db()


@app.get("/")
def read_root():
    return {"message": "Hello depuis le backend FastAPI"}


@app.post("/api/produits")
def ajouter_produit(produit: Produit):
    try:
        with sqlite3.connect(DB_PATH) as conn:
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO produits (nom, lot, expiration, quantite) VALUES (?, ?, ?, ?)",
                (produit.nom, produit.lot, produit.expiration, produit.quantite),
            )
            conn.commit()
            return {
                "status": "success",
                "message": f"Produit {produit.nom} ajouté avec succès.",
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/produits")
def lister_produits():
    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM produits")
        rows = cursor.fetchall()
    return [dict(row) for row in rows]


@app.get("/api/stock-summary")
def resume_stock():
    today_date = date.today()
    today = today_date.isoformat()
    cutoff = (today_date + timedelta(days=30)).isoformat()

    with sqlite3.connect(DB_PATH) as conn:
        cursor = conn.cursor()
        cursor.execute(
            """
            SELECT
                COUNT(*) AS references_total,
                COALESCE(SUM(quantite), 0) AS unites_total,
                SUM(CASE WHEN quantite = 0 THEN 1 ELSE 0 END) AS ruptures,
                SUM(CASE WHEN quantite BETWEEN 1 AND 10 THEN 1 ELSE 0 END) AS stock_faible,
                SUM(CASE WHEN expiration < ? THEN 1 ELSE 0 END) AS expires,
                SUM(CASE WHEN expiration >= ? AND expiration <= ? THEN 1 ELSE 0 END) AS expiration_proche
            FROM produits
            """,
            (today, today, cutoff),
        )
        row = cursor.fetchone()

    return {
        "references_total": row[0],
        "unites_total": row[1],
        "ruptures": row[2] or 0,
        "stock_faible": row[3] or 0,
        "expires": row[4] or 0,
        "expiration_proche": row[5] or 0,
    }