export default function PageFooter() {
  return (
    <footer className="page-footer">
      <span>PHARMASTOCK</span>
      <span>Fait pour mieux prendre soin de vos stocks.</span>
      <span>© {new Date().getFullYear()}</span>
    </footer>
  )
}
