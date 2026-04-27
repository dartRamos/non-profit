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

    emailTemplate: "",
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

      emailTemplate: "",
    })

    setEditingAction(null)
  }

  // ---------------- FILTER ----------------

  const filteredActions = actions.filter((a) => {
    if (tab === "protests") return a.type === "protest"
    if (tab === "petitions") return a.type === "petition"
    if (tab === "actions") return a.type === "cta"
    if (tab === "emails") return a.type === "email"
    return true
  })

  // ---------------- CREATE / UPDATE ----------------

  const handleSubmit = async () => {
    // Email validation
    if (form.type === "email") {
      if (!form.recipientName || !form.recipientPosition) {
        alert("Recipient name and position are required for email campaigns")
        return
      }

      if (!form.emailTemplate) {
        alert("Email template is required")
        return
      }
    }

    if (editingAction) {
      await updateAction(editingAction.id, form)
    } else {
      await createAction(form)
    }

    resetForm()
    load()
  }

  return (
    <div className="admin-wrapper">

      {/* SIDEBAR */}
      <div className="admin-sidebar">
        <h3>Admin</h3>

        <button onClick={() => setTab("emails")}>Emails</button>
        <button onClick={() => setTab("petitions")}>Petitions</button>
        <button onClick={() => setTab("actions")}>CTA Actions</button>
      </div>

      {/* CONTENT */}
      <div className="admin-content">

        <h1>CMS Dashboard</h1>

        {/* ---------------- FORM ---------------- */}
        <div className="admin-form">

          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />

          <input
            placeholder="Subtitle (Subject Line)"
            value={form.subtitle}
            onChange={(e) =>
              setForm({ ...form, subtitle: e.target.value })
            }
          />

          <textarea
            placeholder="Description (Shown on page)"
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
            <option value="cta">CTA</option>
            <option value="petition">Petition</option>
            <option value="protest">Protest</option>
            <option value="email">Email</option>
            <option value="rally">Rally</option>
            <option value="townhall">Townhall</option>
          </select>

          <input
            placeholder="Location"
            value={form.location}
            onChange={(e) =>
              setForm({ ...form, location: e.target.value })
            }
          />

          <input
            placeholder="Image URL"
            value={form.image}
            onChange={(e) =>
              setForm({ ...form, image: e.target.value })
            }
          />

          {/* ---------------- RECIPIENT FIELDS ---------------- */}
          <input
            placeholder="Recipient Name (e.g. Olivia Chow)"
            value={form.recipientName}
            onChange={(e) =>
              setForm({ ...form, recipientName: e.target.value })
            }
          />

          <input
            placeholder="Recipient Position (e.g. Mayor)"
            value={form.recipientPosition}
            onChange={(e) =>
              setForm({ ...form, recipientPosition: e.target.value })
            }
          />

          {/* ---------------- EMAIL TEMPLATE ---------------- */}
          {form.type === "email" && (
            <textarea
              placeholder={`Enter the body of the email here only.`}
              value={form.emailTemplate}
              onChange={(e) =>
                setForm({ ...form, emailTemplate: e.target.value })
              }
              style={{ minHeight: "220px" }}
            />
          )}

          <button onClick={handleSubmit}>
            {editingAction ? "Update" : "Create"}
          </button>

        </div>

        {/* ---------------- LIST ---------------- */}
        {filteredActions.map((a) => (
          <div key={a.id} className="admin-card">

            <h3>{a.title}</h3>

            {a.subtitle && (
              <p>
                {a.type === "email" ? "Subject: " : ""}
                {a.subtitle}
              </p>
            )}

            <p>Type: {a.type}</p>

            <button onClick={() => loadSignups(a.id)}>
              View Signups
            </button>

            <button
              onClick={() => {
                setEditingAction(a)
                setForm({
                  ...a,
                  emailTemplate: a.emailTemplate || "",
                  recipientName: a.recipientName || "",
                  recipientPosition: a.recipientPosition || "",
                })
              }}
            >
              Edit
            </button>

            <button onClick={() => deleteAction(a.id)}>
              Delete
            </button>

            <button onClick={() =>
              toggleActionFeatured(a.id, a.featured)
            }>
              {a.featured ? "Unfeature" : "Feature"}
            </button>

            <button onClick={() => exportActionSignupsCSV(a.id)}>
              Export Signups
            </button>

          </div>
        ))}

        {/* ---------------- SIGNUPS ---------------- */}
        {viewingActionId && (
          <div className="admin-signups-panel">

            <h2>Signups</h2>
            <p>Total: {selectedActionSignups.length}</p>

            {selectedActionSignups.map((s) => (
              <div key={s.id} className="admin-signup-card">
                <p><strong>{s.firstName} {s.lastName}</strong></p>
                <p>{s.email}</p>
              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  )
}