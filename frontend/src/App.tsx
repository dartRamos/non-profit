import { Routes, Route, Link } from 'react-router-dom'
import React from "react"
import Home from './pages/Home.jsx'
import Petitions from './pages/Petitions.jsx'
import Protests from './pages/Protests.jsx'
import Login from "./pages/Login"
import Admin from "./pages/Admin"
import { useAuth } from "./firebase/useAuth"

export default function App() {
  const { user, loading } = useAuth()

  return (
    <div>
      <nav style={{ padding: 10, borderBottom: "1px solid #ccc" }}>
        <Link to="/" style={{ marginRight: 10 }}>Home</Link>
        <Link to="/protests" style={{ marginRight: 10 }}>Protests</Link>
        <Link to="/petitions">Petitions</Link>

        {user && (
          <Link to="/admin" style={{ marginLeft: 10 }}>Admin</Link>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/protests" element={<Protests />} />
        <Route path="/petitions" element={<Petitions />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>

      <div style={{ padding: 10, background: "#eee" }}>
        {loading ? "Loading..." : user ? "Logged in" : "Not logged in"}
      </div>
    </div>
  )
}