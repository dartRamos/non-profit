import { db } from "./config"
import { collection, getDocs, addDoc } from "firebase/firestore"

// OLD COLLECTIONS
const protestsRef = collection(db, "protests")
const petitionsRef = collection(db, "petitions")
const imagesRef = collection(db, "images")

// NEW COLLECTION
const actionsRef = collection(db, "actions")

export const migrateData = async () => {
  console.log("Starting migration...")

  // ---------------- PROTESTS ----------------
  const protestsSnap = await getDocs(protestsRef)

  for (const docSnap of protestsSnap.docs) {
    const p = docSnap.data()

    await addDoc(actionsRef, {
      type: "protest",
      title: p.title || "",
      description: p.description || "",
      shortDescription: p.description?.slice(0, 120) || "",
      date: p.date || "",
      location: p.location || "",
      image: p.image || "",
      featured: p.featured || false,
      createdAt: Date.now(),
    })
  }

  // ---------------- PETITIONS ----------------
  const petitionsSnap = await getDocs(petitionsRef)

  for (const docSnap of petitionsSnap.docs) {
    const p = docSnap.data()

    await addDoc(actionsRef, {
      type: "petition",
      title: p.title || "",
      description: p.description || "",
      shortDescription: p.description?.slice(0, 120) || "",
      date: p.date || "",
      link: p.link || "",
      image: p.image || "",
      featured: p.featured || false,
      createdAt: Date.now(),
    })
  }

  // ---------------- IMAGES ----------------
  const imagesSnap = await getDocs(imagesRef)

  for (const docSnap of imagesSnap.docs) {
    const img = docSnap.data()

    await addDoc(actionsRef, {
      type: "image",
      title: "Image",
      shortDescription: "",
      image: img.url,
      featured: img.featured || false,
      createdAt: Date.now(),
    })
  }

  console.log("Migration complete")
}