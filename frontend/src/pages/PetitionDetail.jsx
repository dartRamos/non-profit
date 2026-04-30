import { useState } from "react"
import image from "../assets/event3.png"
import rectangle from "../assets/rectangle91.png"
import { signupForAction } from "../firebase/actions"
import DonateButton from "../components/DonateButton.jsx";

import "./PetitionDetail.css"

export default function PetitionDetail({ action }) {

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    postalCode: "",
    consent: false,
  })

  const heroImage = action?.image || image

  const handleSignup = async () => {
    if (!form.firstName || !form.lastName || !form.email) {
      alert("Please fill in required fields")
      return
    }

    if (!form.consent) {
      alert("You must agree to receive emails to sign")
      return
    }

    try {
      await signupForAction(action.id, form)

      const res = await fetch("http://localhost:5000/send-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          firstName: form.firstName,
          actionId: action.id,
        }),
      })

      const data = await res.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to send verification email")
      }

      alert("Check your email to confirm your signature")

      setForm({
        firstName: "",
        lastName: "",
        email: "",
        postalCode: "",
        consent: false,
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

      {/* HERO */}
      <div className="header-image-container">
        <img src={heroImage} className="header-image" alt="header" />
        <img src={rectangle} className="rectangle-54" alt="overlay" />
        {/* <DonateButton onClick={() => window.location.href = "/donate"} /> */}
        <div className="image-fade" />
        <div className="header-text">
          <h1 className="line">SIGN THE PETITION</h1>
          <h1 className="line">MAKE YOUR VOICE HEARD</h1>
          <h1 className="line">CREATE CHANGE</h1>
        </div>
      </div>

      {/* MAIN CONTENT*/}
      <div className="container">

        <div className="petition-section">

          <img src={rectangle} className="petition-action-bg" alt="background" />

          <div className="petition-overlay">

            <div className="petition-layout">

              <div className="petition-left">

                <h1 className="petition-title">{action.title}</h1>

                {action.subtitle && (
                  <p className="petition-subtitle">{action.subtitle}</p>
                )}

                <div className="petition-meta-row">
                  {action.location && <span>📍 {action.location}</span>}
                  {action.date && <span>📅 {action.date}</span>}
                </div>

                <div className="petition-description">
                  {action.description?.split("\n").map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>

              </div>

              <div className="petition-right">

                <div className="petition-panel">

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

                    {/* CONSENT CHECKBOX */}
                    <label className="consent-box">
                      <input
                        type="checkbox"
                        checked={form.consent}
                        onChange={(e) =>
                          setForm({ ...form, consent: e.target.checked })
                        }
                      />
                      I agree to receive updates about this campaign
                    </label>

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