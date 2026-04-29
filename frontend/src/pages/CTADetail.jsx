import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getActionById, signupForAction } from "../firebase/actions"
import { sendEmail } from "../api/email"

import headerImage from "../assets/image1.png"
import rectangle54 from "../assets/rectangle54.png"
import rectangle from "../assets/rectangle91.png"
import DonateButton from "../components/DonateButton.jsx";

import "./CTADetail.css"

export default function ActionDetail() {
  const { id } = useParams()

  const [action, setAction] = useState(null)
  const [loading, setLoading] = useState(true)

  const [activeIndex, setActiveIndex] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    postalCode: "",
    consent: false,
    comment: "",
  })

  useEffect(() => {
    async function load() {
      const found = await getActionById(id)
      setAction(found)
      setLoading(false)
    }

    load()
  }, [id])

  if (loading) return <p>Loading...</p>
  if (!action) return <p>Action not found</p>

  const ctaActions = Array.isArray(action.ctaActions) ? action.ctaActions : []

  const emailActions = ctaActions.filter((a) => a.type === "email")

  const templates = emailActions.length
    ? emailActions
    : action.emailTemplates
      ? action.emailTemplates
      : action.emailTemplate
        ? [action.emailTemplate]
        : [action.description]

  const signups = action?.stats?.signups || 0
  const goalStep = 100
  const currentGoal = Math.ceil((signups + 1) / goalStep) * goalStep
  const progress = (signups / currentGoal) * 100

  const handleSubmit = async () => {
    if (!form.firstName || !form.lastName || !form.email || !form.postalCode) {
      alert("Please fill in required fields")
      return
    }

    try {
      await signupForAction(id, form)

      await sendEmail({
        recipientName: action.recipientName,
        recipientPosition: action.recipientPosition,
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        postalCode: form.postalCode,
        messages: templates,
      })

      setSubmitted(true)

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

  function renderTemplate(template = "", form, action) {
    const text = typeof template === "string" ? template : template.body || ""

    return text
      .replace(/__recipient_name__/g, action?.recipientName || "recipient full name will go here")
      .replace(/__recipient_position__/g, action?.recipientPosition || "recipient position will go here")
      .replace(/__firstName__/g, form.firstName || "first name will go here")
      .replace(/__lastName__/g, form.lastName || "last name will go here")
      .replace(/__email__/g, form.email || "email will go here")
      .replace(/__postalCode__/g, form.postalCode || "postal code will go here")
  }

  const renderPreview = (text = "") => {
    return text.split("\n").map((line, i) => (
      <p key={i}>{line}</p>
    ))
  }

  return (
    <div>

      <div className="header-image-container">
        <img src={headerImage} className="header-image" alt="header" />
        <img src={rectangle54} className="rectangle-54" alt="overlay" />
        <DonateButton onClick={() => window.location.href = "/donate"} />
        <div className="image-fade" />

        <div className="header-text">
          <h1 className="line">USE YOUR VOICE</h1>
          <h1 className="line">TAKE ACTION</h1>
          <h1 className="line">MAKE CHANGE</h1>
        </div>
      </div>

      <div className="container">
        <div className="action-section">

          <img src={rectangle} className="action-bg" alt="background" />

          <div className="action-overlay">
            <div className="action-layout">

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

              <div className="action-right">

                <div className="signup-panel">

                  <div className="signup-stats">
                    <div className="signup-number">{signups}</div>
                    <div className="signup-label">people have taken action</div>
                    <div className="signup-goal">Goal: {currentGoal}</div>
                  </div>

                  <div className="signup-bar">
                    <div
                      className="signup-bar-fill"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>

                  {!submitted ? (
                    <>
                      <h2>Take Action</h2>

                      {emailActions.length > 0 && (
                        <div className="email-preview">

                          <h3>Email Preview</h3>

                          {emailActions.length > 1 && (
                            <div className="email-tabs">
                              {emailActions.map((_, i) => (
                                <button
                                  key={i}
                                  onClick={() => setActiveIndex(i)}
                                  className={activeIndex === i ? "active-tab" : ""}
                                >
                                  Email {i + 1}
                                </button>
                              ))}
                            </div>
                          )}

                          <div className="preview-box">
                            {renderPreview(
                              renderTemplate(
                                emailActions[activeIndex],
                                form,
                                action
                              )
                            )}
                          </div>

                        </div>
                      )}

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

                        <input
                          placeholder="Why does this matter to you? (optional)"
                          value={form.comment}
                          onChange={(e) =>
                            setForm({ ...form, comment: e.target.value })
                          }
                          className="comment-box"
                        />

                        <button onClick={handleSubmit}>
                          Submit
                        </button>

                      </div>
                    </>
                  ) : (
                    <div className="success-message">
                      <h2>Thank you for taking action</h2>
                      <p>Your message is ready.</p>
                    </div>
                  )}

                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}