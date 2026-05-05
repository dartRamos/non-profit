import { db } from "./config"
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore"

const volunteerRef = collection(db, "volunteer_signups")

// ---------------- SIGN UP ----------------

export const signupVolunteer = async (data: {
  name: string
  email: string
}) => {
  const res = await fetch("https://non-profit-ta9x.onrender.com/volunteer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  const json = await res.json()

  if (!json.success) {
    throw new Error(json.error || "Volunteer signup failed")
  }

  return json
}

// ---------------- GET VOLUNTEERS ----------------

export const getVolunteers = async () => {
  const res = await fetch("https://non-profit-ta9x.onrender.com/volunteers")
  const json = await res.json()

  if (!json.success) {
    throw new Error(json.error || "Failed to fetch volunteers")
  }

  return json.volunteers
}