import "./Events.css"

export default function Events() {
  return (
    <div className="events-page">

      <div className="events-hero">
        <h1 className="events-title">Events</h1>
        <p className="events-subtitle">
          Protests, rallies, town halls, and community actions across Ontario
        </p>
      </div>

      <div className="container">

        <div className="events-filters">
          <button className="filter-btn">All</button>
          <button className="filter-btn">Protests</button>
          <button className="filter-btn">Town Halls</button>
          <button className="filter-btn">Community</button>
        </div>

        <div className="events-list">

          <div className="event-card">
            <div className="event-image-placeholder" />

            <div className="event-content">
              <h2 className="event-title">Example Event Title</h2>

              <p className="event-description">
                Short description of the event goes here. This will later come from Firebase.
              </p>

              <div className="event-meta">
                <p>Date: TBD</p>
                <p>Location: Ontario</p>
              </div>

              <button className="event-button">View Details</button>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}