import { Link } from "react-router-dom"
import logo from "../assets/whitelogo.png"
import "./Nav.css"

export default function Nav({ user }) {
  return (
    <nav className="navbar-custom">
      <Link to="/">
        <img src={logo} className="white-logo" alt="logo" />
      </Link>

      <div className="navbar-links">
        <Link to="/About">About</Link>
        <Link to="/protests">Events</Link>
        <Link to="/petitions">Stay Informed</Link>

        {user && <Link to="/admin">Admin</Link>}
      </div>
    </nav>
  )
}