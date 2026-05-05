const API = "https://non-profit-ta9x.onrender.com"

// ---------------- TYPES ----------------

export type ActionSignup = {
  firstName: string
  lastName: string
  email: string
  postalCode: string
  consent: true
  comment?: string
}

// ---------------- ACTIONS ----------------

// GET ALL ACTIONS
export const getActions = async () => {
  const res = await fetch(`${API}/actions`)
  const json = await res.json()

  if (!json.success) {
    throw new Error(json.error || "Failed to fetch actions")
  }

  return json.actions
}

// GET ACTION BY ID
export const getActionById = async (id: string) => {
  const res = await fetch(`${API}/actions/${id}`)
  const json = await res.json()

  if (!json.success) {
    throw new Error(json.error || "Failed to fetch action")
  }

  return json.action
}

// CREATE ACTION
export const createAction = async (action: any) => {
  const res = await fetch(`${API}/actions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(action),
  })

  const json = await res.json()

  if (!json.success) {
    throw new Error(json.error || "Failed to create action")
  }

  return json
}

// UPDATE ACTION
export const updateAction = async (id: string, data: any) => {
  const res = await fetch(`${API}/actions/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  const json = await res.json()

  if (!json.success) {
    throw new Error(json.error || "Failed to update action")
  }

  return json
}

// DELETE ACTION
export const deleteAction = async (id: string) => {
  const res = await fetch(`${API}/actions/${id}`, {
    method: "DELETE",
  })

  const json = await res.json()

  if (!json.success) {
    throw new Error(json.error || "Failed to delete action")
  }

  return json
}

// TOGGLE FEATURED
export const toggleActionFeatured = async (id: string, current: boolean) => {
  const res = await fetch(`${API}/actions/${id}/featured`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ featured: !current }),
  })

  const json = await res.json()

  if (!json.success) {
    throw new Error(json.error || "Failed to toggle featured")
  }

  return json
}

// SIGNUP FOR ACTION
export const signupForAction = async (actionId: string, data: ActionSignup) => {
  const res = await fetch(`${API}/signup-action`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      actionId,
      ...data,
    }),
  })

  const json = await res.json()

  if (!json.success) {
    throw new Error(json.error || "Signup failed")
  }

  return json
}

// GET SIGNUPS
export const getActionSignups = async (actionId: string) => {
  const res = await fetch(`${API}/actions/${actionId}/signups`)
  const json = await res.json()

  if (!json.success) {
    throw new Error(json.error || "Failed to fetch signups")
  }

  return json.signups
}

// GET FEATURED ACTIONS BY TYPES
export const getFeaturedActionsByTypes = async (types: string[]) => {
  const res = await fetch(
    `${API}/actions/featured?types=${types.join(",")}`
  )

  const json = await res.json()

  if (!json.success) {
    throw new Error(json.error || "Failed to fetch featured actions")
  }

  return json.actions
}

// EXPORT CSV
export const exportActionSignupsCSV = async (actionId: string) => {
  const data = await getActionSignups(actionId)

  const headers = ["firstName", "lastName", "email", "postalCode", "createdAt"]

  const rows = data.map((s: any) =>
    headers.map((h) => JSON.stringify(s[h] || "")).join(",")
  )

  const csv = [headers.join(","), ...rows].join("\n")

  const blob = new Blob([csv], { type: "text/csv" })
  const url = URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.href = url
  a.download = `action-${actionId}-signups.csv`
  a.click()

  URL.revokeObjectURL(url)
}