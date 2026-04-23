import { Routes, Route, Link } from "react-router-dom";
import React from "react";
import Home from "./pages/Home.jsx";
import Petitions from "./pages/Petitions.jsx";
import Protests from "./pages/Protests.jsx";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import { useAuth } from "./firebase/useAuth";
import "./App.css";
import logo from "./assets/whitelogo.png";

export default function App() {
  const { user, loading } = useAuth();

  return (
    <div>
      <nav className="navbar-custom">
        <img src={logo} className="white-logo" alt="logo" />

        <div className="navbar-links">
          <Link to="/">About</Link>
          <Link to="/protests">Events</Link>
          <Link to="/petitions">Stay Informed</Link>

          {user && <Link to="/admin">Admin</Link>}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/protests" element={<Protests />} />
        <Route path="/petitions" element={<Petitions />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
{/* 
      <div style={{ padding: 10, background: "#eee" }}>
        {loading ? "Loading..." : user ? "Logged in" : "Not logged in"}
      </div> */}
    </div>
  );
}
