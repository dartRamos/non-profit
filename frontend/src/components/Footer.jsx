import "./Footer.css"
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
                <input type="text" placeholder="Name" className="footer-input" />
                <input type="email" placeholder="Email" className="footer-input" />
              </div>

              <button className="footer-button">Subscribe Now</button>

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

              {/* LINKS COLUMN */}
              <div className="footer-links-column">

                <a href="/about">About</a>
                <a href="/events">Events</a>
                <a href="/stay-connected">Stay Connected</a>
                <a href="/gallery">Photo Gallery</a>

                {/* optional text under links */}
                <p className="footer-links-text">
                  © 2026 Ontarians Against Corruption
                </p>

              </div>

              {/* SOCIAL COLUMN */}
              <div className="footer-social-column">

                <div className="social-grid">
                  <a href="https://discord.gg/QX2zY867"><img src={discord} /></a>
                  <a href="https://www.instagram.com/ontariansagainstcorruption/" ><img src={instagram} /></a>
                  <a href="https://x.com/OntariansAC"><img src={twitter} /></a>
                  <a href="https://www.tiktok.com/@ontarians.against" ><img src={tiktok} /></a>

                  <a href="https://www.facebook.com/people/Ontarians-Against-Corruption-OAC/61574271323531/"><img src={facebook} /></a>
                  <a href="https://www.reddit.com/user/OntariansAgainst/" ><img src={reddit} /></a>
                  <a href="https://bsky.app/profile/ontariansagainst.bsky.social"><img src={bluesky} /></a>
                  <a href="https://substack.com/@ontariansagainstcorruption?utm_source=global-search"><img src={substack} /></a>
                </div>

                <p className="privacy-text">
                  Privacy Policy
                </p>

              </div>

            </div>

          </div>
        </div>
      </div>

    </footer>
  )
}