import { useEffect, useState } from "react"
import { getFeaturedPetitions } from "../firebase/actions"

export default function Petitions() {
  const [petitions, setPetitions] = useState([])

  useEffect(() => {
    const load = async () => {
      setPetitions(await getFeaturedPetitions())
    }

    load()
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <h1>Petitions</h1>

      {petitions.map((p) => (
        <div key={p.id}>
          <h3>{p.title}</h3>
          <p>{p.description}</p>
          <a href={p.link} target="_blank">Sign</a>
        </div>
      ))}
    </div>
  )
}