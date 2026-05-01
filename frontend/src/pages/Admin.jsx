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

import { getSubscribers } from "../firebase/subscribers"
import { getVolunteers } from "../firebase/volunteers"

export default function Admin() {
  const { user, loading } = useAuth()

  const [tab, setTab] = useState("actions")
  const [actions, setActions] = useState([])
  const [editingAction, setEditingAction] = useState(null)
  const [subscribers, setSubscribers] = useState([])
  const [actionFilter, setActionFilter] = useState("all")
  const [volunteers, setVolunteers] = useState([])

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
      { subject: "", body: "", recipientEmail: "" },
    ],
    ctaActions: [],
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
    setSubscribers(await getSubscribers())
    setVolunteers(await getVolunteers())
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
        { subject: "", body: "", recipientEmail: "" },
      ],
      ctaActions: [],
    })
    setEditingAction(null)
  }

  const filteredActions = actions.filter((a) => {
    if (tab === "actions") {
      if (actionFilter === "all") {
        return ["cta", "email", "petition"].includes(a.type)
      }
      return a.type === actionFilter
    }

    if (tab === "events") {
      return ["protest", "rally", "townhall"].includes(a.type)
    }

    return false
  })

  const handleSubmit = async () => {
    const payload = {
      ...form,
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
        <button onClick={() => setTab("subscribers")}>Subscribers</button>
        <button onClick={() => setTab("volunteers")}>Volunteers</button>
      </div>

      <div className="admin-content">

        {(tab === "actions" || tab === "events") && (
          <div className="admin-layout">

            {/* LEFT SIDE */}
            <div className="admin-main">
              <h1>CMS Dashboard</h1>

              {tab === "actions" && (
                <div style={{ marginBottom: 15 }}>
                  <button onClick={() => setActionFilter("all")}>All</button>
                  <button onClick={() => setActionFilter("cta")}>CTA</button>
                  <button onClick={() => setActionFilter("email")}>Email</button>
                  <button onClick={() => setActionFilter("petition")}>Petition</button>
                </div>
              )}

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

                <button onClick={handleSubmit}>
                  {editingAction ? "Update" : "Create"}
                </button>
              </div>

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
                      setForm({ ...a })
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => toggleActionFeatured(a.id, a.featured)}
                  >
                    {a.featured ? "Unfeature" : "Feature"}
                  </button>

                  <button onClick={() => deleteAction(a.id)}>Delete</button>
                </div>
              ))}
            </div>

            {/* RIGHT SIDE */}
            <div className="admin-right">
              {viewingActionId && (
                <div className="admin-signups-panel">
                  <h2>Signups</h2>
                  <p>Total: {selectedActionSignups.length}</p>

                  {selectedActionSignups.map((s) => {
                    const actionType = actions.find(a => a.id === viewingActionId)?.type

                    return (
                      <div key={s.id}>
                        <strong>{s.firstName} {s.lastName}</strong>
                        <p>{s.email}</p>

                        {actionType === "petition" && (
                          <p>Postal Code: {s.postalCode || "N/A"}</p>
                        )}

                        <p>------------------------------------</p>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

          </div>
        )}

        {tab === "subscribers" && (
          <div className="admin-signups-panel">
            <h2>Subscribers</h2>
            <p>Total: {subscribers.length}</p>

            {subscribers.map((s) => (
              <div key={s.id}>
                <strong>{s.name}</strong>
                <p>{s.email}</p>
                <p>------------------------------------</p>
              </div>
            ))}
          </div>
        )}

        {tab === "volunteers" && (
          <div className="admin-signups-panel">
            <h2>Volunteers</h2>
            <p>Total: {volunteers.length}</p>

            {volunteers.map((v) => (
              <div key={v.id}>
                <strong>{v.name}</strong>
                <p>{v.email}</p>
                <p>----------------------</p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}