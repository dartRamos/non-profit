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
        <img
          src={rectangle19}
          className="about-hero-image"
          alt="about header"
        />

        <div className="about-hero-text">
          <h1>WHO WE ARE</h1>
        </div>
      </div>

      {/* BODY */}
      <div className="container">

        <div className="about-body-container">

          <img src={logo} className="about-logo" alt="oac logo" />

          <div className="about-text-container">

            <p className="about-description">
              Many people across Ontario feel frustrated with the current state of provincial politics.
              Whether it’s transparency, accountability, or representation, there’s a growing sense that a lot of us feel disconnected from the political process.
              <br /><br />

              Ontarians Against Corruption is being built to help change that. We are a centralized, accessible hub where people can learn, organize, and take action together on provincial and municipal issues.
            </p>

            <div className="text-lines-3">
              <p className="left-3">A project built by the community</p>
              <p className="right-3">for the community</p>
            </div>

          </div>
        </div>

        {/* PLAN SECTION */}
        <div className="plan-section">
          <h2>The Plan</h2>
          <img src={line} className="line-1" alt="divider" />

          <p>
            Many people across Ontario feel frustrated with the current state of provincial politics.
            Whether it’s transparency, accountability, or representation, there’s a growing sense that a lot of us feel disconnected from the political process.
            <br /><br />

            Ontarians Against Corruption is being built to help change that. We are a centralized, accessible hub where people can learn, organize, and take action together on provincial and municipal issues.
          </p>

          {/* PHASES */}
          <div className="plan-details-container">

            {/* PHASE 1 */}
            <div className="phase-card">

            <img src={rectangle} className="phase-img" alt="Phase 1" />

              <div className="phase-content">

                <div className="phase-header">
                  <h2 className="phase-number">Phase 1</h2>

                  <p className="phase-title">Building the community</p>
                </div>
                

                <p className="phase-details">
                  The foundation of the OAC is our Discord server, which acts as a central organizing space for members. This is a one-stop location for civic engagement in Ontario.
                  <br /><br />

                  Inside the Discord, members can:
                  <br />
                  ● Stay informed about provincial and municipal issues
                  <br />
                  ● Participate in discussions about policy and current events
                  <br />
                  ● Connect with other people interested in advocacy
                  <br />
                  ● Coordinate and participate in actions such as petitions, protests, or community engagement.
                  <br /><br />

                  OAC also manages a public Google Calendar that tracks upcoming opportunities for involvement, including:
                  <br />
                  ● Town halls
                  <br />
                  ● Political protests or rallies
                  <br />
                  ● Community meetings or events
                  <br />
                  ● Educational webinars or discussions
                  <br />
                  ● Opportunities to engage with elected officials
                </p>

              </div>
            </div>

            {/* PHASE 2 */}
            <div className="phase-card">
              <img src={rectangle} className="phase-img" alt="Phase 2" />
              <div className="phase-content">

                <div className="phase-header">
                  <h2 className="phase-number">Phase 2</h2>

                  <p className="phase-title">Expanding Awareness</p>
                </div>
                

                <p className="phase-details">
                In order to grow the movement, we have teams working on growing our presence across all
                mainstream social media platforms.
                <br /><br />
                These teams are made up of dedicated volunteers working together to stay up to date on all
                areas of provincial and municipal politics. We want to create engaging content catered to
                each platform in order to spread awareness and educate the public on current issues and
                events. 
                <br /><br />
                We have come to a realization: our provincial politics are confusing, so we need to
                get people interested in participating again. Living in a democracy means it is our
                responsibility to engage, but because we have been apathetic to the system, it has grown
                out of control.
                </p>

              </div>
            </div>

            {/* PHASE 3 */}
            <div className="phase-card">
              <img src={rectangle} className="phase-img" alt="Phase 2" />
              <div className="phase-content">

                <div className="phase-header">
                  <h2 className="phase-number">Phase 3</h2>

                  <p className="phase-title">Larger Advocacy and Political Engagement</p>
                </div>
                

                <p className="phase-details">
                Once the community grows and we have broader support across platforms, we can begin
                focusing on larger advocacy efforts.
                <br /><br />
                Some of the initiatives we are currently aiming for include:
                <br />
                ● Organizing large-scale demonstrations or protests. These will be directed at Doug
                Ford (and other corrupt officials) and not just specific actions or policy decisions
                <br />
                ● Advocating for policy changes, such as the introduction of a Recall Act in Ontario
                <br />
                ● Collaborating with other advocacy organizations that share similar goals
                <br />
                ● Hosting interviews or discussions with political candidates and opposition parties
                </p>

              </div>
            </div>

          </div>
        </div>

        {/* FOOTER SECTIONS */}
        <div className="about-section">
          <div className="text-lines-4">
            <p className="left-4">“Never doubt that a small group of thoughtful,</p>

            <p className="right-4">committed, citizens can change the world.</p>

            <div className="quote-row">
              <p className="left-4">Indeed, it is the only thing that ever has.”</p>

              <p className="author-text">
                Margaret Mead,
                < br/>
                American cultural anthropologist
              </p>
            </div>

            </div>
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