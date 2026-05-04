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
  const [mpps, setMpps] = useState([])

  const [mppTestPostal, setMppTestPostal] = useState("")
  const [mppTestResult, setMppTestResult] = useState(null)
  const [mppTestLoading, setMppTestLoading] = useState(false)

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    type: "",
    date: "",
    link: "",
    tag: "",
    image: "",
    location: "",
    active: true,
    recipientName: "",
    recipientPosition: "",
    emailTemplates: [
      {
        subject: "",
        body: "",
        recipientEmails: [""],
        recipientName: "",
        recipientPosition: "",
      },
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
      tag: "",
      image: "",
      location: "",
      active: true,
      recipientName: "",
      recipientPosition: "",
      emailTemplates: [
        {
          subject: "",
          body: "",
          recipientEmail: "",
          recipientName: "",
          recipientPosition: "",
        },
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

    const cleanedCTA = (form.ctaActions || [])
      .filter(a => a.type === "email" || a.type === "petition")
      .map(a => {
        if (a.type === "email") {
          return {
            type: "email",
            subject: a.subject || "",
            body: a.body || "",
            recipientEmails: a.recipientEmails || [],
            recipientName: a.recipientName || "",
            recipientPosition: a.recipientPosition || "",
            requireMppInfo: !!a.requireMppInfo,
          }
        }

        if (a.type === "petition") {
          return {
            type: "petition",
            petitionLink: a.petitionLink || "",
          }
        }

        return null
      })
      .filter(Boolean)
      
    const payload = {
      ...form,
      ctaActions: cleanedCTA,
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
                  placeholder="Description (use [text](https://link.com) for links)"
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

                <input
                  placeholder="Tag (e.g. health, environment)"
                  value={form.tag || ""}
                  onChange={(e) =>
                    setForm({ ...form, tag: e.target.value })
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

                <input
                  placeholder="External Link (optional)"
                  value={form.link}
                  onChange={(e) =>
                    setForm({ ...form, link: e.target.value })
                  }
                />

                {/* EMAIL BUILDER */}
                {form.type === "email" && (
                  <div className="email-builder">
                    <h3>Email Campaigns</h3>

                    {form.emailTemplates.map((t, i) => (
                      <div key={i} className="email-block">

                        <input
                          placeholder="Recipient Emails (comma separated)"
                          value={t.recipientEmailsRaw ?? (t.recipientEmails?.join(", ") || "")}
                          onChange={(e) => {
                            const updated = [...form.emailTemplates]

                            const raw = e.target.value

                            updated[i] = {
                              ...updated[i],
                              recipientEmailsRaw: raw,
                              recipientEmails: raw
                                .split(",")
                                .map(email => email.trim())
                                .filter(Boolean),
                            }

                            setForm({ ...form, emailTemplates: updated })
                          }}
                        />

                        <input
                          placeholder="Recipient Name"
                          value={t.recipientName}
                          onChange={(e) => {
                            const updated = [...form.emailTemplates]
                            updated[i].recipientName = e.target.value
                            setForm({ ...form, emailTemplates: updated })
                          }}
                        />

                        <input
                          placeholder="Recipient Position"
                          value={t.recipientPosition || ""}
                          onChange={(e) => {
                            const updated = [...form.emailTemplates]
                            updated[i].recipientPosition = e.target.value
                            setForm({ ...form, emailTemplates: updated })
                          }}
                        />

                        <input
                          placeholder="Subject"
                          value={t.subject}
                          onChange={(e) => {
                            const updated = [...form.emailTemplates]
                            updated[i].subject = e.target.value
                            setForm({ ...form, emailTemplates: updated })
                          }}
                        />

                        <textarea
                          placeholder="Body"
                          value={t.body}
                          onChange={(e) => {
                            const updated = [...form.emailTemplates]
                            updated[i].body = e.target.value
                            setForm({ ...form, emailTemplates: updated })
                          }}
                        />

                        <label>
                          <input
                            type="checkbox"
                            checked={t.requireMppInfo || false}
                            onChange={(e) => {
                              const updated = [...form.emailTemplates]
                              updated[i].requireMppInfo = e.target.checked
                              setForm({ ...form, emailTemplates: updated })
                            }}
                          />
                          Require MPP Info (user provides email + name)
                        </label>

                        <button onClick={() => {
                          const updated = form.emailTemplates.filter((_, idx) => idx !== i)
                          setForm({ ...form, emailTemplates: updated })
                        }}>
                          Remove
                        </button>

                      </div>
                    ))}

                    <button onClick={() =>
                      setForm({
                        ...form,
                        emailTemplates: [
                          ...form.emailTemplates,
                          {
                            subject: "",
                            body: "",
                            recipientEmails: [""],
                            recipientName: "",
                            recipientPosition: "",
                          },
                        ],
                      })
                    }>
                      + Add Email
                    </button>
                  </div>
                )}

                {/* CTA BUILDER */}
                {form.type === "cta" && (
                  <div className="email-builder">
                    <h3>CTA Actions</h3>

                    {form.ctaActions.map((a, i) => (
                      <div key={i} className="email-block">

                        <select
                          value={a.type}
                          onChange={(e) => {
                            const updated = [...form.ctaActions]
                            updated[i].type = e.target.value
                            setForm({ ...form, ctaActions: updated })
                          }}
                        >
                          <option value="">Select Type</option>
                          <option value="email">Email</option>
                          <option value="petition">Petition</option>
                        </select>

                        {a.type === "email" && (
                          <>
                            <input
                              placeholder="Recipient Emails (comma separated)"
                              value={a.recipientEmailsRaw ?? (a.recipientEmails?.join(", ") || "")}
                              onChange={(e) => {
                                const updated = [...form.ctaActions]
                              
                                const raw = e.target.value
                              
                                updated[i] = {
                                  ...updated[i],
                                  recipientEmailsRaw: raw,
                                  recipientEmails: raw
                                    .split(",")
                                    .map(email => email.trim())
                                    .filter(Boolean),
                                }
                              
                                setForm({ ...form, ctaActions: updated })
                              }}
                            />

                            <input placeholder="Recipient Name"
                              value={a.recipientName || ""}
                              onChange={(e) => {
                                const updated = [...form.ctaActions]
                                updated[i].recipientName = e.target.value
                                setForm({ ...form, ctaActions: updated })
                              }}
                            />

                            <input placeholder="Recipient Position"
                              value={a.recipientPosition || ""}
                              onChange={(e) => {
                                const updated = [...form.ctaActions]
                                updated[i].recipientPosition = e.target.value
                                setForm({ ...form, ctaActions: updated })
                              }}
                            />

                            <input placeholder="Subject"
                              value={a.subject || ""}
                              onChange={(e) => {
                                const updated = [...form.ctaActions]
                                updated[i].subject = e.target.value
                                setForm({ ...form, ctaActions: updated })
                              }}
                            />

                            <textarea placeholder="Body"
                              value={a.body || ""}
                              onChange={(e) => {
                                const updated = [...form.ctaActions]
                                updated[i].body = e.target.value
                                setForm({ ...form, ctaActions: updated })
                              }}
                            />

                            <label>
                              <input
                                type="checkbox"
                                checked={a.requireMppInfo || false}
                                onChange={(e) => {
                                  const updated = [...form.ctaActions]
                                  updated[i].requireMppInfo = e.target.checked
                                  setForm({ ...form, ctaActions: updated })
                                }}
                              />
                              Require MPP Info (user input)
                            </label>
                          </>
                        )}

                        {a.type === "petition" && (
                          <input
                            placeholder="Petition Link"
                            value={a.petitionLink || ""}
                            onChange={(e) => {
                              const updated = [...form.ctaActions]
                              updated[i].petitionLink = e.target.value
                              setForm({ ...form, ctaActions: updated })
                            }}
                          />
                        )}

                        <button onClick={() => {
                          const updated = form.ctaActions.filter((_, idx) => idx !== i)
                          setForm({ ...form, ctaActions: updated })
                        }}>
                          Remove
                        </button>

                      </div>
                    ))}

                    <button
                      onClick={() =>
                        setForm({
                          ...form,
                          ctaActions: [
                            ...form.ctaActions,
                            {
                              type: "email",
                              subject: "",
                              body: "",
                              recipientEmails: [],
                              recipientName: "",
                              recipientPosition: "",
                              requireMppInfo: false,
                            },
                          ],
                        })
                      }
                    >
                      + Add CTA Action
                    </button>
                  </div>
                )}

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

                  <button onClick={() => {
                    setEditingAction(a)
                    setForm({
                      ...a,
                      emailTemplates: a.emailTemplates || [{
                        subject: "",
                        body: "",
                        recipientEmails: [],
                        recipientName: "",
                        recipientPosition: "",
                      }],
                      ctaActions: a.ctaActions || [],
                    })
                  }}>
                    Edit
                  </button>

                  <button onClick={() => toggleActionFeatured(a.id, a.featured)}>
                    {a.featured ? "Unfeature" : "Feature"}
                  </button>

                  <button
                    onClick={async () => {
                      await updateAction(a.id, {
                        ...a,
                        active: a.active === false,
                      })
                      load()
                    }}
                  >
                    {a.active === false ? "Activate" : "Deactivate"}
                  </button>

                  <button onClick={() => deleteAction(a.id)}>Delete</button>
                </div>
              ))}
            </div>

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