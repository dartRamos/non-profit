import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getActionById, signupForAction } from "../firebase/actions"
import headerImage from "../assets/image1.png"
import rectangle54 from "../assets/rectangle54.png"
import rectangle from "../assets/rectangle91.png"

import "./ActionDetail.css"

export default function ActionDetail() {
  const { id } = useParams()

  const [action, setAction] = useState(null)
  const [loading, setLoading] = useState(true)

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    postalCode: "",
  })

  useEffect(() => {
    async function load() {
      const found = await getActionById(id)
      setAction(found)
      setLoading(false)
    }

    load()
  }, [id])

  const handleSignup = async () => {
    if (!form.firstName || !form.lastName || !form.email) {
      alert("Please fill in required fields")
      return
    }

    try {
      await signupForAction(id, form)

      alert("You're signed up")

      setForm({
        firstName: "",
        lastName: "",
        email: "",
        postalCode: "",
      })

      setAction((prev) => ({
        ...prev,
        stats: {
          signups: (prev?.stats?.signups || 0) + 1,
        },
      }))
    } catch (err) {
      console.error(err)
      alert("Something went wrong. Please try again.")
    }
  }

  if (loading) return <p>Loading...</p>
  if (!action) return <p>Action not found</p>

  const signups = action?.stats?.signups || 0
  const goalStep = 100

  const currentGoal =
    Math.ceil((signups + 1) / goalStep) * goalStep

  const progress = (signups / currentGoal) * 100

  return (
    <div>
      {/* HERO */}
      <div className="header-image-container">
        <img src={headerImage} className="header-image" alt="header" />
        <img src={rectangle54} className="rectangle-54" alt="overlay" />
        <div className="image-fade" />
        <div className="header-text">
          <h1 className="line">SIGN UP NOW</h1>
          <h1 className="line">STAY INFORMED</h1>
          <h1 className="line">FIGHT BACK</h1>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="container">

      <div className="action-section">

        {/* BACKGROUND */}
        <img src={rectangle} className="action-bg" alt="background" />

        {/* OVERLAY CONTENT */}
        <div className="action-overlay">

          <div className="action-layout">

            {/* LEFT SIDE */}
            <div className="action-left">

              <h1 className="action-title">{action.title}</h1>

              {action.subtitle && (
                <p className="action-subtitle">{action.subtitle}</p>
              )}

              <div className="action-meta-row">
                {action.location && <span>📍 {action.location}</span>}
                {action.date && <span>📅 {action.date}</span>}
              </div>

              <div className="action-description">
                {action.description?.split("\n").map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>

            </div>

            {/* RIGHT SIDE */}
            <div className="action-right">

              <div className="signup-panel">

                <div className="signup-stats">
                  <div className="signup-number">{signups}</div>
                  <div className="signup-label">people have signed</div>

                  <div className="signup-goal">
                    Goal: {currentGoal}
                  </div>
                </div>

                <div className="signup-bar">
                  <div
                    className="signup-bar-fill"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>

                <h2>Take Action</h2>

                <div className="signup-box">

                  <input
                    placeholder="First Name"
                    value={form.firstName}
                    onChange={(e) =>
                      setForm({ ...form, firstName: e.target.value })
                    }
                  />

                  <input
                    placeholder="Last Name"
                    value={form.lastName}
                    onChange={(e) =>
                      setForm({ ...form, lastName: e.target.value })
                    }
                  />

                  <input
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />

                  <input
                    placeholder="Postal Code"
                    value={form.postalCode}
                    onChange={(e) =>
                      setForm({ ...form, postalCode: e.target.value })
                    }
                  />

                  <button onClick={handleSignup}>
                    Sign Up
                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>
      </div>
      </div>
    </div>
  )
}