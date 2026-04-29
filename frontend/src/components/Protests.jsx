import { getActions } from "../firebase/actions"
import ActionGrid from "./ActionsGrid"

export default function Protests() {
  const [actions, setActions] = useState([])

  useEffect(() => {
    getActions().then((data) => {
      setActions(data.filter((a) => a.type === "protests"))
    })
  }, [])


  return <ActionGrid items={actions} baseLink="/events" />
}