import { useState } from "react"
import { loginAdmin } from "../firebase/auth"
import "./Volunteer.css"

import headerImage from "../assets/volunteerHero.png";
import rectangle54 from "../assets/rectangle54.png";
import rectangle149 from "../assets/rectangle149.png"
import discord from "../assets/volunteerDiscord.png"

import DonateButton from "../components/DonateButton";

import { signupVolunteer } from "../firebase/volunteers"

export default function Volunteer() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")

  const handleSignup = async () => {
    try {
      await signupVolunteer({ 
        name, 
        email 
      })
  
      alert("Successfully signed up as volunteer!")
      setName("")
      setEmail("")
    } catch (err) {
      alert(err.message || "Signup failed")
    }
  }

  return (
    <div>

      {/* HERO */}
      <div className="header-image-container">
        <img src={headerImage} className="volunteer-image" alt="header" />
        <img src={rectangle54} className="rectangle-54" alt="overlay" />
        
        <div className="image-fade" />
        {/* <DonateButton onClick={() => window.location.href = "/donate"} /> */}

        <div className="header-text">
          <h1 className="line">JOIN US</h1>
        </div>
      </div>

      <div className="container">
        <div className="volunteer-container">
          {/* VOLUNTEER SIGNUP SECTION */}
          <div className="volunteer-section">

          <img
            src={rectangle149}
            className="featured-volunteer-bg"
            alt="background"
          />

          <div className="volunteer-form-overlay">
            <h2>Volunteering with us</h2>
            <p>
              Ontarians Against Corruption is a new grassroots organization focused on exposing and fighting corruption across Ontario. We organize Ontarians to take action through coordinated email campaigns, petitions, and public calls to action. 
              < br /> < br />
              We also help spread awareness about protests, rallies, and town hall meetings happening across the province. While much of our work takes place online through Discord and social media, we also come together in person for demonstrations and community action.
            </p>

            {/* INPUT ROW (like footer) */}
            <div className="volunteer-input-row">
              <input
                className="volunteer-input"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                className="volunteer-input"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button className="volunteer-button" onClick={handleSignup}>
              Sign Up
            </button>

            <h3> Join our Discord to join the team! </h3>
            <p>Stay connected with others in the Ontarians Against Corruption Discord. Click the icon to join our community, stay informed on all actions and campaigns, and get involved in organizing change across Ontario.</p>
            <p>We look forward to hearing from you!</p>
            
            <a href="https://discord.gg/QX2zY867" target="_blank" rel="noopener noreferrer">
              <img src={discord} className="discord-icon" />
            </a>
          </div>

          </div>
        
        </div>
      </div>
    </div>
  )
}