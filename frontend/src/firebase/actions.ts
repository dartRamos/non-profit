import { db } from "./config"
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  query,
  orderBy,
  increment,
  where,
  getDoc,
} from "firebase/firestore"

// ---------------- COLLECTIONS ----------------

const actionsRef = collection(db, "actions")
const signupsRef = collection(db, "action_signups")

// ---------------- CREATE ACTION ----------------

type CTAAction = {
  type: "email" | "petition"

  // email fields
  recipientEmail?: string
  subject?: string
  body?: string

  // petition fields
  petitionLink?: string
}

export const createAction = async (action: {
  type: "protest" | "petition" | "cta" | "email" | "rally" | "townhall"
  title: string
  subtitle?: string
  description?: string
  date?: string
  location?: string
  image?: string
  link?: string

  priority?: boolean
  ctaActions?: CTAAction[]
}) => {

  if (action.type === "cta") {
  if (!action.ctaActions || action.ctaActions.length === 0) {
    throw new Error("CTA must have at least one action")
  }

  const hasInvalid = action.ctaActions.some((a) => {
    if (a.type === "email") {
      return !a.recipientEmail || !a.subject || !a.body
    }
    if (a.type === "petition") {
      return !a.petitionLink
    }
    return true
  })

  if (hasInvalid) {
    throw new Error("Invalid CTA actions")
  }
}

  await addDoc(actionsRef, {
    ...action,
  
    featured: false,
    featuredOrder: 999,
  
    priority: action.type === "cta",
    ctaActions: action.type === "cta" ? action.ctaActions || [] : [],
  
    stats: {
      signups: 0,
    },
  
    createdAt: Date.now(),
  })
}
// ---------------- GET ALL ----------------

export const getActions = async () => {
  const q = query(actionsRef, orderBy("createdAt", "desc"))
  const snapshot = await getDocs(q)

  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }))
}

// ---------------- GET BY ID ----------------

export const getActionById = async (id: string) => {
  const ref = doc(db, "actions", id)
  const snapshot = await getDoc(ref)

  if (!snapshot.exists()) return null

  return {
    id: snapshot.id,
    ...snapshot.data(),
  }
}

// ---------------- DELETE ----------------

export const deleteAction = async (id: string) => {
  await deleteDoc(doc(db, "actions", id))
}

// ---------------- UPDATE ----------------

export const updateAction = async (id: string, data: any) => {

  if (data.type === "cta") {
    const hasInvalid = (data.ctaActions || []).some((a) => {
      if (a.type === "email") {
        return (
          !a.recipientEmail ||
          !a.recipientName ||
          !a.recipientPosition ||
          !a.subject ||
          !a.body
        )
      }
      if (a.type === "petition") {
        return !a.petitionLink
      }
      return true
    })

    if (hasInvalid) {
      throw new Error("Invalid CTA actions")
    }
  }

  await updateDoc(doc(db, "actions", id), {
    ...data,
    priority: data.type === "cta",
    ctaActions: data.type === "cta" ? data.ctaActions || [] : [],
  })
}

// ---------------- FEATURE TOGGLE ----------------

export const toggleActionFeatured = async (id: string, current: boolean) => {
  await updateDoc(doc(db, "actions", id), {
    featured: !current,
    featuredOrder: !current ? Date.now() : 999,
  })
}

// ---------------- FILTER HELPERS ----------------

export const getFeaturedActionsByTypes = async (types: string[]) => {
  const q = query(
    actionsRef,
    where("featured", "==", true),
    where("type", "in", types),
    orderBy("featuredOrder", "asc")
  )

  const snapshot = await getDocs(q)

  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }))
}

// ---------------- SIGNUP ----------------

export const signupForAction = async (actionId, data) => {
  const email = data.email.trim().toLowerCase()

  const q = query(
    signupsRef,
    where("actionId", "==", actionId),
    where("email", "==", email)
  )

  const existing = await getDocs(q)

  if (!existing.empty) {
    throw new Error("Already signed up")
  }

  await addDoc(signupsRef, {
    actionId,
    ...data,
    email,
    createdAt: Date.now(),
  })

  await updateDoc(doc(db, "actions", actionId), {
    "stats.signups": increment(1),
  })
}

// ---------------- ADMIN SIGNUPS ----------------

export const getActionSignups = async (actionId: string) => {
  const q = query(signupsRef, where("actionId", "==", actionId))
  const snapshot = await getDocs(q)

  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }))
}

// ---------------- SEED DATA ----------------

export const seedCTAData = async () => {
  const sample = [
    {
      type: "cta",
      title: "Stop Bill 123 – Demand Transparency",
      subtitle: "Join thousands demanding accountability",
      description:
        `Bill 123 is being rushed through without proper public oversight.\n\n` +
        `This legislation could significantly impact how decisions are made in Ontario, yet key details remain unclear.\n\n` +
        `We are calling on leaders to:\n` +
        `• Release the full details of the bill to the public\n` +
        `• Allow independent review before implementation\n` +
        `• Hold public consultations across the province\n\n` +
        `By signing, you are adding pressure for transparency and ensuring your voice is heard before decisions are finalized.`,
      location: "Ontario",
    },
    {
      type: "cta",
      title: "Protect Public Healthcare Funding",
      subtitle: "Oppose healthcare cuts now",
      description:
        `Healthcare workers and patients are already under strain, and proposed budget cuts will make things worse.\n\n` +
        `Reduced funding could lead to longer wait times, staff shortages, and fewer available services.\n\n` +
        `We are demanding:\n` +
        `• No cuts to hospital and clinic funding\n` +
        `• Increased investment in frontline healthcare workers\n` +
        `• Transparent reporting on healthcare budgets\n\n` +
        `Sign this action to stand with healthcare workers and protect essential services for everyone.`,
      location: "Ontario",
    },
  ]

  for (const item of sample) {
    await addDoc(actionsRef, {
      ...item,
      featured: true,
      featuredOrder: Date.now(),
      stats: { signups: Math.floor(Math.random() * 5000) },
      createdAt: Date.now(),
    })
  }
}

// ---------------- EXPORT CSV ----------------

export const exportActionSignupsCSV = async (actionId: string) => {
  const data = await getActionSignups(actionId)

  const headers = ["firstName", "lastName", "email", "postalCode", "createdAt"]

  const rows = data.map((s) =>
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