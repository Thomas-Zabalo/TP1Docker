import Icon from './Icon.jsx'

export default function Topbar({ date }) {
  return (
    <header className="topbar">
      <div className="breadcrumb">
        <span>PharmaStock</span>
        <Icon name="arrow" className="size-3 rotate-[-45deg]" />
        <strong>Tableau de bord</strong>
      </div>
      <div className="topbar-date">
        <Icon name="calendar" className="size-4" /> {date}
      </div>
    </header>
  )
}
