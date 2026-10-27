import Icon from './Icon.jsx'

export default function ProductForm({
  nom,
  lot,
  expiration,
  quantite,
  submitting,
  onChange,
  onSubmit,
}) {
  return (
    <aside id="ajout" className="panel add-panel">
      <div className="add-heading">
        <span className="add-icon"><Icon name="plus" /></span>
        <div>
          <p className="eyebrow">NOUVELLE RÉFÉRENCE</p>
          <h2>Ajouter un produit</h2>
        </div>
      </div>
      <p className="panel-subtitle add-intro">
        Enregistrez un médicament et son lot dans votre stock.
      </p>
      <form onSubmit={onSubmit} className="product-form">
        <label>
          <span>Nom du médicament</span>
          <input
            type="text"
            placeholder="Ex. Paracétamol 500 mg"
            value={nom}
            onChange={(event) => onChange('nom', event.target.value)}
            maxLength={120}
            required
          />
        </label>
        <label>
          <span>Numéro de lot</span>
          <input
            type="text"
            placeholder="Ex. LOT-2026-014"
            value={lot}
            onChange={(event) => onChange('lot', event.target.value)}
            maxLength={80}
            required
          />
        </label>
        <label>
          <span>Date d’expiration</span>
          <input
            type="date"
            value={expiration}
            onChange={(event) => onChange('expiration', event.target.value)}
            required
          />
        </label>
        <label>
          <span>Quantité en stock</span>
          <div className="quantity-input">
            <input
              type="number"
              min="0"
              step="1"
              placeholder="0"
              value={quantite}
              onChange={(event) => onChange('quantite', event.target.value)}
              required
            />
            <span>unités</span>
          </div>
        </label>
        <button className="submit-button" type="submit" disabled={submitting}>
          {submitting ? (
            <>
              <span className="button-spinner" /> Enregistrement…
            </>
          ) : (
            <>
              <Icon name="plus" className="size-4" /> Ajouter à l’inventaire
            </>
          )}
        </button>
      </form>
      <div className="form-hint">
        <Icon name="check" className="size-4" /> Enregistrement sécurisé dans votre base de stock.
      </div>
    </aside>
  )
}
