import { db } from "./config"
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  setDoc,
  doc,
  query,
  orderBy,
  increment,
  where,
  getDoc,
  serverTimestamp
} from "firebase/firestore"

import { v4 as uuidv4 } from "uuid"

type ActionSignup = {
  firstName: string
  lastName: string
  email: string
  postalCode: string
  consent: true
  comment?: string
}

// ---------------- COLLECTIONS ----------------

const actionsRef = collection(db, "actions")
const signupsRef = collection(db, "action_signups")

// ---------------- TYPES ----------------

type CTAAction = {
  type: "email" | "petition"

  recipientEmails?: string[]
  recipientEmail?: string
  subject?: string
  body?: string

  petitionLink?: string

  requireUserInput?: boolean
  requireMppInfo?: boolean
}

// ---------------- CREATE ACTION ----------------

export const createAction = async (action: {
  active?: boolean
  type: "protest" | "petition" | "cta" | "email" | "rally" | "townhall"
  title: string
  subtitle?: string
  description?: string
  date?: string
  location?: string
  image?: string
  link?: string
  tag?: string

  priority?: boolean
  ctaActions?: CTAAction[]
}) => {

  if (action.type === "cta") {
    if (!action.ctaActions || action.ctaActions.length === 0) {
      throw new Error("CTA must have at least one action")
    }

    const normalized = action.ctaActions.map((a) => ({
      ...a,
      recipientEmails:
        a.recipientEmails ||
        (a.recipientEmail ? [a.recipientEmail] : []),
    }))

    const hasInvalid = normalized.some((a) => {
      if (a.type === "email") {

        const requiresUserInput = a.requireUserInput || a.requireMppInfo
      
        if (requiresUserInput) {
          return !a.subject || !a.body
        }
      
        return (
          !Array.isArray(a.recipientEmails) ||
          a.recipientEmails.length === 0 ||
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

    action.ctaActions = normalized
  }

  await addDoc(actionsRef, {
    ...action,

    active: action.active !== false,

    featured: false,
    featuredOrder: 999,

    priority: action.type === "cta",
    ctaActions: action.type === "cta" ? action.ctaActions || [] : [],

    stats: {
      signups: 0,
    },

    createdAt: serverTimestamp(),
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

    const normalized = (data.ctaActions || []).map((a) => ({
      ...a,
      recipientEmails:
        a.recipientEmails ||
        (a.recipientEmail ? [a.recipientEmail] : []),
    }))

    const hasInvalid = normalized.some((a) => {
      if (a.type === "email") {

        const requiresUserInput = a.requireUserInput || a.requireMppInfo
      
        if (requiresUserInput) {
          return !a.subject || !a.body
        }
      
        return (
          !Array.isArray(a.recipientEmails) ||
          a.recipientEmails.length === 0 ||
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

    data.ctaActions = normalized
  }

  await updateDoc(doc(db, "actions", id), {
    ...data,
    active: data.active !== false,
    priority: data.type === "cta",
    ctaActions: data.type === "cta" ? data.ctaActions || [] : [],
  })
}

// ---------------- FEATURE TOGGLE ----------------

export const toggleActionFeatured = async (id: string, current: boolean) => {
  await updateDoc(doc(db, "actions", id), {
    featured: !current,
    featuredOrder: !current ? serverTimestamp() : 999,
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

export const signupForAction = async (
  actionId: string,
  data: ActionSignup
) => {
  const actionRef = doc(db, "actions", actionId)
  const actionSnap = await getDoc(actionRef)

  if (!actionSnap.exists()) {
    throw new Error("Action not found")
  }

  const action = actionSnap.data()
  const isPetition = action.type === "petition"

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

  const signupId = `${actionId}_${email}`

  await setDoc(doc(db, "action_signups", signupId), {
    actionId,
    ...data,
    email,

    verified: true,
    verificationToken: null,

    createdAt: serverTimestamp(),
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