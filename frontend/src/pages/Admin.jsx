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

  const [tab, setTab] = useState("protests")

  const [protests, setProtests] = useState([])
  const [petitions, setPetitions] = useState([])
  const [images, setImages] = useState([])

  const [editingProtest, setEditingProtest] = useState(null)
  const [editingPetition, setEditingPetition] = useState(null)

  const [protestImage, setProtestImage] = useState(null)
  const [petitionImage, setPetitionImage] = useState(null)

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    link: "",
  })

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

  const resetForm = () => {
    setForm({ title: "", description: "", date: "", link: "" })
    setEditingProtest(null)
    setEditingPetition(null)
    setProtestImage(null)
    setPetitionImage(null)
  }

  const panel = { display: "flex", minHeight: "100vh" }
  const sidebar = { width: 200, borderRight: "1px solid #ddd", padding: 10 }
  const content = { flex: 1, padding: 20 }

  return (
    <div style={panel}>
      {/* SIDEBAR */}
      <div style={sidebar}>
        <h3>Admin</h3>

        <button onClick={() => setTab("protests")}>Protests</button>
        <button onClick={() => setTab("petitions")}>Petitions</button>
        <button onClick={() => setTab("images")}>Images</button>
      </div>

      {/* CONTENT */}
      <div style={content}>
        <h1>CMS Dashboard</h1>

        {/* ---------------- PROTESTS ---------------- */}
        {tab === "protests" && (
          <>
            <h2>Protests</h2>

            <input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              style={{ width: "100%", height: 120 }}
            />

            <input
              placeholder="Date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />

            <input type="file" onChange={(e) => setProtestImage(e.target.files[0])} />

            <button
              onClick={async () => {
                let imageUrl = ""
                if (protestImage) imageUrl = await uploadImage(protestImage)

                if (editingProtest) {
                  await updateProtest(editingProtest.id, {
                    title: form.title,
                    description: form.description,
                    date: form.date,
                    image: imageUrl || editingProtest.image || "",
                  })
                } else {
                  await createProtest({
                    title: form.title,
                    description: form.description,
                    date: form.date,
                    image: imageUrl,
                  })
                }

                resetForm()
                load()
              }}
            >
              {editingProtest ? "Update Protest" : "Create Protest"}
            </button>

            {protests.map((p) => (
              <div key={p.id} style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
                <h3>{p.title}</h3>
                <p>{p.description}</p>

                {p.image && <img src={p.image} style={{ width: 120 }} />}

                <button
                  onClick={() => {
                    setEditingProtest(p)
                    setForm({
                      title: p.title,
                      description: p.description,
                      date: p.date,
                      link: "",
                    })
                    setTab("protests")
                  }}
                >
                  Edit
                </button>

                <button onClick={() => deleteProtest(p.id)}>Delete</button>

                <button onClick={() => toggleProtestFeatured(p.id, p.featured)}>
                  {p.featured ? "Unfeature" : "Feature"}
                </button>
              </div>
            ))}
          </>
        )}

        {/* ---------------- PETITIONS ---------------- */}
        {tab === "petitions" && (
          <>
            <h2>Petitions</h2>

            <input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              style={{ width: "100%", height: 120 }}
            />

            <input
              placeholder="Date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />

            <input
              placeholder="Link"
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
            />

            <input type="file" onChange={(e) => setPetitionImage(e.target.files[0])} />

            <button
              onClick={async () => {
                let imageUrl = ""
                if (petitionImage) imageUrl = await uploadImage(petitionImage)

                if (editingPetition) {
                  await updatePetition(editingPetition.id, {
                    title: form.title,
                    description: form.description,
                    date: form.date,
                    link: form.link,
                    image: imageUrl || editingPetition.image || "",
                  })
                } else {
                  await createPetition({
                    title: form.title,
                    description: form.description,
                    date: form.date,
                    link: form.link,
                    image: imageUrl,
                  })
                }

                resetForm()
                load()
              }}
            >
              {editingPetition ? "Update Petition" : "Create Petition"}
            </button>

            {petitions.map((p) => (
              <div key={p.id} style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
                <h3>{p.title}</h3>

                {p.image && <img src={p.image} style={{ width: 120 }} />}

                <button
                  onClick={() => {
                    setEditingPetition(p)
                    setForm({
                      title: p.title,
                      description: p.description,
                      date: p.date,
                      link: p.link,
                    })
                    setTab("petitions")
                  }}
                >
                  Edit
                </button>

                <button onClick={() => deletePetition(p.id)}>Delete</button>

                <button onClick={() => togglePetitionFeatured(p.id, p.featured)}>
                  {p.featured ? "Unfeature" : "Feature"}
                </button>
              </div>
            ))}
          </>
        )}

        {/* ---------------- IMAGES ---------------- */}
        {tab === "images" && (
          <>
            <h2>Images</h2>

            {images.map((img) => (
              <div key={img.id}>
                <img src={img.url} style={{ width: 120 }} />
                <button onClick={() => deleteImage(img.id)}>Delete</button>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}