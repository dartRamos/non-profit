import "./DonateButton.css"

export default function DonateButton({ onClick }) {
  return (
    <button className="donate-button" onClick={onClick}>
      DONATE NOW
    </button>
  )
}