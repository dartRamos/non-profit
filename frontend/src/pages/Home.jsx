import { useEffect, useState } from "react"
import { getActionsByType } from "../firebase/actions"
import { getFeaturedImages } from "../firebase/protests"

import headerImage from "../assets/image1.png"
import rectangle54 from "../assets/rectangle54.png"
import bluesky from "../assets/Bluesky.png"
import discord from "../assets/Discord.png"
import facebook from "../assets/Facebook.png"
import instagram from "../assets/Instagram.png"
import reddit from "../assets/Reddit.png"
import substack from "../assets/Substack.png"
import tiktok from "../assets/Tiktok.png"
import twitter from "../assets/Twitter.png"
import "./Home.css"

import FeaturedActions from "../components/FeaturedActions.jsx"
import FeaturedImages from "../components/FeaturedImages.jsx"

export default function Home() {

  const [ctas, setCtas] = useState([])
  const [petitions, setPetitions] = useState([])
  const [emails, setEmails] = useState([])
  const [images, setImages] = useState([])

  useEffect(() => {
    const load = async () => {
      const ctaData = await getActionsByType("cta")
      const petitionData = await getActionsByType("petition")
      const emailData = await getActionsByType("email")
      const imageData = await getFeaturedImages()

      setCtas(ctaData)
      setPetitions(petitionData)
      setEmails(emailData)
      setImages(imageData)
    }

    load()
  }, [])

  return (
    <div>

      {/* HERO SECTION */}
      <div className="header-image-container">
        <img src={headerImage} className="header-image" alt="header" />
        <img src={rectangle54} className="rectangle-54" alt="overlay" />

        <div className="image-fade" />

        <div className="header-text">
          <h1 className="line">A GRASSROOTS COMMUNITY</h1>
          <h1 className="line">EXPOSING CORRUPTION AND PUSHING</h1>
          <h1 className="line">FOR ACCOUNTABILITY IN ONTARIO.</h1>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="container">

        <div className="text-lines">
          <p className="left">Connecting people and sharing real ways to get involved</p>
          <p className="right">Making change the best way we can: together</p>
          <p className="left2">Stay informed; stay united; stay strong</p>
        </div>

        <div className="featured-events-container">

          {/* CTA */}
          <FeaturedActions
            actions={ctas}
            type="cta"
            title="Stay Informed"
            buttonText="Take Action"
            seeAllLink="/actions"
          />

          {/* PETITIONS */}
          <FeaturedActions
            actions={petitions}
            type="petition"
            title="Make Yourself Heard"
            buttonText="Add Your Name"
            seeAllLink="/actions"
            leftText="Together, we can make a change"
            rightText="We must fight for what is right"
          />

          {/* EMAILS */}
          <FeaturedActions
            actions={emails}
            type="email"
            title="Combine Our Voices"
            buttonText="Send Email"
            seeAllLink="/actions"
            leftText="Make your voice heard"
            rightText="Direct action creates change"
          />

          {/* IMAGES */}
          <h2 className="section-title">Social Media Updates</h2>

          {images.length === 0 && <p>No featured images yet</p>}

          <FeaturedImages images={images} />

          {/* SOCIAL LINKS */}
          <div className="social-media-container">
            <p className="social-text">
              Stay connected with us on social media platforms
            </p>

            <div className="social-media-links">

              <a href="https://discord.com" target="_blank" rel="noopener noreferrer">
                <img src={discord} alt="Discord" />
              </a>

              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <img src={instagram} alt="Instagram" />
              </a>

              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
                <img src={tiktok} alt="TikTok" />
              </a>

              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <img src={facebook} alt="Facebook" />
              </a>

              <a href="https://reddit.com" target="_blank" rel="noopener noreferrer">
                <img src={reddit} alt="Reddit" />
              </a>

              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <img src={twitter} alt="Twitter" />
              </a>

              <a href="https://bsky.app" target="_blank" rel="noopener noreferrer">
                <img src={bluesky} alt="Bluesky" />
              </a>

              <a href="https://substack.com" target="_blank" rel="noopener noreferrer">
                <img src={substack} alt="Substack" />
              </a>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}