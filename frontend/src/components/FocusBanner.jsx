import Icon from './Icon.jsx'

export default function FocusBanner() {
  return (
    <section className="focus-banner">
      <div className="focus-copy">
        <span className="focus-pill"><span /> STOCK & SÉRÉNITÉ</span>
        <h2>
          Les bons réflexes
          <br />
          font les bons stocks.
        </h2>
        <p>
          Repérez les références à réapprovisionner et gardez un œil sur les dates importantes.
        </p>
        <a href="#inventaire" className="focus-link">
          Explorer l’inventaire <Icon name="arrow" className="size-4" />
        </a>
      </div>
      <div className="focus-art" aria-hidden="true">
        <div className="art-orbit orbit-one" />
        <div className="art-orbit orbit-two" />
        <div className="art-pill"><span /><i /></div>
        <div className="art-spark spark-one">✳</div>
        <div className="art-spark spark-two">✦</div>
        <div className="art-dot" />
      </div>
    </section>
  )
}
