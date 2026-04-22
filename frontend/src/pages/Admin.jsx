import { useEffect, useState } from "react"
import {
  getProtests,
  createProtest,
  deleteProtest,
  updateProtest,
  toggleProtestFeatured,
  getPetitions,
  createPetition,
  deletePetition,
  updatePetition,
  togglePetitionFeatured,
  getImages,
  deleteImage,
} from "../firebase/protests"

import { useAuth } from "../firebase/useAuth"
import { uploadImage } from "../firebase/uploadImage"

export default function Admin() {
  const { user, loading } = useAuth()

  const [protests, setProtests] = useState([])
  const [petitions, setPetitions] = useState([])
  const [images, setImages] = useState([])

  const [protestImage, setProtestImage] = useState(null)
  const [petitionImage, setPetitionImage] = useState(null)

  const [pTitle, setPTitle] = useState("")
  const [pDesc, setPDesc] = useState("")
  const [pDate, setPDate] = useState("")

  const [petTitle, setPetTitle] = useState("")
  const [petDesc, setPetDesc] = useState("")
  const [petDate, setPetDate] = useState("")
  const [petLink, setPetLink] = useState("")

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

      {/* ---------------- PROTESTS ---------------- */}
      <h2>Protests</h2>

      <input placeholder="Title" value={pTitle} onChange={(e) => setPTitle(e.target.value)} />
      <input placeholder="Description" value={pDesc} onChange={(e) => setPDesc(e.target.value)} />
      <input placeholder="Date" value={pDate} onChange={(e) => setPDate(e.target.value)} />

      <input type="file" onChange={(e) => setProtestImage(e.target.files[0])} />

      <button
        onClick={async () => {
          let imageUrl = ""

          if (protestImage) {
            imageUrl = await uploadImage(protestImage)
          }

          await createProtest({
            title: pTitle,
            description: pDesc,
            date: pDate,
            image: imageUrl,
          })

          setPTitle("")
          setPDesc("")
          setPDate("")
          setProtestImage(null)
          load()
        }}
      >
        Create Protest
      </button>

      {protests.map((p) => (
        <div key={p.id} style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
          <h3>{p.title}</h3>
          <p>{p.description}</p>

          {p.image && (
            <img src={p.image} style={{ width: 150 }} />
          )}

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

      {/* ---------------- PETITIONS ---------------- */}
      <h2>Petitions</h2>

      <input placeholder="Title" value={petTitle} onChange={(e) => setPetTitle(e.target.value)} />
      <input placeholder="Description" value={petDesc} onChange={(e) => setPetDesc(e.target.value)} />
      <input placeholder="Date" value={petDate} onChange={(e) => setPetDate(e.target.value)} />
      <input placeholder="Link" value={petLink} onChange={(e) => setPetLink(e.target.value)} />

      <input type="file" onChange={(e) => setPetitionImage(e.target.files[0])} />

      <button
        onClick={async () => {
          let imageUrl = ""

          if (petitionImage) {
            imageUrl = await uploadImage(petitionImage)
          }

          await createPetition({
            title: petTitle,
            description: petDesc,
            date: petDate,
            link: petLink,
            image: imageUrl,
          })

          setPetTitle("")
          setPetDesc("")
          setPetDate("")
          setPetLink("")
          setPetitionImage(null)
          load()
        }}
      >
        Create Petition
      </button>

      {petitions.map((p) => (
        <div key={p.id} style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
          <h3>{p.title}</h3>
          <p>{p.description}</p>

          {p.image && (
            <img src={p.image} style={{ width: 150 }} />
          )}

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

      {/* ---------------- IMAGES ---------------- */}
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