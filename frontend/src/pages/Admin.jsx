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

export default function Admin() {
  const { user, loading } = useAuth()

  const [tab, setTab] = useState("protests")

  const [protests, setProtests] = useState([])
  const [petitions, setPetitions] = useState([])
  const [images, setImages] = useState([])

  const [editingProtest, setEditingProtest] = useState(null)
  const [editingPetition, setEditingPetition] = useState(null)

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    link: "",
    image: "",
    location: "",
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
    setForm({
      title: "",
      description: "",
      date: "",
      link: "",
      image: "",
    })
    setEditingProtest(null)
    setEditingPetition(null)
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

            <input
              placeholder="City (e.g. Toronto)"
              value={form.location}
              onChange={(e) =>
                setForm({ ...form, location: e.target.value })
              }
            />

            <input
              placeholder="Image URL (optional)"
              value={form.image}
              onChange={(e) =>
                setForm({ ...form, image: e.target.value })
              }
            />

            <button
              onClick={async () => {
                if (editingProtest) {
                  await updateProtest(editingProtest.id, {
                    title: form.title,
                    description: form.description,
                    date: form.date,
                    image: form.image || "",
                    location: form.location || "",
                  })
                } else {
                  await createProtest({
                    title: form.title,
                    description: form.description,
                    date: form.date,
                    image: form.image || "",
                    location: form.location || "",
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
                      image: p.image || "",
                    })
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

            <input
              placeholder="Image URL (optional)"
              value={form.image}
              onChange={(e) =>
                setForm({ ...form, image: e.target.value })
              }
            />

            <button
              onClick={async () => {
                if (editingPetition) {
                  await updatePetition(editingPetition.id, {
                    title: form.title,
                    description: form.description,
                    date: form.date,
                    link: form.link,
                    image: form.image || "",
                  })
                } else {
                  await createPetition({
                    title: form.title,
                    description: form.description,
                    date: form.date,
                    link: form.link,
                    image: form.image || "",
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
                      image: p.image || "",
                    })
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