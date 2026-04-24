import { useEffect, useState } from "react"
import { getProtests } from "../firebase/protests"
import "./Protests.css"
import { Link } from "react-router-dom"

function formatDate(date) {
  if (!date) return "No date"

  if (typeof date === "object" && date.toDate) {
    return date.toDate().toLocaleDateString()
  }

  return new Date(date).toLocaleDateString()
}

export default function Protests() {
  const [protests, setProtests] = useState([])
  const [visibleCount, setVisibleCount] = useState(9)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProtests() {
      setLoading(true)
      const data = await getProtests()
      setProtests(data)
      setLoading(false)
    }

    fetchProtests()
  }, [])

  const visibleProtests = protests.slice(0, visibleCount)

  function loadMore() {
    setVisibleCount(prev => prev + 9)
  }

  if (loading) return <p>Loading protests...</p>

  return (
    <div className="protests-wrapper">

    <p>View upcoming protests and see how you can become involved.</p>
      <div className="protests-events-grid">

        {visibleProtests.map(protest => (
          <div key={protest.id} className="protests-events-card">

            <h2 className="protests-events-title">
              {protest.title}
            </h2>

            <div className="protests-meta-group">

              <p className="protests-events-meta">
                {formatDate(protest.date)}
                <br />
                {protest.location}
              </p>

              <p className="protests-events-desc">
                {protest.description}
              </p>

              {/* Learn more CTA */}
              <Link
                to={`/protests/${protest.id}`}
                className="protests-learn-more"
              >
                Learn More
              </Link>

            </div>

          </div>
        ))}

      </div>

      <div className="see-more-container">
      {visibleCount < protests.length && (
        <button onClick={loadMore} className="load-more-btn">
          Load more
        </button>
      )}
      </div>

    </div>
  )
}