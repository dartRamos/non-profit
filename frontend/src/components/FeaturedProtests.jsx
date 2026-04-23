import rectangle62 from "../assets/rectangle62.png"
import "./FeaturedProtests.css"
import { Link } from "react-router-dom"

export default function FeaturedProtests({ protests }) {
  return (
    <div className="featured-container">
      <img src={rectangle62} className="rectangle-62" alt="background" />

      <div className="protests-overlay">
        {protests.slice(0, 2).map((p) => (
          <div key={p.id} className="protest-card">

            {p.image && (
              <img
                src={p.image}
                alt={p.title}
                className="protest-image"
              />
            )}

            <div className="protest-info">

              <div className="protest-main">
                <h3>{p.title}</h3>
                <p>{p.description}</p>
              </div>

              <div className="protest-meta">

                <div className="protest-meta-left">
                  <p className="protest-date">{p.date}</p>
                  <p className="protest-location">{p.location}</p>
                </div>

                <button className="join-btn">Join Now</button>

              </div>

            </div>

          </div>
        ))}
        
        <div className="see-all-container">
          <Link to="/protests" className="see-all-btn"> See All Protests </Link>
        </div>

      </div>
    </div>
  )
}