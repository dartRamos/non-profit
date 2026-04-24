import { Routes, Route } from "react-router-dom";
import React from "react";
import Home from "./pages/Home.jsx";
import Petitions from "./pages/Petitions.jsx";
import Protests from "./pages/Protests.jsx";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import About from "./pages/About"
import { useAuth } from "./firebase/useAuth";
import "./App.css";
import Nav from "./components/Navbar.jsx"

export default function App() {
  const { user, loading } = useAuth()

  return (
    <div>
      <Nav user={user} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  )
}