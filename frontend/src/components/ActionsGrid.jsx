import { Link } from "react-router-dom"
import "./ActionsGrid.css"

function formatDate(date) {
  if (!date) return "No date"
  if (typeof date === "object" && date.toDate) {
    return date.toDate().toLocaleDateString()
  }
  return new Date(date).toLocaleDateString()
}

export default function ActionGrid({
  items = [],
  baseLink = "/actions",
  emptyMessage = "No items found",
}) {
  return (
    <div className="grid-section">

      <div className="grid-wrapper">

        <div className="events-grid">

          {items.length === 0 && <p>{emptyMessage}</p>}

          {items.map((item) => (
            <div key={item.id} className="event-card">

              <div className="event-content">

                <h2 className="event-title">{item.title}</h2>

                <div className="event-meta">
                  
                  {item.tag && (
                    <div className="event-tag">
                      {item.tag}
                    </div>
                  )}

                  {item.type !== "cta" &&
                    item.type !== "email" &&
                    item.type !== "petition" && (
                      <>
                        <br />
                        {item.location}
                      </>
                    )}
                </div>

                <div className="event-desc">
                  {item.description}
                </div>
              </div>

              {item.link ? (
                <a
                  href={item.link}
                  className="event-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn More
                </a>
              ) : (
                <Link to={`${baseLink}/${item.id}`} className="event-btn">
                  Learn More
                </Link>
              )}

            </div>
          ))}

        </div>

      </div>

    </div>
  )
}