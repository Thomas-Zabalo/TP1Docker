import { useState, useEffect } from 'react'
import heroImage from './assets/hero.png'

function App() {
  const [produits, setProduits] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [nom, setNom] = useState('')
  const [lot, setLot] = useState('')
  const [expiration, setExpiration] = useState('')
  const [quantite, setQuantite] = useState('')

  const fetchProduits = () => {
    fetch('/api/produits')
      .then((res) => {
        if (!res.ok) throw new Error('Erreur lors de la récupération des stocks')
        return res.json()
      })
      .then((data) => {
        setProduits(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchProduits()
  }, [])

  const totalUnites = produits.reduce(
    (total, produit) => total + Number(produit.quantite || 0),
    0,
  )
  const produitsEnRupture = produits.filter(
    (produit) => Number(produit.quantite) <= 0,
  ).length
  const dateDuJour = new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date())

  const handleSubmit = (e) => {
    e.preventDefault()
    const nouveauProduit = {
      nom,
      lot,
      expiration,
      quantite: parseInt(quantite, 10),
    }

    fetch('/api/produits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nouveauProduit),
    })
      .then((res) => res.json())
      .then(() => {
        setNom('')
        setLot('')
        setExpiration('')
        setQuantite('')
        fetchProduits()
      })
      .catch((err) => console.error("Erreur d'ajout:", err))
  }

  return (
    <div className="min-h-screen bg-[#f7f6fa] text-slate-900">
      <header className="border-b border-violet-100/80 bg-white/85">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
          <a href="#overview" className="flex items-center gap-3" aria-label="PharmaStock, accueil">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-lg shadow-violet-200">
              <svg viewBox="0 0 24 24" fill="none" className="size-6" aria-hidden="true">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </span>
            <span>
              <span className="block text-lg font-bold tracking-tight text-slate-900">Pharma<span className="text-violet-600">Stock</span></span>
              <span className="block text-[11px] font-medium tracking-[0.16em] text-slate-400 uppercase">Gestion de pharmacie</span>
            </span>
          </a>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Navigation principale">
            <a href="#overview" className="text-sm font-semibold text-violet-700">Vue d’ensemble</a>
            <a href="#inventaire" className="text-sm font-medium text-slate-500 transition hover:text-violet-700">Inventaire</a>
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden text-right sm:block">
              <span className="block text-sm font-semibold text-slate-800">Espace équipe</span>
              <span className="block text-xs text-slate-400">Pharmacie centrale</span>
            </span>
            <span className="flex size-10 items-center justify-center rounded-full border-2 border-white bg-violet-100 text-sm font-bold text-violet-700 shadow-sm ring-1 ring-violet-100">PS</span>
          </div>
        </div>
      </header>

      <main id="overview" className="mx-auto max-w-[1440px] px-5 pb-12 sm:px-8 lg:px-12">
        <section className="flex flex-col justify-between gap-4 pb-6 pt-8 sm:flex-row sm:items-end sm:pt-10">
          <div>
            <p className="mb-2 text-xs font-bold tracking-[0.18em] text-violet-600 uppercase">Espace de travail</p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Bonjour, équipe 👋</h1>
            <p className="mt-2 text-sm text-slate-500 sm:text-base">Gardez un œil sur vos stocks et vos produits en un coup d’œil.</p>
          </div>
          <div className="flex items-center gap-2 self-start rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm sm:self-auto">
            <svg viewBox="0 0 24 24" fill="none" className="size-4 text-violet-500" aria-hidden="true">
              <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
              <path d="M7.5 3.5v3M16.5 3.5v3M4 9.5h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
            {dateDuJour}
          </div>
        </section>

        <section className="relative isolate mb-7 overflow-hidden rounded-[28px] bg-[#211333] px-6 py-8 text-white shadow-xl shadow-violet-950/10 sm:px-10 sm:py-9 lg:px-12">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_85%_15%,rgba(139,92,246,0.42),transparent_38%),radial-gradient(ellipse_at_8%_100%,rgba(126,34,206,0.24),transparent_45%)]" />
          <div className="relative z-10 max-w-xl">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-violet-100">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              Votre stock, toujours sous contrôle
            </span>
            <h2 className="max-w-lg text-3xl leading-tight font-bold tracking-tight sm:text-4xl">La bonne visibilité pour prendre soin de vos stocks.</h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-violet-100/75 sm:text-base">Suivez vos produits, vos lots et vos dates de péremption depuis un seul espace.</p>
            <a href="#inventaire" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-violet-800 shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-violet-50">
              Voir l’inventaire
              <svg viewBox="0 0 20 20" fill="none" className="size-4" aria-hidden="true">
                <path d="M4.5 10h11m-4.5-4.5L15.5 10 11 14.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
          <img src={heroImage} alt="" className="pointer-events-none absolute -right-3 -bottom-14 hidden w-64 opacity-90 drop-shadow-[0_12px_35px_rgba(139,92,246,0.35)] sm:block lg:right-10 lg:bottom-[-78px] lg:w-[290px]" />
          <div className="pointer-events-none absolute right-[22%] bottom-8 hidden size-2 rounded-full bg-fuchsia-300 shadow-[0_0_18px_5px_rgba(216,180,254,0.45)] sm:block" />
        </section>

        <section className="mb-7 grid gap-4 sm:grid-cols-3" aria-label="Résumé du stock">
          <article className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm shadow-slate-200/60">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
              <svg viewBox="0 0 24 24" fill="none" className="size-6" aria-hidden="true">
                <path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                <path d="m4.5 7.8 7.5 4.4 7.5-4.4M12 12.2V21" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
              </svg>
            </span>
            <span>
              <span className="block text-sm font-medium text-slate-500">Références en stock</span>
              <span className="mt-1 block text-2xl font-bold tracking-tight text-slate-900">{produits.length}</span>
            </span>
          </article>
          <article className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm shadow-slate-200/60">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-fuchsia-50 text-fuchsia-600">
              <svg viewBox="0 0 24 24" fill="none" className="size-6" aria-hidden="true">
                <path d="M7 3.8h7l4 4V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.8a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                <path d="M14 4v4h4M9 13h6M9 16.5h6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            </span>
            <span>
              <span className="block text-sm font-medium text-slate-500">Unités disponibles</span>
              <span className="mt-1 block text-2xl font-bold tracking-tight text-slate-900">{totalUnites.toLocaleString('fr-FR')}</span>
            </span>
          </article>
          <article className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm shadow-slate-200/60">
            <span className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${produitsEnRupture > 0 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
              <svg viewBox="0 0 24 24" fill="none" className="size-6" aria-hidden="true">
                <path d="M12 3.5 21 20H3l9-16.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                <path d="M12 9v4.5m0 3.2v.1" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
              </svg>
            </span>
            <span>
              <span className="block text-sm font-medium text-slate-500">Références en rupture</span>
              <span className="mt-1 block text-2xl font-bold tracking-tight text-slate-900">{produitsEnRupture}</span>
            </span>
          </article>
        </section>

        <section className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <article id="inventaire" className="min-w-0 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm shadow-slate-200/60">
            <div className="flex flex-col justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
              <div>
                <h2 className="text-lg font-bold tracking-tight text-slate-900">Inventaire actuel</h2>
                <p className="mt-1 text-sm text-slate-500">Retrouvez les informations de vos produits et de leurs lots.</p>
              </div>
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700">
                <span className="size-1.5 rounded-full bg-violet-500" />
                {produits.length} produit{produits.length > 1 ? 's' : ''}
              </span>
            </div>

            {loading && (
              <div className="flex items-center justify-center gap-3 px-6 py-16 text-sm font-medium text-slate-500" role="status">
                <span className="size-5 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600" />
                Chargement de votre inventaire…
              </div>
            )}
            {error && (
              <div className="m-5 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700" role="alert">
                {error}
              </div>
            )}

            {!loading && !error && (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] text-left text-sm">
                  <thead className="bg-slate-50/80 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                    <tr>
                      <th className="px-6 py-3.5">Produit</th>
                      <th className="px-5 py-3.5">N° de lot</th>
                      <th className="px-5 py-3.5">Expiration</th>
                      <th className="px-6 py-3.5 text-right">Quantité</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {produits.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-14 text-center">
                          <span className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-500">
                            <svg viewBox="0 0 24 24" fill="none" className="size-6" aria-hidden="true">
                              <path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                              <path d="m4.5 7.8 7.5 4.4 7.5-4.4M12 12.2V21" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                            </svg>
                          </span>
                          <span className="block font-semibold text-slate-700">Votre inventaire est encore vide</span>
                          <span className="mt-1 block text-slate-500">Ajoutez votre premier produit pour commencer.</span>
                        </td>
                      </tr>
                    ) : (
                      produits.map((produit) => (
                        <tr key={produit.id} className="transition hover:bg-violet-50/40">
                          <td className="px-6 py-4">
                            <span className="flex items-center gap-3">
                              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-xs font-bold text-violet-700">{produit.nom?.slice(0, 2).toUpperCase()}</span>
                              <span>
                                <span className="block font-semibold text-slate-800">{produit.nom}</span>
                                <span className="mt-0.5 block text-xs text-slate-400">Réf. #{produit.id}</span>
                              </span>
                            </span>
                          </td>
                          <td className="px-5 py-4 font-medium text-slate-600">{produit.lot}</td>
                          <td className="px-5 py-4 text-slate-600">{produit.expiration}</td>
                          <td className="px-6 py-4 text-right">
                            <span className={`inline-flex min-w-16 justify-center rounded-lg px-2.5 py-1.5 text-xs font-bold ${Number(produit.quantite) <= 0 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-700'}`}>
                              {produit.quantite}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </article>

          <aside className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm shadow-slate-200/60 sm:p-6">
            <div className="mb-5 flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden="true">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
              <span>
                <h2 className="text-lg font-bold tracking-tight text-slate-900">Ajouter un produit</h2>
                <p className="mt-1 text-sm text-slate-500">Enregistrez une nouvelle référence.</p>
              </span>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-slate-600">Nom du médicament</span>
                <input
                  type="text"
                  placeholder="Ex. Paracétamol 500 mg"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-slate-600">Numéro de lot</span>
                <input
                  type="text"
                  placeholder="Ex. LOT-2026-014"
                  value={lot}
                  onChange={(e) => setLot(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-slate-600">Date d’expiration</span>
                <input
                  type="date"
                  value={expiration}
                  onChange={(e) => setExpiration(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-slate-600">Quantité en stock</span>
                <input
                  type="number"
                  min="0"
                  placeholder="Ex. 120"
                  value={quantite}
                  onChange={(e) => setQuantite(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                />
              </label>
              <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-200">
                <svg viewBox="0 0 20 20" fill="none" className="size-4" aria-hidden="true">
                  <path d="M10 4v12m-6-6h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Ajouter à l’inventaire
              </button>
            </form>
            <p className="mt-4 text-center text-xs leading-5 text-slate-400">Les informations du produit seront enregistrées dans votre stock.</p>
          </aside>
        </section>
        <footer className="pt-8 text-center text-xs text-slate-400">PharmaStock <span className="mx-1">·</span> Gestion des stocks simplifiée</footer>
      </main>
    </div>
  )
}

export default App