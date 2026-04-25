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
import Action from "./pages/Action"
import ActionRouter from "./pages/ActionRouter"

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
        <Route path="/action/:id" element={<Action />} />
        <Route path="/actions/:id" element={<ActionRouter />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>

      <Footer />
    </div>
  )
}