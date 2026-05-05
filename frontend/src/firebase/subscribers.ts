import { db } from "./config"
import { collection, getDocs } from "firebase/firestore"

const subscribersRef = collection(db, "subscribers")

export const addSubscriber = async (subscriber) => {
  const res = await fetch("https://non-profit-ta9x.onrender.com/subscribe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subscriber),
  })

  const json = await res.json()

  if (!json.success) {
    throw new Error(json.error || "Subscribe failed")
  }

  return json
}

export const getSubscribers = async () => {
  const snapshot = await getDocs(subscribersRef)

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
}