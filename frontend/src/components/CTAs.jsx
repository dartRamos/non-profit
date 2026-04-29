import { getActions } from "../firebase/actions"
import ActionGrid from "../components/ActionsGrid"

export default function CTAs() {
  const [actions, setActions] = useState([])

  useEffect(() => {
    getActions().then((data) => {
      setActions(data.filter((a) => a.type === "cta"))
    })
  }, [])

  return <ActionGrid items={actions} baseLink="/actions" />
}