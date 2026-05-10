import "./DonateButton.css"

export default function DonateButton({ onClick, className = "" }) {
  return (
    <button
      className={`donate-button ${className}`}
      onClick={onClick}
    >
      DONATE NOW
    </button>
  )
}