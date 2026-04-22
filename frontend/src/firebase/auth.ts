import { auth } from "./config"
import {
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth"

export const loginAdmin = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password)
}

export const logoutAdmin = async () => {
  return await signOut(auth)
}