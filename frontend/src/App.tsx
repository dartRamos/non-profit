import { Routes, Route } from "react-router-dom";
import React from "react";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import About from "./pages/About"
import Events from "./pages/Events";
import Actions from "./pages/Actions"
import { useAuth } from "./firebase/useAuth";
import "./App.css";
import Nav from "./components/Navbar.jsx"
import Footer from "./components/Footer.jsx"
import Donate from "./pages/Donate.jsx"
import ActionRouter from "./pages/ActionRouter"
import Volunteer from "./pages/Volunteer.jsx"
import Verify from "./pages/Verify.jsx"

export default function App() {
  const { user, loading } = useAuth()

  return (
    <div>
      <Nav user={user} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/events" element={<Events />} />
        <Route path="/actions" element={<Actions />} />
        <Route path="/actions/:id" element={<ActionRouter />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/volunteer" element={<Volunteer />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>

      <Footer />
    </div>
  )
}