import { db } from "./config"
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  orderBy,
  query,
  arrayUnion,
  increment,
} from "firebase/firestore"

// SHARED HELPERS (SIGNUPS)

export const signUpToItem = async (
  collectionName: string,
  id: string,
  email: string
) => {
  await updateDoc(doc(db, collectionName, id), {
    signups: increment(1),
    signupsList: arrayUnion(email),
  })
}

// PROTESTS

const protestsRef = collection(db, "protests")

export const createProtest = async (protest: {
  title: string
  shortDescription?: string
  fullDescription: string
  date: string
  image?: string
  location?: string
  slug: string
}) => {
  await addDoc(protestsRef, {
    ...protest,
    featured: false,
    signups: 0,
    signupsList: [],
  })
}

export const getProtests = async () => {
  const q = query(protestsRef, orderBy("date", "desc"))
  const snapshot = await getDocs(q)

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
}

export const getProtestBySlug = async (slug: string) => {
  const snapshot = await getDocs(protestsRef)

  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .find((p: any) => p.slug === slug)
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

// PETITIONS

const petitionsRef = collection(db, "petitions")

export const createPetition = async (petition: {
  title: string
  shortDescription?: string
  fullDescription?: string
  date: string
  link: string
  image?: string
  slug: string
}) => {
  await addDoc(petitionsRef, {
    ...petition,
    featured: false,
    signups: 0,
    signupsList: [],
  })
}

export const getPetitions = async () => {
  const q = query(petitionsRef, orderBy("date", "desc"))
  const snapshot = await getDocs(q)

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
}

export const getPetitionBySlug = async (slug: string) => {
  const snapshot = await getDocs(petitionsRef)

  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .find((p: any) => p.slug === slug)
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

// CTA (CALL TO ACTIONS)

const ctaRef = collection(db, "ctas")

export const createCTA = async (cta: {
  title: string
  shortDescription: string
  fullDescription: string
  slug: string
  image?: string
}) => {
  await addDoc(ctaRef, {
    ...cta,
    signups: 0,
    signupsList: [],
  })
}

export const getCTAs = async () => {
  const snapshot = await getDocs(ctaRef)

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
}

// RALLIES

const ralliesRef = collection(db, "rallies")

export const createRally = async (rally: {
  title: string
  shortDescription: string
  fullDescription: string
  date: string
  location: string
  image?: string
  slug: string
}) => {
  await addDoc(ralliesRef, {
    ...rally,
    signups: 0,
    signupsList: [],
    featured: false,
  })
}

export const getRallies = async () => {
  const snapshot = await getDocs(ralliesRef)

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
}

// TOWN HALLS

const townHallsRef = collection(db, "townhalls")

export const createTownHall = async (event: {
  title: string
  shortDescription: string
  fullDescription: string
  date: string
  location: string
  image?: string
  zoomLink?: string
  slug: string
}) => {
  await addDoc(townHallsRef, {
    ...event,
    signups: 0,
    signupsList: [],
    featured: false,
  })
}

export const getTownHalls = async () => {
  const snapshot = await getDocs(townHallsRef)

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
}

// EMAIL CAMPAIGNS

const emailRef = collection(db, "emailCampaigns")

export const createEmailCampaign = async (campaign: {
  title: string
  subject: string
  previewText: string
  body: string
  slug: string
}) => {
  await addDoc(emailRef, {
    ...campaign,
    signups: 0,
    signupsList: [],
    sent: false,
  })
}

export const getEmailCampaigns = async () => {
  const snapshot = await getDocs(emailRef)

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
}

// IMAGES

const imagesRef = collection(db, "images")

export const createImage = async (image: {
  url: string
  featured?: boolean
}) => {
  await addDoc(imagesRef, {
    url: image.url,
    featured: image.featured || false,
  })
}

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

export const toggleImageFeatured = async (id: string, current: boolean) => {
  await updateDoc(doc(db, "images", id), {
    featured: !current,
  })
}

export const getFeaturedImages = async () => {
  const snapshot = await getDocs(imagesRef)

  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .filter((img: any) => img.featured === true)
}