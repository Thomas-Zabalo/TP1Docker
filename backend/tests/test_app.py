import pytest
from fastapi.testclient import TestClient

import app as application


@pytest.fixture
def client(tmp_path, monkeypatch):
    database_path = tmp_path / "test.db"
    monkeypatch.setattr(application, "DB_PATH", str(database_path))

    with TestClient(application.app) as test_client:
        yield test_client


def test_list_products_returns_empty_list(client):
    response = client.get("/api/produits")

    assert response.status_code == 200
    assert response.json() == []


def test_added_product_is_returned_by_list(client):
    product = {
        "nom": "Paracetamol",
        "lot": "LOT-001",
        "expiration": "2027-12-31",
        "quantite": 12,
    }

    create_response = client.post("/api/produits", json=product)
    list_response = client.get("/api/produits")

    assert create_response.status_code == 200, create_response.text
    assert create_response.json()["status"] == "success"
    assert list_response.status_code == 200, list_response.text
    assert list_response.json() == [{"id": 1, **product}]


@pytest.mark.parametrize(
    "invalid_product",
    [
        {
            "nom": " ",
            "lot": "LOT-001",
            "expiration": "2027-12-31",
            "quantite": 1,
        },
        {
            "nom": "Produit",
            "lot": "LOT-001",
            "expiration": "31/12/2027",
            "quantite": 1,
        },
        {
            "nom": "Produit",
            "lot": "LOT-001",
            "expiration": "2027-12-31",
            "quantite": -1,
        },
    ],
)
def test_invalid_product_is_rejected(client, invalid_product):
    response = client.post("/api/produits", json=invalid_product)

    assert response.status_code == 422


def test_product_text_is_trimmed(client):
    response = client.post(
        "/api/produits",
        json={
            "nom": "  Paracetamol  ",
            "lot": " LOT-002 ",
            "expiration": "2027-12-31",
            "quantite": 3,
        },
    )

    assert response.status_code == 200
    assert client.get("/api/produits").json()[0]["nom"] == "Paracetamol"


def test_stock_summary_reports_empty_inventory(client):
    response = client.get("/api/stock-summary")

    assert response.status_code == 200
    assert response.json() == {
        "references_total": 0,
        "unites_total": 0,
        "ruptures": 0,
        "stock_faible": 0,
        "expires": 0,
        "expiration_proche": 0,
    }


def test_stock_summary_counts_inventory_and_alerts(client):
    from datetime import date, timedelta

    soon = (date.today() + timedelta(days=10)).isoformat()
    products = [
        {"nom": "Produit A", "lot": "A-001", "expiration": soon, "quantite": 5},
        {"nom": "Produit B", "lot": "B-001", "expiration": "2035-12-31", "quantite": 0},
        {"nom": "Produit C", "lot": "C-001", "expiration": "2035-12-31", "quantite": 20},
    ]

    for product in products:
        response = client.post("/api/produits", json=product)
        assert response.status_code == 200

    response = client.get("/api/stock-summary")

    assert response.json() == {
        "references_total": 3,
        "unites_total": 25,
        "ruptures": 1,
        "stock_faible": 1,
        "expires": 0,
        "expiration_proche": 1,
    }