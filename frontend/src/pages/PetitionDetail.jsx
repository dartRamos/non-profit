import { useState } from "react"
import image from "../assets/event3.png"
import rectangle from "../assets/rectangle91.png"
import { signupForAction } from "../firebase/actions"

import "./PetitionDetail.css"

export default function PetitionDetail({ action }) {

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    postalCode: "",
  })

  const heroImage = action?.image || image

  const handleSignup = async () => {
    if (!form.firstName || !form.lastName || !form.email) {
      alert("Please fill in required fields")
      return
    }

    try {
      await signupForAction(action.id, form)

      alert("Signature added")

      setForm({
        firstName: "",
        lastName: "",
        email: "",
        postalCode: "",
      })

    } catch (err) {
      alert(err.message)
    }
  }

  const signups = action?.stats?.signups || 0
  const goalStep = 100
  const currentGoal = Math.ceil((signups + 1) / goalStep) * goalStep
  const progress = (signups / currentGoal) * 100

  return (
    <div>

      {/* HERO (EXACTLY SAME AS ACTIONDETAIL) */}
      <div className="header-image-container">
        <img src={heroImage} className="header-image" alt="header" />
        <img src={rectangle} className="rectangle-54" alt="overlay" />
        <div className="image-fade" />
        <div className="header-text">
          <h1 className="line">SIGN THE PETITION</h1>
          <h1 className="line">MAKE YOUR VOICE HEARD</h1>
          <h1 className="line">CREATE CHANGE</h1>
        </div>
      </div>

      {/* MAIN CONTENT (COPY OF ACTIONDETAIL STRUCTURE) */}
      <div className="container">

        <div className="action-section">

          {/* BACKGROUND */}
          <img src={rectangle} className="action-bg" alt="background" />

          {/* OVERLAY */}
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

                  <h2>Sign the Petition</h2>

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
                      Sign Petition
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