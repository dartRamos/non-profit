import { db } from "./config"
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore"

// ---------------- PROTESTS ----------------

const protestsRef = collection(db, "protests")

export const createProtest = async (protest: {
  title: string
  description: string
  date: string
  image?: string
}) => {
  await addDoc(protestsRef, {
    ...protest,
    featured: false,
  })
}

export const getProtests = async () => {
  const snapshot = await getDocs(protestsRef)

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
}

export const deleteProtest = async (id: string) => {
  await deleteDoc(doc(db, "protests", id))
}

export const updateProtest = async (id: string, data: any) => {
  await updateDoc(doc(db, "protests", id), data)
}

export const toggleProtestFeatured = async (id: string, current: boolean) => {
  await updateDoc(doc(db, "protests", id), {
    featured: !current,
  })
}

export const getFeaturedProtests = async () => {
  const snapshot = await getDocs(protestsRef)

  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .filter((p: any) => p.featured === true)
}

// ---------------- PETITIONS ----------------

const petitionsRef = collection(db, "petitions")

export const createPetition = async (petition: {
  title: string
  description: string
  date: string
  link: string
  image?: string
}) => {
  await addDoc(petitionsRef, {
    ...petition,
    featured: false,
  })
}

export const getPetitions = async () => {
  const snapshot = await getDocs(petitionsRef)

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
}

export const deletePetition = async (id: string) => {
  await deleteDoc(doc(db, "petitions", id))
}

export const updatePetition = async (id: string, data: any) => {
  await updateDoc(doc(db, "petitions", id), data)
}

export const togglePetitionFeatured = async (id: string, current: boolean) => {
  await updateDoc(doc(db, "petitions", id), {
    featured: !current,
  })
}

export const getFeaturedPetitions = async () => {
  const snapshot = await getDocs(petitionsRef)

  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .filter((p: any) => p.featured === true)
}

// ---------------- IMAGES ----------------

const imagesRef = collection(db, "images")

export const getImages = async () => {
  const snapshot = await getDocs(imagesRef)

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
}

export const deleteImage = async (id: string) => {
  await deleteDoc(doc(db, "images", id))
}