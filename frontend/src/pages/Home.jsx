import { useEffect, useState } from "react";
import { getFeaturedActionsByTypes } from "../firebase/actions"
import { getFeaturedImages } from "../firebase/protests";

import headerImage from "../assets/image1.png";
import rectangle54 from "../assets/rectangle54.png";
import bluesky from "../assets/Bluesky.png";
import discord from "../assets/Discord.png";
import facebook from "../assets/Facebook.png";
import instagram from "../assets/Instagram.png";
import reddit from "../assets/Reddit.png";
import substack from "../assets/Substack.png";
import tiktok from "../assets/Tiktok.png";
import twitter from "../assets/Twitter.png";
import "./Home.css";

import FeaturedActions from "../components/FeaturedActions.jsx";
import FeaturedImages from "../components/FeaturedImages.jsx";

export default function Home() {
  const [civicActions, setCivicActions] = useState([])
  const [events, setEvents] = useState([])
  const [images, setImages] = useState([]);

  useEffect(() => {
    const load = async () => {
      const civic = await getFeaturedActionsByTypes([
        "cta",
        "petition",
        "email",
      ])
  
      const eventData = await getFeaturedActionsByTypes([
        "protest",
        "rally",
        "townhall",
      ])
  
      console.log("civic:", civic)
      console.log("events:", eventData)

      const imageData = await getFeaturedImages()
  
      setCivicActions(civic.slice(0, 6))
      setEvents(eventData.slice(0, 6))
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
          <p className="left">
            Connecting people and sharing real ways to get involved
          </p>
          <p className="right">Making change the best way we can: together</p>
          <p className="left2">Stay informed; stay united; stay strong</p>
        </div>

        <div className="featured-events-container">
          {/* CTA */}
          <FeaturedActions
            actions={civicActions}
            title="Take Action"
            maxItems={6}
            buttonText="Get Involved"
            seeAllLink="/actions"
            leftText="Your voice matters"
            rightText="Collective action drives change"
          />

          <FeaturedActions
            actions={events}
            title="Join Events"
            maxItems={3}
            variant="row"
            buttonText="View Details"
            seeAllLink="/actions"
            leftText="Show up. Speak out."
            rightText="Real change happens together"
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
              <a
                href="https://discord.gg/QX2zY867"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={discord} alt="Discord" />
              </a>

              <a
                href="https://www.instagram.com/ontariansagainstcorruption/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={instagram} alt="Instagram" />
              </a>

              <a
                href="https://www.tiktok.com/@ontarians.against"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={tiktok} alt="TikTok" />
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={facebook} alt="Facebook" />
              </a>

              <a
                href="https://www.reddit.com/user/OntariansAgainst/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={reddit} alt="Reddit" />
              </a>

              <a
                href="https://x.com/OntariansAC"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={twitter} alt="Twitter" />
              </a>

              <a
                href="https://bsky.app/profile/ontariansagainst.bsky.social"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={bluesky} alt="Bluesky" />
              </a>

              <a
                href="https://substack.com/@ontariansagainstcorruption?utm_source=global-search"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={substack} alt="Substack" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
