import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyDPBUlEFWOsL_PaRzOeK7KS7XjB1g3o19w",
  authDomain: "nonprofit-site.firebaseapp.com",
  projectId: "nonprofit-site",
  storageBucket: "nonprofit-site.appspot.com",
  messagingSenderId: "524328542084",
  appId: "1:524328542084:web:fe8d7aefe34e38bc6147d1",
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)