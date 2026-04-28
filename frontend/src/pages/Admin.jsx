import { useEffect, useState } from "react"
import { useAuth } from "../firebase/useAuth"
import "./Admin.css"

import {
  getActions,
  createAction,
  updateAction,
  deleteAction,
  toggleActionFeatured,
  getActionSignups,
  exportActionSignupsCSV,
} from "../firebase/actions"

export default function Admin() {
  const { user, loading } = useAuth()

  const [tab, setTab] = useState("actions")
  const [actions, setActions] = useState([])
  const [editingAction, setEditingAction] = useState(null)

  // ✅ separate image system (standalone feature gallery)
  const [images, setImages] = useState([])
  const [imageUrl, setImageUrl] = useState("")

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    type: "",
    date: "",
    link: "",
    image: "",
    location: "",
    recipientName: "",
    recipientPosition: "",
    emailTemplates: [
      {
        subject: "",
        body: "",
        recipientEmail: "",
      },
    ],
  })

  const [selectedActionSignups, setSelectedActionSignups] = useState([])
  const [viewingActionId, setViewingActionId] = useState(null)

  const loadSignups = async (actionId) => {
    const data = await getActionSignups(actionId)
    setSelectedActionSignups(data)
    setViewingActionId(actionId)
  }

  const load = async () => {
    setActions(await getActions())
  }

  useEffect(() => {
    if (user) load()
  }, [user])

  if (loading) return <div>Loading...</div>
  if (!user) return <div>Not authorized</div>

  const resetForm = () => {
    setForm({
      title: "",
      subtitle: "",
      description: "",
      type: "",
      date: "",
      link: "",
      image: "",
      location: "",
      recipientName: "",
      recipientPosition: "",
      emailTemplates: [
        {
          subject: "",
          body: "",
          recipientEmail: "",
        },
      ],
    })
    setEditingAction(null)
  }

  const filteredActions = actions.filter((a) => {
    if (tab === "actions") {
      return ["cta", "email", "petition"].includes(a.type)
    }

    if (tab === "events") {
      return ["protest", "rally", "townhall"].includes(a.type)
    }

    return true
  })

  // -----------------------
  // IMAGE SYSTEM (separate)
  // -----------------------
  const addImage = () => {
    if (!imageUrl.trim()) return
    setImages([...images, { id: Date.now(), url: imageUrl }])
    setImageUrl("")
  }

  const removeImage = (id) => {
    setImages(images.filter((img) => img.id !== id))
  }

  // -----------------------
  // EMAIL SYSTEM
  // -----------------------
  const addEmailTemplate = () => {
    setForm({
      ...form,
      emailTemplates: [
        ...form.emailTemplates,
        { subject: "", body: "", recipientEmail: "" },
      ],
    })
  }

  const updateEmailTemplate = (index, field, value) => {
    const updated = [...form.emailTemplates]
    updated[index][field] = value
    setForm({ ...form, emailTemplates: updated })
  }

  const removeEmailTemplate = (index) => {
    const updated = form.emailTemplates.filter((_, i) => i !== index)
    setForm({ ...form, emailTemplates: updated })
  }

  // -----------------------
  // SUBMIT ACTION
  // -----------------------
  const handleSubmit = async () => {
    if (form.type === "email") {
      const missingFields = form.emailTemplates.some(
        (t) =>
          !t.recipientEmail?.trim() ||
          !t.recipientName?.trim() ||
          !t.recipientPosition?.trim()
      )

      if (missingFields) {
        alert("Each email must include recipient email, name, and position")
        return
      }
    }

    const payload = {
      title: form.title,
      subtitle: form.subtitle,
      description: form.description,
      type: form.type,
      date: form.date,
      link: form.link,
      image: form.image,
      location: form.location,
      recipientName: form.recipientName,
      recipientPosition: form.recipientPosition,
      emailTemplates: form.emailTemplates,
    }

    if (editingAction) {
      await updateAction(editingAction.id, payload)
    } else {
      await createAction(payload)
    }

    resetForm()
    load()
  }

  return (
    <div className="admin-wrapper">

      {/* SIDEBAR */}
      <div className="admin-sidebar">
        <h3>Admin</h3>

        <button onClick={() => setTab("actions")}>Actions</button>
        <button onClick={() => setTab("events")}>Events</button>
      </div>

      <div className="admin-content">
        <h1>CMS Dashboard</h1>

        {/* FORM */}
        <div className="admin-form">

          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          {/* ACTION IMAGE FIELD */}
          <input
            placeholder="Image URL"
            value={form.image}
            onChange={(e) =>
              setForm({ ...form, image: e.target.value })
            }
          />

          <select
            value={form.type}
            onChange={(e) =>
              setForm({ ...form, type: e.target.value })
            }
          >
            <option value="">Select Type</option>
            <option value="email">Email</option>
            <option value="cta">CTA</option>
            <option value="petition">Petition</option>
            <option value="protest">Protest</option>
            <option value="rally">Rally</option>
            <option value="townhall">Townhall</option>
          </select>

          {/* EVENT FIELDS */}
          {["protest", "rally", "townhall"].includes(form.type) && (
            <>
              <input
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm({ ...form, date: e.target.value })
                }
              />

              <input
                placeholder="Location"
                value={form.location}
                onChange={(e) =>
                  setForm({ ...form, location: e.target.value })
                }
              />
            </>
          )}

          {/* EMAIL BUILDER */}
          {form.type === "email" && (
            <div className="email-builder">

              <h3>Email Campaigns</h3>

              {form.emailTemplates.map((t, i) => (
                <div key={i} className="email-block">

                  <input
                    placeholder="Subject"
                    value={t.subject}
                    onChange={(e) =>
                      updateEmailTemplate(i, "subject", e.target.value)
                    }
                  />

                  <textarea
                    placeholder="Email body"
                    value={t.body}
                    onChange={(e) =>
                      updateEmailTemplate(i, "body", e.target.value)
                    }
                  />

                  <input
                    placeholder="Recipient Email"
                    value={t.recipientEmail}
                    onChange={(e) =>
                      updateEmailTemplate(i, "recipientEmail", e.target.value)
                    }
                  />

                  <input
                    placeholder="Recipient Name"
                    value={t.recipientName || ""}
                    onChange={(e) =>
                      updateEmailTemplate(i, "recipientName", e.target.value)
                    }
                  />

                  <input
                    placeholder="Recipient Position"
                    value={t.recipientPosition || ""}
                    onChange={(e) =>
                      updateEmailTemplate(i, "recipientPosition", e.target.value)
                    }
                  />

                  <button onClick={() => removeEmailTemplate(i)}>
                    Remove
                  </button>
                </div>
              ))}

              <button onClick={addEmailTemplate}>
                + Add Email
              </button>
            </div>
          )}

          <button onClick={handleSubmit}>
            {editingAction ? "Update" : "Create"}
          </button>
        </div>

        {/* LIST */}
        {filteredActions.map((a) => (
          <div key={a.id} className="admin-card">
            <h3>{a.title}</h3>
            <p>Type: {a.type}</p>

            <button onClick={() => loadSignups(a.id)}>
              View Signups
            </button>

            <button
              onClick={() => {
                setEditingAction(a)
                setForm({
                  title: a.title || "",
                  subtitle: a.subtitle || "",
                  description: a.description || "",
                  type: a.type || "",
                  date: a.date || "",
                  link: a.link || "",
                  image: a.image || "",
                  location: a.location || "",
                  recipientName: a.recipientName || "",
                  recipientPosition: a.recipientPosition || "",
                  emailTemplates: a.emailTemplates || [
                    { subject: "", body: "", recipientEmail: "" },
                  ],
                })
              }}
            >
              Edit
            </button>

            <button onClick={() => deleteAction(a.id)}>Delete</button>

            <button onClick={() => toggleActionFeatured(a.id, a.featured)}>
              {a.featured ? "Unfeature" : "Feature"}
            </button>

            <button onClick={() => exportActionSignupsCSV(a.id)}>
              Export Signups
            </button>
          </div>
        ))}

        {/* IMAGE GALLERY (SEPARATE FEATURE) */}
        <hr />

        <h2>Featured Images</h2>

        <div className="admin-form">
          <input
            placeholder="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <button onClick={addImage}>Add Image</button>
        </div>

        <div className="admin-image-grid">
          {images.map((img) => (
            <div key={img.id}>
              <img src={img.url} alt="" style={{ width: "200px" }} />
              <button onClick={() => removeImage(img.id)}>Delete</button>
            </div>
          ))}
        </div>

        {/* SIGNUPS */}
        {viewingActionId && (
          <div className="admin-signups-panel">
            <h2>Signups</h2>
            <p>Total: {selectedActionSignups.length}</p>

            {selectedActionSignups.map((s) => (
              <div key={s.id}>
                <strong>{s.firstName} {s.lastName}</strong>
                <p>{s.email}</p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}