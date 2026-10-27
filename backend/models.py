from datetime import date

from pydantic import BaseModel, Field, field_validator


class Produit(BaseModel):
    nom: str = Field(min_length=1, max_length=120)
    lot: str = Field(min_length=1, max_length=80)
    expiration: str
    quantite: int = Field(ge=0)

    @field_validator("nom", "lot")
    @classmethod
    def trim_text(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Cette valeur ne peut pas être vide.")
        return value

    @field_validator("expiration")
    @classmethod
    def validate_expiration(cls, value: str) -> str:
        try:
            parsed_date = date.fromisoformat(value)
        except ValueError as error:
            raise ValueError("La date doit être au format AAAA-MM-JJ.") from error
        if parsed_date.isoformat() != value:
            raise ValueError("La date doit être au format AAAA-MM-JJ.")
        return value