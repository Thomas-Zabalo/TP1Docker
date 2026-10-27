import Icon from './Icon.jsx'

export default function DashboardHeader({ loading, onRefresh }) {
  return (
    <section className="welcome-row">
      <div>
        <p className="eyebrow">VOTRE ESPACE, EN UN COUP D’ŒIL</p>
        <h1>Bonjour, équipe <span aria-hidden="true">✳</span></h1>
        <p className="welcome-copy">
          Voici ce qui se passe dans votre pharmacie aujourd’hui.
        </p>
      </div>
      <button className="refresh-button" type="button" onClick={onRefresh} disabled={loading}>
        <Icon name="refresh" className={`size-4 ${loading ? 'animate-spin' : ''}`} />
        Actualiser
      </button>
    </section>
  )
}
