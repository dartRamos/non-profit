import "./About.css"
import rectangle19 from "../assets/rectangle19.png"
import logo from "../assets/aboutLogo.png"
import line from "../assets/Line1.png"
import rectangle from "../assets/rectangle24.png"
import rectangle2 from "../assets/rectangle79.png"
import rectangle3 from "../assets/rectangle23.png"
import line2 from "../assets/Line2.png"
import rectangle4 from "../assets/rectangle80.png"
import DonateButton from "../components/DonateButton.jsx";

export default function About() {
  return (
    <div>

      {/* HERO */}
      <div className="about-hero">

       
        
        <div className="image-fade" />
        
        {/* <DonateButton onClick={() => window.location.href = "/donate"} /> */}
        <div className="about-hero-inner">

          <div className="about-hero-text">
            <h1>WHO WE ARE</h1>
          </div>

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

        </div>
      </div>

      {/* BODY */}
      <div className="container">

        {/* PLAN SECTION */}
        <div className="plan-section">
          <h2>The Plan</h2>
          <img src={line} className="line-1" alt="divider" />

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
                </p>

              </div>
            </div>

          </div>
        </div>

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

          <div className="goal-section">

            <div className="image-stack">

              <img src={rectangle2} className="rect-2" alt="rectangle" />

                <div className="overlay-text">

                  <div className="goal-header-container">
                    <h2 className="about-section-title">Goals</h2>
                    <img src={line2} className="line-2" alt="line" />
                  </div>

                  <div className="goal-box">
                    <h3 className="goal-title">Building Community</h3>
                    <p className="goal-description">
                      By establishing the Discord server as a centralized space for all resources and information and growing our presence across all social media platforms. OAC aims to expand our reach to as many people as possible throughout Ontario. OAC is an organization designed to meet people where they are, and enable them to access all the resources needed in order to participate at the level they are capable of.
                    </p>
                  </div>

                  <div className="goal-box">
                    <h3 className="goal-title">Information and Education</h3>
                    <p className="goal-description">
                      Ultimately, one of our major goals is to help voters better understand their political options.
                      <br /><br />
                      Too often, people feel forced to vote for one of two major parties simply to avoid “wasting” their vote. By providing information and direct conversations with different candidates, we hope to empower voters with a broader understanding of the political landscape.
                    </p>
                  </div>

                  <div className="goal-box">
                    <h3 className="goal-title">Recall Act</h3>
                    <p className="goal-description">                   
                      Realistically, removing a sitting government is extremely difficult unless a movement grows very quickly.
                      <br /><br />
                      However, political change doesn’t only happen through immediate victories. Sometimes the most important work is building the networks and awareness that influence future elections. Even if major political shifts don’t happen right away, the goal is to build enough momentum over the coming years to make a meaningful difference.
                    </p>
                  </div>

                  <div className="goal-box">
                    <h3 className="goal-title">No Confidence Vote</h3>
                    <p className="goal-description">                   
                      If we work together, one of the most effective ways to hold Doug Ford accountable is to build momentum toward a vote of no confidence. In practical terms, this means that consistent, coordinated participation in weekly calls to action could generate enough public pressure that members of his cabinet and fellow MPPs begin to question his leadership.
                      <br /><br />
                      Such an effort would signal clearly to our elected representatives that their constituents are paying close attention; not only to the issues themselves, but also to how they vote and what policies they choose to support. Achieving this outcome would set a meaningful precedent, reinforcing higher expectations for future premiers.
                      <br /><br />
                      It is important to note that this process would not remove the Progressive Conservatives from power; rather, it would require them to select a new leader. Even so, it would send a strong message that public accountability matters and that voters are actively engaged.
                    </p>
                  </div>

                </div>

            </div>
          </div>

          <div className="about-foot-section">
            <div className="goal-bottom-wrapper">
              <img src={rectangle4} className="rect-4" alt="rectangle 4" />

              <div className="rect-4-overlay">
                <h2 className="rect-4-title">Looking toward the future</h2>
                <p className="rect-4-text">
                  Ultimately, the Ontarians Against Corruption is meant to be a community-driven initiative.
                  <br /> <br />
                  It only works if people participate—whether that means helping moderate discussions,
                  contributing research, managing social media, organizing events, or simply staying informed
                  and sharing information with others.
                  <br /> <br />
                  Every movement begins with a small group of people willing to take the first step.
                  <br /> <br />
                  We care about the future of Ontario and want to be part of building a more engaged and
                  informed civic community, and I thank you for joining us.
                </p>
              </div>
            </div>

          </div>
      </div>

    </div>
  )
}