import "./About.css"
import rectangle19 from "../assets/rectangle19.png"
import logo from "../assets/aboutLogo.png"
import line from "../assets/Line1.png"
import rectangle from "../assets/rectangle24.png"

export default function About() {
  return (
    <div>

      {/* HERO */}
      <div className="about-hero">
        <img src={rectangle19} className="about-hero-image" alt="about header" />

        <div className="about-hero-text">
          <h1>WHO WE ARE</h1>
        </div>
      </div>

      {/* BODY (NOW OUTSIDE HERO) */}
      <div className="container">
        <div className="about-body-container">

          <img src={logo} className="about-logo" alt="oac logo" />

          <div className="about-text-container">
            <p className="about-description">
              Many people across Ontario feel frustrated with the current state of provincial politics. Whether it’s transparency, accountability, or representation, there’s a growing sense that a lot of us feel disconnected from the political process.
              <br /><br />

              Ontarians Against Corruption is being built to help change that. We are a centralized, accessible hub where people can learn, organize, and take action together on provincial and municipal issues.
            </p>

            <div className="text-lines-3">
              <p className="left-3">A project built by the community</p>
              <p className="right-3">for the community</p>
            </div>

          </div>
        </div>

      </div>

      {/* CONTENT */}
      <div className="container">

        <div className="plan-section">
          <h2>The Plan </h2>
          <img src={line} className="line-1"/>
          <p>
          Many people across Ontario feel frustrated with the current state of provincial politics. Whether it’s transparency, accountability, or representation, there’s a growing sense that a lot of us feel disconnected from the political process. 
          <br /><br />

          Ontarians Against Corruption is being built to help change that. We are a centralized, accessible hub where people can learn, organize, and take action together on provincial and municipal issues.
          </p>

          <div className="plan-details-container">
            
            <div className="phase-1-container">
              <img src={rectangle} className="phase-1" />
            </div>

            <div className="phase-2-container">
              <img src={rectangle} className="phase-2" />
            </div>

            <div className="phase-3-container">
              <img src={rectangle} className="phase-3" />
            </div>
            
          </div>
        </div>

        <div className="about-section">
          <h2>What We Do</h2>
          <p>
            We highlight protests, petitions, and community efforts, making it
            easier for people to find and participate in causes that matter.
          </p>
        </div>

        <div className="about-section">
          <h2>Why It Matters</h2>
          <p>
            Change happens when people are informed and organized. Our goal is
            to make participation simple and accessible for everyone.
          </p>
        </div>

      </div>
    </div>
  )
}