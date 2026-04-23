import { useEffect, useState } from "react"
import {
  getFeaturedProtests,
  getFeaturedPetitions,
  getImages,
} from "../firebase/protests"
import headerImage from "../assets/image1.png"
import rectangle54 from "../assets/rectangle54.png"
import "./Home.css"
import FeaturedProtests from "../components/FeaturedProtests.jsx"
import FeaturedPetitions from "../components/FeaturedPetitions.jsx"

export default function Home() {
  const [protests, setProtests] = useState([])
  const [petitions, setPetitions] = useState([])
  const [images, setImages] = useState([])

  useEffect(() => {
    const load = async () => {
      setProtests(await getFeaturedProtests())
      setPetitions(await getFeaturedPetitions())
      setImages(await getImages())
    }

    load()
  }, [])

  return (
    <div>
      <div className="header-image-container">
        <img src={headerImage} className="header-image" alt="headerImage" />
        <img src={rectangle54} className="rectangle-54" alt="gradiant" />

        <div className="image-fade" />

        <div className="header-text">
          <h1 className="line">A GRASSROOTS COMMUNITY</h1>
          <h1 className="line">EXPOSING CORRUPTION AND PUSHING</h1>
          <h1 className="line">FOR ACCOUNTABILITY IN ONTARIO.</h1>
        </div>
      </div>

      <div className="container">
        <div className="text-lines">
          <p className="left">Connecting people and sharing real ways to get involved</p>
          <p className="right">Making change the best way we can: together</p>
          <p className="left2">Stay informed; stay united; stay strong</p>
        </div>

        <div className="featured-events-container">
          <h2 className="section-title">Upcoming Protests</h2>
          <FeaturedProtests protests={protests}/>

          <h2 className="section-title">Newest Petitions</h2>
          <FeaturedPetitions petitions={petitions}/>
          
          <h2 className="section-title">Social Media Updates</h2>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {images.map((img) => (
              <div key={img.id} style={{ width: 200 }}>
                <img src={img.url} style={{ width: "100%" }} />
                <p>{img.caption}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  )
}