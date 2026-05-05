import { Link } from "react-router-dom";
import "./ActionsGrid.css";

function formatDescription(text = "") {
  return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
}

export default function ActionGrid({
  items = [],
  baseLink = "/actions",
  emptyMessage = "No actions available at the moment. Please check back later!",
}) {
  return (
    <div className="grid-section">
      <div className="grid-wrapper">
        <div className="events-grid">
          {items.length === 0 && <p>{emptyMessage}</p>}

          {items.map((item) => {
            const isActive = item.active !== false;

            return (
              <div key={item.id} className="event-card">
                <div className="event-content">
                  <h2 className="event-title">{item.title}</h2>

                  <div className="event-meta">
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
                    className={`event-btn ${!isActive ? "inactive" : ""}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {isActive ? "Learn More" : "Inactive"}
                  </a>
                ) : (
                  <Link
                    to={`${baseLink}/${item.id}`}
                    className={`event-btn ${!isActive ? "inactive" : ""}`}
                  >
                    {isActive ? "Learn More" : "Inactive"}
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
