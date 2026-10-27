const dateFormat = new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

export function formatDate(value) {
  const [year, month, day] = value.split('-').map(Number)
  return dateFormat.format(new Date(year, month - 1, day))
}

export function getStockState(product) {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const [year, month, day] = product.expiration.split('-').map(Number)
  const expiration = new Date(year, month - 1, day)
  const daysLeft = Math.round((expiration - today) / 86400000)

  if (daysLeft < 0) return { label: 'Expiré', tone: 'expired' }
  if (Number(product.quantite) === 0) return { label: 'Rupture', tone: 'empty' }
  if (daysLeft <= 30) return { label: 'Expire bientôt', tone: 'warning' }
  if (Number(product.quantite) <= 10) return { label: 'Stock faible', tone: 'warning' }
  return { label: 'En stock', tone: 'ok' }
}
