import Icon from './Icon.jsx'

export function ErrorFeedback({ message }) {
  if (!message) return null

  return (
    <div className="feedback error-feedback" role="alert">
      <Icon name="alert" />
      {message}
    </div>
  )
}

export function SuccessFeedback({ message, onDismiss }) {
  if (!message) return null

  return (
    <div className="feedback success-feedback" role="status">
      <Icon name="check" />
      {message}
      <button type="button" onClick={onDismiss} aria-label="Fermer">
        <Icon name="close" />
      </button>
    </div>
  )
}
