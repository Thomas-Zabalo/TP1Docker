import Icon from './Icon.jsx'

const numberFormat = new Intl.NumberFormat('fr-FR')

export default function StockSummary({ summary }) {
  const monitored = (summary?.ruptures ?? 0) + (summary?.stock_faible ?? 0)
  const expirations = (summary?.expires ?? 0) + (summary?.expiration_proche ?? 0)

  return (
    <section className="metrics-grid" aria-label="Résumé du stock">
      <article className="metric-card metric-main">
        <div className="metric-top">
          <span className="metric-icon mint"><Icon name="box" /></span>
          <span className="metric-kicker">RÉFÉRENCES</span>
        </div>
        <p className="metric-value">{numberFormat.format(summary?.references_total ?? 0)}</p>
        <p className="metric-label">produits dans l’inventaire</p>
        <span className="metric-decoration">01</span>
      </article>
      <article className="metric-card">
        <div className="metric-top">
          <span className="metric-icon lavender"><Icon name="grid" /></span>
          <span className="metric-kicker">DISPONIBILITÉ</span>
        </div>
        <p className="metric-value">{numberFormat.format(summary?.unites_total ?? 0)}</p>
        <p className="metric-label">unités disponibles</p>
      </article>
      <article className={`metric-card ${monitored > 0 ? 'metric-alert' : ''}`}>
        <div className="metric-top">
          <span className="metric-icon peach"><Icon name="alert" /></span>
          <span className="metric-kicker">À SURVEILLER</span>
        </div>
        <p className="metric-value">{numberFormat.format(monitored)}</p>
        <p className="metric-label">ruptures ou stocks faibles</p>
      </article>
      <article className="metric-card">
        <div className="metric-top">
          <span className="metric-icon yellow"><Icon name="calendar" /></span>
          <span className="metric-kicker">PÉREMPTION</span>
        </div>
        <p className="metric-value">{numberFormat.format(expirations)}</p>
        <p className="metric-label">expirés ou bientôt</p>
      </article>
    </section>
  )
}
