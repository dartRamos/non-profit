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
        <Link to="/Actions" onClick={() => setOpen(false)}>Actions</Link>
        <Link to="/Events" onClick={() => setOpen(false)}>Events</Link>
        <Link to="/Volunteer" onClick={() => setOpen(false)}>Volunteer</Link>
        <a
          href="https://calendar.google.com/calendar/u/0/embed?src=331963ac174c5deee40a307b7d8e26d8eecc2aeaccd1d3112b802eef967731eb@group.calendar.google.com&ctz=America/Toronto"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setOpen(false)}
        >
          Calendar
        </a>

        {user && (
          <Link to="/admin" onClick={() => setOpen(false)}>
            Admin
          </Link>
        )}
      </div>
    </nav>
  )
}