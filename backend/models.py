from pydantic import BaseModel

class Produit(BaseModel):
    nom: str
    lot: str
    expiration: str
    quantite: int