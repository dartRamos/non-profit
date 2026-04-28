import "./Events.css"
import { useState } from "react"

import img1 from "../assets/event1.png"
import img2 from "../assets/event2.png"
import img3 from "../assets/event3.png"
import img4 from "../assets/event4.png"
import img5 from "../assets/event5.png"
import img6 from "../assets/event6.png"
import img7 from "../assets/event7.png"

import rectangle from "../assets/rectangle91.png"

import Protests from "../components/Protests"
import DonateButton from "../components/DonateButton.jsx";

const baseImages = [img1, img2, img3, img4, img5, img6, img7]

const heroImages = Array.from({ length: 10 }, (_, i) => {
  return baseImages[i % baseImages.length]
})

export default function Events() {
  const [tab, setTab] = useState("protests")

  return (
    <div className="events-page">

      {/* HERO */}
      <div className="events-hero-grid">

        {heroImages.map((img, i) => (
          <img
            key={i}
            src={img}
            className={`hero-img ${i % 2 === 1 ? "offset" : ""}`}
            alt={`event-${i}`}
          />
        ))}

        <DonateButton onClick={() => window.location.href = "/donate"} />

        <div className="hero-center-text">
          GET INVOLVED
        </div>

      </div>

      {/* BODY */}
      <div className="container">

        {/* TABS */}
        <div className="events-tabs">
          <button
            className={tab === "protests" ? "active" : ""}
            onClick={() => setTab("protests")}
          >
            Protests
          </button>

          <button
            className={tab === "rallies" ? "active" : ""}
            onClick={() => setTab("rallies")}
          >
            Rallies
          </button>

          <button
            className={tab === "town-hall-meetings" ? "active" : ""}
            onClick={() => setTab("town-hall-meetings")}
          >
            Town Hall Meetings
          </button>
        </div>

        {/* RECTANGLE SECTION */}
        <div className="events-section">

          <img src={rectangle} className="events-bg" alt="background" />

          <div className="events-overlay">

            {tab === "protests" && <Protests />}
            {tab === "petitions" && <Rallies />}
            {tab === "volunteer" && <TownHallMeetings />}

          </div>

        </div>

      </div>
    </div>
  )
}