import { useEffect, useState } from "react"
import {
  getProtests,
  createProtest,
  deleteProtest,
  getPetitions,
  createPetition,
  deletePetition,
  getImages,
  deleteImage,
} from "../firebase/protests"
import { useAuth } from "../firebase/useAuth"

export default function Admin() {
  const { user, loading } = useAuth()

  const [protests, setProtests] = useState([])
  const [petitions, setPetitions] = useState([])
  const [images, setImages] = useState([])

  const load = async () => {
    setProtests(await getProtests())
    setPetitions(await getPetitions())
    setImages(await getImages())
  }

  useEffect(() => {
    if (user) load()
  }, [user])

  if (loading) return <div>Loading...</div>
  if (!user) return <div>Not authorized</div>

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin CMS</h1>

      {/* PROTESTS */}
      <h2>Protests</h2>
      <button
        onClick={async () => {
          await createProtest({
            title: "New Protest",
            description: "Admin created",
            date: "2026-01-01",
          })
          load()
        }}
      >
        Add Protest
      </button>

      {protests.map((p) => (
        <div key={p.id} style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
          <h3>{p.title}</h3>
          <p>{p.description}</p>

          <button
            onClick={() =>
              updateProtest(p.id, {
                title: prompt("New title", p.title),
                description: prompt("New description", p.description),
              })
            }
          >
            Edit
          </button>

          <button onClick={() => deleteProtest(p.id)}>Delete</button>

          <button onClick={() => toggleProtestFeatured(p.id, p.featured)}>
            {p.featured ? "Unfeature" : "Feature"}
          </button>
        </div>
      ))}

      {/* PETITIONS */}
      <h2>Petitions</h2>

      <button
        onClick={async () => {
          await createPetition({
            title: "New Petition",
            description: "Admin created",
            date: "2026-01-01",
            link: "https://example.com",
          })
          load()
        }}
      >
        Add Petition
      </button>

      {petitions.map((p) => (
        <div key={p.id} style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
          <h3>{p.title}</h3>

          <button
            onClick={() =>
              updatePetition(p.id, {
                title: prompt("New title", p.title),
                description: prompt("New description", p.description),
              })
            }
          >
            Edit
          </button>

          <button onClick={() => deletePetition(p.id)}>Delete</button>

          <button onClick={() => togglePetitionFeatured(p.id, p.featured)}>
            {p.featured ? "Unfeature" : "Feature"}
          </button>
        </div>
      ))}

      {/* IMAGES */}
      <h2>Images</h2>

      {images.map((img) => (
        <div key={img.id}>
          <img src={img.url} style={{ width: 120 }} />
          <button onClick={() => deleteImage(img.id)}>Delete</button>
        </div>
      ))}
    </div>
  )
}