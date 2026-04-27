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

  const [tab, setTab] = useState("emails")
  const [actions, setActions] = useState([])
  const [editingAction, setEditingAction] = useState(null)

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

  // ---------------- RESET ----------------
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
    if (tab === "protests") return a.type === "protest"
    if (tab === "petitions") return a.type === "petition"
    if (tab === "actions") return a.type === "cta"
    if (tab === "emails") return a.type === "email"
    return true
  })

  // ---------------- EMAIL TEMPLATE HANDLERS ----------------
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

  // ---------------- SUBMIT ----------------
  const handleSubmit = async () => {
    if (form.type === "email") {
      if (!form.emailTemplates.length) {
        alert("At least one email is required")
        return
      }
    
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
      ...form,
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

      {/* SIDEBAR (UNCHANGED) */}
      <div className="admin-sidebar">
        <h3>Admin</h3>
        <button onClick={() => setTab("emails")}>Emails</button>
        <button onClick={() => setTab("petitions")}>Petitions</button>
        <button onClick={() => setTab("actions")}>CTA Actions</button>
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
          </select>

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
                    placeholder="Recipient Email (required)"
                    value={t.recipientEmail}
                    onChange={(e) =>
                      updateEmailTemplate(i, "recipientEmail", e.target.value)
                    }
                  />

                  <input
                    placeholder="Recipient Name (required)"
                    value={t.recipientName || ""}
                    onChange={(e) =>
                      updateEmailTemplate(i, "recipientName", e.target.value)
                    }
                  />

                  <input
                    placeholder="Recipient Position (required)"
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

        {/* LIST (UNCHANGED FULL FEATURES) */}
        {filteredActions.map((a) => (
          <div key={a.id} className="admin-card">
            <h3>{a.title}</h3>

            {a.subtitle && <p>{a.subtitle}</p>}
            <p>Type: {a.type}</p>

            <button onClick={() => loadSignups(a.id)}>
              View Signups
            </button>

            <button
              onClick={() => {
                setEditingAction(a)
              
                const templates =
                  Array.isArray(a.emailTemplates) && a.emailTemplates.length
                    ? a.emailTemplates
                    : a.emailTemplate
                      ? [
                          {
                            subject: a.subtitle || "",
                            body: a.emailTemplate,
                            recipientEmail: "",
                          },
                        ]
                      : a.description
                        ? [
                            {
                              subject: a.subtitle || "",
                              body: a.description,
                              recipientEmail: "",
                            },
                          ]
                        : [
                            {
                              subject: "",
                              body: "",
                              recipientEmail: "",
                            },
                          ]
              
                setForm({
                  ...a,
                  emailTemplates: templates,
                })
              }}
            >
              Edit
            </button>

            <button onClick={() => deleteAction(a.id)}>Delete</button>

            <button
              onClick={() => toggleActionFeatured(a.id, a.featured)}
            >
              {a.featured ? "Unfeature" : "Feature"}
            </button>

            <button onClick={() => exportActionSignupsCSV(a.id)}>
              Export Signups
            </button>
          </div>
        ))}

        {/* SIGNUPS PANEL (UNCHANGED) */}
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