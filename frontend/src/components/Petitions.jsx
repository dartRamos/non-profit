import { useEffect, useState } from "react"
import { getActions } from "../firebase/actions"
import { Link } from "react-router-dom"
import "./Petitions.css"

function formatDate(date) {
  if (!date) return "No date"

  if (typeof date === "object" && date.toDate) {
    return date.toDate().toLocaleDateString()
  }

  return new Date(date).toLocaleDateString()
}

function truncateText(text, maxLength = 400) {
  if (!text) return ""
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + "..."
}

const getLink = (e) => `/events/${e.id}`

export default function Petitions(
  seeAllLink = "/events",
) {
  const [petitions, setPetitions] = useState([])
  const [visibleCount, setVisibleCount] = useState(4)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPetitions() {
      setLoading(true)

      const data = await getActions()

      const onlyPetitions = data.filter(
        (item) => item.type === "petition"
      )

      setPetitions(onlyPetitions)
      setLoading(false)
    }

    fetchPetitions()
  }, [])

  const visiblePetitions = petitions.slice(0, visibleCount)

  function loadMore() {
    setVisibleCount(prev => prev + 4)
  }

  if (loading) return <p>Loading petitions...</p>

  return (
    <div className="petitions-wrapper">

      <p>Online action items to fight back.
        <br />
        It’s not always possible to show up in-person, or a need doesn’t have such events.
        <br />
        There is power and strength in online actions, and never doubt that you can help make a difference.
      </p>

      <div className="petitions-events-grid">

      {visiblePetitions.map(petition => (
        <div key={petition.id} className="petitions-events-rect">

          <h2 className="petitions-events-title">
            {petition.title}
          </h2>

          <div className="petitions-events-meta-group">

            <p className="petitions-events-desc">
              {petition.description}
            </p>

            <Link to={getLink(petition)} className="petitions-events-link">
              Learn More
            </Link>

          </div>

        </div>
      ))}

    </div>

    <div className="see-more-container">        
      {visibleCount < petitions.length && (
        <button onClick={loadMore} className="load-more-btn">
          Load more
        </button>
      )}
    </div>

    </div>
  )
}