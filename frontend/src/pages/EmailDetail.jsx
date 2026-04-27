import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getActionById, signupForAction } from "../firebase/actions"
import { sendEmail } from "../api/email"

import headerImage from "../assets/event5.png"
import rectangle54 from "../assets/rectangle54.png"
import rectangle from "../assets/rectangle91.png"

import "./EmailDetail.css"

export default function EmailDetail() {
  const { id } = useParams()

  const [email, setEmail] = useState(null)
  const [loading, setLoading] = useState(true)

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    postalCode: "",
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

  const handleSubmit = async () => {
    if (!form.firstName || !form.lastName || !form.email) {
      alert("Please fill in required fields")
      return
    }

    try {
      await signupForAction(id, form)
    
      await sendEmail({
        recipientName: email.recipientName,
        recipientPosition: email.recipientPosition,
    
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        postalCode: form.postalCode,
    
        message: renderTemplate(
          email.emailTemplate || email.description,
          form,
          email
        ),
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

  // ---------------- TEMPLATE ENGINE ----------------

  function renderTemplate(template = "", form, email) {
    return template
      // recipient fields (ADMIN CONTROLLED)
      .replace(/__recipient_name__/g, email?.recipientName || "recipient full name will go here")
      .replace(/__recipient_position__/g, email?.recipientPosition || "recipient position will go here")

      // user fields (USER INPUT)
      .replace(/__firstName__/g, form.firstName || "first name will go here")
      .replace(/__lastName__/g, form.lastName || "last name will go here")
      .replace(/__email__/g, form.email || "email will go here")
      .replace(/__postalCode__/g, form.postalCode || "postal code will go here")
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

  const signups = email?.stats?.signups || 0
  const goalStep = 100
  const currentGoal = Math.ceil((signups + 1) / goalStep) * goalStep
  const progress = (signups / currentGoal) * 100

  return (
    <div>

      {/* HERO */}
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

      {/* MAIN */}
      <div className="container">

        <div className="action-section">
          <img src={rectangle} className="action-bg" alt="background" />

          <div className="action-overlay">
            <div className="action-layout">

              {/* LEFT */}
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

              {/* RIGHT */}
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

                      {/* PREVIEW */}
                      <div className="email-preview">
                        <h3>Preview</h3>

                        <div className="preview-box">
                          {renderPreview(
                            renderTemplate(
                              email?.emailTemplate || email?.description || "",
                              form,
                              email
                            )
                          )}
                        </div>
                      </div>

                      {/* FORM */}
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

                        <button onClick={handleSubmit}>
                          Submit
                        </button>

                      </div>
                    </>
                  ) : (
                    <div className="success-message">
                      <h2>Thank you for taking action</h2>
                      <p>Your message is ready to be sent.</p>
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