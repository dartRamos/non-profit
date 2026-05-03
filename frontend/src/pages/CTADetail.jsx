import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getActionById, signupForAction } from "../firebase/actions"
import { sendEmail } from "../api/email"
import { normalizeTemplates } from "../utils/normalizeTemplates"

import headerImage from "../assets/image1.png"
import rectangle54 from "../assets/rectangle54.png"
import rectangle from "../assets/rectangle91.png"
import DonateButton from "../components/DonateButton.jsx"

import "./CTADetail.css"

function formatDescription(text = "") {
  let formatted = text

  formatted = formatted.replace(/\n(?!\n)/g, " ") 

  // BOLD
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

  // LINKS
  formatted = formatted.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  )

  // PARAGRAPHS
  const paragraphs = formatted.split(/\n{2,}/)

  return paragraphs
    .map(p => `<p>${p.trim()}</p>`)
    .join("")
}

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

  const isEvent = ["protest", "rally", "townhall"].includes(action?.type)

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
  
  const templates = normalizeTemplates(emailActions.length ? emailActions : action)

  const requiresMPP = templates.some(t => t.requireMppInfo)

  const signups = action?.stats?.signups || 0
  const goalStep = 100
  const currentGoal = Math.ceil((signups + 1) / goalStep) * goalStep
  const progress = (signups / currentGoal) * 100

  const openMPPFinder = () => {
    window.open("https://www.ola.org/en/members/current", "_blank", "noopener,noreferrer")
  }

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

        mppName: form.mppName,
        mppEmail: form.mppEmail,
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

  function renderTemplate(template = "", form, email) {
    const text =
      typeof template === "string"
        ? template
        : template?.body || template?.subject || ""
  
    return text
      .replace(/\\n/g, "\n") // normalize escaped newlines
      .replace(/__recipient_name__/g, email?.recipientName || "")
      .replace(/__recipient_position__/g, email?.recipientPosition || "")
      .replace(/__firstName__/g, form.firstName || "")
      .replace(/__lastName__/g, form.lastName || "")
      .replace(/__email__/g, form.email || "")
      .replace(/__postalCode__/g, form.postalCode || "")
  }

  function renderPreview(text = "") {
    return String(text)
      .split(/\n{2,}/)
      .map((block, i) => {
        const cleaned = block.trim().replace(/\n/g, " ")
  
        return (
          <p key={i}>
            {cleaned}
          </p>
        )
      })
  }

  return (
    <div>

      <div className="header-image-container">
        <img src={headerImage} className="header-image" alt="header" />
        <img src={rectangle54} className="rectangle-54" alt="overlay" />
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
                  <div
                    className="action-description"
                    dangerouslySetInnerHTML={{
                      __html: formatDescription(action.description),
                    }}
                  />
                </div>

              </div>

              {!isEvent && (
                <div className="action-right">

                  <div className="signup-panel">

                    <div className="signup-stats">
                      <div className="signup-number">{signups}</div>
                      <div className="signup-label">
                        people have taken action
                      </div>
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
                                    className={
                                      activeIndex === i ? "active-tab" : ""
                                    }
                                  >
                                    Email {i + 1}
                                  </button>
                                ))}
                              </div>
                            )}

                            <div className="preview-box">
                            {renderPreview(
                              renderTemplate(
                                templates[activeIndex],
                                form,
                                action
                              )
                            )}
                            </div>

                          </div>
                        )}

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
                              setForm({
                                ...form,
                                firstName: e.target.value,
                              })
                            }
                          />

                          <input
                            placeholder="Last Name"
                            value={form.lastName}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                lastName: e.target.value,
                              })
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
                              setForm({
                                ...form,
                                postalCode: e.target.value,
                              })
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
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}