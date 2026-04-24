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
  createImage,
  deleteImage,
  toggleImageFeatured,
} from "../firebase/protests"

import { useAuth } from "../firebase/useAuth"
import "./Admin.css"

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

  const [imageForm, setImageForm] = useState({
    url: "",
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
      location: "",
    })
    setEditingProtest(null)
    setEditingPetition(null)
  }

  return (
    <div className="admin-wrapper">

      {/* SIDEBAR */}
      <div className="admin-sidebar">
        <h3>Admin</h3>

        <button onClick={() => setTab("protests")}>Protests</button>
        <button onClick={() => setTab("petitions")}>Petitions</button>
        <button onClick={() => setTab("images")}>Images</button>
      </div>

      {/* CONTENT */}
      <div className="admin-content">

        <h1>CMS Dashboard</h1>

        {/* ---------------- PROTESTS ---------------- */}
        {tab === "protests" && (
          <>
            <h2>Protests</h2>

            <div className="admin-form">

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
              />

              <div className="admin-row">
                <input
                  placeholder="YYYY-MM-DD"
                  value={form.date}
                  onChange={(e) =>
                    setForm({ ...form, date: e.target.value })
                  }
                />

                <input
                  placeholder="City"
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                />
              </div>

              <input
                placeholder="Image URL"
                value={form.image}
                onChange={(e) =>
                  setForm({ ...form, image: e.target.value })
                }
              />

              <button
                onClick={async () => {
                  if (editingProtest) {
                    await updateProtest(editingProtest.id, form)
                  } else {
                    await createProtest(form)
                  }
                  resetForm()
                  load()
                }}
              >
                {editingProtest ? "Update Protest" : "Create Protest"}
              </button>

            </div>

            {protests.map((p) => (
              <div key={p.id} className="admin-card">

                {p.image && <img src={p.image} width={120} />}

                <h3>{p.title}</h3>
                <p>{p.location}</p>

                <button onClick={() => {
                  setEditingProtest(p)
                  setForm(p)
                }}>
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

            <div className="admin-form">

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
              />

              <div className="admin-row">
                <input
                  placeholder="YYYY-MM-DD"
                  value={form.date}
                  onChange={(e) =>
                    setForm({ ...form, date: e.target.value })
                  }
                />

                <input
                  placeholder="Link"
                  value={form.link}
                  onChange={(e) =>
                    setForm({ ...form, link: e.target.value })
                  }
                />
              </div>

              <input
                placeholder="Image URL"
                value={form.image}
                onChange={(e) =>
                  setForm({ ...form, image: e.target.value })
                }
              />

              <button
                onClick={async () => {
                  if (editingPetition) {
                    await updatePetition(editingPetition.id, form)
                  } else {
                    await createPetition(form)
                  }
                  resetForm()
                  load()
                }}
              >
                {editingPetition ? "Update Petition" : "Create Petition"}
              </button>

            </div>

            {petitions.map((p) => (
              <div key={p.id} className="admin-card">

                <h3>{p.title}</h3>

                <button onClick={() => {
                  setEditingPetition(p)
                  setForm(p)
                }}>
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

            <div className="admin-form">

              <input
                placeholder="Image URL"
                value={imageForm.url}
                onChange={(e) =>
                  setImageForm({ ...imageForm, url: e.target.value })
                }
              />

              <button
                onClick={async () => {
                  await createImage({
                    url: imageForm.url,
                    featured: false,
                  })
                  setImageForm({ url: "" })
                  load()
                }}
              >
                Add Image
              </button>

            </div>

            <div className="image-grid">
              {images.map((img) => (
                <div key={img.id} className="admin-card">
                  <img src={img.url} width={120} />

                  <button onClick={() => deleteImage(img.id)}>Delete</button>

                  <button onClick={() => toggleImageFeatured(img.id, img.featured)}>
                    {img.featured ? "Unfeature" : "Feature"}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  )
}