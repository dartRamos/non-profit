import "./FeaturedActions.css"
import rectangleCTA from "../assets/rectangle79.png"
import { Link } from "react-router-dom"

function truncate(text = "", maxLength = 140) {
  if (!text) return ""
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + "..."
}

export default function FeaturedActions({
  actions = [],
  maxItems = 6,
  title,
  buttonText = "Take Action",
  seeAllLink = "/actions",
  leftText = "Your voice matters",
  rightText = "Real action creates real change",
  variant = "grid",
}) {

  const filtered = (actions || []).slice(0, maxItems)

  const getLink = (a) => {
    return `/actions/${a.id}`
  }

  return (
    <div className="featured-actions-container">

      <img src={rectangleCTA} className="featured-actions-bg" alt="background" />

      <div className="featured-actions-overlay">

        <div className="featured-actions-wrapper">

          <h2 className="featured-actions-title">{title}</h2>

          <div className={`featured-actions-list ${variant}`}>

            {filtered.map((a) => (
              <div key={a.id} className="featured-actions-card">

                <div className="featured-actions-info">
                  <h3>{a.title}</h3>

                  <p>
                    {truncate(a.shortdescription || a.description, 300)}
                  </p>
                </div>

                <Link to={getLink(a)} className="featured-actions-btn">
                  {buttonText}
                </Link>

              </div>
            ))}

          </div>

          <div className="featured-actions-see-all-container">
            <Link to={seeAllLink} className="featured-actions-see-all-btn">
              See All
            </Link>
          </div>

          <div className="featured-actions-text-lines">
            <p className="featured-actions-left">{leftText}</p>
            <p className="featured-actions-right">{rightText}</p>
          </div>

        </div>

      </div>
    </div>
  )
}