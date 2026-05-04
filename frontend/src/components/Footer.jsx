import "./Footer.css"
import { useState } from "react"
import { addSubscriber } from "../firebase/subscribers"

import logo from "../assets/whitelogo.png"

import discord from "../assets/Discord.png"
import instagram from "../assets/Instagram.png"
import twitter from "../assets/Twitter.png"
import tiktok from "../assets/Tiktok.png"
import facebook from "../assets/Facebook.png"
import reddit from "../assets/Reddit.png"
import bluesky from "../assets/Bluesky.png"
import substack from "../assets/Substack.png"

export default function Footer() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  const handleSubscribe = async () => {
    if (!name.trim() || !email.trim()) {
      alert("Enter name and email")
      return
    }

    try {
      await addSubscriber({ name, email })

      setName("")
      setEmail("")
      alert("Subscribed!")
    } catch (err) {
      console.error(err)
      alert("Something went wrong")
    }
  }

  return (
    <footer className="footer">

      {/* TOP YELLOW SECTION */}
      <div className="footer-top">
        <div className="container">
          <div className="footer-top-content">

            <div className="footer-left">
              <h2 className="footer-title">Stay Connected</h2>

              <p className="footer-subtext">
                Subscribe to our newsletter to be the first to know what’s going on.
                <br />
                Latest events, news, and more!
              </p>
            </div>

            <div className="footer-right">

              <div className="footer-input-row">
                <input
                  type="text"
                  placeholder="Name"
                  className="footer-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <input
                  type="email"
                  placeholder="Email"
                  className="footer-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button className="footer-button" onClick={handleSubscribe}>
                Subscribe Now
              </button>

            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM BLACK SECTION */}
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
      
            {/* LEFT */}
            <div className="footer-brand">

              <div className="footer-brand-row">
                <img src={logo} alt="logo" className="footer-logo" />
                <h3>ONTARIANS AGAINST CORRUPTION</h3>
              </div>

              <p className="footer-tagline">
                A grassroots community exposing corruption and pushing for accountability in Ontario.
              </p>

            </div>

            {/* RIGHT */}
            <div className="footer-links-area">

              <div className="footer-links-column">
                <a href="/about">About</a>
                <a href="/actions">Actions</a>
                <a href="/events">Events</a>
                <a href="/stay-connected">Stay Connected</a>

                <div className="footer-policy">
                
                  <p className="footer-links-text">
                    © 2026 Ontarians Against Corruption
                  </p>

                  <p className="privacy-text">
                    Privacy Policy
                  </p>
                
                </div>
                
              </div>

              <div className="footer-social-column">
                
              </div>

            </div>

          </div>
        </div>
      </div>

    </footer>
  )
}