import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { storage } from "./config"

export const uploadImage = async (file: File) => {
  const imageRef = ref(storage, `images/${Date.now()}-${file.name}`)

  await uploadBytes(imageRef, file)

  const url = await getDownloadURL(imageRef)

  return url
}