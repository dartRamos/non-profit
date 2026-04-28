import { useState } from "react"
import { Link } from "react-router-dom"
import logo from "../assets/whitelogo.png"
import "./Nav.css"

export default function Nav({ user }) {
  const [open, setOpen] = useState(false)

  return (
    <nav className="navbar-custom">
      <Link to="/" onClick={() => setOpen(false)}>
        <img src={logo} className="white-logo" alt="logo" />
      </Link>

      {/* hamburger */}
      <button
        className="hamburger"
        onClick={() => setOpen(!open)}
      >
        ☰
      </button>

      <div className={`navbar-links ${open ? "open" : ""}`}>
        <Link to="/About" onClick={() => setOpen(false)}>About</Link>
        <Link to="/Events" onClick={() => setOpen(false)}>Events</Link>
        <Link to="/Actions" onClick={() => setOpen(false)}>Actions</Link>
        <Link to="/StayInformed" onClick={() => setOpen(false)}>Stay Informed</Link>

        {user && (
          <Link to="/admin" onClick={() => setOpen(false)}>
            Admin
          </Link>
        )}
      </div>
    </nav>
  )
}