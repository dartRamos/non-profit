import { useEffect, useState } from "react";
import image from "../assets/event3.png";
import rectangle from "../assets/rectangle91.png";
import "./PetitionDetail.css";
import "./Donate.css";

import { PayPalButtons } from "@paypal/react-paypal-js";

export default function Donate() {
  const GOAL_AMOUNT = 400;

  const [selectedAmount, setSelectedAmount] = useState(null);
  const [raisedAmount, setRaisedAmount] = useState(null);

  const fetchRaisedAmount = async () => {
    const res = await fetch(
      "https://non-profit-ta9x.onrender.com/fundraising"
    );
    const data = await res.json();
  
    if (data.success) {
      setRaisedAmount(data.raised);
    }
  };

  useEffect(() => {
    fetchRaisedAmount();
  }, []);

  const progressPercent = raisedAmount
    ? Math.min((raisedAmount / GOAL_AMOUNT) * 100, 100)
    : 0;

  const heroImage = image;

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
                    hosting, development tools, email services, and infrastructure.
                  </p>

                  <p>
                    Our goal is to raise $400 every 6 months to maintain and
                    improve the platform so we can continue organizing and
                    coordinating public actions across Ontario.
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
                        {raisedAmount === null ? "Loading..." : `$${raisedAmount} / $${GOAL_AMOUNT}`}
                      </span>
                    </div>

                    <div className="goal-bar">
                      <div
                        className="goal-fill"
                        style={{ width: `${progressPercent}%` }}
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
                  <h2>Select Donation Amount</h2>

                  <div className="donation-grid">
                    {["5", "10", "20", "50", "100"].map((amt) => (
                      <button
                        key={amt}
                        className={`donation-box ${
                          selectedAmount === amt ? "active" : ""
                        }`}
                        onClick={() => setSelectedAmount(amt)}
                      >
                        ${amt}
                      </button>
                    ))}
                  </div>

                  {!selectedAmount && (
                    <p className="donation-error">
                      Please select an amount to continue
                    </p>
                  )}

                  {selectedAmount && (
                    <PayPalButtons
                      style={{
                        layout: "vertical",
                        color: "gold",
                        shape: "rect",
                        label: "donate",
                      }}
                      forceReRender={[selectedAmount]}
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [
                            {
                              amount: {
                                value: selectedAmount,
                                currency_code: "CAD",
                              },
                            },
                          ],
                        });
                      }}
                      onApprove={async (data, actions) => {            
                        await fetch("https://non-profit-ta9x.onrender.com/paypal-success", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          orderID: data.orderID,
                        }),
                      });

                      await fetchRaisedAmount();
                      alert("Thank you for your donation!");
                    }}
                    />
                  )}

                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}