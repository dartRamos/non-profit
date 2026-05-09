import { useEffect, useState } from "react";
import image from "../assets/event3.png";
import rectangle from "../assets/rectangle91.png";
import "./PetitionDetail.css";
import "./Donate.css";

import { PayPalButtons } from "@paypal/react-paypal-js";

export default function Donate() {
  const GOAL_AMOUNT = 400;

  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState("");
  const [raisedAmount, setRaisedAmount] = useState(127);

  useEffect(() => {
    // LATER:
    // Fetch this from Firebase/backend after PayPal payments
    // setRaisedAmount(fetchedAmount)
  }, []);

  const displayAmount = customAmount
    ? `$${customAmount}`
    : selectedAmount
    ? selectedAmount
    : "$0";

  const amount = customAmount
    ? Number(customAmount)
    : selectedAmount
    ? Number(selectedAmount.replace("$", ""))
    : 0;

  const isValidAmount = amount >= 1;

  const progressPercent = Math.min(
    (raisedAmount / GOAL_AMOUNT) * 100,
    100
  );

  const heroImage = image;

  const handleDonate = () => {
    if (!isValidAmount) return;

    // PAYPAL REDIRECT HERE
    console.log("Donate:", amount);
  };

  return (
    <div>
      {/* HERO */}
      <div className="header-image-container">
        <img src={heroImage} className="header-image" alt="header" />
        <img src={rectangle} className="rectangle-54" alt="overlay" />

        <div className="image-fade" />

        <div className="header-text">
          <h1 className="line">HELP US KEEP THE FIGHT GOING</h1>
        </div>
      </div>

      {/* MAIN */}
      <div className="container">
        <div className="action-section">
          <img src={rectangle} className="action-bg" alt="background" />

          <div className="action-overlay">
            <div className="action-layout">
              {/* LEFT SIDE */}
              <div className="action-left">
                <h1 className="action-title">
                  Donate to Ontarians Against Corruption
                </h1>

                <div className="action-description">
                  <p>
                    At this early stage, donations are used to help cover the
                    operational costs of running the platform, including website
                    hosting, development tools, email services, and
                    infrastructure required to keep our campaigns and community
                    spaces online.
                  </p>

                  <p>
                    Our goal is to raise enough every 6 months to maintain and
                    improve the platform so we can continue organizing, sharing
                    information, and coordinating public actions across Ontario.
                  </p>

                  <p>
                    We are not currently a registered nonprofit or charity, and
                    donations are not tax-deductible.
                  </p>
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div className="action-right">
                <div className="signup-panel">
                  {/* GOAL */}
                  <div className="goal-section">
                    <div className="goal-header">
                      <h3>6 Month Operating Goal</h3>

                      <span>
                        ${raisedAmount} / ${GOAL_AMOUNT}
                      </span>
                    </div>

                    <div className="goal-bar">
                      <div
                        className="goal-fill"
                        style={{
                          width: `${progressPercent}%`,
                        }}
                      />
                    </div>

                    <p className="goal-percent">
                      {Math.round(progressPercent)}% funded
                    </p>

                    <p className="goal-subtext">
                      Donations help cover hosting, infrastructure, development
                      tools, email services, and operational costs required to
                      keep the platform online.
                    </p>
                  </div>

                  {/* DONATION */}
                  <h2>Your Donation Amount: {displayAmount}</h2>

                  {!isValidAmount && (
                    <p className="donation-error">
                      Minimum donation is $1
                    </p>
                  )}

                  <div className="donation-grid">
                    {["$5", "$10", "$20", "$50", "$100"].map((amt) => (
                      <button
                        key={amt}
                        className={`donation-box ${
                          selectedAmount === amt ? "active" : ""
                        }`}
                        onClick={() => {
                          setSelectedAmount(amt);
                          setCustomAmount("");
                        }}
                      >
                        {amt}
                      </button>
                    ))}

                    {/* CUSTOM */}
                    <input
                      className="donation-box custom-input"
                      placeholder="Custom"
                      value={customAmount}
                      onChange={(e) => {
                        const value = e.target.value;

                        if (/^\d*$/.test(value)) {
                          setCustomAmount(value);
                          setSelectedAmount(null);
                        }
                      }}
                    />

                    {/* BUTTON */}
                    <button
                      className="donate-button"
                      disabled={!isValidAmount}
                      onClick={handleDonate}
                    >
                      Continue Donation
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}