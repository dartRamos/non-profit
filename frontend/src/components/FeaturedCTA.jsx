import "./FeaturedCTA.css"
import rectangleCTA from "../assets/rectangle62.png"
import { Link } from "react-router-dom"

// helper
function truncate(text = "", maxLength = 140) {
  if (!text) return ""
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + "..."
}

export default function FeaturedCTA({ actions }) {

  const ctas = (actions || [])
    .filter(a => a.type === "cta")
    .slice(0, 3)

  return (
    <div className="featured-cta-container">

      <img src={rectangleCTA} className="rectangle-cta" alt="background" />

      <div className="cta-overlay">

        <div className="content-wrapper">

          <div className="cta-list">
            {ctas.map((a) => (
              <div key={a.id} className="cta-card">

                <div className="cta-info">
                  <h3>{a.title}</h3>

                  <p>
                    {truncate(a.shortDescription || a.description, 300)}
                  </p>

                </div>

                <Link to={`/actions/${a.id}`} className="cta-btn">
                  Take Action
                </Link>

              </div>
            ))}
          </div>

          <div className="see-all-container">
            <Link to="/actions" className="see-all-btn">
              See All Actions
            </Link>
          </div>

          <div className="text-lines-cta">
            <p className="left-cta">Your voice matters</p>
            <p className="right-cta">Real action creates real change</p>
          </div>

        </div>

      </div>
    </div>
  )
}