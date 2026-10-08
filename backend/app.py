from fastapi import FastAPI, HTTPException
from models import Produit
import sqlite3
import os

app = FastAPI(title="PharmaStock API", version="1.0")

DB_PATH = os.getenv("DATA_PATH", "/app/data/pharmacy.db")

def init_db():
    with sqlite3.connect(DB_PATH) as conn:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS produits (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nom TEXT NOT NULL,
                lot TEXT NOT NULL,
                expiration TEXT NOT NULL,
                quantite INTEGER NOT NULL
            )
        """)
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
                (produit.nom, produit.lot, produit.expiration, produit.quantite)
            )
            conn.commit()
            conn.close()
            return {"status": "success", "message": f"Produit {produit.nom} ajouté avec succès."}
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