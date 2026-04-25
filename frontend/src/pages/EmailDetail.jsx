import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getActionById } from "../firebase/actions"

import headerImage from "../assets/image1.png"
import rectangle54 from "../assets/rectangle54.png"
import rectangle from "../assets/rectangle91.png"

import "./EmailDetail.css"

export default function EmailDetail() {
  const { id } = useParams()

  const [email, setEmail] = useState(null)
  const [loading, setLoading] = useState(true)

  const [form, setForm] = useState({
    name: "",
    email: "",
  })

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

  const handleSendEmail = () => {
    const subject = encodeURIComponent(email.title || "Campaign Email")
    const body = encodeURIComponent(
      `${email.description || ""}

---
Sent by: ${form.name || "Anonymous"} (${form.email || "no email"})`
    )

    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  return (
    <div>
      {/* HERO */}
      <div className="header-image-container">
        <img src={headerImage} className="header-image" alt="header" />
        <img src={rectangle54} className="rectangle-54" alt="overlay" />
        <div className="image-fade" />

        <div className="header-text">
          <h1 className="line">SEND EMAIL</h1>
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

              {/* LEFT SIDE */}
              <div className="action-left">

                <h1 className="action-title">{email.title}</h1>

                {email.subtitle && (
                  <p className="action-subtitle">{email.subtitle}</p>
                )}

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

              {/* RIGHT SIDE */}
              <div className="action-right">

                <div className="signup-panel">

                  <h2>Send This Email</h2>

                  <p className="urgency-text">
                    This will open your email client
                  </p>

                  <div className="signup-box">

                    <input
                      placeholder="Your Name"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />

                    <input
                      placeholder="Your Email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                    />

                    <button onClick={handleSendEmail}>
                      Open Email App
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