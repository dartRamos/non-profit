import "./FeaturedEvents.css";
import rectangleCTA from "../assets/rectangle79.png";
import { Link } from "react-router-dom";
import protestImg from "../assets/event5.png";
import rallyImg from "../assets/event4.png";
import townhallImg from "../assets/event1.png";

function truncate(text = "", maxLength = 140) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

export default function FeaturedEvents({
  events = [],
  maxItems = 3,
  title = "Join Events",
  buttonText = "View Details",
  seeAllLink = "/events",
  leftText = "Together, we can make a change",
  rightText = "We must fight for what is right",
}) {
  const filtered = (events || [])
    .slice(0, maxItems);

  const getLink = (e) => `/events/${e.id}`;

  return (
    <div className="featured-actions-container">
      {/* background */}
      <img
        src={rectangleCTA}
        className="featured-actions-bg"
        alt="background"
      />

      <div className="featured-actions-overlay">
        <div className="image-fade-2" />
        <div className="image-fade" />
        <div className="featured-actions-wrapper">
          <h2 className="featured-actions-title">{title}</h2>

          {/* STACKED LAYOUT */}
          <div className="featured-events-column">
            {filtered.map((e, index) => (
              <div key={e.id} className="featured-event-card-split">
                {/* LEFT IMAGE */}
                <div className="featured-event-image">
                  <img
                    src={e.image}
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
                      <span className="event-date">
                        {e.date ? e.date : "\u00A0"}
                      </span>

                      <p className="event-meta">{e.location}</p>
                    </div>

                      {e.link ? (
                        <a
                          href={e.link}
                          className="featured-events-btn"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {buttonText}
                        </a>
                      ) : (
                        <Link to={getLink(e)} className="featured-events-btn">
                          {buttonText}
                        </Link>
                      )}

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
  );
}
