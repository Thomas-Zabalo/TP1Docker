import Icon from './Icon.jsx'

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <a href="#accueil" className="brand" aria-label="PharmaStock, accueil">
        <span className="brand-mark">
          <Icon name="plus" className="size-6" />
        </span>
        <span>
          <strong>
            pharma<span>stock</span>
          </strong>
          <small>ESPACE DE GESTION</small>
        </span>
      </a>

      <p className="sidebar-label">MENU PRINCIPAL</p>
      <nav className="sidebar-nav" aria-label="Navigation principale">
        <a className="sidebar-link active" href="#accueil">
          <Icon name="grid" /> Vue d’ensemble
        </a>
        <a className="sidebar-link" href="#inventaire">
          <Icon name="box" /> Inventaire
        </a>
        <a className="sidebar-link" href="#ajout">
          <Icon name="plus" /> Ajouter un produit
        </a>
      </nav>

      <div className="sidebar-bottom">
        <div className="team-card">
          <span className="team-avatar">PC</span>
          <span>
            <strong>Pharmacie Centrale</strong>
            <small>Équipe de gestion</small>
          </span>
          <span className="online-dot" aria-label="En ligne" />
        </div>
        <p className="sidebar-footnote">
          Une gestion plus sereine,
          <br />
          un stock toujours bien suivi.
        </p>
      </div>
    </aside>
  )
}
