import { useEffect, useState } from "react"
import {
  getFeaturedProtests,
  getFeaturedPetitions,
  getImages,
} from "../firebase/protests"

export default function Home() {
  const [protests, setProtests] = useState([])
  const [petitions, setPetitions] = useState([])
  const [images, setImages] = useState([])

  useEffect(() => {
    const load = async () => {
      setProtests(await getFeaturedProtests())
      setPetitions(await getFeaturedPetitions())
      setImages(await getImages())
    }

    load()
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <h1>Home</h1>

      <h2>Featured Protests</h2>
      {protests.map((p) => (
        <div key={p.id}>
          <h3>{p.title}</h3>
          <p>{p.description}</p>
        </div>
      ))}

      <h2>Featured Petitions</h2>
      {petitions.map((p) => (
        <div key={p.id}>
          <h3>{p.title}</h3>
          <p>{p.description}</p>
        </div>
      ))}

      <h2>Gallery</h2>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {images.map((img) => (
          <div key={img.id} style={{ width: 200 }}>
            <img src={img.url} style={{ width: "100%" }} />
            <p>{img.caption}</p>
          </div>
        ))}
      </div>
    </div>
  )
}