import "./FeaturedActions.css"
import rectangleCTA from "../assets/rectangle79.png"
import { Link } from "react-router-dom"

function truncate(text = "", maxLength = 140) {
  if (!text) return ""
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + "..."
}

const ACTION_TYPES = ["cta", "petition", "email"]

export default function FeaturedActions({
  actions = [],
  maxItems = 6,
  title,
  buttonText = "Take Action",
  seeAllLink = "/actions",
  variant = "grid",
}) {

  const filtered = (actions || [])
  .filter((a) => ACTION_TYPES.includes(a.type))
  .sort((a, b) => (b.priority === true) - (a.priority === true))
  .slice(0, maxItems)

  const getLink = (a) => {
    return a.link || `/actions/${a.id}`
  }

  return (
    <div className="featured-actions-container">

      <img src={rectangleCTA} className="featured-actions-bg" alt="background" />

      <div className="featured-actions-overlay">
        <div className="image-fade-2" />
        <div className="image-fade" />
        <div className="featured-actions-wrapper">

          <h2 className="featured-actions-title">{title}</h2>

          <div className={`featured-actions-list ${variant}`}>

            {filtered.map((a) => (
              <div key={a.id} className="featured-actions-card">

                <div className="featured-actions-info">

                  <h3>{a.title}</h3>

                  {a.tag && (
                    <div className="featured-actions-tag">
                      {a.tag}
                    </div>
                  )}
                  
                  <p>
                    {truncate(a.shortdescription || a.description, 300)}
                  </p>
                  
                </div>
                
                {a.link ? (
                  <a
                    href={a.link}
                    className={`featured-actions-btn ${a.priority ? "priority-btn" : ""}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {a.priority ? "PRIORITY" : buttonText}
                  </a>
                ) : (
                  <Link
                    to={`/actions/${a.id}`}
                    className={`featured-actions-btn ${a.priority ? "priority-btn" : ""}`}
                  >
                    {a.priority ? "PRIORITY" : buttonText}
                  </Link>
                )}

              </div>
            ))}

          </div>

          <div className="featured-actions-see-all-container">
            <Link to={seeAllLink} className="featured-actions-see-all-btn">
              See All
            </Link>
          </div>

        </div>

      </div>
    </div>
  )
}