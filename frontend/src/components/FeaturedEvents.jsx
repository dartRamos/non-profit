import "./FeaturedEvents.css"
import rectangleCTA from "../assets/rectangle79.png"
import { Link } from "react-router-dom"
import protestImg from "../assets/event5.png"
import rallyImg from "../assets/event4.png"
import townhallImg from "../assets/event1.png"


function truncate(text = "", maxLength = 140) {
  if (!text) return ""
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + "..."
}

function formatDate(dateStr) {
  if (!dateStr) return ""
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

const EVENT_TYPES = ["protest", "rally", "townhall"]

const EVENT_IMAGES = {
  protest: protestImg,
  rally: rallyImg,
  townhall: townhallImg,
}

export default function FeaturedEvents({
  events = [],
  maxItems = 3,
  title = "Join Events",
  buttonText = "View Details",
  seeAllLink = "/actions",
  leftText = "Show up. Speak out.",
  rightText = "Real change happens together",
}) {

  const filtered = (events || [])
  .filter((e) => EVENT_TYPES.includes(e.type))
  .slice(0, maxItems)

console.log("FEATURED EVENTS:", filtered)

  const getLink = (e) => `/actions/${e.id}`

  return (
    <div className="featured-actions-container">

      {/* background */}
      <img src={rectangleCTA} className="featured-actions-bg" alt="background" />

      <div className="featured-actions-overlay">

        <div className="featured-actions-wrapper">

          <h2 className="featured-actions-title">{title}</h2>

          {/* ✅ STACKED LAYOUT (3 ROWS) */}
          <div className="featured-events-column">

            {filtered.map((e) => (
              <div key={e.id} className="featured-event-card-split">

                {/* LEFT IMAGE */}
                <div className="featured-event-image">
                  <img
                    src={EVENT_IMAGES[e.type] || protestImg}
                    alt={e.title}
                  />
                </div>

                {/* RIGHT CONTENT */}
                <div className="featured-event-content">

                  <h3 className="featured-event-title">{e.title}</h3>

                  <p className="featured-event-description">
                    {truncate(e.shortdescription || e.description, 300)}
                  </p>

                  {/* bottom row */}
                  <div className="featured-event-bottom">
                    
                    <div className="featured-event-meta-group">
                      <p className="event-meta">
                        {formatDate(e.date)}
                      </p>

                      <p className="event-meta">
                        {e.location}
                      </p>
                    </div>

                    <Link to={getLink(e)} className="featured-events-btn">
                      {buttonText}
                    </Link>

                  </div>

                </div>

              </div>
            ))}

          </div>

          {/* SEE ALL */}
          <div className="featured-actions-see-all-container">
            <Link to={seeAllLink} className="featured-actions-see-all-btn">
              See All
            </Link>
          </div>

          {/* BOTTOM TEXT */}
          <div className="featured-events-text-lines">
            <p className="featured-events-left">{leftText}</p>
            <p className="featured-events-right">{rightText}</p>
          </div>

        </div>

      </div>
    </div>
  )
}