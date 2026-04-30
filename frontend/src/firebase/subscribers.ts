import { db } from "./config"
import { collection, addDoc, getDocs } from "firebase/firestore"

const subscribersRef = collection(db, "subscribers")

export const addSubscriber = async (subscriber) => {
  return await addDoc(subscribersRef, {
    name: subscriber.name,
    email: subscriber.email,
    createdAt: new Date(),
  })
}

export const getSubscribers = async () => {
  const snapshot = await getDocs(subscribersRef)
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }))
}