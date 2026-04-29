import { useEffect, useState } from "react"
import { getActions } from "../firebase/actions"
import ActionGrid from "./ActionsGrid"

export default function ActionFeed({ type }) {
  const [items, setItems] = useState([])

  useEffect(() => {
    async function load() {
      const data = await getActions()
      setItems(data.filter((a) => a.type === type))
    }

    load()
  }, [type])

  return <ActionGrid items={items} baseLink="/actions" />
}