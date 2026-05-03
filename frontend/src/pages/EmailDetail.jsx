import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getActionById, signupForAction } from "../firebase/actions"
import { sendEmail } from "../api/email"
import { normalizeTemplates } from "../utils/normalizeTemplates"

import headerImage from "../assets/event5.png"
import rectangle54 from "../assets/rectangle54.png"
import rectangle from "../assets/rectangle91.png"
import "./EmailDetail.css"
import DonateButton from "../components/DonateButton.jsx"

export default function EmailDetail() {
  const { id } = useParams()

  const [email, setEmail] = useState(null)
  const [loading, setLoading] = useState(true)

  const [activePreviewIndex, setActivePreviewIndex] = useState(0)

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    postalCode: "",
    consent: false,
    comment: "",
  })

  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    async function load() {
      const found = await getActionById(id)
      setEmail(found)
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return <p>Loading...</p>
  if (!email) return <p>Email campaign not found</p>

  const openMPPFinder = () => {
    window.open("https://www.ola.org/en/members/current", "_blank", "noopener,noreferrer")
  }

  const handleSubmit = async () => {
    const { firstName, lastName, email: userEmail, postalCode } = form

    if (!firstName || !lastName || !userEmail || !postalCode) {
      alert("Please fill in all required fields")
      return
    }

    try {
      await signupForAction(id, form)

      const templates = normalizeTemplates(email)

      await sendEmail({
        recipientName: email.recipientName,
        recipientPosition: email.recipientPosition,
        firstName,
        lastName,
        email: userEmail,
        postalCode,
        messages: templates,

        mppName: form.mppName,
        mppEmail: form.mppEmail,
      })

      setSubmitted(true)

      setEmail((prev) => ({
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

  function renderTemplate(template = "", form, email) {
    const text =
      typeof template === "string"
        ? template
        : template?.body || template?.subject || ""
  
    return text
      .replace(/__recipient_name__/g, email?.recipientName || "recipient name")
      .replace(/__recipient_position__/g, email?.recipientPosition || "recipient position")
      .replace(/__firstName__/g, form.firstName || "first name")
      .replace(/__lastName__/g, form.lastName || "last name")
      .replace(/__email__/g, form.email || "email")
      .replace(/__postalCode__/g, form.postalCode || "postal code")
  }

  function renderPreview(text) {
    const placeholders = {
      __firstName__: "first name",
      __lastName__: "last name",
      __email__: "email",
      __postalCode__: "postal code",
      __recipient_name__: "recipient name",
      __recipient_position__: "recipient position",
    }

    return text.split("\n").map((line, i) => {
      const parts = line.split(
        /(__firstName__|__lastName__|__email__|__postalCode__|__recipient_name__|__recipient_position__)/
      )

      return (
        <p key={i}>
          {parts.map((part, j) => {
            if (placeholders[part]) {
              return (
                <em key={j} className="email-placeholder">
                  {placeholders[part]}
                </em>
              )
            }
            return part
          })}
        </p>
      )
    })
  }

  const templates = normalizeTemplates(email)

  const requiresMPP = templates.some(t => t.requireMppInfo === true)

  const signups = email?.stats?.signups || 0
  const goalStep = 100
  const currentGoal = Math.ceil((signups + 1) / goalStep) * goalStep
  const progress = (signups / currentGoal) * 100

  return (
    <div>

      <div className="header-image-container">
        <img src={headerImage} className="email-header-image" alt="header" />
        <img src={rectangle54} className="rectangle-54" alt="overlay" />
        <div className="image-fade" />

        <div className="header-text">
          <h1 className="line">SEND A EMAIL</h1>
          <h1 className="line">MAKE IMPACT</h1>
          <h1 className="line">BE HEARD</h1>
        </div>
      </div>

      <div className="container">
        <div className="action-section">
          <img src={rectangle} className="action-bg" alt="background" />

          <div className="action-overlay">
            <div className="action-layout">

              <div className="action-left">
                <h1 className="action-title">{email.title}</h1>

                <div className="action-meta-row">
                  {email.location && <span>📍 {email.location}</span>}
                  {email.date && <span>📅 {email.date}</span>}
                </div>

                <div className="action-description">
                  {email.description?.split("\n").map((line, i) => (
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

                      <div className="email-preview">
                        <h3>Email Preview</h3>

                        {templates.length > 1 && (
                          <div className="email-tabs">
                            {templates.map((_, i) => (
                              <button
                                key={i}
                                onClick={() => setActivePreviewIndex(i)}
                                className={activePreviewIndex === i ? "active-tab" : ""}
                              >
                                Email {i + 1}
                              </button>
                            ))}
                          </div>
                        )}

                        <div className="preview-box">
                          {renderPreview(
                            renderTemplate(
                              templates[activePreviewIndex],
                              form,
                              email
                            )
                          )}
                        </div>
                      </div>

                      <div className="signup-box">

                        {requiresMPP && (
                          <>
                            <input
                              placeholder="MPP Name"
                              value={form.mppName || ""}
                              onChange={(e) =>
                                setForm({ ...form, mppName: e.target.value })
                              }
                            />

                            <input
                              placeholder="MPP Email"
                              value={form.mppEmail || ""}
                              onChange={(e) =>
                                setForm({ ...form, mppEmail: e.target.value })
                              }
                            />
                          </>
                        )}

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

                      <div className="submit-row">
                        <button onClick={handleSubmit}>
                          Submit
                        </button>

                        {requiresMPP && (
                          <button
                            type="button"
                            onClick={openMPPFinder}
                          >
                            Find Your MPP
                          </button>
                        )}
                      </div>

                      </div>
                    </>
                  ) : (
                    <div className="success-message">
                      <h2>Thank you for taking action</h2>
                      <p>Your message is being sent.</p>
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