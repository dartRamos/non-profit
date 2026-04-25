import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getActions, signupForAction } from "../firebase/actions"

export default function Action() {
  const { id } = useParams()
  const [action, setAction] = useState(null)
  const [email, setEmail] = useState("")

  useEffect(() => {
    const load = async () => {
      const actions = await getActions()
      const found = actions.find(a => a.id === id)
      setAction(found)
    }

    load()
  }, [id])

  if (!action) return <p>Loading...</p>

  const handleSignup = async () => {
    if (!email) return alert("Enter email")

    await signupForAction(action.id, email)
    alert("Signed up!")
    setEmail("")
  }

  return (
    <div style={{ padding: 40 }}>

      <h1>{action.title}</h1>

      <p>{action.description}</p>

      <p><b>Location:</b> {action.location}</p>

      <p>
        <b>Total supporters:</b> {action.stats?.signups || 0}
      </p>

      <hr />

      <h3>Join this action</h3>

      <input
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button onClick={handleSignup}>
        Sign This Action
      </button>

    </div>
  )
}