import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getActionById } from "../firebase/actions"

import ActionDetail from "./CTADetail"
import PetitionDetail from "./PetitionDetail"
import EmailDetail from "./EmailDetail"

export default function ActionRouter() {
  const { id } = useParams()

  const [action, setAction] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const data = await getActionById(id)
      setAction(data)
      setLoading(false)
    }

    load()
  }, [id])

  if (loading) return <p>Loading...</p>
  if (!action) return <p>Not found</p>

  if (action.type === "petition") {
    return <PetitionDetail action={action} />
  }

  if (action.type === "email") {
    return <EmailDetail action={action} />
  }

  return <ActionDetail action={action} />
}