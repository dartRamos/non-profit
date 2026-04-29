import { useEffect, useState } from "react"
import { getActions } from "../firebase/actions"
import "./Emails.css"
import { Link } from "react-router-dom"

export default function CTAs() {
  const [actions, setActions] = useState([])
  const [visibleCount, setVisibleCount] = useState(9)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchActions() {
      setLoading(true)
      const data = await getActions()
      setActions(data)
      setLoading(false)
    }

    fetchActions()
  }, [])

  const ctaActions = actions.filter((a) => a.type === "cta")
  const visibleActions = ctaActions.slice(0, visibleCount)

  function loadMore() {
    setVisibleCount((prev) => prev + 9)
  }

  if (loading) return <p>Loading actions...</p>

  return (
    <div className="ctas-wrapper">
      <p>View active campaigns and take action to make an impact.</p>

      <div className="ctas-events-grid">
        {visibleActions.map((action) => (
          <div className="ctas-events-card">

          <div className="ctas-content">
            <h2 className="ctas-events-title">{action.title}</h2>
        
            <div className="ctas-meta-group">      
              <p className="ctas-events-desc">
                {action.description}
              </p>
            </div>
          </div>
        
          <Link
            to={`/actions/${action.id}`}
            className="ctas-learn-more"
          >
            Learn More
          </Link>
        
        </div>
        ))}
      </div>

      <div className="see-more-container">
        {visibleCount < ctaActions.length && (
          <button onClick={loadMore} className="load-more-btn">
            Load more
          </button>
        )}
      </div>

    </div>
  )
}