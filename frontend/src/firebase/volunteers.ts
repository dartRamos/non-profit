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
  const email = data.email.trim().toLowerCase()

  const q = query(volunteerRef, where("email", "==", email))
  const existing = await getDocs(q)

  if (!existing.empty) {
    throw new Error("Already signed up as volunteer")
  }

  await addDoc(volunteerRef, {
    name: data.name,
    email,
    createdAt: serverTimestamp(),
  })
}

// ---------------- GET VOLUNTEERS ----------------

export const getVolunteers = async () => {
  const q = query(volunteerRef, orderBy("createdAt", "desc"))
  const snapshot = await getDocs(q)

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
}