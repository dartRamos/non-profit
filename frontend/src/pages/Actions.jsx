import "./Actions.css"
import { useState } from "react"

import img1 from "../assets/event1.png"
import img2 from "../assets/event2.png"
import img3 from "../assets/event3.png"
import img4 from "../assets/event4.png"
import img5 from "../assets/event5.png"
import img6 from "../assets/event6.png"
import img7 from "../assets/event7.png"

import rectangle from "../assets/rectangle91.png"

import Petitions from "../components/Petitions"
import DonateButton from "../components/DonateButton.jsx";


const baseImages = [img1, img2, img3, img4, img5, img6, img7]

const heroImages = Array.from({ length: 10 }, (_, i) => {
  return baseImages[i % baseImages.length]
})

export default function Actions() {
  const [tab, setTab] = useState("cta")

  return (
    <div className="actions-page">

      {/* HERO */}
      <div className="actions-hero-grid">

        {heroImages.map((img, i) => (
          <img
            key={i}
            src={img}
            className={`hero-img ${i % 2 === 1 ? "offset" : ""}`}
            alt={`action-${i}`}
          />
        ))}

        <DonateButton onClick={() => window.location.href = "/donate"} />

        <div className="hero-center-text">
          TAKE ACTION
        </div>

      </div>

      {/* BODY */}
      <div className="container">

        {/* TABS */}
        <div className="actions-tabs">

          <button
            className={tab === "cta" ? "active" : ""}
            onClick={() => setTab("cta")}
          >
            OAC’s Call to Actions
          </button>

          <button
            className={tab === "email" ? "active" : ""}
            onClick={() => setTab("email")}
          >
            Email Campaigns
          </button>

          <button
            className={tab === "petitions" ? "active" : ""}
            onClick={() => setTab("petitions")}
          >
            Petitions
          </button>

        </div>

        {/* RECTANGLE SECTION */}
        <div className="events-section">

          <img src={rectangle} className="events-bg" alt="background" />

          <div className="events-overlay">

            {/* {tab === "cta" && <CTA />} */}
            {/* {tab === 'email' && <EmailCampaigns />} */}
            {tab === "petitions" && <Petitions />}

          </div>

        </div>

      </div>
    </div>
  )
}