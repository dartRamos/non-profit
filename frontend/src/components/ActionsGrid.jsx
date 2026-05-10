import { Link } from "react-router-dom";
import "./ActionsGrid.css";

function formatDescription(text = "") {
  return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
}

export default function ActionGrid({
  items = [],
  baseLink = "/actions",
  emptyMessage = "No actions available at the moment. Please check back later!",
  sectionDescription = "",
}) {
  return (
    <div className="grid-section">
      <div className="grid-wrapper">
        {sectionDescription && (
          <p className="section-description">{sectionDescription}</p>
        )}

        <div className="events-grid">
          {items.length === 0 && <p>{emptyMessage}</p>}

          {[...items]
            .sort((a, b) => {
              const aInactive = a.active === false;
              const bInactive = b.active === false;

              const aPriority = a.priority === true;
              const bPriority = b.priority === true;

              if (aInactive !== bInactive) return aInactive ? 1 : -1;

              if (aPriority !== bPriority) return aPriority ? -1 : 1;

              return 0;
            })
            .map((item) => {
            const isActive = item.active !== false;

            const label = !isActive
              ? "INACTIVE"
              : item.priority
              ? "PRIORITY"
              : "Learn More";

            return (
              <div
                key={item.id}
                className={`event-card ${!isActive ? "inactive-card" : ""}`}
              >
                <div className="event-content">
                  <h2 className="event-title">{item.title}</h2>

                  <div className="event-meta">
                    {(item.date || item.location) && (
                      <div className="event-info">
                        <span className="event-date">
                          {item.date ? item.date : "\u00A0"}
                        </span>
                      
                        <span className="event-location">
                          {item.location ? item.location : "\u00A0"}
                        </span>
                      </div>
                    )}

                    {item.tag && <div className="event-tag">{item.tag}</div>}
                  </div>

                  <div
                    className="event-desc"
                    dangerouslySetInnerHTML={{
                      __html: formatDescription(item.description),
                    }}
                  />
                </div>

                {item.link ? (
                  <a
                    href={item.link}
                    className={`event-btn ${!isActive ? "inactive" : ""} ${
                      item.priority ? "priority-btn" : ""
                    }`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {label}
                  </a>
                ) : (
                  <Link
                    to={`${baseLink}/${item.id}`}
                    className={`event-btn ${!isActive ? "inactive" : ""} ${
                      item.priority ? "priority-btn" : ""
                    }`}
                  >
                    {label}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}