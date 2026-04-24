import "./FeaturedPetitions.css"
import rectangle62 from "../assets/rectangle62.png"
import { Link } from "react-router-dom"

export default function FeaturedPetitions({ petitions }) {
  return (
    <div className="featured-petitions-container">
      
      <img src={rectangle62} className="rectangle-62" alt="background" />

      <div className="petitions-overlay">

        <div className="content-wrapper">

          <div className="petitions-list">
            {petitions.slice(0, 3).map((p) => (
              <div key={p.id} className="petition-card">

                <div className="petition-info">
                  <h3>{p.title}</h3>
                  <p>{p.description}</p>
                </div>

                <a
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="petition-btn"
                >
                  Act Now
                </a>

              </div>
            ))}
          </div>

          <div className="see-all-container">
            <Link to="/protests" className="see-all-btn-2">
              See All Petitions
            </Link>
          </div>

          <div className="text-lines-2">
            <p className="left">Together, we can make a change</p>
            <p className="right">We must fight for what is right</p>
          </div>

        </div>

      </div>
    </div>
  )
}