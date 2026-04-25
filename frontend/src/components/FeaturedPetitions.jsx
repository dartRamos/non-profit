import "./FeaturedPetitions.css"
import rectangle62 from "../assets/rectangle62.png"
import { Link } from "react-router-dom"

export default function FeaturedPetitions({ petitions }) {

  const featured = (petitions || [])
    .filter(p => p.type === "petition" && p.featured)
    .slice(0, 3)

  return (
    <div className="featured-petitions-container">

      <img src={rectangle62} className="rectangle-62" alt="background" />

      <div className="petitions-overlay">

        <div className="content-wrapper">

          <div className="petitions-list">

            {featured.map((p) => (
              <div key={p.id} className="petition-card">

                <div className="petition-info">
                  <h3>{p.title}</h3>

                  <p>
                    {(p.description || "").length > 140
                      ? p.description.slice(0, 140) + "..."
                      : p.description}
                  </p>
                </div>

                <Link
                  to={`/actions/${p.id}`}
                  className="petition-btn"
                >
                  Add Your Name
                </Link>

              </div>
            ))}

          </div>

          <div className="see-all-container">
            <Link to="/actions" className="see-all-btn-2">
              See All Petitions
            </Link>
          </div>

          <div className="text-lines-2">
            <p className="left-2">Together, we can make a change</p>
            <p className="right-2">We must fight for what is right</p>
          </div>

        </div>

      </div>
    </div>
  )
}