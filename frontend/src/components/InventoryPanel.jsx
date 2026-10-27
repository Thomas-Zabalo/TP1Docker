import Icon from './Icon.jsx'
import { formatDate, getStockState } from '../utils/stock.js'

const numberFormat = new Intl.NumberFormat('fr-FR')

function ProductRow({ product }) {
  const state = getStockState(product)

  return (
    <tr>
      <td>
        <div className="product-cell">
          <span className="product-monogram">{product.nom.slice(0, 1).toUpperCase()}</span>
          <span>
            <strong>{product.nom}</strong>
            <small>Réf. PH-{String(product.id).padStart(4, '0')}</small>
          </span>
        </div>
      </td>
      <td><span className="lot-code">{product.lot}</span></td>
      <td>{formatDate(product.expiration)}</td>
      <td>
        <strong className="quantity-value">{numberFormat.format(product.quantite)}</strong>
        <span className="quantity-unit"> unités</span>
      </td>
      <td><span className={`status-pill ${state.tone}`}><span />{state.label}</span></td>
    </tr>
  )
}

function EmptyState({ hasProducts }) {
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <Icon name={hasProducts ? 'search' : 'box'} className="size-6" />
      </span>
      <strong>{hasProducts ? 'Aucun résultat' : 'Votre inventaire est vide'}</strong>
      <p>
        {hasProducts
          ? 'Essayez une autre recherche ou un autre filtre.'
          : 'Ajoutez votre première référence pour commencer.'}
      </p>
    </div>
  )
}

export default function InventoryPanel({
  products,
  filteredProducts,
  loading,
  search,
  filter,
  onSearchChange,
  onFilterChange,
}) {
  return (
    <article id="inventaire" className="panel inventory-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">VOTRE CATALOGUE</p>
          <h2>Inventaire</h2>
          <p className="panel-subtitle">Suivez chaque référence, lot et date de péremption.</p>
        </div>
        <span className="count-badge">{filteredProducts.length} / {products.length}</span>
      </div>

      <div className="inventory-controls">
        <label className="search-box">
          <Icon name="search" className="size-4" />
          <input
            type="search"
            placeholder="Rechercher un produit ou un lot…"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </label>
        <div className="filter-tabs" aria-label="Filtrer les produits">
          <button
            type="button"
            className={filter === 'all' ? 'selected' : ''}
            onClick={() => onFilterChange('all')}
          >
            Tout
          </button>
          <button
            type="button"
            className={filter === 'alerts' ? 'selected' : ''}
            onClick={() => onFilterChange('alerts')}
          >
            À surveiller
          </button>
          <button
            type="button"
            className={filter === 'expired' ? 'selected' : ''}
            onClick={() => onFilterChange('expired')}
          >
            Expirés
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-state" role="status">
          <span className="loading-spinner" /> Chargement de l’inventaire…
        </div>
      ) : filteredProducts.length === 0 ? (
        <EmptyState hasProducts={products.length > 0} />
      ) : (
        <div className="table-wrap">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>PRODUIT</th>
                <th>LOT</th>
                <th>EXPIRATION</th>
                <th>QUANTITÉ</th>
                <th>ÉTAT</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <ProductRow key={product.id} product={product} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </article>
  )
}
