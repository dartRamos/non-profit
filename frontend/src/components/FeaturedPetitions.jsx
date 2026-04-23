import rectangle62 from "../assets/rectangle62.png"
import "./FeaturedPetitions.css"

export default function FeaturedEvents({ petitions }) {
  return (
    <div>
      <img src={rectangle62} className="rectangle-62" alt="rectangle-62"/>

      {petitions.map((p) => (
        <div key={p.id}>
          <h3>{p.title}</h3>
          <p>{p.description}</p>
        </div>
      ))}
    </div>
  )
}